<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import { api, API_BASE } from '$lib/api';

    let fileInput = $state<HTMLInputElement | null>(null);
    let jobId = $state<string | null>(null);
    let status = $state<'pending' | 'processing' | 'completed' | 'failed' | null>(null);
    let errorMsg = $state<string | null>(null);
    let publicId = $state<string | null>(null);
    let uploading = $state(false);
    let polling = $state(false);

    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        const file = fileInput?.files?.[0];
        if (!file) return;

        uploading = true;
        jobId = null;
        status = null;
        errorMsg = null;
        publicId = null;

        try {
            const form = new FormData();
            form.append('file', file);
            const res = await fetch(`${API_BASE}/transformations/create`, {
                method: 'POST',
                body: form
            });
            const data = (await res.json()) as { job_id: string };
            jobId = data.job_id;
            poll();
        } finally {
            uploading = false;
        }
    }

    async function poll() {
        if (!jobId) return;
        polling = true;
        while (true) {
            const { data } = await api.GET('/transformations/{id}/status', {
                params: { path: { id: jobId } }
            });
            if (data) {
                status = data.status;
                errorMsg = data.error_msg ?? null;
                if (data.status === 'completed' || data.status === 'failed') break;
            }
            await new Promise((r) => setTimeout(r, 2000));
        }
        polling = false;
        await invalidateAll();
    }

    async function publish() {
        if (!jobId) return;
        const { data } = await api.POST('/transformations/{id}/publish', {
            params: { path: { id: jobId } }
        });
        if (data) publicId = data.public_id;
    }
</script>

<div class="max-w-lg space-y-8">
    <h1 class="text-2xl font-bold">Image Pipeline</h1>

    <form onsubmit={handleSubmit} class="flex gap-3">
        <input
            bind:this={fileInput}
            type="file"
            accept="image/*"
            required
            class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
        <button
            type="submit"
            disabled={uploading}
            class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        >
            {uploading ? 'Uploading…' : 'Upload'}
        </button>
    </form>

    {#if jobId}
        <div class="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
            <div class="font-mono text-xs text-gray-400">{jobId}</div>

            <div class="flex items-center gap-2">
                <span
                    class="rounded-full px-2.5 py-0.5 text-xs font-medium"
                    class:bg-yellow-100={status === 'pending'}
                    class:text-yellow-800={status === 'pending'}
                    class:bg-blue-100={status === 'processing'}
                    class:text-blue-800={status === 'processing'}
                    class:bg-green-100={status === 'completed'}
                    class:text-green-800={status === 'completed'}
                    class:bg-red-100={status === 'failed'}
                    class:text-red-800={status === 'failed'}
                >
                    {status ?? '…'}
                </span>
                {#if polling}<span class="text-xs text-gray-400">polling…</span>{/if}
            </div>

            {#if errorMsg}
                <p class="text-sm text-red-600">{errorMsg}</p>
            {/if}

            {#if status === 'completed'}
                <img
                    src="{API_BASE}/transformations/{jobId}/image"
                    alt="Result"
                    class="w-full rounded"
                />
                <div class="flex gap-3">
                    {#if !publicId}
                        <button
                            onclick={publish}
                            class="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                        >
                            Publish
                        </button>
                    {:else}
                        <a
                            href="{API_BASE}/images/{publicId}"
                            rel="external"
                            target="_blank"
                            class="text-sm text-blue-600 hover:underline"
                        >
                            Public URL →
                        </a>
                    {/if}
                </div>
            {/if}
        </div>
    {/if}
</div>
