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
        class="flex h-8.5 max-w-52 items-center rounded-l border border-r-0 border-gray-300 bg-gray-50 px-2.5"
    >
        <span
            class="line-clamp-1 font-mono text-xs text-gray-500 transition-[filter] select-all"
            class:blur-sm={!url}
            class:select-none={!url}
            class:pointer-events-none={!url}>{url ?? `${apiBase}/images/public/••••••••••••`}</span
        >
    </div>
    <Button variant="neutral" onclick={handleAction} {loading} class="w-20 shrink-0 rounded-l-none">
        {copied ? 'Copied!' : url ? 'Copy' : 'Share'}
    </Button>
</div>
