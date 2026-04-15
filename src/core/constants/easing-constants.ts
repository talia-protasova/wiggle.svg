export const EASING_OPTIONS = [
    'ease',
    'ease-in',
    'ease-out',
    'ease-in-out',
    'linear',
    'cubic-bezier(0.34, 1.56, 0.64, 1)',
] as const;

export const EASING_LABELS: Record<string, string> = {
    ease: 'ease',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
    linear: 'linear',
    'cubic-bezier(0.34, 1.56, 0.64, 1)': 'spring',
};
