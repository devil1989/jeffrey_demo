//常用方法集合
(function(w) {
  var toString = Object.prototype.toString;
  w.J = {

    //引用类型
    isObject: function(t) {
      return (toString.call(t) === "[object Object]") ? true : false;
    },
    isArray: function(t) {
      return (toString.call(t) === "[object Array]") ? true : false;
    },
    isExp: function(t) {
      return (toString.call(t) === "[object RegExp]") ? true : false;
    },
    isDate: function(t) {
      return (toString.call(t) === "[object Date]") ? true : false;
    },
    isFunction: function(t) {
      return (toString.call(t) === "[object Function]") ? true : false;
    },

    //基本类型
    isNumber: function(t) {
      return (toString.call(t) === "[object Number]") ? true : false;
    },
    isString: function(t) {
      return (toString.call(t) === "[object String]") ? true : false;
    },
    isBoole: function(t) {
      return (toString.call(t) === "[object Boolean]") ? true : false;
    },
    now: function() {
      return (new Date()).getTime();
    },
    offset: function() {
      //chrome,safari,ie[html头部没有dtd声明]:document.body.scrollTop
      //firefox 或者 ie[html头部有dtd声明]:document.documentElement.scrollTop 
      var p;
      p.y = document.documentElement.scrollTop || document.body.scrollTop;
      p.x = document.documentElement.scrollLeft || document.body.scrollLeft;
      return p;
    },
    docSize: function(isAllDoc) {
      //HTML标准下:document.body是dom的根元素;document.body.clientHeight[文档在屏幕中的可见区域的高度],document.documentElement.clientHeight[整个文档的高度]            
      //XHTML标准下,document.documentElement才是dom的根元素;document.body.clientHeight[整个文档的高度],document.documentElement.clientHeight[文档在屏幕中的可见区域的高度]            
      var p;
      if (isAllDoc) { //整个文档的宽高(body外面有border的时候，计算出错,基本上不会出现这种情况)
        p.x = Math.max(document.body.clientWidth, document.documentElement.clientWidth);
        p.y = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
      } else { //文档在屏幕中的可见区域的宽高[不包括滚动框]
        p.x = Math.min(document.body.clientWidth, document.documentElement.clientWidth);
        p.y = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
      }
      return p;
    },
    winSize: function(isInner) { //是否包括底部任务栏[屏幕宽高比较少用，一般用的是文档的宽高]
      var w;
      if (isInner) {
        p.x = window.screen.availWidth;
        p.y = window.screen.availHeight;
      } else { //是否包括底部任务栏
        p.x = window.screen.width;
        p.y = window.screen.height;
      }
      return w;
    },
    parseXML: function(data, xml, tmp) {
      if (window.DOMParser) { // Standard 标准XML解析器
        tmp = new DOMParser();
        xml = tmp.parseFromString(data, "text/xml");
      } else { // IE IE的XML解析器
        xml = new ActiveXObject("Microsoft.XMLDOM");
        xml.async = "false";
        xml.loadXML(data);
      }
      tmp = xml.documentElement;
      if (!tmp || !tmp.nodeName || tmp.nodeName === "parsererror") {
        jQuery.error("Invalid XML: " + data);
      }
      return xml;
    },

    //类继承方法（parent：父类对象或者父类方法，initializer:类的构造函数）
    Class: function(parent, initializer) {
      if (!initializer) {
        initializer = parent;
        parent = function() {};
      }
      var supper = typeof parent == "function" ? parent.prototype : parent;//父类
      var originFunction = function() {
          typeof initializer == "function" && initializer.apply(this, arguments);
        }
        //originFunction继承自parent
      originFunction.prototype = supper;
      originFunction.prototype.constructor = originFunction;

      //拓展属性方法
      originFunction.extend = originFunction.prototype.extend = function(o) {
        for (key in o) {
          this[key] = o[key];
        }
      };
      return originFunction;
    },

    //原型链的混成形式（它是“寄生组合式继承”的一部分，剩下部分就是child通过借用构造函数来继承属性），见红皮书：172～173页
    inherit:function(child,parent){
      // function F(){}
      // F.prototype=parent.prototype;
      // var prototype=new F();
      var prototype=parent.prototype;
      prototype.extend=function(o){
        for(var key in o){
          this[key]=o[key];
        }
      }
      prototype.constructor=child;
      child.prototype=prototype;
    },


    //深度克隆
    clone: function(tgObj) {
      var obj = {};
      if (JSON && JSON.stringify && JSON.parse) {
        obj = JSON.parse(JSON.stringify(tgObj));
      } else {
        for (key in tgObj) {
          var value = tgObj[key];
          var type = toString.call(value);
          if (type == "[object Number]" || type == "[object String]" || type == "[object Boolean]") {
            obj[key] = value;
          } else {
            obj[key] = arguments.callee(value);
          }
        }
      }
      return obj;
    },

    //和$(document).ready一样
    DOMReady: function(callback) {
      var verson = parseInt(navigator.userAgent.substring(30, 31));
      //ie6-8没有DOMContentLoaded事件，所以要用setInterval事件来判断DOM有没有准备好，如果dom好了，那么document.documentElement.doScroll方法存在
      if (navigator.userAgent.indexOf("IE") != -1 && verson < 9) {
        var timeout = setInterval(function() {
          if (document.documentElement.doScroll) {
            callback();
            clearInterval(timeout); //绑定以后，要手动清除之前的setInterval
          }
        }, 20);
      } else { //ie9+和其他浏览器都有addEventListener事件
        document.addEventListener("DOMContentLoaded", callback, false);
      }
    },

    getElementsByClassName: function(range, className) {
      var len, rst = [];
      if (range.nodeType != 1 && range.nodeType != 9) {
        return [];
      }
      for (var nodeList = range.childNodes, len = nodeList.length, i = 0; i < len; i++) {
        if (nodeList[i].nodeType != 1) {
          continue;
        }
        if (nodeList[i].className.indexOf(className) != -1) {
          rst.push(nodeList[i]);
        }
        if (nodeList[i].hasChildNodes()) {
          rst = rst.concat(arguments.callee(nodeList[i], className));
        }
      }
      return rst;
    }
  };

  return w;
})(window);