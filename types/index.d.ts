declare type TKey = string;
declare type THook = Function | undefined;
interface TKeyHandlerOptions {
    key: TKey;
}
interface TStorageHandlerOptions extends TKeyHandlerOptions {
    expire?: number;
}
interface TSetStorageHandlerOptions extends TStorageHandlerOptions {
    data?: any;
}
interface TKeyOptions extends TStorageHandlerOptions {
    prefixName?: string;
    expireTimeName?: string;
}
interface TConstructorOptionsHooks {
    set?: THook;
    get?: THook;
    remove?: THook;
}
interface TConstructorOptions {
    hooks?: TConstructorOptionsHooks;
    prefixName?: string;
    expireTimeName?: string;
    keys?: TKeyOptions[];
}
export default class BluePerformStorage {
    options?: TConstructorOptions;
    hooks: TConstructorOptionsHooks;
    prefixName?: string | Function;
    expireTimeName?: string;
    keys: TKeyOptions[];
    constructor(opts?: TConstructorOptions);
    setStorage(opts: TSetStorageHandlerOptions): any;
    getStorage(opts: TKeyHandlerOptions): any;
    removeStorage(opts: TKeyHandlerOptions): any;
    getExpireTime(opts: TKeyHandlerOptions): number;
    removeExpireTimeStorage(opts: TKeyHandlerOptions): void;
    generate(opts: TKeyHandlerOptions): void;
}
export {};
