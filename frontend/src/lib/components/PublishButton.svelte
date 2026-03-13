<script lang="ts">
    import Button from './Button.svelte';

    let {
        publicId,
        onpublish,
        apiBase
    }: { publicId: string | null; onpublish: () => Promise<void>; apiBase: string } = $props();

    let loading = $state(false);
    let copied = $state(false);

    async function handlePublish() {
        loading = true;
        await onpublish();
        loading = false;
    }

    async function copyUrl() {
        await navigator.clipboard.writeText(`${apiBase}/images/public/${publicId}`);
        copied = true;
        setTimeout(() => (copied = false), 2000);
    }
</script>

{#if !publicId}
    <Button variant="primary" onclick={handlePublish} disabled={loading}>
        {#if loading}
            <svg
                class="h-3.5 w-3.5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
            >
                <path
                    d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                />
            </svg>
        {/if}
        Publish
    </Button>
{:else}
    <div class="flex w-full max-w-sm items-center gap-2">
        <span class="min-w-0 flex-1 truncate font-mono text-sm text-gray-500"
            >{apiBase}/images/public/{publicId}</span
        >
        <Button variant="neutral" onclick={copyUrl} class="shrink-0">
            {copied ? 'Copied!' : 'Copy'}
        </Button>
    </div>
{/if}
