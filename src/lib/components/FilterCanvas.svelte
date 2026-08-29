<script lang="ts">
  import { onMount } from "svelte";

  const BORDER_WIDTH = 4;

  let { colors }: {
    colors: string[]
  } = $props();

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  onMount(() => {
    ctx = canvas.getContext("2d")!;
  });

  function hexToRGB(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  }

  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }

  function filterImage(imgData: ImageDataArray) {
    let test = "";
    for (let i = 0; i < imgData.length; i += 4) {
      const r = imgData[i];
      const g = imgData[i + 1];
      const b = imgData[i + 2];

      // calculate grayscale
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;

      const GRAY_MIN = 0;
      const GRAY_MAX = 20;
      const GRAY_RANGE = GRAY_MAX - GRAY_MIN;

      // apply threshold
      const val = (gray - GRAY_MIN) / GRAY_RANGE;
      const step = (colors.length);
      const idx = Math.floor(clamp(val * step, 0, colors.length));
      test += idx + ", ";
      const c = hexToRGB(colors[idx]);
      imgData[i] = c.r;
      imgData[i + 1] = c.g;
      imgData[i + 2] = c.b;
      // imgData[i] = (idx / colors.length) * 255;
      // imgData[i + 1] = (idx / colors.length) * 255;
      // imgData[i + 2] = (idx / colors.length) * 255;
    }
    console.log(test);
  }

  export function exportImage() {
    const link = document.createElement("a");
    link.download = "filtered_image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  export function setImage(img: HTMLImageElement) {
    // maintain aspect ration and center image
    if (img.width / img.height > canvas.width / canvas.height) {
      const scale = canvas.height / img.height;
      const newWidth = img.width * scale;
      const xOffset = (canvas.width - newWidth) / 2;
      ctx.drawImage(img, xOffset, 0, newWidth, canvas.height);
    } else {
      const scale = canvas.width / img.width;
      const newHeight = img.height * scale;
      const yOffset = (canvas.height - newHeight) / 2;
      ctx.drawImage(img, 0, yOffset, canvas.width, newHeight);
    }

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    filterImage(data);
    ctx.putImageData(imgData, 0, 0);

    // 4px border
    ctx.fillRect(0, 0, canvas.width, BORDER_WIDTH);
    ctx.fillRect(canvas.width - BORDER_WIDTH, 0, BORDER_WIDTH, canvas.height);
    ctx.fillRect(0, canvas.height - BORDER_WIDTH, canvas.width, BORDER_WIDTH);
    ctx.fillRect(0, 0, BORDER_WIDTH, canvas.height);
  }
</script>

<canvas
  bind:this={canvas}
  width={1280}
  height={450}
  class="sizefull w-full"
></canvas>
