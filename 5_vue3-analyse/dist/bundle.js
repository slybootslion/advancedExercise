(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Vue = {}));
}(this, (function (exports) { 'use strict';

  const isObject = (obj) => typeof obj === 'object' && obj != null;
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (target, key) => hasOwnProperty.call(target, key);
  const isArray = (obj) => Array.isArray(obj);
  const isFunction = (fn) => typeof fn === 'function';
  const isString = (val) => typeof val === 'string';
  const hasChange = (oldVal, newVal) => oldVal !== newVal;

  // 依赖收集
  const effect = (fn, options = {}) => {
      const effect = createReactiveEffect(fn, options);
      if (!options.lazy) {
          effect();
      }
      return effect;
  };
  const effectStack = [];
  let activeEffect = null;
  function createReactiveEffect(fn, options) {
      // reactiveEffect只是提示看源码的人的（没有实际用处）
      const effect = function reactiveEffect() {
          if (!effectStack.includes(effect)) {
              try {
                  effectStack.push(effect);
                  activeEffect = effect;
                  return fn();
              }
              finally {
                  effectStack.pop();
                  activeEffect = effectStack[effectStack.length - 1];
              }
          }
      };
      effect.options = options;
      return effect;
  }
  const targetMap = new WeakMap();
  function track(target, key) {
      if (activeEffect == null)
          return;
      let depsMap = targetMap.get(target);
      if (!depsMap)
          targetMap.set(target, (depsMap = new Map()));
      let dep = depsMap.get(key);
      if (!dep)
          depsMap.set(key, (dep = new Set()));
      if (!dep.has(activeEffect))
          dep.add(activeEffect);
  }
  function run(effects) {
      if (effects)
          effects.forEach(effect => {
              if (effect.options.scheduler) {
                  effect.options.scheduler(effect);
                  return;
              }
              effect();
          });
  }
  function trigger(target, type, key, value) {
      const depsMap = targetMap.get(target);
      if (!depsMap)
          return;
      if (key === 'length' && isArray(target)) {
          depsMap.forEach((dep, key) => {
              // 如果改变数组长度，触发更新，如果更改的数组长度小于取值长度，触发更新
              if (key === 'length' || key >= value) {
                  run(dep);
              }
          });
          return;
      }
      if (key != null) {
          const effects = depsMap.get(key);
          run(effects);
      }
      switch (type) {
          case 'add':
              if (isArray(target)) {
                  if (parseInt(key) === key) {
                      run(depsMap.get('length'));
                  }
              }
              break;
      }
  }

  const mutableHandlers = {
      // 取值时将effect存储 recevier是代理后的对象
      get(target, key, recevier) {
          const res = Reflect.get(target, key, recevier);
          // 如果是内置Symbol，排除依赖收集
          if (typeof key === 'symbol')
              return res;
          track(target, key);
          // if (res.__v_isRef) return res.value
          // 取值时，是对象再代理
          return isObject(res) ? reactive(res) : res;
      },
      // 更新值的时候将effect更新
      set(target, key, value, recevier) {
          const oldVal = target[key];
          // 是否是原有的属性（数组根据索引长度判断）
          const hadKey = isArray(target) && (parseInt(key, 10) + '' === key) ?
              Number(key) < target.length :
              hasOwn(target, key);
          const result = Reflect.set(target, key, value, recevier);
          if (!hadKey) {
              // 没有该属性，触发新增操作
              trigger(target, 'add', key, value);
          }
          else if (hasChange(oldVal, value)) {
              //  值改变，修改属性
              trigger(target, 'set', key, value);
          }
          else ;
          effectStack.forEach(effect => effect());
          return result;
      }
  };

  const reactive = (target) => {
      return createReactiveObject(target, mutableHandlers);
  };
  // 映射表中的key必须是对象
  const reactiveMap = new WeakMap();
  function createReactiveObject(target, baseHandle) {
      if (!isObject(target))
          return target;
      // 如果已经代理过了，不需要再次代理
      const existProxy = reactiveMap.get(target);
      if (existProxy)
          return existProxy;
      // 代理 放到映射表中 返回代理
      const proxy = new Proxy(target, baseHandle);
      reactiveMap.set(target, proxy);
      return proxy;
  }

  class ComputedRefImpl {
      constructor(getter, setter) {
          this.setter = setter;
          this.__v_isReadonly = true;
          this.__V_isRef = true;
          this._dirty = true;
          // 默认getter执行的时候，依赖一个内置的effect
          this.effect = effect(getter, {
              lazy: true,
              scheduler: (effect) => {
                  this._dirty = true; // 依赖数据变化，需要重新缓存
                  trigger(this, 'set', 'value');
              }
          });
      }
      // 类属性描述器
      get value() {
          if (this._dirty) { // 缓存
              this._value = this.effect();
              track(this, 'value');
              this._dirty = false;
          }
          return this._value;
      }
      set value(nVal) {
          this.setter(nVal);
      }
  }
  function computed(getterOrOptions) {
      let getter;
      let setter;
      if (isFunction(getterOrOptions)) {
          getter = getterOrOptions;
          setter = () => { console.log('computed not set value'); };
      }
      else {
          getter = getterOrOptions.get;
          setter = getterOrOptions.set;
      }
      return new ComputedRefImpl(getter, setter);
  }

  class RefImpl {
      constructor(rawVal) {
          this.rawVal = rawVal;
          this.__v_isRef = true;
          this._value = convert(rawVal);
      }
      get value() {
          track(this, 'value');
          return this._value;
      }
      set value(nVal) {
          if (hasChange(this.rawVal, nVal)) {
              this.rawVal = nVal;
              this._value = convert(nVal);
              trigger(this, 'set', 'value');
          }
      }
  }
  function ref(rawVal) {
      return new RefImpl(rawVal);
  }
  function convert(val) {
      return isObject(val) ? reactive(val) : val;
  }
  class ObjectRefImpl {
      constructor(object, key) {
          this.object = object;
          this.key = key;
      }
      get value() {
          return this.object[this.key];
      }
      set value(nVal) {
          this.object[this.key] = nVal;
      }
  }
  function toRefs(object) {
      const result = Array.isArray(object) ? new Array(object.length) : {};
      for (const key in object) {
          result[key] = new ObjectRefImpl(object, key);
      }
      return result;
  }

  function createVNode(type, props = {}, children = null) {
      // 判断type是元素还是组件
      const shapeFlag = isString(type)
          ? 1 /* ELEMENT */
          : isObject(type)
              ? 4 /* STATEFUL_COMPONENT */
              : 0;
      const vnode = {
          type,
          props,
          children,
          component: null,
          el: null,
          key: props.key,
          shapeFlag,
      };
      if (isArray(children)) {
          vnode.shapeFlag |= 16 /* ARRAY_CHILDREN */;
      }
      else {
          vnode.shapeFlag |= 8 /* TEXT_CHILDREN */;
      }
      return vnode;
  }

  function createAppApi(render) {
      return component => {
          const app = {
              mount(container) {
                  const vNode = createVNode(component);
                  render(vNode, container);
              },
          };
          return app;
      };
  }

  function createComponentInstance(vNode) {
      const instance = {
          type: vNode.type,
          props: {},
          vNode,
          render: null,
          setupState: null,
          isMounted: false,
          subtree: null,
      };
      return instance;
  }
  function finishComponentSetup(instance) {
      const Component = instance.type;
      // 如果有render函数，以render函数中的内容为准
      if (Component.render && !instance.render) {
          instance.render = Component.render;
      }
      else if (!instance.render) ;
  }
  function handleSetupResult(instance, result) {
      if (isFunction(result)) {
          instance.render = result;
      }
      else {
          instance.setupState = result;
      }
      // 兼容vue2处理方法
      finishComponentSetup(instance);
  }
  function setupStatefulComponent(instance) {
      const Component = instance.type;
      const { setup } = Component;
      if (setup) {
          const setupResult = setup(instance.props);
          // setup返回状态，或者render函数
          handleSetupResult(instance, setupResult);
      }
  }
  function setupComponent(instance) {
      // 属性处理
      setupStatefulComponent(instance);
  }

  function createRenderer(options) {
      const { createElement: hostCreateElement, inset: hostInset, remove: hostRemove, setElementText: hostSetElementText, createTextNode: hostCreateTextNode, patchProps: hostPatchProps, } = options;
      function isSameNode(node1, node2) {
          return node1.type === node2.type && node1.key === node2.key;
      }
      const patch = (prevNode, vNode, container, anchor = null) => {
          // 组件更新：同级比对，同Vue2
          // 1.类型不一样 key不一样，不复用
          // 2.复用节点后，比对属性
          // 3.比对子节点，1方有子节点，直接替换或者直接删除
          // 4.两方都有子节点（真正的diff算法）
          if (prevNode && !isSameNode(prevNode, vNode)) {
              hostRemove(prevNode.el);
              prevNode = null;
          }
          const { shapeFlag } = vNode;
          const mountElement = (vNode, container, anchor) => {
              const { shapeFlag, props, type, children } = vNode;
              // 创建
              const el = (vNode.el = hostCreateElement(type));
              // 子节点
              if (shapeFlag & 8 /* TEXT_CHILDREN */) {
                  hostSetElementText(el, children);
              }
              else {
                  mountChildren(children, el);
              }
              // 属性
              if (props) {
                  for (const key in props) {
                      hostPatchProps(el, key, null, props[key]);
                  }
              }
              // 插入节点
              hostInset(el, container, anchor);
          };
          function mountChildren(children, container) {
              for (let i = 0; i < children.length; i++) {
                  patch(null, children[i], container);
              }
          }
          function patchProps(oldProps, newProps, el) {
              if (oldProps !== newProps) {
                  for (const key in newProps) {
                      const oldOne = oldProps[key];
                      const newOne = newProps[key];
                      if (oldOne !== newProps)
                          hostPatchProps(el, key, oldOne, newOne);
                  }
                  // 旧的属性有，新的没有，删除旧属性
                  for (const key in oldProps) {
                      const oldOne = oldProps[key];
                      if (!(key in newProps))
                          hostPatchProps(el, key, oldOne, null);
                  }
              }
          }
          function patchKeyedChildren(c1, c2, el) {
              let i = 0;
              let e1 = c1.length - 1;
              let e2 = c2.length - 1;
              while (i <= e1 && i <= e2) {
                  // 头相同
                  const n1 = c1[i];
                  const n2 = c2[i];
                  if (isSameNode(n1, n2)) {
                      patch(n1, n2, el);
                  }
                  else {
                      break;
                  }
                  i++;
              }
              while (i <= e1 && i <= e2) {
                  // 尾相同
                  const n1 = c1[e1];
                  const n2 = c2[e2];
                  if (isSameNode(n1, n2)) {
                      patch(n1, n2, el);
                  }
                  else {
                      break;
                  }
                  e1--;
                  e2--;
              }
              if (i > e1) {
                  // 旧的节点都比较完了
                  if (i <= e2) {
                      // 新增节点
                      const nextPos = e2 + 1;
                      const anchor = nextPos < c2.length ? c2[nextPos].el : null;
                      while (i <= e2) {
                          patch(null, c2[i], el, anchor);
                          i++;
                      }
                  }
              }
              else if (i > e2) {
                  // 新的节点都比较完了 删除旧的节点
                  while (i <= e1) {
                      hostRemove(c1[i].el);
                      i++;
                  }
              }
              else ;
          }
          function patchChildren(oldNode, newNode, el) {
              const oldChildren = oldNode.children;
              const newChildren = newNode.children;
              // 4种情况（仅考虑文本和标签，其他元素不考虑）
              const oldShapeFlag = oldNode.shapeFlag;
              const newShapeFlag = newNode.shapeFlag;
              // 1旧的是文本，新的是文本
              // 2旧的是数组，新的是文本 如果新的是文本，直接覆盖
              if (newShapeFlag & 8 /* TEXT_CHILDREN */) {
                  if (newChildren !== oldChildren)
                      hostSetElementText(el, newChildren);
              }
              else {
                  // 3旧的是数组，新的是数组
                  if (oldShapeFlag & 16 /* ARRAY_CHILDREN */) {
                      // 真·diff算法
                      patchKeyedChildren(oldChildren, newChildren, el);
                  }
                  else {
                      // 4旧的是文本，新的是数组
                      hostSetElementText(el, '');
                      mountChildren(newChildren, el);
                  }
              }
          }
          const patchElement = (prevNode, vNode, container) => {
              // 比较两个元素，并复用
              const el = (vNode.el = prevNode.el);
              const oldProps = prevNode.props;
              const newProps = vNode.props;
              // 比对属性
              patchProps(oldProps, newProps, el);
              // 比对子节点
              patchChildren(prevNode, vNode, el);
          };
          const mountComponent = (vNode, container) => {
              // 每个组件有一个effect，达到组件级更新的效果
              // 组件的创建
              const instance = (vNode.component = createComponentInstance(vNode));
              // 组件的setup方法
              setupComponent(instance);
              // 渲染effect
              setupRenderEffect(instance, container);
          };
          function setupRenderEffect(instance, container) {
              effect(() => {
                  if (!instance.isMounted) {
                      // 组件的创建渲染
                      const subtree = (instance.subtree = instance.render());
                      patch(null, subtree, container);
                      instance.isMounted = true;
                  }
                  else {
                      // 组件的更新渲染
                      const prevTree = instance.subtree;
                      const nextTree = instance.render();
                      patch(prevTree, nextTree, container);
                  }
              });
          }
          const processElement = (prevNode, vNode, container, anchor) => {
              if (prevNode == null) {
                  // 元素挂载
                  mountElement(vNode, container, anchor);
              }
              else {
                  patchElement(prevNode, vNode);
              }
          };
          const processComponent = (prevNode, vNode, container) => {
              if (prevNode == null) {
                  // 组件挂载
                  mountComponent(vNode, container);
              }
          };
          // & 包含类型
          // 1100 & 0001
          if (shapeFlag & 1 /* ELEMENT */) {
              // 元素
              processElement(prevNode, vNode, container, anchor);
          }
          else if (shapeFlag & 4 /* STATEFUL_COMPONENT */) {
              //1100 0100
              // 组件
              processComponent(prevNode, vNode, container);
          }
      };
      const render = (vNode, container) => {
          // 初次渲染 没有prevNode
          patch(null, vNode, container);
      };
      return {
          createApp: createAppApi(render),
      };
  }

  function h(type, props = {}, children = null) {
      return createVNode(type, props, children);
  }

  const nodeOpts = {
      createElement(type) {
          return document.createElement(type);
      },
      inset(child, parent, anchor = null) {
          parent.insertBefore(child, anchor);
      },
      remove(child) {
          const parent = child.parentNode;
          if (parent)
              parent.removeChild(child);
      },
      setElementText(el, content) {
          el.textContent = content;
      },
      createTextNode(content) {
          return document.createTextNode(content);
      },
  };

  function patchStyle(el, prev, next) {
      const style = el.style;
      if (!next) {
          el.removeAttribute("style");
      }
      else {
          for (const key in next) {
              style[key] = next[key];
          }
          if (prev) {
              for (const key in prev) {
                  if (!next[key]) {
                      style[key] = "";
                  }
              }
          }
      }
  }
  function patchClass(el, next) {
      if (!next)
          next = "";
      el.className = next;
  }
  function pathAttr(el, key, next) {
      if (!next) {
          el.removeAttribute(key);
      }
      else {
          el.setAttribute(key, next);
      }
  }
  function patchProps(el, key, prevVal, nextVal) {
      switch (key) {
          case "style":
              patchStyle(el, prevVal, nextVal);
              break;
          case "className":
              patchClass(el, nextVal);
          default:
              pathAttr(el, key, nextVal);
      }
  }

  function ensureRenderer() {
      return createRenderer({ ...nodeOpts, patchProps });
  }
  function createApp(rootComponent) {
      const app = ensureRenderer().createApp(rootComponent);
      const { mount } = app;
      app.mount = function (container) {
          container = document.querySelector(container);
          container.innerHTML = "";
          mount(container);
      };
      return app;
  }

  exports.computed = computed;
  exports.createApp = createApp;
  exports.createRenderer = createRenderer;
  exports.effect = effect;
  exports.h = h;
  exports.reactive = reactive;
  exports.ref = ref;
  exports.toRefs = toRefs;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.js.map
