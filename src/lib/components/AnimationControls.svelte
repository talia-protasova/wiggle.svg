<script lang="ts">
    import { sandbox, selectedAnimation } from '../stores/sandbox';
    import RangeFromTo from '../ui/RangeFromTo.svelte';
    import ChipGroup from '../ui/ChipGroup.svelte';
    import {
        ITERATION_OPTIONS,
        DIRECTION_OPTIONS,
        EASING_OPTIONS,
        EASING_LABELS,
    } from '../../core/constants';
    import RangeSingle from '../ui/RangeSingle.svelte';

    const anim = $derived($selectedAnimation);
    const id = $derived($sandbox.selectedElementId);
    const hasSelection = $derived(!!id);

    /**
     * Toggles orbit animation mode for current element
     *
     * @param value - new orbit mode state
     */
    function onOrbitMode(value: boolean) {
        if (!id) return;
        sandbox.updateTransform(id, { orbitMode: value });
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
        <!-- TRANSFORM -->
        <section class="controls__section">
            <h3 class="controls__title">transform</h3>

            <RangeSingle
                id="tx"
                label="translate x"
                min={-200}
                max={200}
                step={1}
                value={anim.transform.translateX}
                format={(v) => `${v}px`}
                onchange={(v) => onTransform('translateX', v)}
            />

            <RangeSingle
                id="ty"
                label="translate y"
                min={-200}
                max={200}
                step={1}
                value={anim.transform.translateY}
                format={(v) => `${v}px`}
                onchange={(v) => onTransform('translateY', v)}
            />

            <RangeSingle
                id="sc"
                label="scale"
                min={0.1}
                max={3}
                step={0.05}
                value={anim.transform.scale}
                format={(v) => `${v.toFixed(2)}×`}
                onchange={(v) => onTransform('scale', v)}
            />

            <RangeFromTo
                label="rotate"
                min={-360}
                max={360}
                step={1}
                from={anim.transform.rotateFrom}
                to={anim.transform.rotateTo}
                format={(v) => `${v}°`}
                onchange={(from, to) => {
                    if (!id) return;
                    sandbox.updateTransform(id, { rotateFrom: from, rotateTo: to });
                }}
            />

            {#if !anim.transform.orbitMode}
                <RangeSingle
                    id="ox"
                    label="origin x"
                    min={-200}
                    max={200}
                    step={1}
                    value={anim.transform.rotateOriginX}
                    format={(v) => `${v}%`}
                    onchange={(v) => onTransform('rotateOriginX', v)}
                />

                <RangeSingle
                    id="oy"
                    label="origin y"
                    min={-200}
                    max={200}
                    step={1}
                    value={anim.transform.rotateOriginY}
                    format={(v) => `${v}%`}
                    onchange={(v) => onTransform('rotateOriginY', v)}
                />

                <RangeSingle
                    id="rx"
                    label="rotate x"
                    min={-180}
                    max={180}
                    step={1}
                    value={anim.transform.rotateX}
                    format={(v) => `${v}°`}
                    onchange={(v) => onTransform('rotateX', v)}
                />

                <RangeSingle
                    id="ry"
                    label="rotate y"
                    min={-180}
                    max={180}
                    step={1}
                    value={anim.transform.rotateY}
                    format={(v) => `${v}°`}
                    onchange={(v) => onTransform('rotateY', v)}
                />
            {/if}

            <div class="controls__row">
                <label class="controls__label" for="orbit">orbit</label>
                <input
                    id="orbit"
                    type="checkbox"
                    checked={anim.transform.orbitMode}
                    onchange={(e) => onOrbitMode(e.currentTarget.checked)}
                />
            </div>

            {#if anim.transform.orbitMode}
                <RangeSingle
                    id="or"
                    label="radius"
                    min={0}
                    max={300}
                    step={1}
                    value={anim.transform.orbitRadius}
                    format={(v) => `${v}px`}
                    onchange={(v) => onTransform('orbitRadius', v)}
                />
            {/if}
        </section>

        <!-- VISUAL -->
        <section class="controls__section">
            <h3 class="controls__title">visual</h3>

            <RangeFromTo
                label="opacity"
                min={0}
                max={1}
                step={0.01}
                from={anim.visual.opacityFrom}
                to={anim.visual.opacityTo}
                format={(v) => v.toFixed(2)}
                onchange={(from, to) => {
                    if (!id) return;
                    sandbox.updateVisual(id, { opacityFrom: from, opacityTo: to });
                }}
            />
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

            <ChipGroup
                label="repeat"
                options={ITERATION_OPTIONS}
                value={anim.timing.iterationCount}
                onchange={(val) => onTiming('iterationCount', val)}
            />

            <ChipGroup
                label="direction"
                options={DIRECTION_OPTIONS}
                value={anim.timing.direction}
                onchange={(val) => onTiming('direction', val)}
            />
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
    }

    .controls__label {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
    }

    .controls__grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
    }

    .controls__field {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
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

    .controls__reset {
        margin-block-start: auto;

        padding-block: 0.3125rem;
        padding-inline: 0.75rem;

        border-radius: var(--border-radius-md);
        border: 0.03125rem solid var(--color-border-secondary);
        background: transparent;

        font-size: 0.875rem;
        color: var(--color-text-secondary);
        cursor: pointer;
        transition: background 0.1s;
    }

    .controls__reset:hover {
        background: var(--color-background-secondary);
    }
</style>
