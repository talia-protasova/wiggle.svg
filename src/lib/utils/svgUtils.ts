import DOMPurify from 'dompurify';

export function validateAndSanitize(input: string): { svg: string; error: boolean } {
    if (!input.trim()) return { svg: '', error: false };
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(input, 'image/svg+xml');
        const svg = doc.querySelector('svg');
        const hasError = doc.querySelector('parsererror');
        if (!svg || hasError) return { svg: '', error: true };
        const clean = DOMPurify.sanitize(input, {
            USE_PROFILES: { svg: true, svgFilters: true },
        });
        return { svg: clean, error: false };
    } catch {
        return { svg: '', error: true };
    }
}

export function normalizeSvg(svg: SVGSVGElement): void {
    svg.removeAttribute('width');
    svg.removeAttribute('height');
}

export function assignIds(svgRoot: SVGSVGElement): void {
    const elements = svgRoot.querySelectorAll('*');
    elements.forEach((el, index) => {
        if (!el.id) el.id = `wiggle-${index}`;
    });
}

const SKIP_TAGS = new Set(['svg', 'defs', 'clipPath', 'mask', 'symbol', 'style', 'title', 'desc']);

export function isAnimatable(el: Element): boolean {
    return !SKIP_TAGS.has(el.tagName);
}

export function getElementInfo(el: SVGElement): { id: string; tag: string; label: string } {
    return {
        id: el.id,
        tag: el.tagName.toLowerCase(),
        label: `${el.tagName.toLowerCase()} #${el.id}`,
    };
}
