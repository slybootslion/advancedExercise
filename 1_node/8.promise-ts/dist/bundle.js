'use strict';

var Promise = /** @class */ (function () {
    function Promise(executor) {
        var _this = this;
        this.status = "PENDING" /* pending */;
        this.value = undefined;
        this.reason = undefined;
        this.onResolveCallback = [];
        this.onRejectCallback = [];
        var resolve = function (value) {
            if (_this.status === "PENDING" /* pending */) {
                _this.status = "FULFILLED" /* fulfilled */;
                _this.value = value;
                _this.onResolveCallback.forEach(function (fun) { return fun(); });
            }
        };
        var reject = function (reason) {
            if (_this.status === "PENDING" /* pending */) {
                _this.status = "REJECTED" /* rejected */;
                _this.reason = reason;
                _this.onRejectCallback.forEach(function (fun) { return fun(); });
            }
        };
        try {
            executor(resolve, reject);
        }
        catch (err) {
            reject(err);
        }
    }
    Promise.prototype.then = function (onFulfilled, onRejected) {
        var _this = this;
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (val) { return val; };
        onRejected = typeof onRejected === 'function' ? onRejected : function (err) {
            throw err;
        };
        // 每次调用then返回一个新的promise
        var promise2 = new Promise(function (resolve, reject) {
            if (_this.status === "FULFILLED" /* fulfilled */) {
                setTimeout(function () {
                    try {
                        var x = onFulfilled && onFulfilled(_this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    }
                    catch (err) {
                        reject(err);
                    }
                }, 0);
            }
            if (_this.status === "REJECTED" /* rejected */) {
                setTimeout(function () {
                    try {
                        var x = onRejected && onRejected(_this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    }
                    catch (err) {
                        reject(err);
                    }
                }, 0);
            }
            if (_this.status === "PENDING" /* pending */) {
                _this.onResolveCallback.push(function () {
                    setTimeout(function () {
                        try {
                            var x = onFulfilled && onFulfilled(_this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                        catch (err) {
                            reject(err);
                        }
                    }, 0);
                });
                _this.onRejectCallback.push(function () {
                    setTimeout(function () {
                        try {
                            var x = onRejected && onRejected(_this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                        catch (err) {
                            reject(err);
                        }
                    }, 0);
                });
            }
        });
        return promise2;
    };
    return Promise;
}());
function resolvePromise(promise2, x, resolve, reject) {
    if (x == promise2) {
        return reject(new TypeError('不能自己返回自己 chaining cycle detected for promise'));
    }
    if ((typeof x === 'object' && typeof x !== null) || typeof x === 'function') {
        var called_1 = false;
        try {
            var then = x.then;
            if (typeof then === 'function') {
                then.call(x, function (y) {
                    if (called_1)
                        return;
                    called_1 = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, function (r) {
                    if (called_1)
                        return;
                    called_1 = true;
                    reject(r);
                });
            }
            else {
                resolve(x);
            }
        }
        catch (e) {
            reject(e);
        }
    }
    else {
        resolve(x);
    }
}
// 测试用
Promise.deferred = function () {
    var dfd = {};
    dfd.promise = new Promise(function (resolve, reject) {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
};

module.exports = Promise;
//# sourceMappingURL=bundle.js.map
