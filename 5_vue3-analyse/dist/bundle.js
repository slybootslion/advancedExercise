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
  const run = effects => {
      if (effects)
          effects.forEach(effect => effect());
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

  exports.effect = effect;
  exports.reactive = reactive;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.js.map
