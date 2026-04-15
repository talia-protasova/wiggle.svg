<script lang="ts">
    type Props = {
        label: string;
        id: string;
        min?: number;
        max?: number;
        step?: number;
        value: number;
        format?: (val: number) => string;
        onchange: (value: number) => void;
    };

    let {
        label,
        id,
        min = 0,
        max = 100,
        step = 1,
        value,
        format = (v) => String(v),
        onchange,
    }: Props = $props();
</script>

<div class="range-single">
    <label class="range-single__label" for={id}>{label}</label>
    <input
        {id}
        type="range"
        {min}
        {max}
        {step}
        {value}
        oninput={(e) => onchange(+e.currentTarget.value)}
    />
    <span class="range-single__value">{format(value)}</span>
</div>

<style>
    .range-single {
        display: grid;
        grid-template-columns: 4.5rem 1fr 3rem;
        align-items: center;
        gap: 0.375rem;
    }

    .range-single__label {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
    }

    .range-single__value {
        font-size: 0.875rem;
        font-family: var(--font-mono);
        color: var(--color-text-primary);
        text-align: end;
    }
</style>
