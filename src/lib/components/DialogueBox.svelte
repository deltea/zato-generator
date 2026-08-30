<script lang="ts">
  import type { FilterOptions } from "$lib/types";

  // const TYPING_SPEED = 1.0;

  let { onSave, onCrop, onClear, onReset, onOpen, isCropping, options }: {
    onSave: () => void;
    onCrop: () => void;
    onClear: () => void;
    onReset: () => void;
    onOpen: () => void;
    isCropping: boolean;
    options: FilterOptions;
  } = $props();

  function getNoiseLevelName(level: number) {
    if (level <= 0) return "None";
    else if (level <= 40) return "Normal";
    else if (level <= 60) return "Noisy";
    else if (level <= 80) return "Very Noisy";
  }
</script>

<div class="border w-full h-64 border-b-0 px-32 pt-16 relative">
  <!-- <p>I'll see where life takes me.</p> -->
  {#if isCropping}
    <div class="flex">
      <div class="w-1/2">
        <span>[▲/▼]</span> Move Up/Down <span class="text-muted">({-options.position.y}px)</span><br>
        <span>[◀︎/▶︎]</span> Move Left/Right <span class="text-muted">({-options.position.x}px)</span><br>
      </div>
      <div class="w-1/2">
        <span>[W/S]</span> Zoom In/Out <span class="text-muted">(100%)</span><br>
        <span>[Shift]</span> Fast Move<br>
      </div>
    </div>
  {:else}
    <div class="flex">
      <div class="w-1/2">
        <span>[▲/▼]</span> Hue <span class="text-muted">({options.hue}º)</span><br>
        <span>[◀︎/▶︎]</span> Saturation <span class="text-muted">({Math.round(options.saturation * 100)}%)</span><br>
        <span>[W/S]</span> Lightness <span class="text-muted">
          ({options.lightness > 0 ? "+" : ""}{Math.round(options.lightness * 100)}%)
        </span>
      </div>
      <div class="w-1/2">
        <span>[A/D]</span> Posterize <span class="text-muted">({options.posterize})</span><br>
        <span>[Q/E]</span> Contrast <span class="text-muted">({Math.round(options.contrast / 14 * 100)}%)</span><br>
        <span>[1-4]</span> Noise <span class="text-muted">({getNoiseLevelName(options.noise)})</span>
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
