/*
 * @Description: 数组扁平化
 * @Author: jidongyu
 * @Date: 2021-05-14 14:56:00
 * @LastEditTime: 2021-05-14 17:06:28
 * @LastEditors: jidongyu
 * @Reference: 
 */
let arr = ["one",["two",["three"]],["four",{"name":"jidongyu"}]];

function flatten(arr){
    let res = [];
    arr.forEach( element => {
        if(Array.isArray(element)){
            let nextElementArr = flatten(element);
            res = res.concat(nextElementArr);
        }else{
            res.push(element);
        }
    });
    return res;
}

// let result = flatten(arr);
// console.log('flatten：',result);

function flatten2(arr){
    let res = [];
    res = arr.reduce((preItem,currentItem)=>{
        console.log('preItem：',preItem);
        console.log('currentItem：',currentItem);
        preItem = preItem.concat(Array.isArray(currentItem) ? flatten2(currentItem) : currentItem );
        return preItem;
    },[]);
    return res;
}

// console.log("flatten2：", flatten2(arr));

function flatten3(arr){
    while(arr.some( item => Array.isArray(item) )){
        arr = [].concat(...arr);
        console.log("arr：",arr);
    }
    return arr;
}
// console.log("flatten3：",flatten3(arr));

function flatten4(arr){
    console.log("arr.toString()",arr.toString());
    return arr.toString().split(',');
}
console.log("flatten4：",flatten4(arr));

// flat实现
function flat(arr, depth) {
    let res = []
    let depthArg = depth || 1
    let depthNum = 0,
    flatMap = (arr) => {
      arr.map((element, index, array) => {
        // 判断是否是数组类型（之前文章有写过）
        if(Object.prototype.toString.call(element).slice(8, -1) === 'Array'){
          if(depthNum < depthArg){
            depthNum++;
            flatMap(element);
          }else{
            res.push(element);
          }
        }else{
          res.push(element);
          if(index === array.length -1) depthNum = 0;
        }
      });
    };
    flatMap(arr);
    return res;
  }
  console.log(flat(arr, Infinity))   // ['one', 'two', 'three']

  // 特定的数组扁平化方法flat
function flatten5(arr) {
    return arr.flat(Infinity);
  }
  console.log(flatten5(arr));
