import {
  TKey,
  TKeyHandlerOptions,
  TStorageHandlerOptions,
  TSetStorageHandlerOptions,
  TKeyOptions,
  TConstructorOptionsHooks,
  TConstructorOptions,
} from "./types";
import storage from "./storage";
import { hook } from "./hook";

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
      value: (data: any) =>
        this.setStorage({
          key,
          data,
          expire,
        }),
      writable,
    },
    [`get${storageMethodName}`]: {
      value: () =>
        this.getStorage({
          key,
        }),
      writable,
    },
    [`remove${storageMethodName}`]: {
      value: () =>
        this.removeStorage({
          key,
        }),
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
  removeExpireTimeStorage(opts: TKeyHandlerOptions): void {
    const { key } = opts;
    //删除超时时间
    this.removeStorage({
      key: getExpireTimeKey.call(this, {
        key,
      }),
    });
  }

  //生成对应的存储方法
  generate(opts: TKeyHandlerOptions): void {
    const { key = `` } = opts;
    //不设置不处理
    if (!key) return;
    //写到实例属性上调用
    definePropertiesPerform.call(this, opts);
  }
}
