<script lang="ts">
  import { onMount } from "svelte";

  const BORDER_WIDTH = 4;

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  onMount(() => {
    ctx = canvas.getContext("2d")!;
  });

  function filterImage(imgData: ImageDataArray) {
    for (let i = 0; i < imgData.length; i += 4) {
      const r = imgData[i];
      const g = imgData[i + 1];
      const b = imgData[i + 2];

      // convert to grayscale
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;

      // apply threshold
      if (gray > 128) {
        imgData[i] = 255;
        imgData[i + 1] = 255;
        imgData[i + 2] = 255;
      } else {
        imgData[i] = 0;
        imgData[i + 1] = 0;
        imgData[i + 2] = 0;
      }
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
