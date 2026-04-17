import type { ElementAnimation } from './animation.model';

export type SandboxState = {
    svgSource: string;
    animations: Map<string, ElementAnimation>;
    selectedElementId: string | null;
    isPlaying: boolean;
    processedSvg: string;
    selectedPathLength: number | null;
};
