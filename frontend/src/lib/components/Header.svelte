<script lang="ts">
    import { Blend } from '@lucide/svelte';
    import { resolve } from '$app/paths';
</script>

<header class="sticky top-0 z-50 border-b border-gray-200 bg-white/80 py-3 backdrop-blur">
    <div class="page-container flex items-center justify-between">
        <a
            href={resolve('/')}
            class="flex items-center gap-2 font-bold text-gray-900 hover:text-gray-600"
        >
            <Blend size={20} />
        </a>
        <a
            href={resolve('/')}
            class="rounded-full bg-moss-green-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-moss-green-600"
        >
            Upload
        </a>
    </div>
</header>
