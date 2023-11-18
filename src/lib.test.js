import test from 'node:test'
import { deepStrictEqual } from 'node:assert'
import { countOffsetAndStartIndex } from './lib.js'

test('countOffsetAndStartIndex', () => {
    let map = new Map()
    let data = [...new Uint8Array(1000)].map((o, i) => i)
    let scrollTop = 0
    let listClientHeight = 400
    let o = countOffsetAndStartIndex(map, data, listClientHeight, scrollTop)

    deepStrictEqual(o, {
        startIndex: 0,
        offsets: [0]
    })


    map = new Map()
    map.set(0, 45)
    data = [...new Uint8Array(1000)].map((o, i) => i)
    scrollTop = 0
    listClientHeight = 20
    o = countOffsetAndStartIndex(map, data, listClientHeight, scrollTop)

    deepStrictEqual(o, {
        startIndex: 0,
        offsets: [0]
    })

    map = new Map()
    map.set(0, 45)
    data = [...new Uint8Array(1000)].map((o, i) => i)
    scrollTop = 0
    listClientHeight = 50
    o = countOffsetAndStartIndex(map, data, listClientHeight, scrollTop)

    deepStrictEqual(o, {
        startIndex: 0,
        offsets: [0, 45]
    })

    map = new Map()
    map.set(0, 45)
    data = [...new Uint8Array(1000)].map((o, i) => i)
    scrollTop = 0
    listClientHeight = 90
    o = countOffsetAndStartIndex(map, data, listClientHeight, scrollTop)

    deepStrictEqual(o, {
        startIndex: 0,
        offsets: [0, 45]
    })

    map = new Map()
    map.set(0, 45)
    data = [...new Uint8Array(1000)].map((o, i) => i)
    scrollTop = 0
    listClientHeight = 91
    o = countOffsetAndStartIndex(map, data, listClientHeight, scrollTop)

    deepStrictEqual(o, {
        startIndex: 0,
        offsets: [0, 45, 90]
    })

    map = new Map()
    map.set(0, 45)
    data = [...new Uint8Array(1000)].map((o, i) => i)
    scrollTop = 10
    listClientHeight = 91
    o = countOffsetAndStartIndex(map, data, listClientHeight, scrollTop)

    deepStrictEqual(o, {
        startIndex: 0,
        offsets: [-10, 35, 80]
    })

    map = new Map()
    map.set(0, 45)
    map.set(3, 15)
    data = [...new Uint8Array(1000)].map((o, i) => i)
    scrollTop = 123
    listClientHeight = 91
    o = countOffsetAndStartIndex(map, data, listClientHeight, scrollTop)

    deepStrictEqual(o, {
        offsets: [-33, 12, 27, 42, 57, 72, 87],
        startIndex: 2
    })

})