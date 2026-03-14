<script lang="ts">
    import type { Snippet } from 'svelte';
    import { Loader2 } from '@lucide/svelte';

    let {
        variant = 'neutral',
        icon = false,
        disabled = false,
        loading = false,
        type = 'button' as const,
        onclick,
        class: className = '',
        children
    }: {
        variant?: 'primary' | 'neutral' | 'danger';
        icon?: boolean;
        disabled?: boolean;
        loading?: boolean;
        type?: 'button' | 'submit' | 'reset';
        onclick?: (e: MouseEvent) => void;
        class?: string;
        children?: Snippet;
    } = $props();

    const base =
        'inline-flex items-center justify-center gap-2 rounded text-sm transition-colors disabled:opacity-60';

    const variants: Record<string, string> = {
        primary:
            'bg-moss-green-500 border border-moss-green-600 font-medium text-white hover:bg-moss-green-600',
        neutral: 'bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 font-medium',
        danger: 'bg-gray-100 border border-gray-300 text-gray-700 font-medium hover:bg-coral-glow-500 hover:border-coral-glow-600 hover:text-white'
    };

    const padding = $derived(icon ? 'p-1.5' : 'px-3 py-1.5');
</script>

<button
    {type}
    disabled={disabled || loading}
    {onclick}
    class="{base} {variants[variant]} {padding} {className}"
>
    {#if loading}
        {#if !icon}&nbsp;{/if}
        <Loader2 size={14} class="animate-spin" />
        {#if !icon}&nbsp;{/if}
    {:else}
        {@render children?.()}
    {/if}
</button>
