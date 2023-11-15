<script>
    import { onMount, tick } from "svelte";

    export let data = [];
    export let scrollTop = 0;

    let render = [];
    /** @type{HTMLDivElement} */
    let list = null;
    /** @type{HTMLDivElement} */
    let scrollBar = null;

    let listScrollTop = 0;
    let listClientHeight = 0;
    let listPageSize = 0;
    let itemClientHeight = 0;
    let listOffsetTop = 0;
    let listRenderStart = 0;
    let scrollBarHeight = 0;
    let skipScrollEventOnce = false;
    let skipWheelEventOnce = false;

    $: renderList(listScrollTop, data);

    onMount(() => {
        (async () => {
            await tick();
            listScrollTop = scrollTop;
            await renderList(listScrollTop, data);
            let listScrollHeight = data.length * itemClientHeight;
            let percent = listScrollTop / (listScrollHeight - list.clientHeight);
            scrollBar.scrollTop =
                percent * (scrollBar.scrollHeight - scrollBar.clientHeight);
        })();

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

    let lastTouchY = 0;
    let lastTouchTime = 0;
    let touchSpeed = 0;
    let flingScale = 1;
    let lastFlingTime = 0;

    /**
     * @param {TouchEvent} e
     */
    function onTouchStart(e) {
        lastTouchY = e.touches[0].clientY;
        lastTouchTime = e.timeStamp;
        touchSpeed = 0;
    }

    /**
     * @param {TouchEvent} e
     */
    function onTouchMove(e) {
        e.preventDefault();
        let y = e.touches[0].clientY;
        let deltaY = lastTouchY - y;
        touchSpeed = deltaY / (e.timeStamp - lastTouchTime);
        lastTouchY = y;
        lastTouchTime = e.timeStamp;
        scrollList(deltaY);
    }

    const animationFrame = () =>
        new Promise((resolve) => requestAnimationFrame(resolve));

    /**
     * @param {TouchEvent} e
     */
    async function onTouchEnd(e) {
        if (performance.now() - lastFlingTime < 800) {
            flingScale *= 3;
        } else {
            flingScale = 1;
        }
        if (Math.abs(touchSpeed) > 1) {
            lastFlingTime = performance.now();
        }
        let speed = touchSpeed * flingScale;
        let time = performance.now();
        let speedDelta = 0.99;
        while (Math.abs(speed) > 0.01 && Math.abs(touchSpeed) > 0) {
            await animationFrame();
            scrollList(speed * (performance.now() - time));
            time = performance.now();
            speed *= speedDelta;
        }
    }

    /**
     * @param {WheelEvent} e
     */
    function onWheel(e) {
        if (e.ctrlKey && e.cancelable) {
            return;
        }
        e.preventDefault();
        scrollList(e.deltaY);
    }

    /**
     * @param {number} deltaY
     */
    function scrollList(deltaY) {
        if (skipWheelEventOnce) {
            skipWheelEventOnce = false;
            return;
        }
        skipScrollEventOnce = true;
        let countListScrollTop = listScrollTop + deltaY;

        if (countListScrollTop < 0) {
            countListScrollTop = 0;
        }
        if (
            countListScrollTop >
            (data.length - listPageSize) * itemClientHeight
        ) {
            countListScrollTop =
                (data.length - listPageSize) * itemClientHeight;
        }

        if (data.length < listPageSize) {
            countListScrollTop = 0;
        }

        let listScrollHeight = data.length * itemClientHeight;
        let percent =
            countListScrollTop / (listScrollHeight - list.clientHeight);
        let countScrollTop =
            percent * (scrollBar.scrollHeight - scrollBar.clientHeight);
        if (Math.floor(countScrollTop) != Math.floor(scrollBar.scrollTop)) {
            scrollBar.scrollTop =
                percent * (scrollBar.scrollHeight - scrollBar.clientHeight);
        }

        if (countListScrollTop != listScrollTop) {
            listScrollTop = countListScrollTop;
            scrollTop = listScrollTop;
        }
    }

    function onScroll() {
        if (skipScrollEventOnce) {
            skipScrollEventOnce = false;
            return;
        }
        skipWheelEventOnce = true;
        let percent =
            scrollBar.scrollTop /
            (scrollBar.scrollHeight - scrollBar.clientHeight);

        let listScrollHeight = data.length * itemClientHeight;
        let countListScrollTop =
            percent * (listScrollHeight - list.clientHeight);
        if (Math.floor(countListScrollTop) != Math.floor(listScrollTop)) {
            listScrollTop = countListScrollTop;
            scrollTop = listScrollTop;
        }
    }

    /**
     * @param {number} scrollTop
     * @param {object[]} [datas]
     */
    async function renderList(scrollTop, datas) {
        listOffsetTop = -scrollTop % itemClientHeight;
        let end = 1;
        if (itemClientHeight > 0 && listClientHeight > 0) {
            listRenderStart = Math.floor(scrollTop / itemClientHeight);
            end = listRenderStart + 1 + listClientHeight / itemClientHeight;
        } else {
            listRenderStart = 0;
        }
        listPageSize = end - listRenderStart - 1;
        render = datas.slice(listRenderStart, end);

        await tick();
        // @ts-ignore
        itemClientHeight = list?.firstChild?.clientHeight ?? 0;

        if (datas.length < listPageSize) {
            scrollBarHeight = 0;
        } else {
            scrollBarHeight = itemClientHeight * datas.length;
        }
    }
</script>

<div class="root">
    <div
        class="container"
        bind:this={list}
        bind:clientHeight={listClientHeight}
    >
        {#each render as item, index}
            <div
                class="item"
                style="top:{listOffsetTop +
                    index * itemClientHeight}px;left:0px"
            >
                <slot {item} index={index + listRenderStart} />
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
