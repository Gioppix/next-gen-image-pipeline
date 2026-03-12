<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import { api, API_BASE } from '$lib/api';
    import StatusBadge from '$lib/components/StatusBadge.svelte';
    import ImagePanel from '$lib/components/ImagePanel.svelte';

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

<div class="max-w-4xl space-y-6">
    <div class="space-y-1">
        <div class="font-mono text-xs text-gray-400">{data.job_id}</div>
        <StatusBadge {status} {polling} />
    </div>

    {#if errorMsg}
        <p class="text-sm text-red-600">{errorMsg}</p>
    {/if}

    <div class="grid grid-cols-2 gap-4">
        <ImagePanel label="Original" imageId={data.original_image_id} alt="Original" />
        <ImagePanel
            label="Final"
            imageId={status === 'completed' ? data.final_image_id : null}
            alt="Processed result"
        />
    </div>

    {#if status === 'completed'}
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
                    href="{API_BASE}/images/public/{publicId}"
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
