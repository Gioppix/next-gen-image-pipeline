import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import * as images from '../modules/images/index.js';
import * as jobs from '../modules/jobs/index.js';
import { runPipeline } from '../pipeline.js';

const router = new OpenAPIHono();

const ErrorSchema = z.object({ error: z.string() });

const JobSummarySchema = z.object({
    job_id: z.string().uuid(),
    status: z.string(),
    submitted_at: z.string(),
    completed_at: z.string().nullable(),
    error_msg: z.string().nullable(),
    has_final_image: z.boolean()
});

// GET /transformations
router.openapi(
    createRoute({
        method: 'get',
        path: '/transformations',
        responses: {
            200: {
                content: {
                    'application/json': { schema: z.object({ jobs: z.array(JobSummarySchema) }) }
                },
                description: 'All jobs'
            }
        }
    }),
    async (c) => {
        const all = await jobs.getAllJobs();
        return c.json(
            {
                jobs: all.map((j) => ({
                    job_id: j.job_id,
                    status: j.status,
                    submitted_at: j.submitted_at.toISOString(),
                    completed_at: j.completed_at?.toISOString() ?? null,
                    error_msg: j.error_msg,
                    has_final_image: j.final_image_id !== null
                }))
            },
            200 as const
        );
    }
);

// GET /transformations/:id/image
router.openapi(
    createRoute({
        method: 'get',
        path: '/transformations/:id/image',
        request: { params: z.object({ id: z.string().uuid() }) },
        responses: {
            200: { content: { 'image/*': { schema: z.any() } }, description: 'Final image' },
            404: {
                content: { 'application/json': { schema: ErrorSchema } },
                description: 'Not found'
            }
        }
    }),
    async (c) => {
        const { id } = c.req.valid('param');
        const job = await jobs.getJob(id);
        if (!job?.final_image_id)
            return c.json({ error: 'No final image for this job' }, 404 as const);

        const { buffer, image } = await images.readImage(job.final_image_id);
        return new Response(new Uint8Array(buffer), {
            headers: {
                'Content-Type': image.mime_type ?? 'image/png',
                'Content-Length': String(buffer.length)
            }
        });
    }
);

// POST /transformations/create
router.openapi(
    createRoute({
        method: 'post',
        path: '/transformations/create',
        request: {
            body: {
                content: { 'multipart/form-data': { schema: z.object({ file: z.any() }) } },
                required: true
            }
        },
        responses: {
            200: {
                content: {
                    'application/json': { schema: z.object({ job_id: z.string().uuid() }) }
                },
                description: 'Job created'
            },
            400: {
                content: { 'application/json': { schema: ErrorSchema } },
                description: 'Bad request'
            }
        }
    }),
    async (c) => {
        const body = await c.req.parseBody();
        const file = body['file'];

        if (!(file instanceof File)) {
            return c.json({ error: 'No file uploaded' }, 400 as const);
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const mime_type = file.type || 'application/octet-stream';

        const image = await images.createImage(buffer, { mime_type });
        const job = await jobs.createJob(image.image_id);

        runPipeline(job.job_id).catch(console.error);

        return c.json({ job_id: job.job_id }, 200 as const);
    }
);

// GET /transformations/:id/status
router.openapi(
    createRoute({
        method: 'get',
        path: '/transformations/:id/status',
        request: { params: z.object({ id: z.string().uuid() }) },
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: z.object({
                            status: z.string(),
                            submitted_at: z.string(),
                            completed_at: z.string().nullable(),
                            error_msg: z.string().nullable()
                        })
                    }
                },
                description: 'Job status'
            },
            404: {
                content: { 'application/json': { schema: ErrorSchema } },
                description: 'Not found'
            }
        }
    }),
    async (c) => {
        const { id } = c.req.valid('param');
        const job = await jobs.getJob(id);

        if (!job) return c.json({ error: 'Job not found' }, 404 as const);

        return c.json(
            {
                status: job.status,
                submitted_at: job.submitted_at.toISOString(),
                completed_at: job.completed_at?.toISOString() ?? null,
                error_msg: job.error_msg
            },
            200 as const
        );
    }
);

// POST /transformations/:id/publish
router.openapi(
    createRoute({
        method: 'post',
        path: '/transformations/:id/publish',
        request: { params: z.object({ id: z.string().uuid() }) },
        responses: {
            200: {
                content: {
                    'application/json': { schema: z.object({ public_id: z.string().uuid() }) }
                },
                description: 'Published'
            },
            404: {
                content: { 'application/json': { schema: ErrorSchema } },
                description: 'Not found'
            }
        }
    }),
    async (c) => {
        const { id } = c.req.valid('param');
        const job = await jobs.getJob(id);

        if (!job) return c.json({ error: 'Job not found' }, 404 as const);

        const public_id = await jobs.publishJob(id);
        return c.json({ public_id }, 200 as const);
    }
);

// DELETE /transformations/:id
router.openapi(
    createRoute({
        method: 'delete',
        path: '/transformations/:id',
        request: { params: z.object({ id: z.string().uuid() }) },
        responses: {
            200: {
                content: { 'application/json': { schema: z.object({ success: z.boolean() }) } },
                description: 'Deleted'
            },
            404: {
                content: { 'application/json': { schema: ErrorSchema } },
                description: 'Not found'
            }
        }
    }),
    async (c) => {
        const { id } = c.req.valid('param');

        try {
            await jobs.deleteJob(id);
            return c.json({ success: true as const }, 200 as const);
        } catch (err) {
            if (err instanceof Error && err.message === 'Job not found') {
                return c.json({ error: 'Job not found' }, 404 as const);
            }
            throw err;
        }
    }
);

export default router;
