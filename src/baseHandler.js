import { track, trigger } from "./effect"
import { TrackOpTypes, TriggerOpTypes } from "./operations"

class BaseReactiveHandler {
  get(target, key, receiver) {
    const result = Reflect.get(target, key, receiver)
    track(target, TrackOpTypes.GET, key)
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
