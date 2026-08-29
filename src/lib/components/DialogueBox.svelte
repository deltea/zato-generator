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
  <div class="flex">
    <div class="w-1/2">
      <span>▲/▼</span> Hue <span class="text-muted">(-140º)</span><br>
      <span>◀︎/▶︎</span> Saturation <span class="text-muted">(50%)</span><br>
      <span>W/S</span> Lightness <span class="text-muted">(0%)</span>
    </div>
    <div class="w-1/2">
      <span>A/D</span> Posterize <span class="text-muted">(5)</span><br>
      <span>Q/E</span> Contrast <span class="text-muted">(71%)</span><br>
      <span>1-4</span> Noise <span class="text-muted">(Normal)</span>
    </div>
  </div>

  <div class="flex bottom-0 left-1/2 -translate-x-1/2 absolute text-base text-muted">
    <button class="px-3 pt-3 hover:text-fg" onclick={onOpen}>Q.LOAD</button>
    <button class="px-3 pt-3 hover:text-fg" onclick={onSave}>Q.SAVE</button>
    <button class="px-3 pt-3 hover:text-fg {isCropping ? "text-fg": "text-muted"}" onclick={onCrop}>CROP</button>
    <button class="px-3 pt-3 hover:text-fg" onclick={onClear}>CLEAR</button>
    <button class="px-3 pt-3 hover:text-fg" onclick={onReset}>RESET</button>
    <a href="https://github.com/deltea/zato-generator" class="px-3 pt-3 hover:text-fg">GITHUB</a>
    <!-- <button class="px-3 pt-3 hover:text-fg">SHARE</button> -->
  </div>
</div>
