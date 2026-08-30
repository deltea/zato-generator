<script lang="ts">
  import { onMount } from "svelte";
  import type { FilterOptions } from "$lib/types";
  import { clamp, randSeed, wrap } from "$lib/utils";

  import DialogueBox from "$lib/components/DialogueBox.svelte";
  import FilterCanvas from "$lib/components/FilterCanvas.svelte";

  const validFileTypes = ["image/png", "image/jpeg", "image/webp"];
  const defaultOptions: FilterOptions = {
    hue: 220,
    saturation: 0.5,
    lightness: 0,
    posterize: 5,
    noise: 60,
    contrast: 10,
    position: { x: 0, y: 0 },
    zoom: 1
  }

  let filterCanvas = $state<FilterCanvas>();
  let img: HTMLImageElement | null = $state(null);
  let isCropping = $state(false);
  let isHoldingShift = false;
  let options: FilterOptions = $state(defaultOptions);
  let fileInput: HTMLInputElement;
  let speaker: string | null = $state(null);
  let refreshInterval: NodeJS.Timeout;

  let dialogueText = $state("");
  let isEditing = $state(false);

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Shift") {
      isHoldingShift = true;
    } else if (e.key === "r") {
      resetFilters();
    } else if (e.key === "c") {
      toggleCropping();
    }

    if (isCropping) {
      const speed = isHoldingShift ? 12 : 2;
      switch (e.key) {
        case "ArrowUp":
          options.position.y += speed;
          break;
        case "ArrowDown":
          options.position.y -= speed;
          break;
        case "ArrowLeft":
          options.position.x += speed;
          break;
        case "ArrowRight":
          options.position.x -= speed;
          break;
        case "w":
          options.zoom = clamp(options.zoom + 0.2, 1, 3);
          break;
        case "s":
          options.zoom = clamp(options.zoom - 0.2, 1, 3);
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
          options.saturation = clamp(options.saturation + 0.1, 0.1, 1);
          break;
        case "ArrowLeft":
          options.saturation = clamp(options.saturation - 0.1, 0.1, 1);
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
          options.noise = 20;
          break;
        case "3":
          options.noise = 40;
          break;
        case "4":
          options.noise = 60;
          break;
        case "5":
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

  async function clear() {
    isEditing = false;

    dialogueText = "";
    speaker = "LOADING";

    await refreshPlaceholder();

    dialogueText = "Z.A.T.O // I Love the Backgrounds and All the Filters on Them\nDrag and drop an image file or load a file...";
    speaker = null;
  }

  function refreshPlaceholder() {
    return new Promise((resolve) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = "https://loremflickr.com/640/620/landscape,buildings?random=" + randSeed();
      image.onload = () => {
        if (isEditing) return;
        resolve(image);
        img = image;
        resetFilters();
        options.hue = Math.floor(Math.random() * 360);
      }
    });
  }

  function resetFilters() {
    options = defaultOptions;
  }

  function fileInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const files = target.files;

    if (files && files.length > 0) {
      uploadImage(files[0]);
    } else {
      console.error("no file selected");
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      if (validFileTypes.includes(files[0].type)) {
        uploadImage(files[0]);
      } else {
        console.error("invalid file type");
      }
    } else {
      console.error("no file dropped");
    }
  }

  function uploadImage(file: File) {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = URL.createObjectURL(file);
    speaker = "LOADING";
    image.onload = () => {
      speaker = file.name;
      img = image;
      dialogueText = "";
      isEditing = true;
      resetFilters();
      options.hue = Math.floor(Math.random() * 360);
    }
  }

  function preventDefaults(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  onMount(() => {
    clear()

    document.addEventListener("keydown", onKeydown);
    document.addEventListener("keyup", onKeyup);
    window.addEventListener("drop", onDrop);

    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
      window.addEventListener(eventName, preventDefaults, false);
    });

    refreshInterval = setInterval(() => {
      if (!isEditing) refreshPlaceholder();
    }, 2000);

    return () => {
      document.removeEventListener("keydown", onKeydown);
      document.removeEventListener("keyup", onKeyup);
      window.removeEventListener("drop", onDrop);

      clearInterval(refreshInterval);
    }
  });
</script>

<svelte:head>
  <title>Z.A.T.O. // I Love the Background and All the Filters On Them</title>
</svelte:head>

<main class="flex flex-col justify-end items-center h-screen px-32">
  <div class="max-w-7xl min-w-280 w-full">
    <div class="border w-full pixelated">
      <FilterCanvas bind:this={filterCanvas} {options} {img} />
    </div>

    <!-- speaker card -->
    <div class="text-3xl py-4 px-5 border w-fit -my-6 bg-bg ml-12 z-10 relative uppercase">
      [{speaker ?? "???"}]
    </div>

    <DialogueBox
      onSave={filterCanvas?.exportImage}
      onCrop={toggleCropping}
      onClear={() => { if (isEditing) clear() }}
      onReset={resetFilters}
      onOpen={() => fileInput.click()}
      {isCropping}
      {options}
      targetText={dialogueText}
      {isEditing}
    />
  </div>
</main>

<input
  onchange={fileInputChange}
  bind:this={fileInput}
  accept={validFileTypes.join(",")}
  type="file"
  name="music"
  id="music"
  class="hidden"
  multiple={false}
/>
