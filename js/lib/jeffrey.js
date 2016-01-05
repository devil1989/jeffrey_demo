//常用方法集合
//underscore常用方法：_.extend,_.defaults,_.each,_.tempalte,_.filter(筛选return true的项),_.compact,_.min,_.uniq,
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
      var supper = typeof parent == "function" ? parent.prototype : parent; //父类
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
    inherit: function(child, parent) {
      // function F(){}
      // F.prototype=parent.prototype;
      // var prototype=new F();
      var prototype = parent.prototype;
      prototype.extend = function(o) {
        for (var key in o) {
          this[key] = o[key];
        }
      }
      prototype.constructor = child;
      child.prototype = prototype;
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

    /*
     *desc:把字符串转化成JOSN格式
     *dataStr:传入的字符串
     *format：‘{"age":25}’,一定要外部单引号，内部双引号的格式，否则会报错
     *note:eval("("+dataStr+")")也能实现相同的功能，但是性能没new Function好
     */
    parseJSON:function(dataStr){//new Function的时候，会自动转化成json
      return JSON.parse?JSON.parse(dataStr):(function (dataStr){return (new Function('return '+dataStr))();})();
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

    //递归调用实现，性能相对来说比通过获取所有元素再一一比对要好
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
    },

    //创建命名空间，例如namespace("a.b.c"):则会出现window.a={b:{c:{}}};是用object来实现命名空间
    namespace: function(nameList) {
      var arr = nameList ? nameList.split(".") : [],
        temp = window;
      for (var i = 0, len = arr.length; i < len; i++) {
        temp = temp[arr[i]] = temp[arr[i]] || {};
      }
      return temp;
    },

    //把数字变成固定长度，比如把14变成4位固定长度的值“0014”，formatZero(14,4);第二个参数是位数
    formatZero: function(str, type) {
      str += '';
      for (var i = 0, len = str.length; i < type - len; i++) {
        str = '0' + str;
      }
      return str;
    },

    //构造函数，可以把“sdf=34&sdf=fd”这种类型的字符串（和location.search结构类似）转化为对象
    QueryStringBuilder: function(baseQueryString) {
      var me = arguments.callee;
      if (!(this instanceof me)) {
        return new me(baseQueryString);
      }

      //获取key在keyMap中的index
      function getIndex(key) {
        key = key && key.toLowerCase();
        return ArrayIndexOf(keyMap, key);
      }

      function ArrayIndexOf(arr, key) {
        if (arr.indexOf) {
          return arr.indexOf(key);
        } else {
          for (var i = 0, len = arr.length || 0; i < len; i++) {
            if (arr[i] === key) {
              return i;
            }
          }
        }
        return -1;
      }

      var keyMap = []; //保存key.toLowerCase的数组
      var names = []; //保存key的数组
      var values = []; //保存value的数组
      var model = {}; //保存数据的对象

      if (baseQueryString) {
        var collections = baseQueryString.split('&');
        if (collections) {
          for (var i = collections.length - 1; i >= 0; i--) {
            var keyValue = collections[i];
            var keyValueArr = keyValue && keyValue.split('=');
            var key = keyValueArr && keyValueArr[0];
            var value = keyValueArr && keyValueArr[1];
            if (key) {
              model[key] = value;
              set(key, value);
            }
          };
        }
      }

      function set(key, value) {
        if (key && value) {
          var index = getIndex(key);
          if (index >= 0 && index < values.length) {
            values[index] = value;
          } else {
            names.push(key);
            values.push(value);
            keyMap.push(key.toLowerCase());
          }
          model[key] = value;
        }
        return value;
      }

      function get(key) {

        var result = key ? values[getIndex(key)] : model;
        return result;
        //return key ? model[key] : model;
      }

      function remove(key) {
        var _model = model;
        var index = getIndex(key);
        if (key && index > 0) {
          delete model[key];
          names.splice(index, 1);
          values.splice(index, 1);
          keyMap.splice(index, 1);
        } else {
          model = {};
          names = [];
          values = [];
          keyMap = [];
        }
      }

      var encodeURI = function(str) {
        try {
          str = str ? decodeURIComponent(str) : '';
        } catch (e) {};

        return encodeURIComponent(str).replace(/\*/g, "%2A").replace(/-/g, "%2D").replace(/_/g, "%5F").replace(/\./g, "%2E").replace(/!/g, '%21').replace(/~/g, '%7E').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
      };
      this.set = set;
      this.get = get;
      this.remove = remove;
      this.toString = function(t1, t2) {
        t1 = t1 || '=';
        t2 = t2 || '&';
        var result = [];
        for (var index = 0; index < names.length; index++) {
          if (values[index]) {
            result.push(encodeURI(names[index]) + t1 + encodeURI(values[index]));
          }
        }
        return result.join(t2) || '';
      }

    },

    //查询URL后面的尾随参数值（因为正则中有变量，所以只能用new来创建正则表达式）
    queryURL: function(name) {
      var rst = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i")) || [];
      return (rst.length == 2) ? rst[1] : "";
    },
               
    /*
     *@desc:创建一个继承自parent的子类
     *@parent：子类要继承的父类
     *@protoProps:子类的构造函数
     *@staticProps：子类的静态方法和属性
     */
    inherits: function(parent, protoProps, staticProps) {
      var child;
      var ctor = function() {};
      //判断protoProps是否一个原型对象（prototype），如果是则将child赋值为原型对象所属的构造函数
      if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
      } else {
        //否则将新建一个构造函数赋值给child
        child = function() {
          //inherits函数返回的是一个构造函数，我们会用new child()来调用此构造函数（例如：AppView = Backbone.View.extend({});var appView=new AppView();）,所以此处的this指向我们new的实例（例如var appView=new AppView(),则this指向appView）
          //new AppView进行的操作其实是Backbone.Model.apply(this,arguments) ,也就是说我们实例化appView的时候其实是调用Backbone.Model
          parent.apply(this, arguments);
        };
      }

      //此处parent既 1  中的 this，也就是Backbone.View,_extend是underscore.js里的一个函数，作用是将第二个及第二个以后的所有参数的所有属性和属性值设置到第一个参数上（_extend的具体实现在此不赘述，可看underscore.js的源码）
      _.extend(child, parent);

      //ctor是一个内容为空的构造函数，此处将其原型对象设置为Backbone.View.prototype
      ctor.prototype = parent.prototype;
      //将child的原型对象设置为一个ctor的实例，child.prototype.contructor指向ctor
      child.prototype = new ctor();
      //将Backbone.View.extend的第二个参数（一般是一个对象）的的所有属性复制到child.prototype
      if (protoProps) _.extend(child.prototype, protoProps);

      //将Backbone.View.extend的第三个参数（一般是一个对象）的的所有属性复制到child，也就是给child设置静态属性或方法
      if (staticProps) _.extend(child, staticProps);

      //执行完child.prototype=new ctor后，child.prototype.constructor已经不指向child，所以此处需要显示设置
      child.prototype.constructor = child;

      //EcmaScript中并没有定义__super__这个属性，此处应该是backbone记录child对应的super类
      child.__super__ = parent.prototype;

      return child;
    };

  };

  return w;
})(window);