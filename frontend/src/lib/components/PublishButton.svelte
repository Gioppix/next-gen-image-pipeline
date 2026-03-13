<script lang="ts">
    import Button from './Button.svelte';

    let {
        publicId,
        onpublish,
        apiBase
    }: { publicId: string | null; onpublish: () => Promise<void>; apiBase: string } = $props();

    let loading = $state(false);
    let copied = $state(false);

    const url = $derived(publicId ? `${apiBase}/images/public/${publicId}` : null);

    async function handleAction() {
        if (url) {
            await navigator.clipboard.writeText(url);
            copied = true;
            setTimeout(() => (copied = false), 2000);
        } else {
            loading = true;
            await onpublish();
            loading = false;
        }
    }
</script>

<div class="flex items-center">
    <div
        class="flex h-8.5 max-w-52 items-center rounded-l border border-r-0 border-light-gold-400 bg-gray-50 px-2.5"
    >
        <span
            class="line-clamp-1 font-mono text-xs text-gray-500 transition-[filter] select-all"
            class:blur-sm={!url}
            class:select-none={!url}
            class:pointer-events-none={!url}>{url ?? `${apiBase}/images/public/••••••••••••`}</span
        >
    </div>
    <Button
        variant="neutral"
        onclick={handleAction}
        disabled={loading}
        class="w-20 shrink-0 rounded-l-none"
    >
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
        {:else}
            {copied ? 'Copied!' : url ? 'Copy' : 'Share'}
        {/if}
    </Button>
</div>
