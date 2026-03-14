<script lang="ts">
    import { goto, invalidate, invalidateAll } from '$app/navigation';
    import { api, API_BASE } from '$lib/api';
    import ImagePanel from '$lib/components/ImagePanel.svelte';
    import PublishButton from '$lib/components/PublishButton.svelte';
    import Button from '$lib/components/Button.svelte';
    import { ArrowRight } from '@lucide/svelte';
    import { resolve } from '$app/paths';

    let { data } = $props();

    let status = $derived(data.status);
    let errorMsg = $derived<string | null>(data.error_msg ?? null);
    let publicId = $derived<string | null>(data.public_id ?? null);

    $effect(() => {
        let cancelled = false;

        status = data.status;
        errorMsg = data.error_msg ?? null;

        if (data.status !== 'completed' && data.status !== 'failed') {
            doPoll(data.job_id, () => cancelled);
        }

        return () => {
            cancelled = true;
        };
    });

    async function doPoll(jobId: string, isCancelled: () => boolean) {
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
        if (!isCancelled()) await invalidateAll();
    }

    let deleting = $state(false);

    async function deleteJob() {
        deleting = true;
        await api.DELETE('/transformations/{id}', { params: { path: { id: data.job_id } } });
        await invalidateAll();
        await goto(resolve('/'));
    }

    async function publish() {
        const { data: res } = await api.POST('/transformations/{id}/publish', {
            params: { path: { id: data.job_id } }
        });
        if (res) await invalidate(`job:${data.job_id}`);
    }
</script>

<div class="max-w-4xl space-y-6">
    {#if errorMsg}
        <p class="text-sm text-red-600">{errorMsg}</p>
    {/if}

    <div class="flex items-center gap-4">
        <ImagePanel imageId={data.original_image_id} alt="Original" />
        <ArrowRight class="shrink-0 text-gray-300" size={28} />
        <ImagePanel
            imageId={status === 'completed' ? data.final_image_id : null}
            alt="Processed result"
            status="completed"
        />
    </div>

    <div class="flex h-10 items-center justify-center gap-3">
        {#if status === 'completed'}
            <PublishButton {publicId} onpublish={publish} apiBase={API_BASE} />
        {/if}
        <Button variant="danger" class="w-20" loading={deleting} onclick={deleteJob}>Delete</Button>
    </div>
</div>
