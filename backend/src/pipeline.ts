import * as jobs from './modules/jobs/index.js';
import * as images from './modules/images/index.js';
import { removeBg } from './services/removeBg.js';
import { flipImage } from './services/flipImage.js';

// Cleanup is best-effort and is not awaited.
// TODO: implement a vacuum system that cleans up unused database records and loose S3 files

export async function runPipeline(jobId: string, maxRetries = 2): Promise<void> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            await jobs.setProcessing(jobId);

            const job = await jobs.getJob(jobId);
            if (!job?.original_image_id) throw new Error('Job not found or missing original image');

            // Reuse bg_removed intermediate if it already exists from a prior attempt
            let bgImageId = await jobs.getIntermediate(jobId, 'bg_removed');
            let bgBuffer: Buffer;

            if (bgImageId) {
                ({ buffer: bgBuffer } = await images.readImage(bgImageId));
            } else {
                const { buffer: originalBuffer, image: originalMeta } = await images.readImage(
                    job.original_image_id
                );
                bgBuffer = await removeBg(originalBuffer, originalMeta.mime_type ?? 'image/jpeg');
                const bgImage = await images.createImage(bgBuffer, { mime_type: 'image/png' });
                bgImageId = bgImage.image_id;
                await jobs.recordIntermediate(jobId, 'bg_removed', bgImageId);
            }

            const finalBuffer = await flipImage(bgBuffer);
            const finalImage = await images.createImage(finalBuffer, { mime_type: 'image/png' });

            await jobs.setCompleted(jobId, finalImage.image_id);

            jobs.deleteIntermediate(jobId, 'bg_removed').catch((e) =>
                console.error('[pipeline] cleanup error:', e)
            );

            return;
        } catch (err) {
            if (attempt < maxRetries) {
                await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
            } else {
                const errorMsg = err instanceof Error ? err.message : String(err);

                try {
                    await jobs.setFailed(jobId, errorMsg);
                } catch (e) {
                    console.error('[pipeline] setFailed error:', e);
                }

                jobs.deleteIntermediate(jobId, 'bg_removed').catch((cleanupErr) =>
                    console.error('[pipeline] cleanup error:', cleanupErr)
                );
            }
        }
    }
}
