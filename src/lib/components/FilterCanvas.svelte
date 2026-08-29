<script lang="ts">
  import { onMount } from "svelte";
  import { clamp, noise, hslToRgb, rgbToHsl } from "$lib/utils";

  const BORDER_WIDTH = 2;
  let HUE = -138;
  let SATURATION = 0.4;
  let LIGHTNESS = 0.2;
  let POSTERIZE = 6;
  let NOISE = 40;

  let { color }: {
    color: string
  } = $props();

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let data: ImageDataArray;

  onMount(() => {
    ctx = canvas.getContext("2d")!;

    document.addEventListener("keydown", (e: KeyboardEvent) => {

    });
  });

  function applySigmoidContrast(value: number, midpoint = 200, steepness = 10) {
    const x = (value - midpoint) / 255;
    return 255 / (1 + Math.exp(-steepness * x));
  }

  function filterImage(imgData: ImageDataArray) {
    for (let i = 0; i < imgData.length; i += 4) {
      let r = imgData[i];
      let g = imgData[i + 1];
      let b = imgData[i + 2];

      // turn to grayscale and apply contrast
      let gray = 0.299 * r + 0.587 * g + 0.114 * b;
      gray = applySigmoidContrast(gray, 160, 10);

      r = g = b = gray;

      let { h, s, l } = rgbToHsl(r, g, b);

      // adjust hsl
      h = (h + HUE + 360) % 360;
      s = clamp(s + SATURATION, 0, 1);
      l = clamp(l + LIGHTNESS, 0, 1);

      const rgb = hslToRgb(h, s, l);
      r = rgb.r;
      g = rgb.g;
      b = rgb.b;

      // add color noise
      r = clamp(r + noise(NOISE), 0, 255);
      g = clamp(g + noise(NOISE), 0, 255);
      b = clamp(b + noise(NOISE), 0, 255);

      // posterization
      const step = 255 / (POSTERIZE - 1);
      r = Math.round(Math.round(r / step) * step);
      g = Math.round(Math.round(g / step) * step);
      b = Math.round(Math.round(b / step) * step);

      imgData[i] = r;
      imgData[i + 1] = g;
      imgData[i + 2] = b;
    }
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
    data = imgData.data;
    filterImage(data);
    ctx.putImageData(imgData, 0, 0);

  // black border
    ctx.fillRect(0, 0, canvas.width, BORDER_WIDTH);
    ctx.fillRect(canvas.width - BORDER_WIDTH, 0, BORDER_WIDTH, canvas.height);
    ctx.fillRect(0, canvas.height - BORDER_WIDTH, canvas.width, BORDER_WIDTH);
    ctx.fillRect(0, 0, BORDER_WIDTH, canvas.height);
  }
</script>

<canvas
  bind:this={canvas}
  width={640}
  height={225}
  class="sizefull w-full"
></canvas>
