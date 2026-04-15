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
