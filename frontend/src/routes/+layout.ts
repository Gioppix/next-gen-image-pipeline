import { api } from '$lib/api';

export async function load() {
    const { data } = await api.GET('/transformations');
    return { jobs: data?.jobs ?? [] };
}
