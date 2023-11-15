<script>
  import VirtualScrollList from "./VirtualScrollList.svelte";

  let datas = [...new Uint8Array(1000000)].map((o, i) => ({
    id: i,
    text: "---" + (i + 1) + "===",
  }));
  // let datas = [...new Uint8Array(1000)].map((o, i) => ({ id: i, text: "---" + (i + 1) + "===", }));

  let showList = true;
  let scrollTop = 0;

  // $: console.log("initScrollTop", scrollTop);
</script>

<main>
  <div class="content">
    {#if showList}
      <VirtualScrollList data={datas} bind:scrollTop let:item let:index>
        <div class="item">{index} : {item.text}</div>
      </VirtualScrollList>
    {/if}
  </div>

  <button
    on:click={() => {
      showList = !showList;
    }}>toggle</button
  >
</main>

<style>
  main {
    padding: 1em;
  }

  .content {
    background-color: aliceblue;
    height: 400px;
    margin-top: 1em;
    box-sizing: border-box;
  }
  .item {
    line-height: 3em;
    padding-left: 1em;
    box-sizing: border-box;
    border-bottom: blue 1px solid;
    overflow: hidden;
    width: 100%;
  }
</style>
