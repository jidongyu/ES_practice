/*
 * @Description:
 * @Author: jidongyu
 * @Date: 2021-05-11 10:41:19
 * @LastEditTime: 2021-05-11 20:31:04
 * @LastEditors: jidongyu
 * @Reference:
 */
/*
1.对象内自带的set和get方法数据劫持

let obj = {
    $name: '伯远',
    get name(){
        // 获取name属性时触发
        console.log("这里要获取name");
        return this.$name;
    },
    set name(newName){
        // 设置name时触发
        console.log("这里设置name");
        this.$name = newName;
        console.log(newName);
    }
}

console.log(obj.name);	//获取name值 （触发get方法）
obj.name = "张艺兴";
//以上为对象赋值和获取数据的劫持方法
 */

/*
   2.通过Object.defineProperty设置对象属性实现数据劫持
   Object.defineProperty(obj, key, descriptor)
   - obj 要在其上定义属性的对象。
        - ley 要定义或修改的属性的名称。
        - descriptor 将被定义或修改的属性描述符。
    使用参数
      - value 该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。
      - writable 当且仅当该属性的writable为true时，value才能被赋值运算符改变。默认为 true。
      - configurable  配置是否允许被删除 true(默认值) 可以被删除，false 不能被删除
      - enumerable    配置是否允许被枚举 true(默认值) 可以被枚举，false 不能被枚举
    - 存取描述符
      - get 一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。当访问该属性时，该方法会被执行，方法执行时没有参数传入，但是会传入this对象（由于继承关系，这里的this并不一定是定义该属性的对象）。默认为 undefined。
      - set 一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。当属性值修改时，触发执行该方法。该方法将接受唯一参数，即该属性新的参数值。默认为 undefined。


let obj = {
    name: ''
};

Object.defineProperty(obj, "name", {
    configurable: true,
    enumerable: true,
    //重新给obj中的name赋值时触发
    set(newVal) {
        console.log("这个想要设置的新值", newVal);
    },

    //获取obj中的name值时触发
    get() {
        return '给你返回的名字22';
    }
})

console.log(obj.name); // 获取
obj.name = "张艺兴";  // 赋值
let a = obj.name; // 获取
console.log(a,'-----a-----');
*/


/*
 defineProperty 的默认值问题：
    情况一，该属性已经在对象定义过:
        configurable: true
        enumerable: true
        value: "hello"
        writable: true

    情况二，该属性在对象未定义过:
        configurable: false
        enumerable: false
        value: undefined
        writable: false

let obj = {
    name:"hello"
}
Object.defineProperty(obj,"name",{

});
console.log(Object.getOwnPropertyDescriptor(obj,"name"));
*/

/*
  Proxy.get 在对数据进行获取操作的时候，进行拦截
    let proxy = new Proxy(target, handler);
    target 是用Proxy包装的被代理对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）
    handler 是一个对象，其声明了代理target 的一些操作，其属性是当执行一个操作时定义代理的行为的函数。
*/
let data = {
    name: "mt",
    age: 8,
    price: 9000
};
let proxyData = new Proxy( data, {
    // 获取数据时的劫持行为
    get(target,key){
        if(key == 'price'){
            target[key] = target[key]*10;
        }
        return target[key]
    },
    // 赋值数据时的劫持事件
    set(target,key,newValue){
        console.log(newValue,'这里是想要赋予的新值');
        target[key] = newValue;
    },
    // 方法用来处理在判断是否有该属性时的劫持行为
    has(target,key){ //判断某个值存不存
        //return true 存在该属性，false 不存在该属性
     if(key == "gf"){
         return true;
     }
     return (key in target);
 }
} )
console.log(proxyData);
console.log(proxyData.price);
proxyData.gf = '测试';
// console.log(proxyData.gf);