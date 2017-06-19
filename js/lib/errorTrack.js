/**
 * ubtTracker数据埋点
 * 可调用方法：send
 * 统计范围：服务请求，页面jsError，页面埋点（点击事件）
 */
 
window.ubtTracker = {
    _getKey: function () {
        // 设置对应的key
        return /jeffreytrip/i.test(window.navigator.userAgent) ?   '_flight_hybird_jeffreytrip' : '_flight_h5';
    },
    _getBelongTo: function () {
        var arr = location.pathname.split('/');
        return arr[arr.length - 2];
    },
    _getErrorType: function (error) {
        if (!error) return "";
        var errorType = "";
        if (error instanceof EvalError) {//eval函数使用错误
            errorType = 'EvalError';
        } else if (error instanceof RangeError) {//超出内存容许范围，一般是递归循环调用导致
            errorType = 'RangeError';
        } else if (error instanceof ReferenceError) {//作用域内没有这个变量，但是却在使用它，会抛出这个错误【最常见错误】
            errorType = 'ReferenceError';
        } else if (error instanceof SyntaxError) {//语法错误，一般是少了括号，逗号等导致语法错误
            errorType = 'SyntaxError';
        } else if (error instanceof TypeError) {//当在作用域中找到了这个变量引用，然后你让这个变量去做他力所不能及的事情的时候，比如说引用它一个不存在的属性，或者把变量当函数使用等
            errorType = 'TypeError';
        } else if (error instanceof URIError) {//encodeURIComponent和decodeURIComponent方法报错
            errorType = 'URIError';
        }
        return errorType;
    },
    _getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return (decodeURI(r[2])); return null;
    },
    init: function () {
        var me = this;
        if (!window.__bfi) window['__bfi'] = [];
        //startTime = new Date();
        window.addEventListener('error', function (e) {
            //var errorInfo = {
            //    message: e.message, // 当跨域时值为 "Script error."
            //    filename: e.filename,
            //    lineno: e.lineno,
            //    colno: e.colno,
            //    stack: e.error && e.error.stack ? e.error.stack : 'no stack',
            //    type: e.type,
            //    etype: e.error && e.error.name ? e.error.name : me._getErrorType(e.error),
            //    ua: window.navigator.userAgent
            //};
            //sockMsg('err', 'js error,' + JSON.stringify(errorInfo));
           // sockMsg('info', '{"oid":"2160240817","head":{"cid":"09031037410000257046","ctok":"","cver":"1.0","lang":"01","sid":"8888","syscode":"09","auth":"DF7AE9A8F320A6B6DF0D346270B8C1D2A932EC0380C9CC46525A59A457DCAE09","extension":[{"name":"protocal","value":"http"}]},"contentType":"json"}');
            var errorInfo = {
                version: 7,
                name: 'postserviceError',
                message: e.message,
                line: e.lineno,
                column: e.colno,
                file: e.filename,
                etype: e.error && e.error.name ? e.error.name : me._getErrorType(e.error),
                stack: e.error && e.error.stack ? e.error.stack : 'no stack',
                category: 'OnError',// error level
                time: new Date() 
            };

            me.send('error', errorInfo);
            console.log(e);
        });

        // 事件代理
        var on = $.fn.on;
        $.fn.on = function (event, selector, data, callback, one) {
            if (typeof callback == "function") {
                callback = me.override(callback);
            } else if (callback == undefined && typeof data == "function") {
                data = me.override(data);
            }else if (callback == undefined && typeof selector == "function") {
                selector = me.override(selector);
            }
            return on.call(this, event, selector, data, callback, one);
        }
    },

    // 功能描述：重写方法
    override: function (callback) {
        var me = this;
        var _callback = callback;
        return function (e) {
            // 切换上下文对象
            //_callback.call(this,e);

            // 切换上下文对象
            _callback.apply(this, arguments);

            // 捕获日志
            me.capture(e);
        };
    },

    // 功能描述：捕获
    capture:function(e){
        var me = this;
        var n = 0;

        function getSpeed(target) {
            if (!target) {
                return;
            }
            n++;

            var speedAttr = target.attributes && (target.attributes['speed'] || target.attributes['data-speed']);
            if (speedAttr) {
                return speedAttr.value;
            }
        }
        //这里一定不能写e.target， 因为父级上面的元素如果也有绑定事件， 那么 就会每次就会触发
        var speed = getSpeed(e.currentTarget);
        
        if (speed) {
            me.send('speed', speed);
        }
    },

    /**
     * 发送数据
     * @param  {Object} data 埋点数据，必须是Object类型
     * belongto: 'schedule' // 从属项目
     */
    send: function (key, data, from) {
        var me = this;
        if ( Lizard.P("oid") && localStorage.getItem('FLT_POSTSERVICE_OID') != Lizard.P("oid") ) {
            localStorage.setItem('FLT_POSTSERVICE_OID', Lizard.P("oid"));
        }
        var oid = Lizard.P("oid") || localStorage.getItem('FLT_POSTSERVICE_OID') || 0;
        //var pid = $ && $("#page_id") && $("#page_id").length && $("#page_id").get(0).value || 0;
        var pid = document.getElementById('page_id') && document.getElementById('page_id').value;
         
        var isHybrid = Lizard.app.vendor.is('CTRIP');
        var guid = localStorage.getItem('GUID');
        if (!guid) {
            var createGuid = function () {
                function S4() {
                    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                }

                function NewGuid() {
                    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
                }

                return NewGuid();
            };

            guid = createGuid();
            localStorage.setItem('GUID', guid);
        }
    
        Date.prototype.Format = function (fmt) { //author: meizz 
            var o = {
                "M+": this.getMonth() + 1, //月份 
                "d+": this.getDate(), //日 
                "h+": this.getHours(), //小时 
                "m+": this.getMinutes(), //分 
                "s+": this.getSeconds(), //秒 
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                "S": this.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
        var normalData = {
            belongTo: me._getBelongTo(),
            clientID: guid,  
            speed: '',
            serverInfo: {
                startTime: '',
                endTime: '',
                requestInfo: {},
                responseInfo: {},
                url:''
            },
            error: {},
            env: isHybrid ? "hybrid" : "h5",
            pageid: pid,
            hpageid: pid,
            orderid: oid,
            startTime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
            from: from || window.encodeURIComponent(location.href)
        };

        if (typeof key === 'string') {
           
            if (typeof window['__bfi'] == 'undefined') {//__bfi字段存放错误和埋点信息
                window['__bfi'] = [];
            }

            if (key == 'error') {//错误信息
                window['__bfi'].push(['_trackError', data]);
            } else {//埋点信息，例如key="serverInfo”可以设置为服务请求埋点，统计服务请求；
                    //其他事件埋点可以通过在某个点击元素上添加data-action="点击登录"，最后在所有事件的基础上，获取data-action对应的值作为key，然后send
               
                normalData[key] = data;

                window['__bfi'].push(['_tracklog', me._getKey(), JSON.stringify(normalData)]);
            }
            
        } else {
            console.log('key 必须是字符串');
        }
    }
};

// 初始化
ubtTracker.init();

try{
    let _console = window.console || {
            log: function () {},
            error: function () {},
            info: function () {},
            assert: function () {}
        };

    let _oriError = _console.error;
    if(FLTHYBRID.dev==='prd'){
        _console.error=function(){
            let arg=arguments;
            for(let i=0;i<arg.length;i++){
                if(arg[i] instanceof Error){
                    ubtTracker.send('error',arg[i]);
                }
            }
        }
    }

}catch (e){
    ubtTracker.send('error',e);
}

