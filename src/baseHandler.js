import { track, trigger } from "./effect"
import { TrackOpTypes, TriggerOpTypes } from "./operations"
import { ReactiveFlags, reactive } from "./reactive"
import { isObject } from "./shared"

class BaseReactiveHandler {
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    const result = Reflect.get(target, key, receiver)
    track(target, TrackOpTypes.GET, key)
    // 复杂结构通过递归代理直到得到普通类型的数据类型
    // 同时避免了循环导入
    if (isObject(result)) {
      return reactive(result)
    }
    return result
  }
}

class MutableReactiveHandler extends BaseReactiveHandler {
  set(target, key, value, receiver) {
    const oldValue = target[key]
    const result = Reflect.set(target, key, value, receiver)
    trigger(target, TriggerOpTypes.SET, key, value)
    return result
  }
}

export const mutableHandlers = new MutableReactiveHandler()
