<script lang="ts">
  // const TYPING_SPEED = 1.0;

  function closeTab() {
    window.close();
  }
</script>

<div class="border w-full h-64 border-b-0 px-32 pt-16 relative">
  <p>I'll see where life takes me.</p>

  <div class="flex bottom-0 left-1/2 -translate-x-1/2 absolute text-base text-muted">
    <button class="px-3 pt-3 hover:text-fg">NEW</button>
    <button class="px-3 pt-3 hover:text-fg">SAVE</button>
    <button class="px-3 pt-3 hover:text-fg">SETTINGS</button>
    <button class="px-3 pt-3 hover:text-fg">SHARE</button>
    <button class="px-3 pt-3 hover:text-fg" onclick={closeTab}>EXIT</button>
  </div>
</div>
