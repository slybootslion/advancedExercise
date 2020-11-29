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

      console.log('数组变化');
      return result;
    };
  });

  function defineReactive(data, key, value) {
    observe(value); // 对结果，递归拦截

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(nValue) {
        if (nValue === value) return;
        observe(nValue);
        value = nValue;
      }
    });
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

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
    if (_typeof(data) !== 'object' || data == null) return;
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

  function initMixin(Vue) {
    // Vue的初始化
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      initState(vm);
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
