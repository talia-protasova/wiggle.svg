import type { ElementAnimation } from '../stores/sandbox';

/**
 * Checks whether scale animation is applied
 * Scale is considered animated if it differs from default value (1)
 */
function hasScaleAnimation(anim: ElementAnimation): boolean {
    return anim.transform.scale !== 1;
}

/**
 * Checks whether opacity animation is applied
 * Opacity is animated if "from" and "to" values differ
 */
function hasOpacityAnimation(anim: ElementAnimation): boolean {
    return anim.visual.opacityFrom !== anim.visual.opacityTo;
}

/**
 * Checks if element has any supported animation
 * Used to skip elements without changes
 */
function hasAnyAnimation(anim: ElementAnimation): boolean {
    return hasScaleAnimation(anim) || hasOpacityAnimation(anim);
}

/**
 * Builds CSS properties for "from" keyframe
 *
 * @param anim - Animation configuration
 * @returns Array of CSS lines
 */
function buildFromProps(anim: ElementAnimation): string[] {
    const props: string[] = [];

    if (hasOpacityAnimation(anim)) {
        props.push(`  opacity: ${anim.visual.opacityFrom};`);
    }

    if (hasScaleAnimation(anim)) {
        props.push(`  transform: scale(1);`);
    }

    return props;
}

/**
 * Builds CSS properties for "to" keyframe
 *
 * @param anim - Animation configuration
 * @returns Array of CSS lines
 */
function buildToProps(anim: ElementAnimation): string[] {
    const props: string[] = [];

    if (hasOpacityAnimation(anim)) {
        props.push(`  opacity: ${anim.visual.opacityTo};`);
    }

    if (hasScaleAnimation(anim)) {
        props.push(`  transform: scale(${anim.transform.scale});`);
    }

    return props;
}

/**
 * Generates full CSS block (keyframes + element rule)
 * for a single animated element
 *
 * @param anim - Animation configuration
 * @param index - Index used for unique keyframe naming
 * @returns CSS string or empty string if no animation is present
 */
function buildElementCSS(anim: ElementAnimation, index: number): string {
    if (!hasAnyAnimation(anim)) return '';

    const keyframeName = `wiggle-${index}`;
    const fromProps = buildFromProps(anim);
    const toProps = buildToProps(anim);

    /**
     * Normalizes iteration count for CSS output
     */
    const iterCount =
        anim.timing.iterationCount === 'infinite' ? 'infinite' : String(anim.timing.iterationCount);

    /**
     * Builds @keyframes block
     */
    const keyframes = `@keyframes ${keyframeName} {
        from {
            ${fromProps.join('\n')}
        }
        to {
            ${toProps.join('\n')}
        }
    }`;

    /**
     * Builds CSS rule for specific SVG element
     * Applies animation and required transform settings
     */
    const elementRule = `#${anim.elementId} {
        transform-box: fill-box;
        transform-origin: center;
        animation-name: ${keyframeName};
        animation-duration: ${anim.timing.duration}s;
        animation-delay: ${anim.timing.delay}s;
        animation-timing-function: ${anim.timing.easing};
        animation-iteration-count: ${iterCount};
        animation-direction: ${anim.timing.direction};
        animation-fill-mode: forwards;
    }`;

    return `${keyframes}\n\n${elementRule}`;
}

/**
 * Builds final CSS string for all animated elements
 * Iterates over animation map and generates CSS blocks,
 * skipping elements without active animations.
 *
 * @param animations - Map of elementId to animation config
 * @returns Combined CSS string
 */
export function buildCSS(animations: Map<string, ElementAnimation>): string {
    const blocks: string[] = [];
    let index = 0;

    for (const anim of animations.values()) {
        const css = buildElementCSS(anim, index);

        if (css) {
            blocks.push(css);
        }

        index++;
    }

    return blocks.join('\n\n');
}
