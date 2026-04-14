<script lang="ts">
    import { sandbox, generatedCSS } from '../stores/sandbox';
    import { highlightCode } from '../utils/highlight';

    type Tab = 'css' | 'svg';
    let activeTab: Tab = $state('css');

    const exportedSvg = $derived($sandbox.processedSvg);
    let copied: 'css' | 'svg' | null = $state(null);

    /**
     * Copies generated CSS to clipboard and sets temporary "copied" state for UI feedback
     */
    async function copyCss() {
        if (!$generatedCSS) return;

        await navigator.clipboard.writeText($generatedCSS);
        setCopied('css');
    }

    /**
     * Copies generated CSS to clipboard and sets temporary "copied" state for UI feedback
     */
    async function copySvg() {
        if (!exportedSvg) return;

        await navigator.clipboard.writeText(exportedSvg);
        setCopied('svg');
    }

    /**
     * Sets temporary "copied" state for UI feedback
     *
     * @param type - Target state key ('css' or 'svg')
     */

    function setCopied(type: 'css' | 'svg') {
        copied = type;
        setTimeout(() => (copied = null), 2000);
    }

    const highlightedSVG = $derived(highlightCode(exportedSvg));
    const highlightedCSS = $derived(highlightCode($generatedCSS));

    const activeCode = $derived(activeTab === 'css' ? $generatedCSS : exportedSvg);
    const isEmpty = $derived(!activeCode);
    const isCopied = $derived(copied === activeTab);
</script>

<div class="output">
    <div class="output__tabs">
        <div class="output__tablist" role="tablist" aria-label="Output format">
            <button
                id="tab-css"
                class="output__tab"
                class:output__tab--active={activeTab === 'css'}
                role="tab"
                aria-selected={activeTab === 'css'}
                aria-controls="panel-css"
                tabindex={activeTab === 'css' ? 0 : -1}
                onclick={() => (activeTab = 'css')}
            >
                CSS
            </button>

            <button
                id="tab-svg"
                class="output__tab"
                class:output__tab--active={activeTab === 'svg'}
                role="tab"
                aria-selected={activeTab === 'svg'}
                aria-controls="panel-svg"
                tabindex={activeTab === 'svg' ? 0 : -1}
                onclick={() => (activeTab = 'svg')}
            >
                SVG
            </button>
        </div>

        <button
            class="output__copy"
            class:output__copy--copied={isCopied}
            onclick={activeTab === 'css' ? copyCss : copySvg}
            disabled={isEmpty}
            aria-label={`Copy ${activeTab.toUpperCase()} to clipboard`}
        >
            {#if isCopied}
                <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <polyline
                        points="1,6 5,10 11,2"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
                <span aria-live="polite"> copied </span>
            {:else}
                <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <rect x="4" y="1" width="7" height="8" rx="1" />
                    <path d="M1 4h2v6h6v2H1z" />
                </svg>
                copy
            {/if}
        </button>
    </div>

    <div
        class="output__panel"
        role="tabpanel"
        id="panel-css"
        aria-labelledby="tab-css"
        hidden={activeTab !== 'css'}
    >
        {#if activeTab === 'css'}
            {#if !$generatedCSS}
                <div class="output__empty">
                    {#if !$sandbox.svgSource}
                        <p>paste an SVG first</p>
                    {:else if !$sandbox.selectedElementId}
                        <p>select an element and adjust controls</p>
                    {:else}
                        <p>move a slider to generate animation</p>
                    {/if}
                </div>
            {:else}
                <pre class="output__code">
                    <code>{@html highlightedCSS}</code>
                </pre>
            {/if}
        {/if}
    </div>

    <div
        class="output__panel"
        role="tabpanel"
        id="panel-svg"
        aria-labelledby="tab-svg"
        hidden={activeTab !== 'svg'}
    >
        {#if activeTab === 'svg'}
            {#if !exportedSvg}
                <div class="output__empty">
                    <p>no SVG available</p>
                </div>
            {:else}
                <pre class="output__code">
                    <code> {@html highlightedSVG}</code>
                </pre>
            {/if}
        {/if}
    </div>
</div>

<style>
    .output {
        display: flex;
        flex-direction: column;

        block-size: 100%;

        overflow: hidden;
    }

    .output__tabs {
        display: flex;
        align-items: center;
        gap: 0.125rem;
        flex-shrink: 0;

        padding-inline: 0.25rem;

        border-block-end: 0.03125rem solid var(--color-border-tertiary);
    }

    .output__tab {
        padding-block: 0.5rem;
        padding-inline: 0.625rem;

        color: var(--color-text-tertiary);
        background: transparent;
        border: none;
        border-block-end: 0.125rem solid transparent;
        cursor: pointer;

        font-size: 0.875rem;
        font-weight: 500;

        transition:
            color 0.15s,
            border-color 0.15s;
    }

    .output__tab:hover {
        color: var(--color-text-secondary);
    }

    .output__tab--active {
        border-block-end-color: var(--accent);

        color: var(--accent);
    }

    .output__copy {
        display: flex;
        align-items: center;
        gap: 0.25rem;

        padding-block: 0.25rem;
        padding-inline: 0.625rem;

        border-radius: var(--border-radius-md);
        border: 0.03125rem solid var(--color-border-secondary);
        background: transparent;
        color: var(--color-text-secondary);
        cursor: pointer;

        font-size: 0.875rem;
        white-space: nowrap;

        transition:
            background 0.1s,
            color 0.1s,
            border-color 0.1s;
    }

    .output__copy svg {
        inline-size: 0.6875rem;
        block-size: 0.6875rem;
    }

    .output__copy:hover:not(:disabled) {
        background: var(--color-background-secondary);
    }

    .output__copy:disabled {
        opacity: 0.35;
        cursor: not-allowed;
    }

    .output__copy--copied {
        border-color: var(--accent-mid);
        background: var(--accent-tint);

        color: var(--accent);
    }

    .output__panel {
        flex: 1;

        overflow-y: scroll;
        overflow-x: hidden;
    }

    .output__code {
        margin: 0;
        padding-block: 0.875rem;
        padding-inline: 0.875rem;

        font-size: 0.875rem;
        font-family: var(--font-mono);
        line-height: 1.75;
        color: var(--color-text-secondary);
        white-space: pre-wrap;
        word-break: break-word;
    }

    .output__code :global(.kw) {
        color: var(--code-keyword);
        font-weight: 500;
    }

    .output__code :global(.sel) {
        color: var(--code-selector);
    }

    .output__code :global(.prop) {
        color: var(--code-property);
    }

    .output__code :global(.val-color) {
        color: var(--code-value-color);
    }

    .output__code :global(.val-num) {
        color: var(--code-value-number);
    }

    .output__code :global(.val-kw) {
        color: var(--code-value-keyword);
    }

    .output__empty {
        display: flex;
        align-items: center;
        justify-content: center;

        block-size: 100%;

        padding-block: 1.5rem;
        padding-inline: 1.5rem;
    }

    .output__empty p {
        font-size: 0.875rem;
        color: var(--color-text-tertiary);
        text-align: center;
        line-height: 1.7;
        font-style: italic;
    }
</style>
