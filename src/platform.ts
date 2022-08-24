//平台名
export enum PLATFORM_NAME {
  //微信
  WECHAT = `wx`,
  //uni-app
  UNI = `uni`,
  //支付宝
  ALIPAY = `my`,
  //百度
  BAIDU = `swan`,
  //字节跳动
  BYTEDANCE = `tt`,
  //钉钉跳动
  DINGDING = `dd`,
}

//检查环境
function checkPlatform(platform: any): boolean {
  return !!(platform && platform.setStorageSync && platform.getStorageSync);
}

//微信环境
export function weChatPlatform(): boolean {
  try {
    //@ts-ignore
    return checkPlatform(wx);
  } catch (e) {
    return false;
  }
}

//通用环境
export function uniPlatform(): boolean {
  try {
    //@ts-ignore
    return checkPlatform(uni);
  } catch (e) {
    return false;
  }
}

//支付宝环境
export function aliPayPlatform(): boolean {
  try {
    //@ts-ignore
    return checkPlatform(my);
  } catch (e) {
    return false;
  }
}

//百度小程序环境
export function baiduPlatform(): boolean {
  try {
    //@ts-ignore
    return checkPlatform(swan);
  } catch (e) {
    return false;
  }
}

//字节跳动小程序环境
export function byteDancePlatform(): boolean {
  try {
    //@ts-ignore
    return checkPlatform(tt);
  } catch (e) {
    return false;
  }
}

//字节跳动小程序环境
export function dingDingPlatform(): boolean {
  try {
    //@ts-ignore
    return checkPlatform(dd);
  } catch (e) {
    return false;
  }
}
