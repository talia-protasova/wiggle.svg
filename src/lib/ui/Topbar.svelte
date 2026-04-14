<script lang="ts">
    import { sandbox } from '../stores/sandbox';
</script>

<header class="topbar">
    <h1 class="topbar__brand">
        <span class="topbar__dot" aria-hidden="true"></span>
        <span class="topbar__text">
            wiggle<span class="topbar__accent">.svg</span>
        </span>
    </h1>

    <button class="topbar__button" onclick={() => sandbox.resetAll()}> reset all </button>
</header>

<style>
    .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;

        padding-inline: 1.25rem;
        padding-block: 0.85rem;

        border-block-end: 0.03125rem solid var(--color-border-tertiary);
        background: var(--color-background-primary);
    }

    .topbar__brand {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .topbar__dot {
        flex-shrink: 0;

        inline-size: 0.625rem;
        block-size: 0.625rem;

        border-radius: var(--border-full);
        background: var(--accent);
    }

    .topbar__text {
        font-size: 1.2rem;
        font-weight: 500;
        letter-spacing: -0.01em;
        color: var(--color-text-primary);
    }

    .topbar__accent {
        color: var(--accent);
    }

    .topbar__button {
        display: flex;
        align-items: center;

        padding: 0.6rem;

        font-size: 0.8rem;
    }
</style>
