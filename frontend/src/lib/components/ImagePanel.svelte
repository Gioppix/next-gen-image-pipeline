<script lang="ts">
    import PrivateImage from './PrivateImage.svelte';
    import { CircleX } from '@lucide/svelte';
    import type { JobStatus } from '$lib/api';

    let {
        imageId,
        alt,
        status
    }: { imageId: string | null | undefined; alt: string; status?: JobStatus } = $props();

    let inProgress = $derived(status === 'pending' || status === 'processing');
    let failed = $derived(status === 'failed');
</script>

<div class="relative h-96 w-full overflow-hidden rounded-lg bg-gray-50">
    {#if inProgress}
        <div class="flex h-full items-center justify-center">
            <span class="loader"></span>
        </div>
    {:else if failed}
        <div class="flex h-full flex-col items-center justify-center gap-2">
            <CircleX size={32} class="text-red-400" />
            <span class="text-sm text-red-400">Processing failed</span>
        </div>
    {:else if imageId}
        <PrivateImage {imageId} {alt} />
    {/if}
</div>

<style>
    .loader {
        color: #6b7280;
        font-size: 10px;
        width: 1em;
        height: 1em;
        border-radius: 50%;
        position: relative;
        text-indent: -9999em;
        animation: mulShdSpin 1.3s infinite linear;
        transform: translateZ(0);
    }

    @keyframes mulShdSpin {
        0%,
        100% {
            box-shadow:
                0 -3em 0 0.2em,
                2em -2em 0 0em,
                3em 0 0 -1em,
                2em 2em 0 -1em,
                0 3em 0 -1em,
                -2em 2em 0 -1em,
                -3em 0 0 -1em,
                -2em -2em 0 0;
        }
        12.5% {
            box-shadow:
                0 -3em 0 0,
                2em -2em 0 0.2em,
                3em 0 0 0,
                2em 2em 0 -1em,
                0 3em 0 -1em,
                -2em 2em 0 -1em,
                -3em 0 0 -1em,
                -2em -2em 0 -1em;
        }
        25% {
            box-shadow:
                0 -3em 0 -0.5em,
                2em -2em 0 0,
                3em 0 0 0.2em,
                2em 2em 0 0,
                0 3em 0 -1em,
                -2em 2em 0 -1em,
                -3em 0 0 -1em,
                -2em -2em 0 -1em;
        }
        37.5% {
            box-shadow:
                0 -3em 0 -1em,
                2em -2em 0 -1em,
                3em 0em 0 0,
                2em 2em 0 0.2em,
                0 3em 0 0em,
                -2em 2em 0 -1em,
                -3em 0em 0 -1em,
                -2em -2em 0 -1em;
        }
        50% {
            box-shadow:
                0 -3em 0 -1em,
                2em -2em 0 -1em,
                3em 0 0 -1em,
                2em 2em 0 0em,
                0 3em 0 0.2em,
                -2em 2em 0 0,
                -3em 0em 0 -1em,
                -2em -2em 0 -1em;
        }
        62.5% {
            box-shadow:
                0 -3em 0 -1em,
                2em -2em 0 -1em,
                3em 0 0 -1em,
                2em 2em 0 -1em,
                0 3em 0 0,
                -2em 2em 0 0.2em,
                -3em 0 0 0,
                -2em -2em 0 -1em;
        }
        75% {
            box-shadow:
                0em -3em 0 -1em,
                2em -2em 0 -1em,
                3em 0em 0 -1em,
                2em 2em 0 -1em,
                0 3em 0 -1em,
                -2em 2em 0 0,
                -3em 0em 0 0.2em,
                -2em -2em 0 0;
        }
        87.5% {
            box-shadow:
                0em -3em 0 0,
                2em -2em 0 -1em,
                3em 0 0 -1em,
                2em 2em 0 -1em,
                0 3em 0 -1em,
                -2em 2em 0 0,
                -3em 0em 0 0,
                -2em -2em 0 0.2em;
        }
    }
</style>
