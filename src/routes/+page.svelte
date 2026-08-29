<script lang="ts">
  import DialogueBox from "$lib/components/DialogueBox.svelte";
</script>

<svelte:head>
  <title>Z.A.T.O. // I Love the Background and Everything On It</title>
</svelte:head>

<main class="flex flex-col justify-end items-center h-screen px-32">
  <div class="max-w-7xl w-full">
    <div class="outline w-full aspect-12/5 bg-[url('/filtered.png')] bg-cover bg-center pixelated border-4 border-bg">

    </div>

    <!-- speaker card -->
    <div class="text-3xl py-4 px-5 outline w-fit -my-6 bg-bg ml-12 z-10 relative">
      [???]
    </div>

    <DialogueBox />
  </div>
</main>
