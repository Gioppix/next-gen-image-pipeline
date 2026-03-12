<script lang="ts">
    import { API_BASE } from '$lib/api';

    let {
        imageId,
        alt,
        objectFit = 'contain'
    }: { imageId: string; alt: string; objectFit?: 'contain' | 'cover' } = $props();
</script>

<!-- using `key` to force a re-render and avoid showing an old image while loading the new one -->
{#key imageId}
    <img
        src="{API_BASE}/images/private/{imageId}"
        {alt}
        class="absolute inset-0 h-full w-full"
        class:object-contain={objectFit === 'contain'}
        class:object-cover={objectFit === 'cover'}
    />
{/key}
