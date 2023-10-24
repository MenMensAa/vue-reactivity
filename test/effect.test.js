import { test, expect } from "vitest"
import { effect, reactive } from "../src"

test("basic", () => {
  let count = 0
  const data = reactive({
    value: 114,
  })
  effect(() => {
    count = data.value
  })

  expect(count).toBe(114)
  data.value = 514
  expect(count).toBe(514)
})
