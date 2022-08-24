export type TKey = string;
export type THook = Function | undefined;

//可执行得处理配置
export interface TKeyHandlerOptions {
  key: TKey;
}

//可执行得处理配置
export interface TStorageHandlerOptions extends TKeyHandlerOptions {
  expire?: number;
}

//设置处理类型
export interface TSetStorageHandlerOptions extends TStorageHandlerOptions {
  data?: any;
}

//key配置相关
export interface TKeyOptions extends TStorageHandlerOptions {
  prefixName?: string;
  expireTimeName?: string;
}

//构造 钩子
export interface TConstructorOptionsHooks {
  set?: THook;
  get?: THook;
  remove?: THook;
}

//构造器配置信息
export interface TConstructorOptions {
  //钩子处理
  hooks?: TConstructorOptionsHooks;
  //前缀名
  prefixName?: string;
  //超时时间名
  expireTimeName?: string;
  //构造keys配置
  keys?: TKeyOptions[];
}
