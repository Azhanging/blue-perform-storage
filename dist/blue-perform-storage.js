/*!
 * 
 * blue-perform-storage.js 1.0.0
 * (c) 2016-2022 Blue
 * Released under the MIT License.
 * https://github.com/azhanging/blue-perform-storage
 * time:Sun, 07 Aug 2022 10:06:43 GMT
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["BluePerformStorage"] = factory();
	else
		root["BluePerformStorage"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./static";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//hook处理
function hook(ctx, fn, args) {
    if (args === void 0) { args = []; }
    if (typeof fn === "function") {
        return fn.apply(ctx, args);
    }
    return fn;
}
//是否存在key记录
function hasKey(platform, key) {
    var info = platform.getStorageInfoSync();
    return !!info.keys[key];
}
//微信小程序
function weChatMiniProgram() {
    return {
        setStorage: function (opts) {
            var key = opts.key, data = opts.data;
            //@ts-ignore
            wx.setStorageSync(key, data);
        },
        getStorage: function (opts) {
            var key = opts.key;
            //@ts-ignore
            return wx.getStorageSync(key);
        },
        removeStorage: function (opts) {
            var key = opts.key;
            //@ts-ignore
            wx.removeStorageSync(key);
        },
        //是否存在key值
        hasKey: function (key) {
            //@ts-ignore
            return hasKey(wx, key);
        },
    };
}
//uni 或者 支付宝
function uniOrAliPayMiniProgram() {
    //@ts-ignore
    var platform = my || uni;
    return {
        setStorage: platform.setStorageSync,
        getStorage: platform.getStorageSync,
        removeStorage: platform.removeStorageSync,
        //是否存在key值
        hasKey: function (key) {
            return hasKey(platform, key);
        },
    };
}
//浏览器
function browser() {
    var localStorage = window.localStorage;
    return {
        setStorage: function (opts) {
            var key = opts.key, data = opts.data;
            try {
                localStorage.setItem(key, JSON.stringify(data));
            }
            catch (e) {
                return localStorage.setItem(key, data);
            }
        },
        getStorage: function (opts) {
            var key = opts.key;
            try {
                return JSON.parse(localStorage.getItem(key));
            }
            catch (e) {
                return localStorage.getItem(key);
            }
        },
        removeStorage: function (opts) {
            var key = opts.key;
            return localStorage.removeItem(key);
        },
        //是否存在key值
        hasKey: function (key) {
            return key in localStorage;
        },
    };
}
function weChatGlobal() {
    try {
        //@ts-ignore
        return wx;
    }
    catch (e) {
        return false;
    }
}
function uniGlobal() {
    try {
        //@ts-ignore
        return uni;
    }
    catch (e) {
        return false;
    }
}
function aliPayGlobal() {
    try {
        //@ts-ignore
        return my;
    }
    catch (e) {
        return false;
    }
}
//兼容处理
var storage = (function () {
    if (weChatGlobal()) {
        //微信小程序
        return weChatMiniProgram();
    }
    else if (aliPayGlobal() || uniGlobal()) {
        //uni 或者 支付宝
        return uniOrAliPayMiniProgram();
    }
    else if (window && window.localStorage) {
        //浏览器
        return browser();
    }
    console.warn("\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301");
    return null;
})();
//存储的方法名
function genStorageMethodName(key) {
    //第一位符
    var firstChar = key.toLocaleUpperCase()[0];
    //转化MethodsKey
    return "" + firstChar + key.substring(1, key.length);
}
//初始化设置对应keys配置
function init() {
    var _this = this;
    this.keys.forEach(function (item) {
        var key;
        var expire = 0;
        //初始化配置
        if (typeof item === "string") {
            key = item;
        }
        else {
            key = item.key;
            expire = item.expire;
        }
        //删除过期的的key
        removeExpireStorage.call(_this, {
            key: key,
        });
        //生成对应的存储方法
        _this.generate({
            key: key,
            //@ts-ignore
            expire: expire,
        });
    });
}
//删除过期的的key
function removeExpireStorage(opts) {
    var key = opts.key;
    //实际过期的key 这里会带上前缀扩展
    var prefixNameExpireTimeKey = getExpireTimeKey.call(this, {
        key: key,
        prefixName: this.prefixName,
    });
    //检查是否是过期
    if (!storage.hasKey(prefixNameExpireTimeKey))
        return;
    var expireTime = this.getExpireTime({
        key: key,
    });
    //超时处理
    if (expireTime && expireTime < +new Date()) {
        removeStorage.call(this, {
            key: key,
        });
    }
}
//删除存储
function removeStorage(opts) {
    var key = opts.key;
    //删除超时时间
    this.removeExpireTimeStorage(opts);
    //删除实际记录
    this.removeStorage({
        key: key,
    });
}
//获取超时key
function getExpireTimeKey(opts) {
    var key = opts.key, _a = opts.prefixName, prefixName = _a === void 0 ? "" : _a;
    var currentKey = "" + key + this.expireTimeName;
    if (prefixName)
        return getKey.call(this, currentKey);
    return currentKey;
}
//过期处理
function setStorageExpire(opts) {
    var key = opts.key, expire = opts.expire;
    if (!expire)
        return;
    //设置超时时间
    this.setStorage({
        key: getExpireTimeKey.call(this, {
            key: key,
        }),
        data: +new Date() + expire,
    });
}
//生成key和前缀有关
function getKey(key) {
    //前缀
    var currentPrefix = hook(null, this.prefixName);
    //设置前缀key
    return "" + (currentPrefix || "") + key;
}
//设置选项中前缀key
function setOptionsPrefixKey(opts) {
    opts.key = getKey.call(this, opts.key);
}
//设置可执行的storage配置
function definePropertiesPerform(opts) {
    var _a;
    var _this = this;
    var key = opts.key, _b = opts.expire, expire = _b === void 0 ? 0 : _b;
    //转化MethodsName
    var storageMethodName = genStorageMethodName(key);
    //不可重写
    var writable = false;
    Object.defineProperties(this, (_a = {},
        //绑定到实例上
        _a["set" + storageMethodName] = {
            value: function (data) {
                return _this.setStorage({
                    key: key,
                    data: data,
                    expire: expire,
                });
            },
            writable: writable,
        },
        _a["get" + storageMethodName] = {
            value: function () {
                return _this.getStorage({
                    key: key,
                });
            },
            writable: writable,
        },
        _a["remove" + storageMethodName] = {
            value: function () {
                return _this.removeStorage({
                    key: key,
                });
            },
            writable: writable,
        },
        _a));
}
//实际类
var BluePerformStorage = /** @class */ (function () {
    function BluePerformStorage(opts) {
        if (opts === void 0) { opts = {}; }
        this.keys = [];
        //设置配置
        this.options = opts || {};
        this.hooks = opts.hooks || {};
        this.prefixName = opts.prefixName || "";
        this.expireTimeName = opts.expireTimeName || "ExpireTime";
        //默认配置keys
        this.keys = opts.keys || [];
        //初始化
        init.call(this);
    }
    //通用处理
    BluePerformStorage.prototype.setStorage = function (opts) {
        var key = opts.key;
        //钩子
        hook(this, this.hooks.set, [
            {
                key: key,
            },
        ]);
        //过期处理
        setStorageExpire.call(this, opts);
        //重写key 针对前缀生成
        setOptionsPrefixKey.call(this, opts);
        return storage.setStorage(opts);
    };
    //获取storage
    BluePerformStorage.prototype.getStorage = function (opts) {
        var key = opts.key;
        //删除过期的的key
        removeExpireStorage.call(this, {
            key: key,
        });
        //重写key 针对前缀生成
        setOptionsPrefixKey.call(this, opts);
        var data = storage.getStorage(opts);
        //钩子
        hook(this, this.hooks.get, [
            {
                key: key,
                data: data,
            },
        ]);
        return data;
    };
    //删除storage
    BluePerformStorage.prototype.removeStorage = function (opts) {
        var key = opts.key;
        //重写key 针对前缀生成
        setOptionsPrefixKey.call(this, opts);
        //钩子
        hook(this, this.hooks.remove, [
            {
                key: key,
            },
        ]);
        return storage.removeStorage(opts);
    };
    //获取超时时间
    BluePerformStorage.prototype.getExpireTime = function (opts) {
        var key = opts.key;
        //获取得key的超时时间
        return (this.getStorage({
            key: getExpireTimeKey.call(this, {
                key: key,
            }),
        }) || 0);
    };
    //删除过期
    BluePerformStorage.prototype.removeExpireTimeStorage = function (opts) {
        var key = opts.key;
        //删除超时时间
        this.removeStorage({
            key: getExpireTimeKey.call(this, {
                key: key,
            }),
        });
    };
    //生成对应的存储方法
    BluePerformStorage.prototype.generate = function (opts) {
        var _a = opts.key, key = _a === void 0 ? "" : _a;
        //不设置不处理
        if (!key)
            return;
        //写到实例属性上调用
        definePropertiesPerform.call(this, opts);
    };
    return BluePerformStorage;
}());
/* harmony default export */ __webpack_exports__["default"] = (BluePerformStorage);


/***/ })
/******/ ])["default"];
});
//# sourceMappingURL=blue-perform-storage.js.map