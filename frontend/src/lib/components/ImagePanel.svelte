<script lang="ts">
    import PrivateImage from './PrivateImage.svelte';

    let {
        label,
        imageId,
        alt,
        status
    }: { label: string; imageId: string | null | undefined; alt: string; status?: string } =
        $props();

    let inProgress = $derived(status === 'pending' || status === 'processing');
    let failed = $derived(status === 'failed');
</script>

<div class="space-y-1">
    <p class="text-xs font-medium tracking-wide text-gray-400 uppercase">{label}</p>
    <div class="relative h-96 w-full overflow-hidden rounded-lg bg-gray-50 shadow">
        {#if inProgress}
            <div class="flex h-full flex-col items-center justify-center gap-6 px-12">
                <span
                    class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                    class:bg-yellow-100={status === 'pending'}
                    class:text-yellow-800={status === 'pending'}
                    class:bg-blue-100={status === 'processing'}
                    class:text-blue-800={status === 'processing'}
                >
                    {status}
                </span>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                        class="animate-progress-indeterminate h-full rounded-full bg-blue-500"
                    ></div>
                </div>
            </div>
        {:else if failed}
            <div class="flex h-full items-center justify-center">
                <span class="text-sm text-red-500">Processing failed</span>
            </div>
        {:else if imageId}
            <PrivateImage {imageId} {alt} />
        {/if}
    </div>
</div>
