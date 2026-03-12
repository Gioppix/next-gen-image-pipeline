import { z } from 'zod';

export const JobStatusSchema = z.enum(['pending', 'processing', 'completed', 'failed']);
export type JobStatus = z.infer<typeof JobStatusSchema>;

export const ImagePhaseSchema = z.enum(['bg_removed']);
export type ImagePhase = z.infer<typeof ImagePhaseSchema>;

export const JobSchema = z.object({
    job_id: z.string().uuid(),
    status: JobStatusSchema,
    public_id: z.string().uuid().nullable(),
    error_msg: z.string().nullable(),
    original_image_id: z.string().uuid(),
    final_image_id: z.string().uuid().nullable(),
    submitted_at: z.coerce.date(),
    completed_at: z.coerce.date().nullable()
});

export type Job = z.infer<typeof JobSchema>;
