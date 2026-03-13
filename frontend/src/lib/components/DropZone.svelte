<script lang="ts">
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { API_BASE } from '$lib/api';

    // these limits should be read from the backend
    const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_SIZE_BYTES = 10 * 1024 * 1024;

    let uploading = $state(false);

    let dragOver = $state(false);
    let error = $state<string | null>(null);
    let fileInput = $state<HTMLInputElement | null>(null);

    async function upload(file: File) {
        error = null;
        if (!ACCEPTED_TYPES.some((t) => t === file.type)) {
            error = 'Only JPEG, PNG, and WebP files are accepted.';
            return;
        }
        if (file.size > MAX_SIZE_BYTES) {
            error = 'File must be 10 MB or smaller.';
            return;
        }

        uploading = true;
        try {
            const form = new FormData();
            form.append('file', file);
            const res = await fetch(`${API_BASE}/transformations/create`, {
                method: 'POST',
                body: form
            });
            if (!res.ok) {
                const body = (await res.json()) as { error: string };
                error = body.error;
                return;
            }
            const { job_id } = (await res.json()) as { job_id: string };
            await goto(resolve('/transformations/[id]', { id: job_id }));
        } catch {
            error = 'Upload failed. Please try again.';
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

<div class="flex h-full min-h-60 flex-col gap-2">
    <div
        role="button"
        tabindex="0"
        class="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-8 py-12 transition-colors"
        class:border-blue-400={dragOver}
        class:bg-blue-50={dragOver}
        class:border-gray-300={!dragOver}
        class:opacity-50={uploading}
        class:pointer-events-none={uploading}
        onclick={() => fileInput?.click()}
        onkeydown={(e) => e.key === 'Enter' && fileInput?.click()}
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
            accept="image/jpeg,image/png,image/webp"
            class="hidden"
            onchange={(e) => handleFiles(e.currentTarget.files)}
        />
        {#if uploading}
            <span class="text-sm text-gray-400">Uploading…</span>
        {:else}
            <div class="flex flex-col items-center gap-1">
                <p class="text-lg font-semibold text-gray-700">Drag & drop an image here</p>
                <p class="text-sm text-gray-400">or click to browse</p>
            </div>
            <button
                type="button"
                onclick={(e) => {
                    e.stopPropagation();
                    fileInput?.click();
                }}
                class="rounded-full bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
                Upload your photo
            </button>
            <p class="text-xs text-gray-400">JPEG, PNG, or WebP · max 10 MB</p>
        {/if}
    </div>
    {#if error}
        <p class="text-center text-sm text-red-500">{error}</p>
    {/if}
</div>
