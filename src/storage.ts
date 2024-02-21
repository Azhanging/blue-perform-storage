import type {
  TKeyHandlerOptions,
  TSetStorageHandlerOptions,
  TStorageValue,
} from "./types";

import {
  PLATFORM_NAME,
  weChatPlatform,
  uniPlatform,
  aliPayPlatform,
  baiduPlatform,
  byteDancePlatform,
  dingDingPlatform,
} from "./platform";

//是否存在key记录
function hasKey(platform: any, key: string): boolean {
  const info = platform.getStorageInfoSync();
  return !!info.keys.includes(key);
}

//方法处理
function storageMethods(opts: { platform: any; platformName: PLATFORM_NAME }) {
  const { platform, platformName } = opts;
  //选项式风格 支付宝和百度为选项式风格
  const optsStyle = [
    PLATFORM_NAME.ALIPAY,
    PLATFORM_NAME.BAIDU,
    PLATFORM_NAME.DINGDING,
  ].includes(platformName);
  const { setStorageSync, getStorageSync, removeStorageSync } = platform;
  return {
    //设置存储
    setStorage: (() => {
      return (opts: TSetStorageHandlerOptions) => {
        const { key, data } = opts;
        if (optsStyle) {
          setStorageSync({
            key,
            data,
          });
        } else {
          setStorageSync(key, data);
        }
      };
    })(),
    //获取存储
    getStorage: (() => {
      return (opts: TKeyHandlerOptions) => {
        const { key } = opts;
        if (optsStyle) {
          //支付宝，百度存在data包围
          const result = getStorageSync({
            key,
          });
          return result.data;
        } else {
          return getStorageSync(key);
        }
      };
    })(),
    //删除数据
    removeStorage: (() => {
      return (opts: TKeyHandlerOptions) => {
        const { key } = opts;
        if (optsStyle) {
          return removeStorageSync({
            key,
          });
        } else {
          return removeStorageSync(key);
        }
      };
    })(),
    //是否存在key值
    hasKey(key: string): boolean {
      //@ts-ignore
      return hasKey(platform, key);
    },
  };
}

//浏览器
function browser() {
  const { localStorage } = window;
  //可存储的数据类型
  const dataTypes = [`object`, `string`, `number`, `boolean`, `undefined`];
  return {
    setStorage(opts: TSetStorageHandlerOptions) {
      const { key, data } = opts;
      const type: string = typeof data;
      //写入的值
      const value: TStorageValue = (() => {
        //属于正常数据类型
        if (dataTypes.includes(type)) {
          return {
            type,
            data,
          };
        } else {
          return {
            type,
          };
        }
      })();
      //写入解析好的数据
      localStorage.setItem(key, JSON.stringify(value));
    },
    getStorage(opts: TKeyHandlerOptions) {
      const { key } = opts;
      try {
        const storageValue = JSON.parse(localStorage.getItem(key));
        const { data, type } = storageValue;
        //undefined提供会undefined处理
        if (type === `undefined`) return ``;
        //如果存在值
        if (data !== undefined) {
          return data;
        }
        return data.toString();
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

//兼容处理
const storage = (() => {
  if (uniPlatform()) {
    //uni-app
    return storageMethods({
      //@ts-ignore
      platform: uni,
      platformName: PLATFORM_NAME.UNI,
    });
  } else if (aliPayPlatform()) {
    //支付宝小程序
    return storageMethods({
      //@ts-ignore
      platform: my,
      platformName: PLATFORM_NAME.ALIPAY,
    });
  } else if (dingDingPlatform()) {
    //钉钉
    return storageMethods({
      //@ts-ignore
      platform: dd,
      platformName: PLATFORM_NAME.DINGDING,
    });
  } else if (weChatPlatform()) {
    //微信小程序
    return storageMethods({
      //@ts-ignore
      platform: wx,
      platformName: PLATFORM_NAME.WECHAT,
    });
  } else if (baiduPlatform()) {
    //微信小程序
    return storageMethods({
      //@ts-ignore
      platform: swan,
      platformName: PLATFORM_NAME.BAIDU,
    });
  } else if (byteDancePlatform()) {
    //字节跳动
    return storageMethods({
      //@ts-ignore
      platform: tt,
      platformName: PLATFORM_NAME.BYTEDANCE,
    });
  } else if (window && window.localStorage) {
    //浏览器
    return browser();
  }
  console.warn(`当前环境不支持`);
  return null;
})();

export default storage;
