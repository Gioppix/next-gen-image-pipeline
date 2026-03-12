// Hand-written stub — replaced when you run `npm run generate:api`
export interface paths {
    '/transformations': {
        get: {
            responses: {
                200: {
                    content: {
                        'application/json': {
                            jobs: {
                                job_id: string;
                                status: 'pending' | 'processing' | 'completed' | 'failed';
                                submitted_at: string;
                                completed_at: string | null;
                                error_msg: string | null;
                                has_final_image: boolean;
                            }[];
                        };
                    };
                };
            };
        };
    };
    '/transformations/create': {
        post: {
            requestBody: { content: { 'multipart/form-data': { file: Blob } } };
            responses: {
                200: { content: { 'application/json': { job_id: string } } };
                400: { content: { 'application/json': { error: string } } };
            };
        };
    };
    '/transformations/{id}/status': {
        get: {
            parameters: { path: { id: string } };
            responses: {
                200: {
                    content: {
                        'application/json': {
                            status: 'pending' | 'processing' | 'completed' | 'failed';
                            submitted_at: string;
                            completed_at: string | null;
                            error_msg: string | null;
                        };
                    };
                };
                404: { content: { 'application/json': { error: string } } };
            };
        };
    };
    '/transformations/{id}/image': {
        get: {
            parameters: { path: { id: string } };
            responses: {
                200: { content: { 'image/*': Blob } };
                404: { content: { 'application/json': { error: string } } };
            };
        };
    };
    '/transformations/{id}/publish': {
        post: {
            parameters: { path: { id: string } };
            responses: {
                200: { content: { 'application/json': { public_id: string } } };
                404: { content: { 'application/json': { error: string } } };
            };
        };
    };
    '/transformations/{id}': {
        delete: {
            parameters: { path: { id: string } };
            responses: {
                200: { content: { 'application/json': { success: boolean } } };
                404: { content: { 'application/json': { error: string } } };
            };
        };
    };
    '/images/{public_id}': {
        get: {
            parameters: { path: { public_id: string } };
            responses: {
                200: { content: { 'image/*': Blob } };
                404: { content: { 'application/json': { error: string } } };
            };
        };
    };
}
