<script lang="ts">
  import { onMount } from "svelte";
  import type { FilterOptions } from "$lib/types";

  import DialogueBox from "$lib/components/DialogueBox.svelte";
  import FilterCanvas from "$lib/components/FilterCanvas.svelte";

  let filterCanvas = $state<FilterCanvas | undefined>();
  let options: FilterOptions = {
    hue: -144,
    saturation: 0.5,
    lightness: 0,
    posterize: 5,
    noise: 50
  }

  onMount(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/images/placeholder/school.webp";
    img.onload = () => {
      filterCanvas?.setImage(img);
    };
  });
</script>

<svelte:head>
  <title>Z.A.T.O. // I Love the Background and All the Filters On It</title>
</svelte:head>

<main class="flex flex-col justify-end items-center h-screen px-32">
  <div class="max-w-7xl w-full">
    <div class="border w-full pixelated">
      <FilterCanvas bind:this={filterCanvas} {options} />
    </div>

    <!-- speaker card -->
    <div class="text-3xl py-4 px-5 border w-fit -my-6 bg-bg ml-12 z-10 relative">
      [???]
    </div>

    <DialogueBox onSave={filterCanvas?.exportImage} />
  </div>
</main>
