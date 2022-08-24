import { TKeyHandlerOptions, TSetStorageHandlerOptions } from "./types";

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
  return !!info.keys[key];
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
  return {
    //设置存储
    setStorage: (() => {
      if (optsStyle) {
        return (opts: TSetStorageHandlerOptions) => {
          const { key, data } = opts;
          platform.setStorageSync({
            key,
            data,
          });
        };
      } else {
        return (opts: TSetStorageHandlerOptions) => {
          const { key, data } = opts;
          platform.setStorageSync(key, data);
        };
      }
    })(),
    //获取存储
    getStorage: (() => {
      if (optsStyle) {
        return (opts: TKeyHandlerOptions) => {
          const { key } = opts;
          //支付宝，百度存在data包围
          const result = platform.getStorageSync({
            key,
          });
          return result.data;
        };
      } else {
        return (opts: TKeyHandlerOptions) => {
          const { key } = opts;
          return platform.getStorageSync(key);
        };
      }
    })(),
    removeStorage: (() => {
      if (optsStyle) {
        return (opts: TKeyHandlerOptions) => {
          const { key } = opts;
          return platform.removeStorageSync({
            key,
          });
        };
      } else {
        return (opts: TKeyHandlerOptions) => {
          const { key } = opts;
          return platform.removeStorageSync(key);
        };
      }
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
