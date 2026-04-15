<script lang="ts">
    type Props = {
        label: string;
        min?: number;
        max?: number;
        step?: number;
        from: number;
        to: number;
        format?: (val: number) => string;
        onchange: (from: number, to: number) => void;
    };

    let {
        label,
        min = 0,
        max = 1,
        step = 0.01,
        from,
        to,
        format = (v) => v.toFixed(2),
        onchange,
    }: Props = $props();

    const labelId = $derived(`range-label-${label.replace(/\s+/g, '-').toLowerCase()}`);
    const fromId = $derived(`${labelId}-from`);
    const toId = $derived(`${labelId}-to`);
</script>

<div class="range-from-to" role="group" aria-labelledby={labelId}>
    <span id={labelId} class="range-from-to__label">{label}</span>

    <div class="range-from-to__group">
        <div class="range-from-to__row">
            <span id={fromId} class="range-from-to__sublabel">from</span>
            <input
                type="range"
                {min}
                {max}
                {step}
                value={from}
                aria-labelledby="{labelId} {fromId}"
                oninput={(e) => onchange(+e.currentTarget.value, to)}
            />
            <span class="range-from-to__value">{format(from)}</span>
        </div>

        <div class="range-from-to__row">
            <span id={toId} class="range-from-to__sublabel">to</span>
            <input
                type="range"
                {min}
                {max}
                {step}
                value={to}
                aria-labelledby="{labelId} {toId}"
                oninput={(e) => onchange(from, +e.currentTarget.value)}
            />
            <span class="range-from-to__value">{format(to)}</span>
        </div>
    </div>
</div>

<style>
    .range-from-to {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
    }

    .range-from-to__label {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
    }

    .range-from-to__group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .range-from-to__row {
        display: grid;
        grid-template-columns: 2rem 1fr 3rem;
        align-items: center;
        gap: 0.375rem;
    }

    .range-from-to__sublabel {
        font-size: 0.75rem;
        color: var(--color-text-tertiary);
        text-transform: uppercase;
    }

    .range-from-to__value {
        font-size: 0.875rem;
        font-family: var(--font-mono);
        color: var(--color-text-primary);
        text-align: end;
    }
</style>
