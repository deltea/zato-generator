<script lang="ts">
  // const TYPING_SPEED = 1.0;

  let { onSave, onCrop, onClear, onReset, onOpen, isCropping }: {
    onSave: () => void;
    onCrop: () => void;
    onClear: () => void;
    onReset: () => void;
    onOpen: () => void;
    isCropping: boolean;
  } = $props();
</script>

<div class="border w-full h-64 border-b-0 px-32 pt-16 relative">
  <!-- <p>I'll see where life takes me.</p> -->
  {#if isCropping}
    <div class="flex">
      <div class="w-1/2">
        <span>[▲/▼]</span> Move Up/Down<br>
        <span>[◀︎/▶︎]</span> Move Left/Right<br>
      </div>
      <div class="w-1/2">
        <span>[W/S]</span> Zoom In/Out<br>
        <span>[SHIFT]</span> Fast Move<br>
      </div>
    </div>
  {:else}
    <div class="flex">
      <div class="w-1/2">
        <span>[▲/▼]</span> Hue <span class="text-muted">(-140º)</span><br>
        <span>[◀︎/▶︎]</span> Saturation <span class="text-muted">(50%)</span><br>
        <span>[W/S]</span> Lightness <span class="text-muted">(0%)</span>
      </div>
      <div class="w-1/2">
        <span>[A/D]</span> Posterize <span class="text-muted">(5)</span><br>
        <span>[Q/E]</span> Contrast <span class="text-muted">(71%)</span><br>
        <span>[1-4]</span> Noise <span class="text-muted">(Normal)</span>
      </div>
    </div>
  {/if}

  <div class="flex bottom-0 left-0 w-full justify-center absolute text-base text-muted">
    <button class="outline-none px-4 pt-3 hover:text-highlight" onclick={onOpen}>Q.LOAD</button>
    <button class="outline-none px-4 pt-3 hover:text-highlight" onclick={onSave}>Q.SAVE</button>
    <button
      class="outline-none px-4 pt-3 hover:text-highlight {isCropping ? "text-fg!": "text-muted"}"
      onclick={onCrop}
    >
      <u>C</u>ROP
    </button>
    <button class="outline-none px-4 pt-3 hover:text-highlight" onclick={onReset}><u>R</u>ESET</button>
    <button class="outline-none px-4 pt-3 hover:text-highlight" onclick={onClear}>CLEAR</button>
    <a href="https://github.com/deltea/zato-generator" class="outline-none px-3 pt-3 hover:text-highlight">GITHUB</a>
  </div>
</div>
