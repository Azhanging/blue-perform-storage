# [blue-perform-storage](https://github.com/azhanging/blueperform-storage)

## 可执行 storage 存储，对于 localStorage 的管理，如果业务中存在多出分散使用，会造成实际增加使用成本和维护成本，对此衍生出对 storage 的可执行处理

---

## 开始使用 - PS: 当前的包支持在(微信|支付宝|uni-app|钉钉|字节跳动|百度)小程序，以及浏览器环境进行使用 （所有的操作为 Sync 的处理）

对于原有 localStorage 的使用，如

```javascript
const localKey1 = `key1`;
const localKey2 = `key2`;
localStorage.setItem(localKey1, {
  dataValue: 1,
});
localStorage.getItem(localKey1);
localStorage.setItem(localKey2, {
  dataValue: 2,
});
localStorage.getItem(localKey2);
```

实际业务中会使用到多次 localKey，对于 key 的而管理成本是非常大的，而在当前的包中可以解决这个问题

```javascript
import PerformStorage from "blue-perform-storage";
const perform = new PerformStorage({
  keys: [`key1`, `key2`],
});
perform.setKey1({
  dataValue: 1,
});
//return {dataValue:1}
perform.getKey1();
perform.removeKey1();
perform.setKey2({
  dataValue: 2,
});
//return {dataValue:2}
perform.getKey2();
perform.removeKey2();
```

上面的事例可以看出，实际 key 会被注册到 PerformStorage 实例中，会通过 setKey1,getKey1 方法进行处理，减少对 localStorage 的 key 的多度依赖使用，也很好的管理对应的 keys；

---

## 前缀名

对于一些项目部署，实际都在关联到一个域名下的，而在这些域名下可能会存在 localStorage 的冲突，这时候就需要用到 prefix 的处理

```javascript
import PerformStorage from "blue-perform-storage";
const perform = new PerformStorage({
  keys: [`key1`, `key2`],
  //前缀名 默认为空
  prefixName: `prefix-name-`,
});
// 实际在storage中的存储key为 prefix-name-key1
perform.setKey1({
  dataValue: 1,
});
// 实际在storage中的存储key为 prefix-name-key1
perform.getKey1();
```

---

## 过期场景

对于实际业务中 localStorage 是存在有效期的，这里为了可以更好的处理时间上的问题，当前包加入的有效期的管理

```javascript
import PerformStorage from "blue-perform-storage";
const perform = new PerformStorage({
  keys: [
    `key1`,
    {
      key: `key2`,
      //30秒后过期
      expire: 30000,
    },
  ],
  //前缀名 默认为空
  prefixName: `prefix-name-`,
  //可配置过期的key name 默认ExpireTime
  //实际的过期存储key为 prefix-name-key1ExpireTime: +new Date + expire
  expireTimeName: `ExpireTime`,
});
```

过期的记录会在两种场景下会被删除：

- 对于当前实例化时，会检查 keys 中的所有有效期，如果存在有效期，这里的场景将会被删除
- 对于 getStorage 的时候，会检查当前的有效期，如果是失效情况，会优先删除，实际获取为 null
- 通过 removeStorage 删除，或者通过实例方法删除 key

删除时，实际的 key 和过期 key 会被一并删除

---

## 不在 keys 中进行配置,可以通过 setStorage 进行处理，这里将不会生成可执行的实例方法

```javascript
import PerformStorage from "blue-perform-storage";
const perform = new PerformStorage({
  //前缀名 默认为空
  prefixName: `prefix-name-`,
});
//这里的key1依旧是被prefixName影响 这里的配置内容不会被写入到perform的形态，只能通过getStorage的方式获取到
perform.setStorage({
  key: `key1`,
  data: {
    dataValue: 1,
  },
  expire: 3000,
});
//只能通过这种形式进行获取
perform.getStorage({
  key: `key1`,
});
```

如需生成实例方法调用，可以使用 generate 方法进行生成

```javascript
import PerformStorage from "blue-perform-storage";
const perform = new PerformStorage({
  //前缀名 默认为空
  prefixName: `prefix-name-`,
});
perform.generate({
  key: `key1`,
  expire: 3000,
});
perform.setKey1({
  dataValue: 1,
});
perform.getKey1();
```

## Hooks

对于当前的 perform 实例，这里每次进行 set,get,remove 都会有相关的 hook 触发

```javascript
import PerformStorage from "blue-perform-storage";
const perform = new PerformStorage({
  keys: [`key1`],
  //前缀名 默认为空
  prefixName: `prefix-name-`,
  hooks: {
    get(res)
      //下列的get的调用，将会触发到当前钩子
      console.log(res.key, res.data);
    },
    set(res) {
      //下列的set的调用，将会触发到当前钩子
      console.log(res.key);
    },
    remove(res) {
      //下列的remove的调用，将会触发到当前钩子
      console.log(res.key);
    },
  },
});
perform.setKey1({
  data: 1,
});
perform.getKey1();
perform.removeKey1();
```

## 原型方法

setStorage({key:string;data?:any;expire?:number})：设置 storage 值

getStorage({key:string;})：获取 storage 值

removeStorage({key:string;})删除 storage 值，同时也会删除相关 key 的过期时间的 storage 相关内容

get(KeyName)({key:string;}): 功能同上

set(KeyName)({key:string;data:any;}): 功能同上

remove(KeyName)({key:string;}): 功能同上

getExpireTime({key:string}) 获取 key 的过期时间

removeExpireTimeStorage({key:string})：删除过期时间 storage

generate({key:string;expire:number})：生成 key 调用的实例方法
