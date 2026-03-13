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
        primary: 'bg-indigo-600 font-medium text-white hover:bg-indigo-700',
        neutral: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        danger: 'bg-red-600 font-medium text-white hover:bg-red-700'
    };

    const padding = $derived(icon ? 'p-1.5' : 'px-3 py-1.5');
</script>

<button {type} {disabled} {onclick} class="{base} {variants[variant]} {padding} {className}">
    {@render children?.()}
</button>
