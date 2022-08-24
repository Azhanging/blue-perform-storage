import { TKeyHandlerOptions, TSetStorageHandlerOptions, TKeyOptions, TConstructorOptionsHooks, TConstructorOptions } from "./types";
export default class BluePerformStorage {
    options?: TConstructorOptions;
    hooks: TConstructorOptionsHooks;
    prefixName?: string | Function;
    expireTimeName?: string;
    keys: TKeyOptions[];
    constructor(opts?: TConstructorOptions);
    setStorage(opts: TSetStorageHandlerOptions): void;
    getStorage(opts: TKeyHandlerOptions): any;
    removeStorage(opts: TKeyHandlerOptions): any;
    getExpireTime(opts: TKeyHandlerOptions): number;
    removeExpireTimeStorage(opts: TKeyHandlerOptions): void;
    generate(opts: TKeyHandlerOptions): void;
}
