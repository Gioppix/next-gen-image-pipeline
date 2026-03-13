<script lang="ts">
    import type { Snippet } from 'svelte';

    let {
        variant = 'neutral',
        icon = false,
        disabled = false,
        type = 'button' as const,
        onclick,
        class: className = '',
        children
    }: {
        variant?: 'primary' | 'neutral' | 'danger';
        icon?: boolean;
        disabled?: boolean;
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
        neutral:
            'bg-light-gold-100 border border-light-gold-400 text-light-gold-800 hover:bg-light-gold-200',
        danger: 'bg-coral-glow-500 border border-coral-glow-600 font-medium text-white hover:bg-coral-glow-600'
    };

    const padding = $derived(icon ? 'p-1.5' : 'px-3 py-1.5');
</script>

<button {type} {disabled} {onclick} class="{base} {variants[variant]} {padding} {className}">
    {@render children?.()}
</button>
