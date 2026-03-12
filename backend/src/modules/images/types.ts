import { z } from 'zod';

export const ImageSchema = z.object({
    image_id: z.string().uuid(),
    mime_type: z.string().nullable(),
    size_bytes: z.coerce.number().nullable(),
    created_at: z.coerce.date()
});

export type Image = z.infer<typeof ImageSchema>;
