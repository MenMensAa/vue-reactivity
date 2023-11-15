import { mutableHandlers } from "./baseHandler"

export const ReactiveFlags = {
  IS_REACTIVE: "__v_isReactive",
}

const TargetType = {
  INVALID: 0,
  COMMON: 1,
}

export const reactiveMap = new WeakMap()

function getTargetType(target) {
  // 不可新增属性的对象，依然可能是一个响应式对象，理论上isFrozen的对象才是不可响应式的
  // 这里是和官方代码对齐所以选用了isExtensible
  if (!Object.isExtensible(target)) {
    return TargetType.INVALID
  }
  return TargetType.COMMON
}

function createReactiveObject(options) {
  const { target, baseHandlers, proxyMap } = options
  // 检查代理缓存
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  // 非法类型的对象，不进行代理
  const targetType = getTargetType(target)
  if (targetType === TargetType.INVALID) {
    return target
  }
  const proxy = new Proxy(target, baseHandlers)
  proxyMap.set(target, proxy)
  return proxy
}

export function reactive(target) {
  if (isReactive(target)) {
    return target
  }
  return createReactiveObject({
    target,
    baseHandlers: mutableHandlers,
    proxyMap: reactiveMap,
  })
}

export function isReactive(value) {
  return !!(value && value[ReactiveFlags.IS_REACTIVE])
}
