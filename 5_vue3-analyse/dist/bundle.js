(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Vue = {}));
}(this, (function (exports) { 'use strict';

  const effectStack = [];
  function createReactiveEffect(fun) {
      const effect = function () {
          effectStack.push(effect);
          fun();
      };
      return effect;
  }
  function effect(fun, opts = {}) {
      const effect = createReactiveEffect(fun);
      effect();
  }

  function isObject(obj) {
      return typeof obj === 'object' && obj != null;
  }

  const mutableHandlers = {
      get(target, key, recevier) {
          // return target[key]
          return Reflect.get(target, key, recevier);
      },
      set(target, key, value, recevier) {
          // target[key] = value
          Reflect.set(target, key, value, recevier);
          effectStack.forEach(effect => effect());
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
