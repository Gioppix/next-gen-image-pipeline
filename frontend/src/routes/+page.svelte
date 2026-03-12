<script lang="ts">
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { API_BASE } from '$lib/api';

    let fileInput = $state<HTMLInputElement | null>(null);
    let uploading = $state(false);

    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        const file = fileInput?.files?.[0];
        if (!file) return;

        uploading = true;
        try {
            const form = new FormData();
            form.append('file', file);
            const res = await fetch(`${API_BASE}/transformations/create`, {
                method: 'POST',
                body: form
            });
            const { job_id } = (await res.json()) as { job_id: string };
            await goto(resolve(`/transformations/[id]`, { id: job_id }));
        } finally {
            uploading = false;
        }
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
</div>
