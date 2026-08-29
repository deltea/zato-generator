<script lang="ts">
  import { onMount } from "svelte";
  import type { FilterOptions } from "$lib/types";
  import { clamp, wrap } from "$lib/utils";

  import DialogueBox from "$lib/components/DialogueBox.svelte";
  import FilterCanvas from "$lib/components/FilterCanvas.svelte";

  const defaultOptions: FilterOptions = {
    hue: 220,
    saturation: 0.5,
    lightness: 0,
    posterize: 5,
    noise: 40,
    contrast: 10,
    position: { x: 0, y: 0 }
  }

  let filterCanvas = $state<FilterCanvas>();
  let img: HTMLImageElement | null = $state(null);
  let isCropping = $state(false);
  let isHoldingShift = false;
  let options: FilterOptions = $state(defaultOptions);

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Shift") {
      isHoldingShift = true;
    }

    if (isCropping) {
      const speed = isHoldingShift ? 12 : 2;
      switch (e.key) {
        case "ArrowUp":
          options.position.y -= speed;
          break;
        case "ArrowDown":
          options.position.y += speed;
          break;
        case "ArrowLeft":
          options.position.x -= speed;
          break;
        case "ArrowRight":
          options.position.x += speed;
          break;
      }
    } else {
      switch (e.key) {
        case "ArrowUp":
          options.hue = wrap(options.hue + 10, 360);
          break;
        case "ArrowDown":
          options.hue = wrap(options.hue - 10, 360);
          break;
        case "ArrowRight":
          options.saturation = clamp(options.saturation + 0.1, 0, 1);
          break;
        case "ArrowLeft":
          options.saturation = clamp(options.saturation - 0.1, 0, 1);
          break;
        case "w":
          options.lightness = clamp(options.lightness + 0.1, -0.8, 0.8);
          break;
        case "s":
          options.lightness = clamp(options.lightness - 0.1, -0.8, 0.8);
          break;
        case "a":
          options.posterize = clamp(options.posterize + 1, 2, 8);
          break;
        case "d":
          options.posterize = clamp(options.posterize - 1, 2, 8);
          break;
        case "q":
          options.contrast = clamp(options.contrast - 1, 2, 16);
          break;
        case "e":
          options.contrast = clamp(options.contrast + 1, 2, 16);
          break;
        case "1":
          options.noise = 0;
          break;
        case "2":
          options.noise = 40;
          break;
        case "3":
          options.noise = 60;
          break;
        case "4":
          options.noise = 80;
          break;
      }
    }
  }

  function onKeyup(e: KeyboardEvent) {
    if (e.key === "Shift") {
      isHoldingShift = false;
    }
  }

  function toggleCropping() {
    isCropping = !isCropping;
  }

  function clear() {
    img = null;
  }

  function resetFilters() {
    options = defaultOptions;
  }

  function openFileDialog() {
    // open file picker
  }

  onMount(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = "/images/placeholder/school.webp";
    image.onload = () => {
      img = image;
    };

    document.addEventListener("keydown", onKeydown);
    document.addEventListener("keyup", onKeyup);

    return () => {
      document.removeEventListener("keydown", onKeydown);
      document.removeEventListener("keyup", onKeyup);
    }
  });
</script>

<svelte:head>
  <title>Z.A.T.O. // I Love the Background and All the Filters On Them</title>
</svelte:head>

<main class="flex flex-col justify-end items-center h-screen px-32">
  <div class="max-w-7xl w-full">
    <div class="border w-full pixelated">
      <FilterCanvas bind:this={filterCanvas} {options} {img} />
    </div>

    <!-- speaker card -->
    <div class="text-3xl py-4 px-5 border w-fit -my-6 bg-bg ml-12 z-10 relative">
      [???]
    </div>

    <DialogueBox
      onSave={filterCanvas?.exportImage}
      onCrop={toggleCropping}
      onClear={clear}
      onReset={resetFilters}
      onOpen={openFileDialog}
      {isCropping}
    />
  </div>
</main>
