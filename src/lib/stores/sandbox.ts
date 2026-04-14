import { writable, derived } from 'svelte/store';
import { buildCSS } from '../utils/cssGenerator';

export type TransformValues = {
    translateX: number;
    translateY: number;
    rotate: number;
    scale: number;
};

export type VisualValues = {
    opacityFrom: number;
    opacityTo: number;
    fillFrom: string;
    fillTo: string;
    strokeFrom: string;
    strokeTo: string;
    strokeDashoffsetFrom: number;
    strokeDashoffsetTo: number;
};

export type TimingValues = {
    duration: number;
    delay: number;
    easing: string;
    iterationCount: number | 'infinite';
    direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
};

export type ElementAnimation = {
    elementId: string;
    transform: TransformValues;
    visual: VisualValues;
    timing: TimingValues;
};

export type SandboxState = {
    svgSource: string;
    animations: Map<string, ElementAnimation>;
    selectedElementId: string | null;
    isPlaying: boolean;
    processedSvg: string;
};

export const DEFAULT_TRANSFORM: TransformValues = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    scale: 1,
};

export const DEFAULT_VISUAL: VisualValues = {
    opacityFrom: 1,
    opacityTo: 1,
    fillFrom: '',
    fillTo: '',
    strokeFrom: '',
    strokeTo: '',
    strokeDashoffsetFrom: 0,
    strokeDashoffsetTo: 0,
};

export const DEFAULT_TIMING: TimingValues = {
    duration: 1,
    delay: 0,
    easing: 'ease',
    iterationCount: 1,
    direction: 'normal',
};

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

function makeDefaultAnimation(elementId: string): ElementAnimation {
    return {
        elementId,
        transform: { ...DEFAULT_TRANSFORM },
        visual: { ...DEFAULT_VISUAL },
        timing: { ...DEFAULT_TIMING },
    };
}

function createSandboxStore() {
    const { subscribe, set, update } = writable<SandboxState>({
        svgSource: '',
        animations: new Map(),
        selectedElementId: null,
        isPlaying: false,
        processedSvg: '',
    });

    return {
        subscribe,

        setSvgSource(source: string) {
            update((s) => ({ ...s, svgSource: source }));
        },

        selectElement(id: string | null) {
            update((s) => ({ ...s, selectedElementId: id }));
        },

        setPlaying(playing: boolean) {
            update((s) => ({ ...s, isPlaying: playing }));
        },

        ensureAnimation(elementId: string): ElementAnimation {
            let result!: ElementAnimation;
            update((s) => {
                if (!s.animations.has(elementId)) {
                    const anim = makeDefaultAnimation(elementId);
                    s.animations.set(elementId, anim);
                    result = anim;
                } else {
                    result = s.animations.get(elementId)!;
                }
                return { ...s, animations: new Map(s.animations) };
            });
            return result;
        },

        getAnimation(elementId: string): ElementAnimation | undefined {
            let result: ElementAnimation | undefined;
            update((s) => {
                result = s.animations.get(elementId);
                return s;
            });
            return result;
        },

        updateTransform(elementId: string, transform: Partial<TransformValues>) {
            update((s) => {
                const anim = s.animations.get(elementId) ?? makeDefaultAnimation(elementId);
                s.animations.set(elementId, {
                    ...anim,
                    transform: { ...anim.transform, ...transform },
                });
                return { ...s, animations: new Map(s.animations) };
            });
        },

        updateVisual(elementId: string, visual: Partial<VisualValues>) {
            update((s) => {
                const anim = s.animations.get(elementId) ?? makeDefaultAnimation(elementId);
                s.animations.set(elementId, {
                    ...anim,
                    visual: { ...anim.visual, ...visual },
                });
                return { ...s, animations: new Map(s.animations) };
            });
        },

        updateTiming(elementId: string, timing: Partial<TimingValues>) {
            update((s) => {
                const anim = s.animations.get(elementId) ?? makeDefaultAnimation(elementId);
                s.animations.set(elementId, {
                    ...anim,
                    timing: { ...anim.timing, ...timing },
                });
                return { ...s, animations: new Map(s.animations) };
            });
        },

        updateOrigin(elementId: string) {
            update((s) => {
                const anim = s.animations.get(elementId) ?? makeDefaultAnimation(elementId);
                s.animations.set(elementId, {
                    ...anim,
                });
                return { ...s, animations: new Map(s.animations) };
            });
        },

        removeAnimation(elementId: string) {
            update((s) => {
                s.animations.delete(elementId);
                return { ...s, animations: new Map(s.animations) };
            });
        },

        setProcessedSvg(svg: string) {
            update((s) => ({ ...s, processedSvg: svg }));
        },

        resetAll() {
            set({
                svgSource: '',
                animations: new Map(),
                selectedElementId: null,
                isPlaying: false,
                processedSvg: '',
            });
        },
    };
}

export const sandbox = createSandboxStore();

export const generatedCSS = derived(sandbox, ($s) => buildCSS($s.animations));

export const selectedAnimation = derived(sandbox, ($s) => {
    if (!$s.selectedElementId) return null;
    return $s.animations.get($s.selectedElementId) ?? makeDefaultAnimation($s.selectedElementId);
});
