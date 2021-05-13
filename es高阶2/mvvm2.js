/*
 * @Description: 
 * @Author: jidongyu
 * @Date: 2021-05-13 23:20:47
 * @LastEditTime: 2021-05-13 23:24:59
 * @LastEditors: jidongyu
 * @Reference: 
 */
class KVue extends EventTarget {
    constructor(options) {
        super();
        this.$options = options;
        this.compile();
        this.observer(this.$options.data);
    }
    observer(data) {
        let _this = this;
        this.$options.data = new Proxy( data, {
            get(target,key){
                return target[key];
            },
            set(target,key,value){
                // 设置新数据拦截时，创建数据的相关事件，并进行触发，事件的监听绑定是在元素编译处理过程中实现的
                let ev = new CustomEvent(key, {
                    detail: value
                });
                _this.dispatchEvent(ev);
                target[key] = value;
                return true;
            }
        } )
    }
    // defineReact(data, key, value) {
    //     let _this = this;
    //     Object.defineProperty(data, key, {
    //         configurable: true,
    //         enumerable: true,
    //         get() {
    //             console.log("get 拦截");
    //             return value
    //         },
    //         set(newValue) {
    //             console.log("这里是新值，", newValue);
                
    //             // 设置新数据拦截时，创建数据的相关事件，并进行触发，事件的监听绑定是在元素编译处理过程中实现的
    //             let ev = new CustomEvent(key, {
    //                 detail: newValue
    //             });
    //             _this.dispatchEvent(ev);
    //             value = newValue;
    //         }
    //     })
    // }
    compile() {
        let el = document.querySelector(this.$options.el);
        this.compileNode(el);
    }
    compileNode(el) {
        // 1.拿到元素标签中的子元素
        let childNodes = el.childNodes;
        console.log(childNodes);
        // 循环遍历获取的子元素，判断子元素类型
        childNodes.forEach(node => {
            if (node.nodeType == 1) {
                // 获取元素属性
                let attrs = node.attributes;
                console.log("attrs：",attrs);
                [...attrs].map( attr => {
                    let attrName = attr.name;
                    let attrValue = attr.value;
                    if(attrName.indexOf("v-")==0){
                        attrName = attrName.substr(2);
                        if(attrName == "html"){
                            // 如果是v-html就用innerHTML填充内容
                            node.innerHTML = this.$options.data[attrValue];
                        }else if( attrName == "model" ){
                            node.value = this.$options.data[attrValue];
                            node.addEventListener("input", e => {
                                this.$options.data[attrValue] = e.target.value;
                            })
                        }
                    }
                } )
                // 标签元素
                if (node.childNodes.length > 0) {
                    this.compileNode(node);
                }
            } else if (node.nodeType == 3) {
                // 字符串
                // 1.用正则取到两个大括号包裹的内容,用设置的data内容替换
                let reg = /\{\{\s*(\S+)\s*\}\}/g;
                let textContent = node.textContent;
                console.log('textContent:', textContent);

                if (reg.test(textContent)) {
                    let $1 = RegExp.$1;
                    console.log($1,"----------$1----------");
                    node.textContent = textContent.replace(reg, this.$options.data[$1]);
                    // 在这里实现事件的监听绑定方法
                    this.addEventListener($1, e => {
                        console.log($1,"----------事件监听 $1----------")
                        console.log(this.$options.data[$1],"----------this.$options.data[$1]----------")
                        console.log(e,"--------------------")
                        let oldValue = this.$options.data[$1];
                        console.log(oldValue,"----------oldValue----------")
                        let reg = RegExp(oldValue);
                        node.textContent = node.textContent.replace(reg, e.detail)
                    })
                }

            }
        });
    }
}