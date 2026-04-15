<script lang="ts" generics="T extends string | number">
    import type { ChipOption } from '../../core/models/chip-options.model';

    type Props = {
        label: string;
        options: ChipOption<T>[];
        value: T;
        onchange: (value: T) => void;
    };

    let { label, options, value, onchange }: Props = $props();

    const groupId = $derived(`chip-group-${label.replace(/\s+/g, '-').toLowerCase()}`);
</script>

<div class="chip-group" role="group" aria-labelledby={groupId}>
    <span id={groupId} class="chip-group__label">{label}</span>
    <div class="chip-group__chips">
        {#each options as opt}
            <button
                class="chip-group__chip"
                class:chip-group__chip--active={value === opt.value}
                aria-pressed={value === opt.value}
                onclick={() => onchange(opt.value)}
            >
                {opt.label}
            </button>
        {/each}
    </div>
</div>

<style>
    .chip-group {
        display: grid;
        grid-template-columns: 4.5rem 1fr;
        align-items: center;
        gap: 0.375rem;
    }

    .chip-group__label {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
    }

    .chip-group__chips {
        display: flex;
        gap: 0.25rem;
        flex-wrap: wrap;
    }

    .chip-group__chip {
        padding-block: 0.25rem;
        padding-inline: 0.5rem;

        border-radius: var(--border-radius-md);
        border: 0.03125rem solid var(--color-border-tertiary);
        background: transparent;
        color: var(--color-text-secondary);
        cursor: pointer;

        font-size: 0.875rem;
        transition:
            background 0.1s,
            border-color 0.1s,
            color 0.1s;
    }

    .chip-group__chip:hover {
        background: var(--color-background-secondary);
    }

    .chip-group__chip--active {
        background: var(--accent-tint);
        border-color: var(--accent-mid);
        color: var(--accent-text);
        font-weight: 500;
    }
</style>
