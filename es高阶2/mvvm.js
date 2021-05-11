/*
 * @Description: 
 * @Author: jidongyu
 * @Date: 2021-05-11 21:35:20
 * @LastEditTime: 2021-05-11 22:48:50
 * @LastEditors: jidongyu
 * @Reference: 
 */
class KVue{
    constructor(options){
        this.$options = options; 
        this.compile();
    }
    compile(){
        let el = document.querySelector(this.$options.el);
        this.compileNode(el);
    }
    compileNode(el){
        // 1.拿到元素标签中的子元素
        let childNodes = el.childNodes;
        console.log(childNodes);
        // 循环遍历获取的子元素，判断子元素类型
        childNodes.forEach(node => {
            if(node.nodeType == 1){
                // 标签元素
                if(node.childNodes.length>0){
                    this.compileNode(node);
                }
            }else if(node.nodeType == 3){
                // 字符串
                // 1.用正则取到两个大括号包裹的内容,用设置的data内容替换
                let reg = /\{\{\s*(\S+)\s*\}\}/g;
                let textContent = node.textContent;
                console.log('textContent:',textContent);
                if(reg.test(textContent)){
                    let $1 = RegExp.$1;
                    node.textContent = textContent.replace(reg,this.$options.data[$1])
                }
            }
        });
    }
}