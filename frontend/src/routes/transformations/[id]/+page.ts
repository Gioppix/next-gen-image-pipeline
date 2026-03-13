import { api } from '$lib/api';
import { error } from '@sveltejs/kit';

export async function load({ params, depends }) {
    depends(`job:${params.id}`);
    const { data } = await api.GET('/transformations/{id}/status', {
        params: { path: { id: params.id } }
    });
    if (!data) error(404, 'Job not found');
    return { job_id: params.id, ...data };
}
