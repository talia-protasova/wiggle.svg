<script lang="ts">
    import { sandbox, selectedAnimation, EASING_OPTIONS, EASING_LABELS } from '../stores/sandbox';

    const anim = $derived($selectedAnimation);
    const id = $derived($sandbox.selectedElementId);
    const hasSelection = $derived(!!id);

    /**
     * Updates visual animation properties (opacity, fill, stroke, etc.) for currently selected element
     *
     * @param key - Visual property name
     * @param value - New value for the property
     */
    function onVisual(key: string, value: number) {
        if (!id) return;
        sandbox.updateVisual(id, { [key]: value });
    }

    /**
     * Updates transform properties (translate, rotate, scale) for currently selected element
     *
     * @param key - Transform property name
     * @param value - New value for the property
     */
    function onTransform(key: string, value: number) {
        if (!id) return;
        sandbox.updateTransform(id, { [key]: value });
    }

    /**
     * Updates timing-related animation properties such as duration, delay or easing
     *
     * @param key - Timing property name
     * @param value - New value (string or number depending on field)
     */
    function onTiming(key: string, value: string | number) {
        if (!id) return;
        sandbox.updateTiming(id, { [key]: value });
    }

    /**
     * Sets animation iteration count (number of repeats or infinite)
     *
     * @param val - Iteration value (number or 'infinite')
     */
    function setIteration(val: number | 'infinite') {
        if (!id) return;
        sandbox.updateTiming(id, { iterationCount: val });
    }

    /**
     * Sets animation direction mode
     *
     * @param val - Direction type (normal, reverse, alternate, etc.)
     */
    function setDirection(val: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse') {
        if (!id) return;
        sandbox.updateTiming(id, { direction: val });
    }

    /**
     * Resets animation state for current element, removes existing animation and reinitializes default values
     */
    function resetElement() {
        if (!id) return;

        sandbox.removeAnimation(id);
        sandbox.ensureAnimation(id);
    }
</script>

<div class="controls" class:controls--disabled={!hasSelection} aria-disabled={!hasSelection}>
    {#if !hasSelection}
        <div class="controls__empty" aria-live="polite">
            <p>select an element<br />in the preview</p>
        </div>
    {:else if anim}
        <!-- VISUAL -->
        <section class="controls__section">
            <h3 class="controls__title">visual</h3>

            <!-- Opacity -->
            <div class="controls__group" role="group" aria-labelledby="opacity-label">
                <span id="opacity-label" class="controls__label">opacity</span>

                <div class="controls__range-group">
                    <div class="controls__range">
                        <span id="opacity-from" class="controls__range-label">from</span>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={anim.visual.opacityFrom}
                            aria-labelledby="opacity-label opacity-from"
                            oninput={(e) => onVisual('opacityFrom', +e.currentTarget.value)}
                        />
                        <span class="controls__value">{anim.visual.opacityFrom.toFixed(2)}</span>
                    </div>

                    <div class="controls__range">
                        <span id="opacity-to" class="controls__range-label">to</span>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={anim.visual.opacityTo}
                            aria-labelledby="opacity-label opacity-to"
                            oninput={(e) => onVisual('opacityTo', +e.currentTarget.value)}
                        />
                        <span class="controls__value">{anim.visual.opacityTo.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div class="controls__row">
                <label class="controls__label" for="sc">scale</label>
                <input
                    id="sc"
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.05"
                    value={anim.transform.scale}
                    oninput={(e) => onTransform('scale', +e.currentTarget.value)}
                />
                <span class="controls__value">{anim.transform.scale.toFixed(2)}×</span>
            </div>
        </section>

        <!-- TIMING -->
        <section class="controls__section">
            <h3 class="controls__title">timing</h3>

            <div class="controls__grid">
                <div class="controls__field">
                    <label class="controls__label" for="dur">duration</label>
                    <div class="controls__input-wrap">
                        <input
                            id="dur"
                            type="number"
                            min="0.1"
                            max="30"
                            step="0.1"
                            value={anim.timing.duration}
                            oninput={(e) => onTiming('duration', +e.currentTarget.value)}
                        />
                        <span class="controls__unit">s</span>
                    </div>
                </div>

                <div class="controls__field">
                    <label class="controls__label" for="del">delay</label>
                    <div class="controls__input-wrap">
                        <input
                            id="del"
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={anim.timing.delay}
                            oninput={(e) => onTiming('delay', +e.currentTarget.value)}
                        />
                        <span class="controls__unit">s</span>
                    </div>
                </div>
            </div>

            <div class="controls__row">
                <label class="controls__label" for="easing">easing</label>
                <select
                    id="easing"
                    value={anim.timing.easing}
                    onchange={(e) => onTiming('easing', e.currentTarget.value)}
                >
                    {#each EASING_OPTIONS as opt}
                        <option value={opt}>{EASING_LABELS[opt] ?? opt}</option>
                    {/each}
                </select>
            </div>

            <!-- repeat -->
            <div class="controls__row">
                <span class="controls__label">repeat</span>
                <div class="controls__chips">
                    {#each [1, 2, 3] as n}
                        <button
                            class="controls__chip"
                            class:controls__chip--active={anim.timing.iterationCount === n}
                            aria-pressed={anim.timing.iterationCount === n}
                            onclick={() => setIteration(n)}
                        >
                            {n}×
                        </button>
                    {/each}
                    <button
                        class="controls__chip"
                        class:controls__chip--active={anim.timing.iterationCount === 'infinite'}
                        aria-pressed={anim.timing.iterationCount === 'infinite'}
                        onclick={() => setIteration('infinite')}
                    >
                        ∞
                    </button>
                </div>
            </div>

            <!-- direction -->
            <div class="controls__row">
                <span class="controls__label">direction</span>
                <div class="controls__chips">
                    {#each ['normal', 'reverse', 'alternate'] as const as dir}
                        <button
                            class="controls__chip"
                            class:controls__chip--active={anim.timing.direction === dir}
                            aria-pressed={anim.timing.direction === dir}
                            onclick={() => setDirection(dir)}
                        >
                            {dir}
                        </button>
                    {/each}
                </div>
            </div>
        </section>

        <button
            class="controls__reset"
            onclick={resetElement}
            aria-label="Reset animation for selected element"
        >
            reset element
        </button>
    {/if}
</div>

<style>
    .controls {
        display: flex;
        flex-direction: column;

        block-size: 100%;
        overflow-y: scroll;

        padding: 0.75rem;

        background: var(--color-background-primary);
    }

    .controls--disabled {
        pointer-events: none;
        opacity: 0.5;
    }

    .controls__empty {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .controls__empty p {
        font-size: 0.875rem;
        color: var(--color-text-tertiary);
        text-align: center;
        line-height: 1.6;
        font-style: italic;
    }

    .controls__section {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;

        padding-block-end: 0.875rem;
        margin-block-end: 0.875rem;

        border-block-end: 0.03125rem solid var(--color-border-tertiary);
    }
    .controls__group {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
    }
    .controls__title {
        margin-block-end: 0.625rem;

        font-size: 0.875rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-text-tertiary);
    }

    .controls__row {
        display: grid;
        grid-template-columns: 4.5rem 1fr 3rem;
        align-items: center;
        gap: 0.375rem;

        margin-block-end: 0.5rem;
    }

    .controls__label {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
    }

    .controls__value {
        font-size: 0.875rem;
        font-family: var(--font-mono);
        color: var(--color-text-primary);
        text-align: end;
    }

    .controls__range-group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .controls__range {
        display: grid;
        grid-template-columns: 2rem 1fr 3rem;
        align-items: center;
        gap: 0.375rem;
    }

    .controls__range-label {
        font-size: 0.75rem;
        color: var(--color-text-tertiary);
        text-transform: uppercase;
    }

    .controls__grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
    }

    .controls__input-wrap {
        position: relative;

        display: flex;
        align-items: center;
    }

    .controls__input-wrap input {
        inline-size: 100%;
        block-size: 1.75rem;

        padding-inline: 0.5rem 1.5rem;

        border: 0.03125rem solid var(--color-border-tertiary);
        border-radius: var(--border-radius-md);
        background: var(--color-background-secondary);

        font-size: 0.875rem;
        font-family: var(--font-mono);
    }

    .controls__unit {
        position: absolute;
        inset-inline-end: 0.5rem;

        font-size: 0.75rem;
        color: var(--color-text-tertiary);
    }

    .controls select {
        block-size: 1.75rem;
        font-size: 0.875rem;
    }

    .controls__chips {
        display: flex;
        gap: 0.25rem;
        flex-wrap: wrap;
    }

    .controls__chip {
        padding-block: 0.25rem;
        padding-inline: 0.5rem;

        border-radius: var(--border-radius-md);
        border: 0.03125rem solid var(--color-border-tertiary);
        background: transparent;
        color: var(--color-text-secondary);
        cursor: pointer;

        font-size: 0.975rem;
    }

    .controls__chip--active {
        background: var(--accent-tint);
        border-color: var(--accent-mid);

        color: var(--accent-text);
        font-weight: 500;
    }

    .controls__reset {
        margin-block-start: auto;

        padding-block: 0.3125rem;
        padding-inline: 0.75rem;

        border-radius: var(--border-radius-md);
        border: 0.03125rem solid var(--color-border-secondary);
        background: transparent;

        font-size: 0.875rem;
    }
</style>
