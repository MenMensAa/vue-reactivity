import { mutableHandlers } from "./baseHandler"

function createReactiveObject(options) {
  const { target, baseHandlers } = options
  const proxy = new Proxy(target, baseHandlers)
  return proxy
}

export function reactive(target) {
  return createReactiveObject({
    target,
    baseHandlers: mutableHandlers,
  })
}
