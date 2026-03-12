<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import { api, API_BASE } from '$lib/api';

    let { data } = $props();

    let status = $derived(data.status);
    let errorMsg = $derived<string | null>(data.error_msg ?? null);
    let polling = $state(false);
    let publicId = $state<string | null>(null);

    $effect(() => {
        let cancelled = false;

        status = data.status;
        errorMsg = data.error_msg ?? null;
        publicId = null;

        if (data.status !== 'completed' && data.status !== 'failed') {
            doPoll(data.job_id, () => cancelled);
        }

        return () => {
            cancelled = true;
        };
    });

    async function doPoll(jobId: string, isCancelled: () => boolean) {
        polling = true;
        while (true) {
            if (isCancelled()) break;
            const { data: res } = await api.GET('/transformations/{id}/status', {
                params: { path: { id: jobId } }
            });
            if (isCancelled()) break;
            if (res) {
                status = res.status;
                errorMsg = res.error_msg ?? null;
                if (res.status === 'completed' || res.status === 'failed') break;
            }
            await new Promise((r) => setTimeout(r, 2000));
        }
        polling = false;
        if (!isCancelled()) await invalidateAll();
    }

    async function publish() {
        const { data: res } = await api.POST('/transformations/{id}/publish', {
            params: { path: { id: data.job_id } }
        });
        if (res) publicId = res.public_id;
    }
</script>

<div class="max-w-2xl space-y-6">
    <div class="space-y-1">
        <div class="font-mono text-xs text-gray-400">{data.job_id}</div>
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
            {#if polling}<span class="text-xs text-gray-400">polling…</span>{/if}
        </div>
    </div>

    {#if errorMsg}
        <p class="text-sm text-red-600">{errorMsg}</p>
    {/if}

    {#if status === 'completed'}
        <img
            src="{API_BASE}/transformations/{data.job_id}/image"
            alt="Processed result"
            class="w-full rounded-lg shadow"
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

    <dl class="space-y-1 text-sm text-gray-500">
        <div>
            <dt class="inline font-medium">Submitted:</dt>
            {new Date(data.submitted_at).toLocaleString()}
        </div>
        {#if data.completed_at}
            <div>
                <dt class="inline font-medium">Completed:</dt>
                {new Date(data.completed_at).toLocaleString()}
            </div>
        {/if}
    </dl>
</div>
