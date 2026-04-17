import { writable, derived } from 'svelte/store';
import { buildCSS } from '../utils/cssGenerator';
import type {
    ElementAnimation,
    SandboxState,
    TimingValues,
    TransformValues,
    VisualValues,
} from '../../core/models';
import { DEFAULT_TIMING, DEFAULT_TRANSFORM, DEFAULT_VISUAL } from '../../core/constants';

/**
 * Creates a default animation object for a given SVG element
 * Initializes transform, visual and timing properties with default values
 *
 * @param elementId - unique identifier of the SVG element
 * @returns new animation object with default configuration
 */
function makeDefaultAnimation(elementId: string): ElementAnimation {
    return {
        elementId,
        transform: { ...DEFAULT_TRANSFORM },
        visual: { ...DEFAULT_VISUAL },
        timing: { ...DEFAULT_TIMING },
        pathLength: null,
    };
}

/**
 * Creates sandbox store for managing SVG animations state
 * Handles source SVG, selected element, animations map and playback state
 *
 * @returns store API with state and mutation methods
 */
function createSandboxStore() {
    const { subscribe, set, update } = writable<SandboxState>({
        svgSource: '',
        animations: new Map(),
        selectedElementId: null,
        isPlaying: false,
        processedSvg: '',
        selectedPathLength: null,
    });

    return {
        subscribe,

        /**
         * Sets raw SVG source string
         *
         * @param source - original SVG markup
         */
        setSvgSource(source: string) {
            update((s) => ({ ...s, svgSource: source }));
        },

        /**
         * Sets currently selected SVG element
         *
         * @param id - element id or null if nothing is selected
         */
        selectElement(id: string | null) {
            update((s) => ({ ...s, selectedElementId: id }));
        },

        /**
         * Toggles animation playback state
         *
         * @param playing - should animation be playing or not
         */
        setPlaying(playing: boolean) {
            update((s) => ({ ...s, isPlaying: playing }));
        },

        /**
         * Ensures that animation exists for the given element
         * Creates a new one if it doesn't exist
         *
         * @param elementId - eement id
         * @returns existing / newly created animation
         */
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

        /**
         * Updates transform properties for a specific element
         * Merges new values with existing ones
         *
         * @param elementId - element id
         * @param transform - partial transform values to update
         */
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

        /**
         * Updates visual properties (opacity, fill, stroke, etc) for a specific element
         *
         * @param elementId - element id
         * @param visual - partial visual values to update
         */
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

        /**
         * Updates timing properties (duration, delay, easing, etc) for a specific element
         *
         * @param elementId - element id
         * @param timing - prtial timing values to update
         */

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

        /**
         * Removes animation for the given element
         *
         * @param elementId - element id
         */
        removeAnimation(elementId: string) {
            update((s) => {
                s.animations.delete(elementId);
                return { ...s, animations: new Map(s.animations) };
            });
        },

        /**
         * Sets processed SVG (with applied ids / transformations)
         *
         * @param svg - processed SVG string
         */
        setProcessedSvg(svg: string) {
            update((s) => ({ ...s, processedSvg: svg }));
        },

        /**
         * Sets path length for currently selected SVG element
         * Used to control stroke-dasharray / stroke-dashoffset animations
         *
         * @param length - total path length or null to reset
         */
        setSelectedPathLength(length: number | null) {
            update((s) => ({ ...s, selectedPathLength: length }));
        },

        /**
         * Updates path length value for a specific element animation
         * Creates animation entry if it doesn't exist
         *
         * @param elementId - element id
         * @param length - total path length or null to remove value
         */
        updatePathLength(elementId: string, length: number | null) {
            update((s) => {
                const anim = s.animations.get(elementId) ?? makeDefaultAnimation(elementId);
                s.animations.set(elementId, { ...anim, pathLength: length });
                return { ...s, animations: new Map(s.animations) };
            });
        },

        /**
         * Resets entire sandbox state to initial values
         */
        resetAll() {
            set({
                svgSource: '',
                animations: new Map(),
                selectedElementId: null,
                isPlaying: false,
                processedSvg: '',
                selectedPathLength: null,
            });
        },
    };
}

export const sandbox = createSandboxStore();

/**
 * Generated CSS string based on current animations map
 * Recomputes automatically on any sandbox state change
 */
export const generatedCSS = derived(sandbox, ($s) => buildCSS($s.animations));

/**
 * Returns animation for currently selected element
 * Falls back to default animation if element has no configuration yet
 */
export const selectedAnimation = derived(sandbox, ($s) => {
    if (!$s.selectedElementId) return null;
    return $s.animations.get($s.selectedElementId) ?? makeDefaultAnimation($s.selectedElementId);
});
