<script lang="ts">
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { API_BASE } from '$lib/api';

    let uploading = $state(false);
    let dragOver = $state(false);
    let fileInput = $state<HTMLInputElement | null>(null);

    async function upload(file: File) {
        uploading = true;
        try {
            const form = new FormData();
            form.append('file', file);
            const res = await fetch(`${API_BASE}/transformations/create`, {
                method: 'POST',
                body: form
            });
            const { job_id } = (await res.json()) as { job_id: string };
            await goto(resolve('/transformations/[id]', { id: job_id }));
        } finally {
            uploading = false;
        }
    }

    function handleFiles(files: FileList | null) {
        const file = files?.[0];
        if (file) upload(file);
    }

    function handleDrop(e: DragEvent) {
        e.preventDefault();
        dragOver = false;
        handleFiles(e.dataTransfer?.files ?? null);
    }
</script>

<button
    type="button"
    class="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 rounded border-2 border-dashed transition-colors"
    class:border-blue-400={dragOver}
    class:bg-blue-50={dragOver}
    class:border-gray-300={!dragOver}
    class:opacity-50={uploading}
    disabled={uploading}
    onclick={() => fileInput?.click()}
    ondragover={(e) => {
        e.preventDefault();
        dragOver = true;
    }}
    ondragleave={() => {
        dragOver = false;
    }}
    ondrop={handleDrop}
>
    <input
        bind:this={fileInput}
        type="file"
        accept="image/*"
        class="hidden"
        onchange={(e) => handleFiles(e.currentTarget.files)}
    />
    {#if uploading}
        <span class="text-xs text-gray-400">Uploading…</span>
    {:else}
        <span class="text-lg text-gray-300">+</span>
        <span class="text-xs text-gray-400">Upload</span>
    {/if}
</button>
