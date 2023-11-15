import { test, expect } from "vitest"
import { effect, reactive, isReactive } from "../src"

test("reactive缓存", () => {
  const target = {}
  const r1 = reactive(target)
  const r2 = reactive(target)
  expect(r1).toBe(r2)
})

test("reactive深度监听", () => {
  const target = reactive({
    deepOne: {
      deepTwo: {
        age: 114,
      },
    },
  })
  let count = 0
  effect(() => {
    count = target.deepOne.deepTwo.age
  })
  expect(count).toBe(114)
  target.deepOne.deepTwo.age = 514
  expect(count).toBe(514)
})

test("isReactive基础用法", () => {
  expect(isReactive(reactive({}))).toBe(true)
  expect(isReactive({})).toBe(false)

  const obj = reactive({
    foo: Object.preventExtensions({ a: 1 }),
    // sealed or frozen objects are considered non-extensible as well
    // https://github.com/vuejs/core/pull/1753
    bar: Object.freeze({ a: 1 }),
    baz: Object.seal({ a: 1 }),
  })
  expect(isReactive(obj.foo)).toBe(false)
  expect(isReactive(obj.bar)).toBe(false)
  expect(isReactive(obj.baz)).toBe(false)

  const target = reactive({ a: 1 })
  const result = reactive(target)
  expect(result).toBe(target)
})
