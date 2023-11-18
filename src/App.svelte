<script>
  import VirtualScrollList from "./VirtualScrollList.svelte";

  let datas = [...new Uint8Array(1000000)].map((o, i) => ({
    id: i,
    text: "---" + (i + 1) + "===",
  }));
  // let datas = [...new Uint8Array(1000)].map((o, i) => ({ id: i, text: "---" + (i + 1) + "===", }));

  let showList = true;
  let scrollTop = 0;
  /** @type{VirtualScrollList} */
  let list = null;

  class NameUtil {
    constructor() {
      this.nameCode =
        "鑫正涵琛妍芸露楠薇锦彤采初美冬婧桐莲彩洁" +
        "呈菡怡冰雯雪茜优静萱林馨鹤梅娜璐曼彬芳颖韵曦蔚桂月梦琪蕾" +
        "依碧枫欣杉丽祥雅欢婷舒心紫芙慧梓香玥菲璟茹昭岚玲云华阳弦" +
        "莉明珊雨蓓旭钰柔敏家凡花媛歆沛姿妮珍琬彦倩玉柏橘昕桃栀克" +
        "帆俊惠漫芝寒诗春淑凌珠灵可格璇函晨嘉鸿瑶帛琳文洲娅霞颜康" +
        "卓星礼远帝裕腾震骏加强运杞良梁逸禧辰佳子栋博年振荣国钊喆" +
        "睿泽允邦骞哲皓晖福濡佑然升树祯贤成槐锐芃驰凯韦信宇鹏盛晓" +
        "翰海休浩诚辞轩奇潍烁勇铭平瑞仕谛翱伟安延锋寅起谷稷胤涛弘" +
        "侠峰材爵楷尧炳乘蔓桀恒桓日坤龙锟天郁吉暄澄中斌杰祜权畅德";
    }

    get() {
      let length = [3, 2, 4, 5][
        Math.floor(Math.random() * Math.random() * 3.1)
      ];
      let name = [];
      while (length--) {
        name.push(
          this.nameCode[Math.floor(Math.random() * this.nameCode.length)]
        );
      }
      return name.join("");
    }
  }

  const nameGenerate = new NameUtil();
  const nameMap = new Map();
  function getName(index) {
    if (nameMap.has(index)) {
      return nameMap.get(index);
    }
    nameMap.set(index, nameGenerate.get());
    return nameMap.get(index);
  }

  // $: console.log("initScrollTop", scrollTop);
</script>

<main>
  <div class="content">
    {#if showList}
      <VirtualScrollList
        data={[]}
        size={999999999999}
        bind:scrollTop
        let:item
        let:index
        bind:this={list}
      >
        <div class="item">{index} : {getName(index)}</div>
      </VirtualScrollList>
    {/if}
  </div>

  <button
    on:click={() => {
      showList = !showList;
    }}>toggle</button
  >
  <button
    on:click={() => {
      list.scrollToPercent(0.7, true);
    }}
  >
    scrollToBottom
  </button>
  <button
    on:click={() => {
      list.scrollToPosition(34, true);
    }}
  >
    scrollToPosition
  </button>
  <button
    on:click={() => {
      list.scrollListOffset(1000, true);
    }}
  >
    scrollListOffset
  </button>
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
