<script lang="ts">
    import { sandbox } from '../stores/sandbox';
    import { validateAndSanitize } from '../utils/svgUtils';

    let svgSource = $state('');
    let error = $state(false);
    let isDragging = $state(false);
    let fileInput: HTMLInputElement;

    /**
     * Validates and sanitizes the source, then updates sandbox state
     * Clears SVG in store if validation fails
     */
    function handleInput() {
        const { svg, error: err } = validateAndSanitize(svgSource);
        error = err;
        sandbox.setSvgSource(err ? '' : svg);
    }

    /**
     * Accepts only SVG files, reads content as text and passes it to input handler
     *
     * @param file - file selected via input or drop
     */
    function handleFile(file: File) {
        if (!file.name.endsWith('.svg') && file.type !== 'image/svg+xml') {
            error = true;
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            svgSource = e.target?.result as string;
            handleInput();
        };
        reader.readAsText(file);
    }

    /**
     * Handles file drop event
     *
     * @param e - DragEvent from drop zone
     */
    function handleDrop(e: DragEvent) {
        e.preventDefault();
        isDragging = false;
        const file = e.dataTransfer?.files[0];
        if (file) handleFile(file);
    }

    /**
     * Enables drop, toggles dragging state for UI feedback
     *
     * @param e - DragEvent
     */
    function handleDragOver(e: DragEvent) {
        e.preventDefault();
        isDragging = true;
    }

    /**
     * Handles file selection via input element
     *
     * @param e - input change event
     */
    function handleFileInput(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) handleFile(file);
    }

    /**
     * Fully resets the editor
     */
    function handleClear() {
        svgSource = '';
        error = false;
        sandbox.resetAll();
    }
</script>

<div class="input-panel">
    <div
        class="input-panel__dropzone"
        class:input-panel__dropzone--dragging={isDragging}
        ondrop={handleDrop}
        ondragover={handleDragOver}
        ondragleave={() => (isDragging = false)}
        role="region"
        aria-label="SVG drop zone"
    >
        <div class="input-panel__dropzone-icon">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                    d="M8 2v8M5 7l3 3 3-3M2 13h12"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </div>

        <div class="input-panel__dropzone-text">
            <button
                type="button"
                class="input-panel__dropzone-link"
                onclick={() => fileInput.click()}
            >
                drop SVG file
            </button>

            <input
                bind:this={fileInput}
                type="file"
                accept=".svg,image/svg+xml"
                onchange={handleFileInput}
                class="scr-only"
                aria-label="Upload SVG file"
            />

            <span> or paste below</span>
        </div>
    </div>

    <div class="input-panel__textarea" class:input-panel__textarea--error={error}>
        <label class="scr-only" for="svg-input"> SVG source code </label>

        <textarea
            id="svg-input"
            bind:value={svgSource}
            oninput={handleInput}
            placeholder={'<svg viewBox="0 0 100 100">\n  ...\n</svg>'}
            spellcheck={false}
            aria-label="SVG source code"
            aria-invalid={error}
        ></textarea>

        {#if error}
            <p class="input-panel__error" role="alert">invalid SVG</p>
        {/if}
    </div>

    {#if svgSource}
        <button class="input-panel__clear" onclick={handleClear} aria-label="Clear SVG input">
            clear
        </button>
    {/if}
</div>

<style>
    .input-panel {
        display: flex;
        flex-direction: column;
        gap: 0.625rem;

        block-size: 100%;

        padding: 0.75rem;
    }

    .input-panel__dropzone {
        padding-block: 1rem;
        padding-inline: 0.75rem;

        border: 0.09375rem dashed var(--color-border-secondary);
        border-radius: var(--border-radius-md);

        text-align: center;

        transition:
            border-color 0.15s,
            background 0.15s;
    }

    .input-panel__dropzone--dragging {
        border-color: var(--accent);
        background: var(--accent-tint);
    }

    .input-panel__dropzone-icon {
        display: flex;
        align-items: center;
        justify-content: center;

        inline-size: 1.75rem;
        block-size: 1.75rem;

        margin-inline: auto;
        margin-block-end: 0.5rem;

        border-radius: var(--border-full);
        background: var(--accent-tint);

        color: var(--accent);
    }

    .input-panel__dropzone-icon svg {
        inline-size: 0.875rem;
        block-size: 0.875rem;
    }

    .input-panel__dropzone-text {
        font-size: 0.975rem;
        color: var(--color-text-secondary);
        line-height: 1.4;
    }
    .input-panel__dropzone-link {
        background: none;
        border: none;
        padding: 0;

        color: var(--accent);
        font-weight: 500;
        cursor: pointer;
        text-decoration: underline;
        text-underline-offset: 0.125rem;
    }

    .input-panel__dropzone-link:hover {
        opacity: 0.8;
    }
    .input-panel__dropzone-link:focus-visible {
        outline: 1px solid var(--accent);
    }

    .input-panel__textarea {
        position: relative;

        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .input-panel__textarea textarea {
        flex: 1;

        inline-size: 100%;

        padding-block: 0.5rem;
        padding-inline: 0.625rem;

        border: 0.03125rem solid var(--color-border-tertiary);
        border-radius: var(--border-radius-md);
        resize: none;
        background: var(--color-background-secondary);

        font-size: 0.875rem;
        font-family: var(--font-mono);
        line-height: 1.6;
        color: var(--color-text-secondary);

        transition: border-color 0.15s;
    }

    .input-panel__textarea textarea:focus {
        outline: none;
        border-color: var(--accent);
    }

    .input-panel__textarea--error textarea {
        border-color: var(--color-border-danger);
    }

    .input-panel__error {
        margin-block-start: 0.25rem;
        padding-inline-start: 0.125rem;

        font-size: 0.875rem;
        color: var(--color-text-danger);
    }

    .input-panel__clear {
        align-self: flex-end;

        padding-block: 0.25rem;
        padding-inline: 0.625rem;

        border-radius: var(--border-radius-md);
        border: 0.03125rem solid var(--color-border-secondary);
        background: transparent;
        cursor: pointer;

        color: var(--color-text-secondary);
        font-size: 0.875rem;

        transition: background 0.1s;
    }

    .input-panel__clear:hover {
        background: var(--color-background-secondary);
    }
</style>
