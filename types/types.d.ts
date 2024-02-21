export declare type TKey = string;
export declare type THook = Function | undefined;
export interface TKeyHandlerOptions {
    key: TKey;
}
export interface TStorageHandlerOptions extends TKeyHandlerOptions {
    expire?: number;
}
export interface TSetStorageHandlerOptions extends TStorageHandlerOptions {
    data?: any;
}
export interface TKeyOptions extends TStorageHandlerOptions {
    prefixName?: string;
    expireTimeName?: string;
}
export interface TConstructorOptionsHooks {
    set?: THook;
    get?: THook;
    remove?: THook;
}
export interface TConstructorOptions {
    hooks?: TConstructorOptionsHooks;
    prefixName?: string;
    expireTimeName?: string;
    keys?: TKeyOptions[];
}
export interface TStorageValue {
    type: string;
    data?: any;
}
