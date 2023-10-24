// 一直指向当前正在被执行的effect
let activeEffect = null

// 存储target的所有依赖
const targetMap = new WeakMap()

class ReactiveEffect {
  constructor(fn) {
    this.fn = fn
  }

  run() {
    try {
      activeEffect = this
      return this.fn()
    } finally {
      activeEffect = null
    }
  }
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

export function track(target, type, key) {
  if (activeEffect) {
    // 优先从缓存里面取
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      depsMap = new Map()
      targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key)
    if (!dep) {
      // 创建一个Set来存储activeEffect
      dep = new Set()
      depsMap.set(key, dep)
    }
    trackEffects(dep)
  }
}

export function trackEffects(dep) {
  const shouldTrack = !dep.has(activeEffect)
  if (shouldTrack) {
    // 将当前的effect加入
    dep.add(activeEffect)
  }
}

export function trigger(target, type, key, value) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }

  const deps = depsMap.get(key)
  if (deps) {
    triggerEffects(deps)
  }
}

export function triggerEffects(deps) {
  for (const effect of deps) {
    // 运行effect的函数
    effect.run()
  }
}
