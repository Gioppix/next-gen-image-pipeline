<script lang="ts">
    import PrivateImage from './PrivateImage.svelte';

    let {
        label,
        imageId,
        alt
    }: { label: string; imageId: string | null | undefined; alt: string } = $props();
</script>

<div class="space-y-1">
    <p class="text-xs font-medium tracking-wide text-gray-400 uppercase">{label}</p>
    <div class="relative h-96 w-full overflow-hidden rounded-lg shadow">
        {#if imageId}
            <PrivateImage {imageId} {alt} />
        {/if}
    </div>
</div>
