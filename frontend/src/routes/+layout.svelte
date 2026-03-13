<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';
    import GalleryItem from '$lib/components/GalleryItem.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Header from '$lib/components/Header.svelte';

    let { children, data } = $props();

    let jobsWithImage = $derived(
        data.jobs.filter((j) => j.final_image_id !== null) as typeof data.jobs &
            { final_image_id: string }[]
    );
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-screen flex-col bg-gray-50">
    <Header />
    <main class="min-h-[80dvh] flex-1 py-6">
        <div class="page-container">
            {@render children()}
        </div>
    </main>

    <section class="border-t border-gray-200 bg-white py-6">
        <div class="page-container">
            <p class="mb-4 text-xs font-semibold tracking-wide text-gray-400 uppercase">
                All transformations
            </p>
            {#if jobsWithImage.length > 0}
                <div class="flex flex-wrap gap-3">
                    {#each jobsWithImage as job (job.job_id)}
                        <GalleryItem {job} />
                    {/each}
                </div>
            {:else}
                <p class="text-sm text-gray-400">No transformations yet</p>
            {/if}
        </div>
    </section>

    <Footer />
</div>
