<script lang="ts">
    import { tick } from 'svelte';
    import { sandbox, generatedCSS } from '../stores/sandbox';
    import { normalizeSvg, assignIds, isAnimatable, getElementInfo } from '../utils/svgUtils';

    let previewEl: HTMLDivElement | undefined = $state();
    let selectedEl: SVGElement | null = $state(null);
    let prevSource = '';

    /**
     * Returns current SVG element rendered inside preview
     * Used as a single access point for all DOM manipulations
     */
    function getSvg(): SVGSVGElement | null {
        return previewEl?.querySelector('svg') as SVGSVGElement | null;
    }

    /**
     * Injects generated CSS into SVG via style tag
     * Creates the tag if it does not exist, otherwise updates its content
     *
     * @param css - Generated animation CSS
     */
    function injectStyles(css: string) {
        const svg = getSvg();
        if (!svg) return;

        let styleEl = svg.querySelector('style');

        if (!styleEl) {
            styleEl = document.createElement('style');
            svg.prepend(styleEl);
        }

        styleEl.textContent = css;
    }

    /**
     * Reacts to SVG source changes
     * Normalizes SVG structure, assigns unique ids to elements, and stores processed SVG for export
     */
    $effect(() => {
        const source = $sandbox.svgSource;

        if (source && source !== prevSource) {
            prevSource = source;

            tick().then(() => {
                const svg = getSvg();
                if (!svg) return;

                normalizeSvg(svg);
                assignIds(svg);

                // Save processed SVG (with ids) for export
                sandbox.setProcessedSvg(svg.outerHTML);
            });
        }

        // Clear selection when SVG source is removed
        if (!source && prevSource) {
            prevSource = '';

            Promise.resolve().then(() => {
                selectedEl = null;
                sandbox.selectElement(null);
            });
        }
    });

    /**
     * Reacts to generated CSS changes
     */
    $effect(() => {
        const css = $generatedCSS;

        Promise.resolve().then(() => {
            if (previewEl) injectStyles(css);
        });
    });

    /**
     * Restarts all animations inside SVG
     */
    function replay() {
        const svg = getSvg();
        if (!svg) return;

        const elements = Array.from(svg.querySelectorAll<SVGElement>('*'));

        elements.forEach((el) => el.style.setProperty('animation', 'none'));

        void svg.getBoundingClientRect();

        elements.forEach((el) => el.style.removeProperty('animation'));

        sandbox.setPlaying(true);
        setTimeout(() => sandbox.setPlaying(false), 100);
    }

    /**
     * Handles element selection inside SVG
     *
     * Flow:
     * - Ignores non-SVG or non-animatable elements
     * - Toggles selection if same element is clicked
     * - Assigns unique id if missing
     * - Applies visual selection state (CSS class)
     * - Syncs selected element with store
     * - Initializes animation config if needed
     * - Calculates path length for stroke animations (if supported)
     *
     * @param e - mouse event from preview canvas
     */
    function handleClick(e: MouseEvent) {
        const target = e.target as SVGElement;

        if (!(target instanceof SVGElement)) return;
        if (!isAnimatable(target)) return;

        if (selectedEl === target) {
            clearSelection();
            return;
        }

        clearSelection();

        selectedEl = target;

        if (!selectedEl.id) {
            selectedEl.id = `wiggle-${Date.now()}`;
        }

        selectedEl.classList.add('wiggle-selected');

        sandbox.selectElement(selectedEl.id);
        sandbox.ensureAnimation(selectedEl.id);

        /**
         * Calculates path length for stroke-based animations
         * Only applies if element supports getTotalLength and has visible stroke
         */
        if (typeof (selectedEl as SVGGeometryElement).getTotalLength === 'function') {
            /**
             * Checks whether element has visible stroke
             * Required to determine if dashoffset animation can be applied
             */
            const length = Math.ceil((selectedEl as SVGGeometryElement).getTotalLength());

            const hasStroke =
                selectedEl.getAttribute('stroke') !== 'none' &&
                (selectedEl.getAttribute('stroke') !== null ||
                    getComputedStyle(selectedEl).stroke !== 'none');

            sandbox.updatePathLength(selectedEl.id, hasStroke ? length : null);
            sandbox.setSelectedPathLength(hasStroke ? length : null);
        } else {
            sandbox.setSelectedPathLength(null);
        }
    }

    /**
     * Clears current selection both in DOM and store
     */
    function clearSelection() {
        selectedEl?.classList.remove('wiggle-selected');
        selectedEl = null;
        sandbox.selectElement(null);
        sandbox.setSelectedPathLength(null);
    }

    /**
     * Derived label for currently selected element
     * Used in UI footer to display element type / name
     */
    const selectedLabel = $derived(selectedEl ? getElementInfo(selectedEl).label : null);
</script>

<div class="preview">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="preview__canvas" bind:this={previewEl} onclick={handleClick}>
        <p class="scr-only">SVG preview. Click elements inside to select them.</p>
        {#if $sandbox.svgSource}
            {@html $sandbox.svgSource}
        {:else}
            <div class="preview__empty" aria-hidden="true">
                <div class="preview__empty-icon">
                    <svg viewBox="0 0 32 32" fill="none">
                        <rect
                            x="4"
                            y="4"
                            width="24"
                            height="24"
                            rx="3"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-dasharray="3 2"
                        />
                        <circle cx="12" cy="13" r="2.5" stroke="currentColor" stroke-width="1.5" />
                        <path
                            d="M4 22l6-5 5 4 4-3 9 7"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </div>

                <p class="preview__empty-text">paste an SVG to get started</p>
            </div>
        {/if}
    </div>

    <div class="preview__footer">
        <button
            class="preview__play"
            onclick={replay}
            disabled={!$sandbox.svgSource}
            aria-label="Replay animation"
            title="Replay"
        >
            <svg viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
                <polygon points="0,0 10,6 0,12" />
            </svg>
        </button>

        {#if selectedLabel}
            <span class="preview__tag preview__tag--selected" aria-live="polite">
                {selectedLabel}
            </span>
        {:else if $sandbox.svgSource}
            <span class="preview__tag preview__tag--hint"> click an element to animate </span>
        {/if}
    </div>
</div>

<style>
    .preview {
        display: grid;
        grid-template-rows: 8fr 1fr;

        block-size: 100%;
    }

    .preview__canvas {
        position: relative;

        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;

        background: var(--color-background-secondary);
        cursor: default;
        overflow: hidden;
        outline: none;
    }

    .preview__canvas:focus-visible {
        box-shadow: inset 0 0 0 0.125rem var(--accent);
    }

    .preview__canvas :global(svg) {
        max-inline-size: 70%;
        max-block-size: 70%;

        overflow: visible;
    }

    .preview__canvas :global(.wiggle-selected) {
        outline: 0.125rem dashed var(--accent);
        outline-offset: 0.25rem;
        cursor: pointer;
    }

    .preview__canvas :global(svg *:not(style):not(defs)) {
        cursor: pointer;

        transition: opacity 0.1s;
    }

    .preview__canvas :global(svg *:not(style):not(defs):hover) {
        opacity: 0.85;
    }

    .preview__empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.625rem;

        color: var(--color-text-tertiary);
    }

    .preview__empty-icon {
        display: flex;
        align-items: center;
        justify-content: center;

        inline-size: 3rem;
        block-size: 3rem;

        opacity: 0.4;
    }

    .preview__empty-icon svg {
        inline-size: 2rem;
        block-size: 2rem;
    }

    .preview__empty-text {
        font-size: 0.875rem;
        color: var(--color-text-tertiary);
    }

    .preview__footer {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        flex-shrink: 0;

        min-block-size: 2.75rem;

        padding-block: 0.5rem;
        padding-inline: 0.875rem;

        border-block-start: 0.03125rem solid var(--color-border-tertiary);
    }

    .preview__play {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        inline-size: 2rem;
        block-size: 2rem;

        border-radius: var(--border-full);
        border: none;
        background: var(--accent);
        cursor: pointer;

        color: var(--color-text-white);

        transition:
            opacity 0.15s,
            transform 0.1s;
    }

    .preview__play:hover:not(:disabled) {
        opacity: 0.85;
    }

    .preview__play:active:not(:disabled) {
        transform: scale(0.95);
    }

    .preview__play:disabled {
        opacity: 0.35;
        cursor: not-allowed;
    }

    .preview__play svg {
        inline-size: 0.5625rem;
        block-size: 0.6875rem;

        margin-inline-start: 0.0625rem;
    }

    .preview__tag {
        font-size: 0.875rem;
    }

    .preview__tag--selected {
        padding-block: 0.1875rem;
        padding-inline: 0.5rem;

        background: var(--color-background-secondary);
        border-radius: var(--border-radius-md);
        border: 0.03125rem solid var(--color-border-tertiary);
        overflow: hidden;
        font-family: var(--font-mono);
        color: var(--color-text-secondary);

        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .preview__tag--hint {
        color: var(--color-text-tertiary);
        font-style: italic;
    }
</style>
