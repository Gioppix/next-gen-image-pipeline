<script lang="ts">
    let { status, polling = false }: { status: string; polling?: boolean } = $props();
</script>

<div class="flex items-center gap-2">
    <span
        class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
        class:bg-yellow-100={status === 'pending'}
        class:text-yellow-800={status === 'pending'}
        class:bg-blue-100={status === 'processing'}
        class:text-blue-800={status === 'processing'}
        class:bg-green-100={status === 'completed'}
        class:text-green-800={status === 'completed'}
        class:bg-red-100={status === 'failed'}
        class:text-red-800={status === 'failed'}
    >
        {status}
    </span>
    {#if polling}
        <span class="text-xs text-gray-400"> polling… </span>
    {/if}
</div>
