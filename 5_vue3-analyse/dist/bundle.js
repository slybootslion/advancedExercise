(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Vue = {}));
}(this, (function (exports) { 'use strict';

  function isObject(obj) {
      return typeof obj === 'object' && obj != null;
  }
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn(target, key) {
      return hasOwnProperty.call(target, key);
  }
  function isArray(arr) {
      return Array.isArray(arr);
  }
  function hasChange(v1, v2) {
      return v1 !== v2;
  }
  function isFunction(fun) {
      return typeof fun === 'function';
  }

  const effectStack = [];
  let currentEffect = null;
  function createReactiveEffect(fun, opts) {
      const effect = function () {
          if (!effectStack.includes(effect)) {
              try {
                  effectStack.push(effect);
                  currentEffect = effect;
                  return fun();
              }
              finally {
                  effectStack.pop();
                  currentEffect = effectStack[effectStack.length - 1];
              }
          }
      };
      effect.options = opts;
      return effect;
  }
  function effect(fun, opts) {
      const ef = createReactiveEffect(fun, opts);
      if (!opts?.lazy) {
          ef();
      }
      return ef;
  }
  // 建立 属性和effect之间的关联（对应Vue2中的dep和watcher）
  const targetMap = new WeakMap();
  function track(target, key) {
      if (currentEffect == undefined)
          return;
      let depsMap = targetMap.get(target);
      if (!depsMap) {
          targetMap.set(target, (depsMap = new Map()));
      }
      let dep = depsMap.get(key);
      if (!dep) {
          depsMap.set(key, (dep = new Set()));
      }
      if (!dep.has(currentEffect)) {
          dep.add(currentEffect);
      }
  }
  const run = effects => {
      if (effects)
          effects.forEach(effect => {
              // 1. 渲染对应的effect 2. 计算属性对应的effect
              if (effect.options?.scheduler) {
                  effect.options.scheduler(effect);
              }
              else {
                  effect();
              }
          });
  };
  function trigger(target, type, key, value) {
      const depsMap = targetMap.get(target);
      if (!depsMap)
          return;
      if (key === 'length' && isArray(target)) {
          depsMap.forEach((dep, k) => {
              // 如果改变了数组长度，触发更新
              if (k === 'length' || k >= value)
                  run(dep);
          });
          return;
      }
      // 修改
      if (key != undefined) {
          const effects = depsMap.get(key);
          run(effects);
      }
      // 添加
      switch (type) {
          case 'add':
              if (isArray(target)) {
                  if (parseInt(key) + '' === key) {
                      run(depsMap.get('length'));
                  }
              }
              break;
      }
  }

  const mutableHandlers = {
      get(target, key, recevier) {
          const res = Reflect.get(target, key, recevier);
          if (typeof key === 'symbol')
              return res;
          // 依赖收集
          track(target, key);
          // 取值如果是对象，递归代理（懒代理）
          return isObject(res) ? reactive(res) : res;
      },
      set(target, key, value, recevier) {
          const oldVal = target[key];
          // 判断是否新增属性
          const hadKey = isArray(target) && (parseInt(key, 10) + '' === key) ? Number(key) < target.length : hasOwn(target, key);
          const res = Reflect.set(target, key, value, recevier);
          if (!hadKey) {
              // 新增属性
              trigger(target, 'add', key, value);
          }
          else if (hasChange(oldVal, value)) {
              // 修改属性
              trigger(target, 'set', key, value);
          }
          return res;
      }
  };

  const reactiveMap = new WeakMap();
  function createReactiveObject(target, baseHandler) {
      if (!isObject(target))
          return target;
      if (!reactiveMap.has(target)) {
          const proxy = new Proxy(target, baseHandler);
          reactiveMap.set(target, proxy);
          return proxy;
      }
      return reactiveMap.get(target);
  }
  function reactive(target) {
      return createReactiveObject(target, mutableHandlers);
  }

  class ComputedRefImpl {
      constructor(getter, setter) {
          this.setter = setter;
          this.__v_isReadonly = true;
          this.__v_isRef = true;
          this._dirty = true;
          this.effect = effect(getter, {
              lazy: true,
              scheduler: effect => {
                  trigger(this, 'set', 'value');
              },
          });
      }
      get value() {
          this._value = this.effect();
          track(this, 'value');
          return this._value;
      }
      set value(val) {
          this.setter(val);
      }
  }
  function computed(getterOrOptions) {
      let getter;
      let setter;
      if (isFunction(getterOrOptions)) {
          getter = getterOrOptions;
          setter = () => console.log('computed not set value');
      }
      else {
          getter = getterOrOptions.get;
          setter = getterOrOptions.set;
      }
      return new ComputedRefImpl(getter, setter);
  }

  exports.computed = computed;
  exports.effect = effect;
  exports.reactive = reactive;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.js.map
