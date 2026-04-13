<script lang="ts">
  let svgSource = '';
</script>

<main class="layout">
  <section class="input">
   
  </section>

  <section class="preview">
    {@html svgSource}
  </section>

  <section class="controls">
   
  </section>
</main>

<style>
  .layout {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    height: 100vh;
  }


  .preview {
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }
</style>