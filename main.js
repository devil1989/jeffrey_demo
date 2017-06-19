
// function buildViewTemplatesPath(htmlpath) {//创建html路径，直接在define中使用该函数创建对应的url
//     return 'text!' + location.origin + htmlpath + ".html";
// }

// (function() {
//     var isDebug = typeof location != 'undefined' && location.search.indexOf('debug=1') != -1;
//     var config = {
//         // baseUrl: "js",//从config文件所在目录开始
//         // paths: {
//         //     'Gallery': 'js/demo/gallery',
//         //     'Canvas':'js/demo/canvas'
//         // }
//         // urlArgs:'201611301517'//这个是css和js文件后面添加的参数，用于发布的时候去缓存，需要在grunt等前端构建工具中生成这个时间字符串，然后再给所有的css和js添加这个后缀
//     };

//     require.config(config);
// })();

require.config({
    paths:{
        "canvas":'js/demo/canvas'
    }
});

// define(["canvas"], function(canvas) {
//     //
//     alert("dd")
// });