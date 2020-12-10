(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Vue = {}));
}(this, (function (exports) { 'use strict';

  const effectStack = [];
  let currentEffect = null;
  function createReactiveEffect(fun) {
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
      return effect;
  }
  function effect(fun, opts = {}) {
      const effect = createReactiveEffect(fun);
      effect();
  }
  // 建立 属性和effect之间的关联（对应Vue2中的dep和watcher）
  const targetMap = new WeakMap;
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

  const mutableHandlers = {
      get(target, key, recevier) {
          const res = Reflect.get(target, key, recevier);
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

  exports.effect = effect;
  exports.reactive = reactive;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.js.map
