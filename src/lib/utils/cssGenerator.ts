import type { ElementAnimation } from '../../core/models';

/**
 * Checks whether stroke-dashoffset animation is applied
 * Animation is considered active if "from" and "to" values differ
 *
 * @param anim - animation configuration
 * @returns `true`, if dashoffset is animated
 */
function hasDashoffsetAnimation(anim: ElementAnimation): boolean {
    return anim.visual.strokeDashoffsetFrom !== anim.visual.strokeDashoffsetTo;
}

/**
 * Checks whether orbit animation mode is enabled
 *
 * @param anim - animation configuration
 * @returns `true`, if orbit animation is enabled
 */
function hasOrbitAnimation(anim: ElementAnimation): boolean {
    return anim.transform.orbitMode;
}

/**
 * Checks whether rotate animation is applied
 * Rotation is considered animated if:
 * - rotation angle changes (from/to differ)
 * - or 3D rotation is used (rotateX / rotateY)
 *
 * @param anim - animation configuration
 * @returns `true`, if rotation is animated
 */
function hasRotateAnimation(anim: ElementAnimation): boolean {
    return (
        anim.transform.rotateFrom !== anim.transform.rotateTo ||
        anim.transform.rotateX !== 0 ||
        anim.transform.rotateY !== 0
    );
}

/**
 * Checks whether translate animation is applied
 */
function hasTranslateAnimation(anim: ElementAnimation): boolean {
    return anim.transform.translateX !== 0 || anim.transform.translateY !== 0;
}

/**
 * Checks whether scale animation is applied
 * Scale is considered animated if it differs from default value (1)
 */
function hasScaleAnimation(anim: ElementAnimation): boolean {
    return anim.transform.scale !== 1;
}

/**
 * Checks whether any transform animation is applied
 */
function hasTransformAnimation(anim: ElementAnimation): boolean {
    return (
        hasTranslateAnimation(anim) ||
        hasScaleAnimation(anim) ||
        hasRotateAnimation(anim) ||
        hasOrbitAnimation(anim)
    );
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
    return hasTransformAnimation(anim) || hasOpacityAnimation(anim) || hasDashoffsetAnimation(anim);
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

    if (hasTransformAnimation(anim)) {
        props.push(`  transform: ${buildTransformValue(anim, true)};`);
    }

    if (hasDashoffsetAnimation(anim)) {
        props.push(`  stroke-dashoffset: ${anim.visual.strokeDashoffsetFrom};`);
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

    if (hasTransformAnimation(anim)) {
        props.push(`  transform: ${buildTransformValue(anim, false)};`);
    }

    if (hasDashoffsetAnimation(anim)) {
        props.push(`  stroke-dashoffset: ${anim.visual.strokeDashoffsetTo};`);
    }

    return props;
}

/**
 * Builds transform string from current transform values
 * Only includes properties that are actually animated
 */
function buildTransformValue(anim: ElementAnimation, isFrom: boolean): string {
    const t = anim.transform;

    if (t.orbitMode) {
        const angle = isFrom ? t.rotateFrom : t.rotateTo;
        const scale = isFrom ? 1 : t.scale;
        // translate одинаковый в from и to — это просто смещение центра орбиты
        return `translate(${t.translateX}px, ${t.translateY}px) rotate(${angle}deg) translateX(${t.orbitRadius}px) rotate(-${angle}deg) scale(${scale})`;
    }

    const tx = isFrom ? 0 : t.translateX;
    const ty = isFrom ? 0 : t.translateY;
    const scale = isFrom ? 1 : t.scale;
    const rotate = isFrom ? t.rotateFrom : t.rotateTo;
    const rotateX = isFrom ? 0 : t.rotateX;
    const rotateY = isFrom ? 0 : t.rotateY;
    const needsPerspective = t.rotateX !== 0 || t.rotateY !== 0;
    const perspective = needsPerspective ? 'perspective(600px) ' : '';
    return `${perspective}translate(${tx}px, ${ty}px) scale(${scale}) rotate(${rotate}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}
/**
 * Generates full CSS block (keyframes + element rule)
 * for a single animated element
 *
 * @param anim - animation configuration
 * @param index - index used for unique keyframe naming
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

    const isOrbit = anim.transform.orbitMode;
    const originX = isOrbit ? 0 : anim.transform.rotateOriginX;
    const originY = isOrbit ? 0 : anim.transform.rotateOriginY;

    const dasharray =
        anim.pathLength && hasDashoffsetAnimation(anim)
            ? `\n  stroke-dasharray: ${anim.pathLength};`
            : '';

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
         ${isOrbit ? '' : 'transform-box: fill-box;'}
        transform-origin: ${originX}% ${originY}%;
        animation-name: ${keyframeName};
        animation-duration: ${anim.timing.duration}s;
        animation-delay: ${anim.timing.delay}s;
        animation-timing-function: ${anim.timing.easing};
        animation-iteration-count: ${iterCount};
        animation-direction: ${anim.timing.direction};
        animation-fill-mode: forwards;${dasharray}
        
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
