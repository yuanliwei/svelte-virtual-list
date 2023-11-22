# Svelte VirtualScrollList



[Demo](https://svelte.dev/repl/79a238b9b69e4143b2bc048207bb98bc?version=4.2.5)

## API
```js

export let data = []
export let size = 0
export let scrollTop = 0

/**
 * @param {number} scrollTop
 * @param {boolean} [animation]
 */
export async function scrollToWithListScrollTop(scrollTop, animation)

/**
 * @param {number} offset
 * @param {boolean} animation
 */
export async function scrollListOffset(offset, animation)

/**
 * @param {number} percent 0-1
 * @param {boolean} [animation]
 */
export async function scrollToPercent(percent, animation)

/**
 * @param {number} index
 * @param {boolean} [animation]
 */
export async function scrollToPosition(index, animation)

export async function reset()
```

## usage
```html
<script>
  import VirtualScrollList from "@yuanliwei/svelte-virtual-list";
  import { getName } from "./data.js";

  let datas = Array.from({ length: 1000000 }).map((_, i) => ({
    id: i + 1,
    text: getName(i),
  }));

  let showList1 = true;
  let showList2 = true;
  let scrollTop1 = 0;
  let scrollTop2 = 0;
  /** @type{VirtualScrollList} */
  let list1 = null;
  /** @type{VirtualScrollList} */
  let list2 = null;

  let list1Position = 0;
  let list2Position = 0;

  $: list1?.scrollToPosition(list1Position);
  $: list2?.scrollToPosition(list2Position);
</script>

<main>
  <section>
    <p>虚拟列表，100万条数据</p>
    <div class="content">
      {#if showList1}
        <VirtualScrollList
          data={datas}
          bind:scrollTop={scrollTop1}
          sticky={10} 
          let:item
          let:index
          bind:this={list1}
        >
          <div class="item">{index} : {item.text}</div>
        </VirtualScrollList>
      {/if}
    </div>

    <button on:click={() => { showList1 = !showList1; }} > toggle </button>
    <button on:click={() => { list1.scrollToPercent(0.7, true); }} > scrollToPercent(0.7, true) </button>
    <button on:click={() => { list1.scrollToPosition(34, true); }} > scrollToPosition(34, true) </button>
    <button on:click={() => { list1.scrollListOffset(390, true); }} > scrollListOffset(390, true) </button>
    <input type="number" placeholder="seek to" bind:value={list1Position} />
  </section>
  <section>
    <p>虚拟列表+虚拟数据，1万亿条数据</p>
    <div class="content">
      {#if showList2}
        <VirtualScrollList
          size={100000000000}
          bind:scrollTop={scrollTop2}
          let:index
          bind:this={list2}
        >
          <div class="item">{index} : {getName(index)}</div>
        </VirtualScrollList>
      {/if}
    </div>

    <button on:click={() => { showList2 = !showList2; }} > toggle </button>
    <button on:click={() => { list2.scrollToPercent(0.7, true); }} > scrollToPercent(0.7, true) </button>
    <button on:click={() => { list2.scrollToPosition(34, true); }} > scrollToPosition(34, true) </button>
    <button on:click={() => { list2.scrollListOffset(390, true); }} > scrollListOffset(390, true) </button>
    <button on:click={() => { list2.reset(); }} > reset() </button>
    <input type="number" placeholder="move to" bind:value={list2Position} />
  </section>
</main>

<style>
  main {
    display: flex;
  }
  section {
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

```