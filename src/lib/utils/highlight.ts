/**
 * Applies lightweight syntax highlighting to CSS/SVG code
 * Works via regex replacements (not a full parser)
 *
 * Note: may not cover all edge cases
 *
 * @param code - Raw code string
 * @returns HTML string with highlighted syntax
 */
export function highlightCode(code: string): string {
    if (!code) return '';

    // Escape HTML first
    let result = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    /**
     * Highlight @rules (e.g. @keyframes)
     */
    result = result.replace(/(@[\w-]+)/g, '<span class="kw">$1</span>');

    /**
     * Highlight selectors (#id, .class, tag)
     * Only when followed by "{"
     */
    result = result.replace(/([.#]?[\w-]+)(\s*\{)/g, '<span class="sel">$1</span>$2');

    /**
     * Highlight properties (color:, transform:, etc.)
     */
    result = result.replace(/([\w-]+)(\s*:)/g, '<span class="prop">$1</span>$2');

    /**
     * Highlight values (numbers, colors)
     */
    result = result.replace(/:\s*([^;{}]+)/g, (match, val) => {
        let highlighted = val
            // Colors
            .replace(/(#[0-9a-fA-F]{3,8})/g, '<span class="val-color">$1</span>')
            // Numbers with units
            .replace(/(-?\d+\.?\d*(?:px|deg|s|%|em|rem)?)/g, '<span class="val-num">$1</span>');

        return match.replace(val, highlighted);
    });

    /**
     * Highlight keywords (animation-related)
     */
    result = result.replace(
        /\b(from|to|infinite|forwards|none|ease[\w-]*|linear)\b/g,
        '<span class="val-kw">$1</span>',
    );

    return result;
}
