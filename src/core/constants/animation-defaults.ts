import type { TransformValues, VisualValues, TimingValues } from '../models/animation.model';

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
