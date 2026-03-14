import { pool } from '../db.js';
import { JobSchema, type Job, type ImagePhase } from './types.js';
import { deleteImage } from '../images/index.js';

export async function createJob(original_image_id: string): Promise<Job> {
    const result = await pool.query(
        `INSERT INTO jobs (status, original_image_id) VALUES ('pending', $1) RETURNING *`,
        [original_image_id]
    );
    return JobSchema.parse(result.rows[0]);
}

export async function getJob(job_id: string): Promise<Job | null> {
    const result = await pool.query(`SELECT * FROM jobs WHERE job_id = $1`, [job_id]);
    if (result.rows.length === 0) return null;
    return JobSchema.parse(result.rows[0]);
}

export async function getJobByPublicId(public_id: string): Promise<Job | null> {
    const result = await pool.query(`SELECT * FROM jobs WHERE public_id = $1`, [public_id]);
    if (result.rows.length === 0) return null;
    return JobSchema.parse(result.rows[0]);
}

export async function setProcessing(job_id: string): Promise<void> {
    await pool.query(`UPDATE jobs SET status = 'processing' WHERE job_id = $1`, [job_id]);
}

export async function setCompleted(job_id: string, final_image_id: string): Promise<void> {
    await pool.query(
        `UPDATE jobs SET status = 'completed', final_image_id = $2, completed_at = NOW() WHERE job_id = $1`,
        [job_id, final_image_id]
    );
}

export async function setFailed(job_id: string, error_msg: string): Promise<void> {
    await pool.query(
        `UPDATE jobs SET status = 'failed', error_msg = $2, completed_at = NOW() WHERE job_id = $1`,
        [job_id, error_msg]
    );
}

export async function publishJob(job_id: string): Promise<string> {
    const result = await pool.query(
        `UPDATE jobs SET public_id = COALESCE(public_id, gen_random_uuid()) WHERE job_id = $1 RETURNING public_id`,
        [job_id]
    );
    if (result.rows.length === 0) throw new Error('Job not found');
    return result.rows[0].public_id;
}

export async function recordIntermediate(
    job_id: string,
    phase: ImagePhase,
    image_id: string
): Promise<void> {
    await pool.query(
        `INSERT INTO intermediate_images (job_id, phase, image_id) VALUES ($1, $2, $3)`,
        [job_id, phase, image_id]
    );
}

export async function deleteIntermediate(job_id: string, phase: ImagePhase): Promise<void> {
    const result = await pool.query(
        `DELETE FROM intermediate_images WHERE job_id = $1 AND phase = $2 RETURNING image_id`,
        [job_id, phase]
    );
    for (const row of result.rows) {
        await deleteImage(row.image_id);
    }
}

export async function getAllJobs(): Promise<Job[]> {
    const result = await pool.query(`SELECT * FROM jobs ORDER BY submitted_at DESC`);
    return result.rows.map((row) => JobSchema.parse(row));
}

export async function deleteJob(job_id: string): Promise<void> {
    const job = await getJob(job_id);
    if (!job) throw new Error('Job not found');

    // Delete all intermediate images (S3 + images rows); CASCADE handles intermediate_images rows
    const intermediates = await pool.query(
        `SELECT image_id FROM intermediate_images WHERE job_id = $1`,
        [job_id]
    );
    for (const row of intermediates.rows) {
        await deleteImage(row.image_id);
    }

    // Delete the job row (ON DELETE CASCADE cleans up intermediate_images)
    await pool.query(`DELETE FROM jobs WHERE job_id = $1`, [job_id]);

    if (job.original_image_id) await deleteImage(job.original_image_id);
    if (job.final_image_id) await deleteImage(job.final_image_id);
}
