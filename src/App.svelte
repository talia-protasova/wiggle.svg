<script lang="ts">
    import SvgInput from './lib/components/SvgInput.svelte';
    import SvgPreview from './lib/components/SvgPreview.svelte';
    import AnimationControls from './lib/components/AnimationControls.svelte';
    import CssOutput from './lib/components/CssOutput.svelte';
    import Topbar from './lib/ui/Topbar.svelte';
    import DesktopOnly from './lib/components/DesktopOnly.svelte';
</script>

<DesktopOnly>
    <div class="layout">
        <Topbar />

        <main class="layout__workspace">
            <section class="workspace__panel workspace__panel--input" aria-label="SVG input">
                <div class="panel__header">input</div>
                <div class="panel__body">
                    <SvgInput />
                </div>
            </section>

            <section class="workspace__panel workspace__panel--preview" aria-label="SVG preview">
                <div class="panel__header">preview</div>
                <SvgPreview />
            </section>

            <section
                class="workspace__panel workspace__panel--controls"
                aria-label="Animation controls and output"
            >
                <div class="controls">
                    <div class="controls__top">
                        <div class="panel__header">animate</div>
                        <div class="controls__body">
                            <AnimationControls />
                        </div>
                    </div>

                    <div class="controls__bottom">
                        <CssOutput />
                    </div>
                </div>
            </section>
        </main>
    </div>
</DesktopOnly>

<style>
    .layout {
        display: grid;
        grid-template-rows: auto 1fr;

        block-size: 100dvh;
        overflow: hidden;
    }

    .layout__workspace {
        display: grid;
        grid-template-columns: 22rem 1fr 46.5rem;

        block-size: 100%;
        overflow: hidden;
    }

    .workspace__panel {
        display: flex;
        flex-direction: column;
        overflow: hidden;

        background: var(--color-background-primary);
        border-inline-end: 0.03125rem solid var(--color-border-tertiary);
    }

    .workspace__panel--preview {
        background: var(--color-background-tertiary);
    }

    .workspace__panel--controls {
        border-inline-end: none;
    }

    .panel__header {
        flex-shrink: 0;

        padding-block: 0.5625rem;
        padding-inline: 0.875rem;

        border-block-end: 0.03125rem solid var(--color-border-tertiary);
        background: var(--color-background-primary);

        font-size: 0.75rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.07em;
        color: var(--color-text-tertiary);
    }

    .panel__body {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .controls {
        display: flex;
        flex-direction: column;
        block-size: 100%;
    }

    .controls__top {
        display: flex;
        flex-direction: column;
        flex: 1;

        min-block-size: 0;

        border-block-end: 0.03125rem solid var(--color-border-tertiary);
        background: var(--color-background-primary);
    }

    .controls__body {
        flex: 1;
        overflow-y: scroll;

        min-block-size: 0;
    }

    .controls__bottom {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;

        block-size: 16.25rem;

        overflow: hidden;
        background: var(--color-background-primary);
    }
</style>
