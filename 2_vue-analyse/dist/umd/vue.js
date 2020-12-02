(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  var oldArrayProtoMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayProtoMethods);
  var methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
  methods.forEach(function (method) {
    //AOP
    // 重写数组方法
    arrayMethods[method] = function () {
      var _oldArrayProtoMethods;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = (_oldArrayProtoMethods = oldArrayProtoMethods[method]).call.apply(_oldArrayProtoMethods, [this].concat(args));

      var inserted;
      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      }

      if (inserted) ob.observeArray(inserted);
      ob.dep.notify();
      return result;
    };
  });

  var id = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id++; // 属性去记住watcher

      this.subs = [];
    } // watcher记住属性


    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        Dep.target.addDep(this);
      } // 记录watcher

    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      } // 通知watcher渲染

    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }();

  Dep.target = null;

  function pushTarget(watcher) {
    Dep.target = watcher;
  }

  function popTarget() {
    Dep.target = null;
  }

  var fns = [];
  var waiting = false;

  function flushCallback() {
    for (var i = 0; i < fns.length; i++) {
      var fn = fns[i];
      fn();
    }

    fns = [];
    waiting = false;
  }

  function nextTick(fn) {
    fns.push(fn);

    if (!waiting) {
      // Vue3只使用了Promise其他兼容降级处理的过时玩意儿就不写了
      Promise.resolve().then(flushCallback);
      waiting = true;
    }
  }

  var LIFECYCLE_HOOK = ['beforeCreate', 'created', 'beforeMount', 'mount'];
  var strats = {};

  function mergeHook(parentValue, childValue) {
    if (childValue) {
      if (parentValue) {
        return parentValue.concat(childValue);
      } else {
        return [childValue];
      }
    } else {
      return parentValue;
    }
  }

  LIFECYCLE_HOOK.forEach(function (hookStr) {
    return strats[hookStr] = mergeHook;
  });

  strats.components = function (parentValue, childValue) {
    var res = Object.create(parentValue);

    for (var key in childValue) {
      if (childValue.hasOwnProperty(key)) res[key] = childValue[key];
    }

    return res;
  };

  function mergeOptions(parent, child) {
    var options = {};

    function mergeField(key) {
      // 策略模式
      if (strats[key]) {
        return options[key] = strats[key](parent[key], child[key]);
      } // 非特有策略，正常合并


      if (isObject(parent[key]) && isObject(child[key])) {
        options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]);
      } else {
        if (child[key]) {
          options[key] = child[key];
        } else {
          options[key] = parent[key];
        }
      }
    }

    for (var parentKey in parent) {
      if (parent.hasOwnProperty(parentKey)) {
        mergeField(parentKey);
      }
    }

    for (var childKey in child) {
      if (child.hasOwnProperty(childKey)) {
        if (!parent.hasOwnProperty(childKey)) {
          mergeField(childKey);
        }
      }
    }

    return options;
  }

  function isObject(obj) {
    return _typeof(obj) === 'object' && obj != null;
  }

  function makeUp(str) {
    var map = {};
    str.split(',').forEach(function (tag) {
      return map[tag] = true;
    });
    return map;
  }

  function isReservedTag(tagName) {
    return !!makeUp('a,p,div,ul,li,span,input,h1,h2,h3,h4,h5,h6,button')[tagName];
  }

  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var item = value[i];
      item.__ob__ && item.__ob__.dep.depend();
      if (Array.isArray(item)) dependArray(item);
    }
  }

  function defineReactive(data, key, value) {
    var dataOb = observe(value); // 对结果，递归拦截

    var dep = new Dep();
    Object.defineProperty(data, key, {
      get: function get() {
        if (Dep.target) {
          dep.depend();

          if (dataOb) {
            dataOb.dep.depend();
            if (Array.isArray(value)) dependArray(value);
          }
        }

        return value;
      },
      set: function set(nValue) {
        if (nValue === value) return;
        observe(nValue);
        value = nValue;
        dep.notify();
      }
    });
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // value.__ob__ = this
      this.dep = new Dep();
      Object.defineProperty(value, '__ob__', {
        value: this,
        enumerable: false,
        configurable: false
      });

      if (Array.isArray(value)) {
        // value.__proto__ = arrayMethods
        Object.setPrototypeOf(value, arrayMethods);
        this.observeArray(value);
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          var val = data[key];
          defineReactive(data, key, val);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(arr) {
        for (var i = 0; i < arr.length; i++) {
          observe(arr[i]);
        }
      }
    }]);

    return Observer;
  }();

  function observe(data) {
    if (!isObject(data)) return;
    if (data.__ob__) return;
    return new Observer(data);
  }

  function initState(vm) {
    // 将所有的数据定义在vm上，后续更改时，触发试图的更新
    var opts = vm.$options;

    if (opts.data) {
      initData(vm);
    }
  }

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(nValue) {
        vm[source][key] = nValue;
      }
    });
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data;

    for (var dataKey in data) {
      proxy(vm, '_data', dataKey);
    } // 观测数据


    observe(data);
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配结尾的标签 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性

  var startTagClose = /^\s*(\/?)>/; // 匹配结束的标签 >

  function parseHTML(html) {
    // 生成ast语法树
    function createASTElement(tag, attrs) {
      return {
        tag: tag,
        type: 1,
        children: [],
        attrs: attrs,
        parent: null
      };
    }

    var root = null;
    var currentParent;
    var stack = [];

    function advance(n) {
      html = html.substring(n);
    }

    function start(tagName, attrs) {
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element;
      stack.push(element);
    }

    function end(tagName) {
      var element = stack.pop();
      currentParent = stack[stack.length - 1];

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }

    function chars(text) {
      text = text.trim();

      if (text) {
        currentParent.children.push({
          type: 3,
          text: text
        });
      }
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); // 查找属性 （开始标签开头和结尾中间的部分）

        var _end, attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5] || true
          });
        }

        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }

    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        // 开始标签
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        } // 结束标签


        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }

      var text = void 0;

      if (textEnd > 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text);
      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function genAttr(attrs) {
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var itemArr = item.split(':');
            obj[itemArr[0]] = itemArr[1];
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ": ").concat(JSON.stringify(attr.value), ",");
    }

    return "{ ".concat(str.slice(0, -1), "}");
  } // 区分元素还是文本


  function gen(child) {
    if (child.type === 1) {
      // 元素 递归调用
      return generate(child);
    } else {
      // 文本
      var t = child.text;

      if (defaultTagRE.test(t)) {
        // 插值表达式
        var tokens = [];
        var match;
        var index = 0;
        var lastIdx = defaultTagRE.lastIndex = 0;

        while (match = defaultTagRE.exec(t)) {
          index = match.index;

          if (index > lastIdx) {
            tokens.push(JSON.stringify(t.slice(lastIdx, index)));
          }

          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIdx = index + match[0].length;
        }

        if (lastIdx < t.length) tokens.push(JSON.stringify(t.slice(lastIdx)));
        return "_v(".concat(tokens.join('+'), ")");
      } else {
        // 普通文本
        return "_v(".concat(JSON.stringify(t), ")");
      }
    }
  }

  function genChildren(children) {
    if (children) {
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }
  } // ast -> str -> Function


  function generate(ast) {
    return "_c('".concat(ast.tag, "', ").concat(ast.attrs.length ? genAttr(ast.attrs) : undefined, " ").concat(ast.children ? ",".concat(genChildren(ast.children)) : '', ")");
  }

  function compileToFunctions(template) {
    var ast = parseHTML(template);
    var code = generate(ast);
    var render = "with(this) {\n    return ".concat(code, "\n  }"); // 字符串变函数

    return new Function(render);
  }

  var has = {};
  var queue = [];
  var waiting$1 = false;

  function flushSchedulerQueue() {
    for (var i = 0; i < queue.length; i++) {
      var watcher = queue[i];
      watcher.run();
    }

    queue = [];
    has = {};
    waiting$1 = false;
  }

  function queueWatcher(watcher) {
    // 更新时对watcher去重
    var id = watcher.id;

    if (has[id] == null) {
      queue.push(watcher);
      has[id] = true; // Promise.resolve().then(flushSchedulerQueue)

      if (!waiting$1) {
        nextTick(flushSchedulerQueue);
        waiting$1 = true;
      }
    }
  }

  var id$1 = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, fn, cb, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.getter = fn;
      this.cb = cb;
      this.options = options;
      this.id = id$1++;
      this.dep = [];
      this.depsId = new Set(); // 调用render方法，对模板中的数进行取值

      this.get();
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        pushTarget(this); // 对属性进行取值操作

        this.getter();
        popTarget();
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        // 记录watcher
        if (!this.depsId.has(dep.id)) {
          this.dep.push(dep);
          this.depsId.add(dep.id);
          dep.addSub(this);
        }
      }
    }, {
      key: "run",
      value: function run() {
        this.get();
      }
    }, {
      key: "update",
      value: function update() {
        queueWatcher(this);
      }
    }]);

    return Watcher;
  }();

  function patch(oldVNode, vNode) {
    if (!oldVNode) return createEl(vNode);
    var isRealElement = oldVNode.nodeType;

    if (isRealElement) {
      // 初次渲染
      var parentEl = oldVNode.parentNode;
      var el = createEl(vNode);
      parentEl.insertBefore(el, oldVNode.nextSibling);
      parentEl.removeChild(oldVNode);
      return el;
    }
  } // 判断是组件还是原始标签


  function createComponent(vNode) {
    var i = vNode.data;
    if ((i = i.hook) && (i = i.init)) i(vNode);

    if (vNode.componentInstance) {
      return true;
    }

    return false;
  } // 创建正式节点


  function createEl(vNode) {
    var vm = vNode.vm,
        tag = vNode.tag,
        children = vNode.children,
        key = vNode.key,
        data = vNode.data,
        txt = vNode.txt;

    if (typeof tag === 'string') {
      // 真实节点 或 组件
      if (createComponent(vNode)) return vNode.componentInstance.$el;
      vNode.el = document.createElement(tag);
      updateProperties(vNode);
      children.forEach(function (child) {
        vNode.el.appendChild(createEl(child));
      });
    } else {
      // 文本节点
      vNode.el = document.createTextNode(txt);
    }

    return vNode.el;
  } // 创建属性


  function updateProperties(vNode) {
    var props = vNode.data || {};
    var el = vNode.el;

    for (var propsKey in props) {
      if (props.hasOwnProperty(propsKey)) {
        var value = props[propsKey];

        if (propsKey === 'style') {
          for (var styleKey in props.style) {
            el.style[styleKey] = value[styleKey];
          }
        } else {
          el.setAttribute(propsKey, value);
        }
      }
    }
  }

  function mountComponent(vm) {
    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    }; // 默认通过watcher渲染


    new Watcher(vm, updateComponent, function () {}, true);
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vNode) {
      var vm = this; // vm.$el = patch(vm.$options.el, vNode)

      vm.$el = patch(vm.$el, vNode);
    };
  }

  function callHook(vm, hook) {
    var handle = vm.$options[hook];
    if (handle) handle.forEach(function (fn) {
      return fn.call(vm);
    });
  }

  function initMixin(Vue) {
    // Vue的初始化
    Vue.prototype._init = function (options) {
      var vm = this; // vm.$options = options
      // 合并选项（如：mixin生命周期，components等）

      vm.$options = mergeOptions(vm.constructor.options, options);
      callHook(vm, 'beforeCreate'); // 状态初始化

      initState(vm);
      callHook(vm, 'created');

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      el = el && document.querySelector(el);
      var vm = this;
      var options = vm.$options;
      vm.$el = el;

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        }

        options.render = compileToFunctions(template);
      } // 组件挂载


      mountComponent(vm);
    };

    Vue.prototype.$nextTick = nextTick;
  }

  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    if (isReservedTag(tag)) {
      return vNode(vm, tag, data, data.key, children, undefined);
    } // 组件 Ctor即Sub


    var Ctor = vm.$options.components[tag];
    return createComponent$1(vm, tag, data, data.key, children, Ctor);
  }

  function createTextVNode(vm, t) {
    return vNode(vm, undefined, undefined, undefined, undefined, t);
  }

  function createComponent$1(vm, tag, data, key, children, Ctor) {
    if (isObject(Ctor)) {
      Ctor = vm.$options._base.extend(Ctor);
    } // 组件添加生命周期


    data.hook = {
      init: function init(vNode) {
        var child = vNode.componentInstance = new vNode.componentOpts.Ctor({});
        child.$mount();
      }
    };
    return vNode(vm, "vue-component-".concat(tag + Ctor.cid), data, key, undefined, undefined, {
      Ctor: Ctor
    });
  }

  function vNode(vm, tag, data, key, children, txt, componentOpts) {
    return {
      vm: vm,
      tag: tag,
      data: data,
      key: key,
      children: children,
      txt: txt,
      componentOpts: componentOpts
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return createElement.apply(void 0, [this].concat(args));
    };

    Vue.prototype._v = function (text) {
      return createTextVNode(this, text);
    };

    Vue.prototype._s = function (val) {
      return val == null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var vNode = render.call(vm);
      return vNode;
    };
  }

  // 混合全局API

  function initGlobalAPI(Vue) {
    // 存放全局配置
    Vue.options = {};
    Vue.options._base = Vue;

    Vue.mixin = function (mixin) {
      // this是大Vue mergeOptions本质是个对象合并的方法
      this.options = mergeOptions(this.options, mixin);
      return this;
    }; // 存放定义的组件


    Vue.options.components = {};

    Vue.component = function (id, opts) {
      opts.name = opts.name || id;
      opts = Vue.options._base.extend(opts);
      this.options.components[id] = opts;
    };

    var cid = 0;

    Vue.extend = function (opts) {
      var Super = this;

      var Sub = function Sub(opts) {
        this._init(opts);
      }; // 子类继承父类


      Sub.cid = cid++;
      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.component = Super.component;
      Sub.options = mergeOptions(Super.options, opts);
      return Sub;
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);
  initGlobalAPI(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
