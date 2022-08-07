type TKey = string;
type THook = Function | undefined;

//可执行得处理配置
interface TKeyHandlerOptions {
  key: TKey;
}

//可执行得处理配置
interface TStorageHandlerOptions extends TKeyHandlerOptions {
  expire?: number;
}

//设置处理类型
interface TSetStorageHandlerOptions extends TStorageHandlerOptions {
  data?: any;
}

//key配置相关
interface TKeyOptions extends TStorageHandlerOptions {
  prefixName?: string;
  expireTimeName?: string;
}

//构造 狗子
interface TConstructorOptionsHooks {
  set?: THook;
  get?: THook;
  remove?: THook;
}

//构造器配置信息
interface TConstructorOptions {
  //钩子处理
  hooks?: TConstructorOptionsHooks;
  //前缀名
  prefixName?: string;
  //超时时间名
  expireTimeName?: string;
  //构造keys配置
  keys?: TKeyOptions[];
}

//hook处理
function hook(ctx: any, fn: any, args: any[] = []) {
  if (typeof fn === `function`) {
    return fn.apply(ctx, args);
  }
  return fn;
}

//是否存在key记录
function hasKey(platform: any, key: string): boolean {
  const info = platform.getStorageInfoSync();
  return !!info.keys[key];
}

//微信小程序
function weChatMiniProgram() {
  return {
    setStorage(opts: TSetStorageHandlerOptions) {
      const { key, data } = opts;
      //@ts-ignore
      wx.setStorageSync(key, data);
    },
    getStorage(opts: TKeyHandlerOptions): any {
      const { key } = opts;
      //@ts-ignore
      return wx.getStorageSync(key);
    },
    removeStorage(opts: TKeyHandlerOptions) {
      const { key } = opts;
      //@ts-ignore
      wx.removeStorageSync(key);
    },
    //是否存在key值
    hasKey(key: string): boolean {
      //@ts-ignore
      return hasKey(wx, key);
    },
  };
}

//uni 或者 支付宝
function uniOrAliPayMiniProgram() {
  //@ts-ignore
  const platform = my || uni;
  return {
    setStorage: platform.setStorageSync,
    getStorage: platform.getStorageSync,
    removeStorage: platform.removeStorageSync,
    //是否存在key值
    hasKey(key: string): boolean {
      return hasKey(platform, key);
    },
  };
}

//浏览器
function browser() {
  const { localStorage } = window;
  return {
    setStorage(opts: TSetStorageHandlerOptions) {
      const { key, data } = opts;
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        return localStorage.setItem(key, data);
      }
    },
    getStorage(opts: TKeyHandlerOptions) {
      const { key } = opts;
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch (e) {
        return localStorage.getItem(key);
      }
    },
    removeStorage(opts: TKeyHandlerOptions) {
      const { key } = opts;
      return localStorage.removeItem(key);
    },
    //是否存在key值
    hasKey(key: string) {
      return key in localStorage;
    },
  };
}

function weChatGlobal(): any {
  try {
    //@ts-ignore
    return wx;
  } catch (e) {
    return false;
  }
}

function uniGlobal(): any {
  try {
    //@ts-ignore
    return uni;
  } catch (e) {
    return false;
  }
}

function aliPayGlobal(): any {
  try {
    //@ts-ignore
    return my;
  } catch (e) {
    return false;
  }
}

//兼容处理
const storage = (() => {
  if (weChatGlobal()) {
    //微信小程序
    return weChatMiniProgram();
  } else if (aliPayGlobal() || uniGlobal()) {
    //uni 或者 支付宝
    return uniOrAliPayMiniProgram();
  } else if (window && window.localStorage) {
    //浏览器
    return browser();
  }
  console.warn(`当前环境不支持`);
  return null;
})();

//存储的方法名
function genStorageMethodName(key: TKey): string {
  //第一位符
  const firstChar = key.toLocaleUpperCase()[0];
  //转化MethodsKey
  return `${firstChar}${key.substring(1, key.length)}`;
}

//初始化设置对应keys配置
function init(this: BluePerformStorage) {
  this.keys.forEach((item: TKeyOptions | string) => {
    let key: TKey;
    let expire: number = 0;
    //初始化配置
    if (typeof item === `string`) {
      key = item;
    } else {
      key = item.key;
      expire = item.expire;
    }
    //删除过期的的key
    removeExpireStorage.call(this, {
      key,
    });
    //生成对应的存储方法
    this.generate({
      key,
      //@ts-ignore
      expire,
    });
  });
}

//删除过期的的key
function removeExpireStorage(
  this: BluePerformStorage,
  opts: TKeyHandlerOptions
) {
  const { key } = opts;
  //实际过期的key 这里会带上前缀扩展
  const prefixNameExpireTimeKey = getExpireTimeKey.call(this, {
    key,
    prefixName: this.prefixName,
  });
  //检查是否是过期
  if (!storage.hasKey(prefixNameExpireTimeKey)) return;
  const expireTime = this.getExpireTime({
    key,
  });
  //超时处理
  if (expireTime && expireTime < +new Date()) {
    removeStorage.call(this, {
      key,
    });
  }
}

//删除存储
function removeStorage(this: BluePerformStorage, opts: TKeyOptions) {
  const { key } = opts;
  //删除超时时间
  this.removeExpireTimeStorage(opts);
  //删除实际记录
  this.removeStorage({
    key,
  });
}

//获取超时key
function getExpireTimeKey(this: BluePerformStorage, opts: TKeyOptions) {
  const { key, prefixName = `` } = opts;
  const currentKey = `${key}${this.expireTimeName}`;
  if (prefixName) return getKey.call(this, currentKey);
  return currentKey;
}

//过期处理
function setStorageExpire(this: BluePerformStorage, opts: TKeyOptions) {
  const { key, expire } = opts;
  if (!expire) return;
  //设置超时时间
  this.setStorage({
    key: getExpireTimeKey.call(this, {
      key,
    }),
    data: +new Date() + expire,
  });
}

//生成key和前缀有关
function getKey(this: BluePerformStorage, key: string): string {
  //前缀
  const currentPrefix = hook(null, this.prefixName);
  //设置前缀key
  return `${currentPrefix || ``}${key}`;
}

//设置选项中前缀key
function setOptionsPrefixKey(opts: TKeyOptions) {
  opts.key = getKey.call(this, opts.key);
}

//设置可执行的storage配置
function definePropertiesPerform(
  this: BluePerformStorage,
  opts: TStorageHandlerOptions
) {
  const { key, expire = 0 } = opts;
  //转化MethodsName
  const storageMethodName = genStorageMethodName(key);
  //不可重写
  const writable = false;
  Object.defineProperties(this, {
    //绑定到实例上
    [`set${storageMethodName}`]: {
      value: (data) => {
        return this.setStorage({
          key,
          data,
          expire,
        });
      },
      writable,
    },
    [`get${storageMethodName}`]: {
      value: () => {
        return this.getStorage({
          key,
        });
      },
      writable,
    },
    [`remove${storageMethodName}`]: {
      value: () => {
        return this.removeStorage({
          key,
        });
      },
      writable,
    },
  });
}

//实际类
export default class BluePerformStorage {
  options?: TConstructorOptions;
  hooks: TConstructorOptionsHooks;
  prefixName?: string | Function;
  expireTimeName?: string;
  keys: TKeyOptions[] = [];
  constructor(opts: TConstructorOptions = {}) {
    //设置配置
    this.options = opts || {};
    this.hooks = opts.hooks || {};
    this.prefixName = opts.prefixName || ``;
    this.expireTimeName = opts.expireTimeName || `ExpireTime`;
    //默认配置keys
    this.keys = opts.keys || [];
    //初始化
    init.call(this);
  }

  //通用处理
  setStorage(opts: TSetStorageHandlerOptions) {
    const { key } = opts;
    //钩子
    hook(this, this.hooks.set, [
      {
        key,
      },
    ]);
    //过期处理
    setStorageExpire.call(this, opts);
    //重写key 针对前缀生成
    setOptionsPrefixKey.call(this, opts);
    return storage.setStorage(opts);
  }

  //获取storage
  getStorage(opts: TKeyHandlerOptions): any {
    const { key } = opts;
    //删除过期的的key
    removeExpireStorage.call(this, {
      key,
    });
    //重写key 针对前缀生成
    setOptionsPrefixKey.call(this, opts);
    const data = storage.getStorage(opts);
    //钩子
    hook(this, this.hooks.get, [
      {
        key,
        data,
      },
    ]);
    return data;
  }

  //删除storage
  removeStorage(opts: TKeyHandlerOptions) {
    const { key } = opts;
    //重写key 针对前缀生成
    setOptionsPrefixKey.call(this, opts);
    //钩子
    hook(this, this.hooks.remove, [
      {
        key,
      },
    ]);
    return storage.removeStorage(opts);
  }

  //获取超时时间
  getExpireTime(opts: TKeyHandlerOptions): number {
    const { key } = opts;
    //获取得key的超时时间
    return (
      this.getStorage({
        key: getExpireTimeKey.call(this, {
          key,
        }),
      }) || 0
    );
  }

  //删除过期
  removeExpireTimeStorage(opts: TKeyHandlerOptions) {
    const { key } = opts;
    //删除超时时间
    this.removeStorage({
      key: getExpireTimeKey.call(this, {
        key,
      }),
    });
  }

  //生成对应的存储方法
  generate(opts: TKeyHandlerOptions) {
    const { key = `` } = opts;
    //不设置不处理
    if (!key) return;
    //写到实例属性上调用
    definePropertiesPerform.call(this, opts);
  }
}
