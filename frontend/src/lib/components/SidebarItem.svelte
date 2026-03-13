<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { invalidateAll } from '$app/navigation';
    import { api } from '$lib/api';
    import PrivateImage from './PrivateImage.svelte';

    let { job }: { job: { job_id: string; final_image_id: string } } = $props();

    let active = $derived($page.params.id === job.job_id);

    async function deleteJob(e: MouseEvent) {
        e.preventDefault();
        await api.DELETE('/transformations/{id}', { params: { path: { id: job.job_id } } });
        await invalidateAll();
        if (active) await goto('/');
    }
</script>

<div class="group relative">
    <a
        href={resolve('/transformations/[id]', { id: job.job_id })}
        class="relative block h-36 min-h-36 w-full overflow-hidden rounded border-2 transition-colors"
        class:border-blue-500={active}
        class:border-transparent={!active}
    >
        <PrivateImage imageId={job.final_image_id} alt="Processed" objectFit="cover" />
    </a>
    <button
        onclick={deleteJob}
        class="absolute top-1 right-1 hidden rounded bg-black/50 px-1.5 py-0.5 text-xs text-white group-hover:block hover:bg-black/70"
    >
        ✕
    </button>
</div>
