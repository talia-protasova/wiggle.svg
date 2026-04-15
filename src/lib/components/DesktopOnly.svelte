<script lang="ts">
    import { onMount } from 'svelte';

    type Props = {
        children: import('svelte').Snippet;
    };

    let { children }: Props = $props();

    let isDesktop = $state(true);

    onMount(() => {
        const check = () => {
            isDesktop = window.innerWidth >= 1440;
        };
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    });
</script>

{#if isDesktop}
    {@render children()}
{:else}
    <div class="desktop-only">
        <p class="desktop-only__title">wiggle.svg</p>
        <p class="desktop-only__text">This tool is designed for desktop.</p>
        <p class="desktop-only__text">Mobile and tablet support is coming later.</p>
    </div>
{/if}

<style>
    .desktop-only {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;

        block-size: 100dvh;

        padding: 2rem;

        text-align: center;
    }

    .desktop-only__title {
        font-size: 1.25rem;
        font-weight: 500;
        color: var(--accent);
    }

    .desktop-only__text {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        line-height: 1.6;
    }
</style>
