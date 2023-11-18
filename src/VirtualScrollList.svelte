<script>
    import { onMount, tick } from "svelte";
    import { ListState } from "./lib.js";

    export let data = [];
    export let scrollTop = 0;

    /** @type{HTMLDivElement} */
    let list = null;
    /** @type{HTMLDivElement} */
    let scrollBar = null;

    let listClientHeight = 0;
    let renderData = [];
    let renderOffsets = [];
    let scrollBarHeight = 0;
    let renderStart = 0;

    const listState = new ListState(tick);

    $: listState.updateListData(data);
    $: listState.updateListClientHeight(listClientHeight);

    onMount(() => {
        listState.init(list, scrollBar, scrollTop, (o) => {
            renderData = o.renderData;
            renderStart = o.renderStart;
            renderOffsets = o.renderOffsets;
            scrollBarHeight = o.scrollBarHeight;
            scrollTop = o.scrollTop;
        });

        list.addEventListener("mouseenter", focusScrollBar);
        list.addEventListener("mouseup", focusScrollBar);
        list.addEventListener("wheel", onWheel, { passive: false });
        list.addEventListener("touchstart", onTouchStart, { passive: true });
        list.addEventListener("touchmove", onTouchMove, { passive: false });
        list.addEventListener("touchend", onTouchEnd);
        scrollBar.addEventListener("scroll", onScroll);

        return () => {
            list.removeEventListener("mouseenter", focusScrollBar);
            list.removeEventListener("mouseup", focusScrollBar);
            list.removeEventListener("wheel", onWheel);
            list.removeEventListener("touchstart", onTouchStart);
            list.removeEventListener("touchmove", onTouchMove);
            list.removeEventListener("touchend", onTouchEnd);
            scrollBar.removeEventListener("scroll", onScroll);
        };
    });

    function focusScrollBar() {
        scrollBar.focus();
    }

    /**
     * @param {TouchEvent} e
     */
    function onTouchStart(e) {
        listState.onTouchStart(e);
    }

    /**
     * @param {TouchEvent} e
     */
    function onTouchMove(e) {
        listState.onTouchMove(e);
    }

    /**
     * @param {TouchEvent} e
     */
    function onTouchEnd(e) {
        listState.onTouchEnd(e);
    }

    /**
     * @param {WheelEvent} e
     */
    function onWheel(e) {
        listState.onWheel(e);
    }

    function onScroll() {
        listState.onScroll();
    }

    /**
     * @param {number} scrollTop
     * @param {boolean} [animation]
     */
    export async function scrollToWithListScrollTop(scrollTop, animation) {
        await listState.scrollToWithListScrollTop(scrollTop, animation);
    }

    /**
     * @param {number} offset
     * @param {boolean} animation
     */
    export async function scrollListOffset(offset, animation) {
        await listState.scrollListOffset(offset, animation);
    }

    /**
     * @param {number} percent 0-1
     * @param {boolean} [animation]
     */
    export async function scrollToPercent(percent, animation) {
        await listState.scrollToPercent(percent, animation);
    }

    /**
     * @param {number} index
     * @param {boolean} [animation]
     */
    export async function scrollToPosition(index, animation) {
        await listState.scrollToPosition(index, animation);
    }
</script>

<div class="root">
    <div
        class="container"
        bind:this={list}
        bind:clientHeight={listClientHeight}
    >
        {#each renderData as item, index}
            <div class="item" style="top:{renderOffsets[index]}px;left:0px">
                <slot {item} index={index + renderStart} />
            </div>
        {/each}
    </div>
    <div tabindex="-1" class="scrollbar" bind:this={scrollBar}>
        <div class="content" style="height:{scrollBarHeight}px;" />
    </div>
</div>

<style>
    .root {
        height: 100%;
        position: relative;
    }
    .container {
        overflow: auto;
        position: relative;
        height: 100%;
    }
    .item {
        position: absolute;
        width: 100%;
    }
    .scrollbar {
        outline: none;
        overflow: auto;
        position: absolute;
        height: 100%;
        right: 0;
        top: 0;
    }
    .content {
        width: 1px;
    }
    @media (max-width: 480px) {
        .container {
            overflow: hidden;
        }
        .content {
            width: 10px;
        }
    }
</style>
