import type { ChipOption } from '../models/chip-options.model';

export const ITERATION_OPTIONS: ChipOption<number | 'infinite'>[] = [
    { value: 1, label: '1×' },
    { value: 2, label: '2×' },
    { value: 3, label: '3×' },
    { value: 'infinite', label: '∞' },
];

export const DIRECTION_OPTIONS: ChipOption<'normal' | 'reverse' | 'alternate'>[] = [
    { value: 'normal', label: 'normal' },
    { value: 'reverse', label: 'reverse' },
    { value: 'alternate', label: 'alternate' },
];
