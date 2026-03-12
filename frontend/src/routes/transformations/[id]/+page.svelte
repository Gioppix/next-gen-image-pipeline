<script lang="ts">
    import { API_BASE } from '$lib/api';

    let { data } = $props();
</script>

<div class="max-w-2xl space-y-6">
    <div class="space-y-1">
        <div class="font-mono text-xs text-gray-400">{data.job_id}</div>
        <span
            class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
            class:bg-yellow-100={data.status === 'pending'}
            class:text-yellow-800={data.status === 'pending'}
            class:bg-blue-100={data.status === 'processing'}
            class:text-blue-800={data.status === 'processing'}
            class:bg-green-100={data.status === 'completed'}
            class:text-green-800={data.status === 'completed'}
            class:bg-red-100={data.status === 'failed'}
            class:text-red-800={data.status === 'failed'}
        >
            {data.status}
        </span>
    </div>

    {#if data.status === 'completed'}
        <img
            src="{API_BASE}/transformations/{data.job_id}/image"
            alt="Processed result"
            class="w-full rounded-lg shadow"
        />
    {/if}

    {#if data.error_msg}
        <p class="text-sm text-red-600">{data.error_msg}</p>
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
