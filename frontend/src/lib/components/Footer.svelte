<script lang="ts">
    const columns: { heading: string; links: { label: string; href: string }[] }[] = [
        {
            heading: 'Product',
            links: [
                { label: 'How it works', href: 'https://tintin.dlazaro.ca/day' },
                { label: 'Pricing', href: 'https://cataas.com/cat' },
                { label: 'API', href: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
            ]
        },
        {
            heading: 'Support',
            links: [
                { label: 'Help Center', href: 'https://http.cat/404' },
                { label: 'Contact', href: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
                { label: 'Status', href: 'https://isitchristmas.com' }
            ]
        },
        {
            heading: 'Legal',
            links: [
                { label: 'Privacy', href: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
                { label: 'Terms', href: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
                { label: 'Cookies', href: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
            ]
        }
    ];
</script>

{#snippet link(href: string, label: string)}
    <a {href} target="_blank" rel="external noopener" class="hover:text-gray-600">{label}</a>
{/snippet}

{#snippet column(heading: string, links: { label: string; href: string }[])}
    <div>
        <p class="mb-3 text-sm font-semibold text-gray-700">{heading}</p>
        <ul class="space-y-2 text-sm text-gray-400">
            {#each links as { label, href } (label)}
                <li>{@render link(href, label)}</li>
            {/each}
        </ul>
    </div>
{/snippet}

<footer class="border-t border-gray-200 bg-white py-12">
    <div class="page-container">
        <div class="grid grid-cols-3 gap-8 pb-10">
            {#each columns as { heading, links } (heading)}
                {@render column(heading, links)}
            {/each}
        </div>

        <div class="border-t border-gray-100 pt-6 text-xs text-gray-400">
            © 1984 Background Annihilator. All rights reserved.
        </div>
    </div>
</footer>
