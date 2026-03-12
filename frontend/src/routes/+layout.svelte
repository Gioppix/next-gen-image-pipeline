<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';
    import SidebarItem from '$lib/components/SidebarItem.svelte';
    import DropZone from '$lib/components/DropZone.svelte';

    let { children, data } = $props();

    let jobsWithImage = $derived(
        data.jobs.filter((j) => j.final_image_id !== null) as typeof data.jobs &
            { final_image_id: string }[]
    );
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex h-screen overflow-hidden bg-gray-50">
    <aside
        class="flex w-48 shrink-0 flex-col gap-1.5 overflow-y-auto border-r border-gray-200 bg-white p-2"
    >
        <p class="px-1 py-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
            All images
        </p>

        <div class="h-24 w-full shrink-0">
            <DropZone />
        </div>

        {#each jobsWithImage as job (job.job_id)}
            <SidebarItem {job} />
        {:else}
            <p class="mt-4 text-center text-xs text-gray-400">No images yet</p>
        {/each}
    </aside>

    <main class="flex-1 overflow-auto p-8">
        {@render children()}
    </main>
</div>
