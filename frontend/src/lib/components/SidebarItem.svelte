<script lang="ts">
    import { page } from '$app/stores';
    import { resolve } from '$app/paths';
    import PrivateImage from './PrivateImage.svelte';

    let { job }: { job: { job_id: string; final_image_id: string } } = $props();

    let active = $derived($page.params.id === job.job_id);
</script>

<a
    href={resolve('/transformations/[id]', { id: job.job_id })}
    class="relative block h-36 min-h-36 w-full overflow-hidden rounded border-2 transition-colors"
    class:border-blue-500={active}
    class:border-transparent={!active}
>
    <PrivateImage imageId={job.final_image_id} alt="Processed" objectFit="cover" />
</a>
