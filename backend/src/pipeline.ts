import * as jobs from './modules/jobs/index.js';
import * as images from './modules/images/index.js';
import { removeBg } from './services/removeBg.js';
import { flipImage } from './services/flipImage.js';

export async function runPipeline(jobId: string, maxRetries = 2): Promise<void> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        let bgImageId: string | null = null;
        let intermediateRecorded = false;

        try {
            await jobs.setProcessing(jobId);

            const job = await jobs.getJob(jobId);
            if (!job?.original_image_id) throw new Error('Job not found or missing original image');

            const { buffer: originalBuffer, image: originalMeta } = await images.readImage(
                job.original_image_id
            );

            const bgBuffer = await removeBg(originalBuffer, originalMeta.mime_type ?? 'image/jpeg');
            const bgImage = await images.createImage(bgBuffer, { mime_type: 'image/png' });
            bgImageId = bgImage.image_id;

            await jobs.recordIntermediate(jobId, 'bg_removed', bgImage.image_id);
            intermediateRecorded = true;

            const finalBuffer = await flipImage(bgBuffer);
            const finalImage = await images.createImage(finalBuffer, { mime_type: 'image/png' });

            await jobs.deleteIntermediate(jobId, 'bg_removed');
            await jobs.setCompleted(jobId, finalImage.image_id);

            return;
        } catch (err) {
            if (bgImageId) {
                try {
                    if (intermediateRecorded) {
                        await jobs.deleteIntermediate(jobId, 'bg_removed');
                    } else {
                        await images.deleteImage(bgImageId);
                    }
                } catch (cleanupErr) {
                    console.error('[pipeline] cleanup error:', cleanupErr);
                }
            }

            if (attempt < maxRetries) {
                await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
            } else {
                const errorMsg = err instanceof Error ? err.message : String(err);
                try {
                    await jobs.setFailed(jobId, errorMsg);
                } catch (e) {
                    console.error('[pipeline] setFailed error:', e);
                }
            }
        }
    }
}
