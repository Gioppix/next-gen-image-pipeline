import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import * as jobs from '../modules/jobs/index.js';
import * as images from '../modules/images/index.js';

const router = new OpenAPIHono();

const ErrorSchema = z.object({ error: z.string() });

async function serveImage(image_id: string) {
    const { buffer, image } = await images.readImage(image_id);
    return new Response(new Uint8Array(buffer), {
        headers: {
            'Content-Type': image.mime_type ?? 'image/png',
            'Content-Length': String(buffer.length),
            'Cache-Control': 'public, max-age=31536000, immutable'
        }
    });
}

// GET /images/public/:public_id
router.openapi(
    createRoute({
        method: 'get',
        path: '/images/public/{public_id}',
        request: { params: z.object({ public_id: z.string().uuid() }) },
        responses: {
            200: { content: { 'image/*': { schema: z.any() } }, description: 'Image data' },
            404: {
                content: { 'application/json': { schema: ErrorSchema } },
                description: 'Not found'
            }
        }
    }),
    async (c) => {
        const { public_id } = c.req.valid('param');
        const job = await jobs.getJobByPublicId(public_id);
        if (!job?.final_image_id) return c.json({ error: 'Image not found' }, 404 as const);
        return serveImage(job.final_image_id);
    }
);

// GET /images/private/:private_id
router.openapi(
    createRoute({
        method: 'get',
        path: '/images/private/{private_id}',
        request: { params: z.object({ private_id: z.string().uuid() }) },
        responses: {
            200: { content: { 'image/*': { schema: z.any() } }, description: 'Image data' },
            404: {
                content: { 'application/json': { schema: ErrorSchema } },
                description: 'Not found'
            }
        }
    }),
    async (c) => {
        const { private_id } = c.req.valid('param');
        return serveImage(private_id);
    }
);

export default router;
