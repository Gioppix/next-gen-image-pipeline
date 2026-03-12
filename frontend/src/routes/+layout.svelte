<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';
    import { page } from '$app/stores';
    import { API_BASE } from '$lib/api';
    import { resolve } from '$app/paths';

    let { children, data } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex h-screen overflow-hidden bg-gray-50">
    <aside
        class="flex w-48 shrink-0 flex-col gap-1.5 overflow-y-auto border-r border-gray-200 bg-white p-2"
    >
        <p class="px-1 py-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
            All images
        </p>

        {#each data.jobs.filter((j) => j.has_final_image) as job (job.job_id)}
            <a
                href={resolve('/transformations/[id]', {
                    id: job.job_id
                })}
                class="block overflow-hidden rounded border-2 transition-colors"
                class:border-blue-500={$page.params.id === job.job_id}
                class:border-transparent={$page.params.id !== job.job_id}
            >
                <div class="relative h-36 w-full">
                    <img
                        src="{API_BASE}/transformations/{job.job_id}/image"
                        alt="Processed"
                        class="absolute inset-0 h-full w-full object-cover transition-opacity hover:opacity-80"
                    />
                </div>
            </a>
        {/each}

        {#if data.jobs.filter((j) => j.has_final_image).length === 0}
            <p class="mt-4 text-center text-xs text-gray-400">No images yet</p>
        {/if}
    </aside>

    <main class="flex-1 overflow-auto p-8">
        {@render children()}
    </main>
</div>
