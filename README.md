# Svelte VirtualScrollList


```html
<script>
  import VirtualScrollList from "@yuanliwei/svelte-virtual-list";
  let scrollTop = 0
  let data = [...new Uint8Array(1000000)].map((o, i) => ({ id: i, text: "---" + (i + 1) + "===", }));
</script>

<div class="content">
  <VirtualScrollList data={data} bind:scrollTop={scrollTop} let:item let:index>
    <div class="item">{index} : {item.text}</div>
  </VirtualScrollList>
</div>

<style>
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

```