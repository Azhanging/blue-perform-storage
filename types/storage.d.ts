import { TKeyHandlerOptions, TSetStorageHandlerOptions } from "./types";
declare const storage: {
    setStorage: (opts: TSetStorageHandlerOptions) => void;
    getStorage: (opts: TKeyHandlerOptions) => any;
    removeStorage: (opts: TKeyHandlerOptions) => any;
    hasKey(key: string): boolean;
};
export default storage;
