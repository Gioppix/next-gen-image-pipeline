<script lang="ts">
    import { page } from '$app/stores';
    import { resolve } from '$app/paths';
    import PrivateImage from './PrivateImage.svelte';

    let { job }: { job: { job_id: string; final_image_id: string } } = $props();

    let active = $derived($page.params.id === job.job_id);
</script>

<a
    href={resolve('/transformations/[id]', { id: job.job_id })}
    class="block overflow-hidden rounded border-2 transition-colors"
    class:border-blue-500={active}
    class:border-transparent={!active}
>
    <div class="relative h-36 w-full">
        <PrivateImage imageId={job.final_image_id} alt="Processed" objectFit="cover" />
    </div>
</a>
