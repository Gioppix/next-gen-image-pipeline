<script lang="ts">
    import { page } from '$app/stores';
    import { goto, invalidateAll } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { api } from '$lib/api';
    import PrivateImage from './PrivateImage.svelte';
    import Button from './Button.svelte';
    import { Trash2 } from '@lucide/svelte';

    let { job }: { job: { job_id: string; final_image_id: string } } = $props();

    let active = $derived($page.params.id === job.job_id);
    let deleting = $state(false);

    async function deleteJob(e: MouseEvent) {
        e.preventDefault();
        deleting = true;
        await api.DELETE('/transformations/{id}', { params: { path: { id: job.job_id } } });
        await invalidateAll();
        if (active) await goto(resolve('/'));
    }
</script>

<div class="group relative shrink-0">
    <a
        href={resolve('/transformations/[id]', { id: job.job_id })}
        class="relative block h-28 w-28 overflow-hidden rounded-xl border-2 transition-colors"
        class:border-coral-glow-500={active}
        class:border-transparent={!active}
    >
        <PrivateImage imageId={job.final_image_id} alt="Processed" objectFit="cover" />
    </a>
    <Button
        variant="danger"
        icon
        loading={deleting}
        onclick={deleteJob}
        class="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100"
    >
        <Trash2 size={14} />
    </Button>
</div>
