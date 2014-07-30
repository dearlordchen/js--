/**
 * Created by lordchen on 14-5-13.
 */

var $txTpl=(function(){
    /**
     * 模板解析器txTpl:
     * @author: wangfz
     * @param {String}  模板id || 原始模板text
     * @param {Object}  数据源json
     * @param {String}  可选 要匹配的开始选择符 '<%' 、'[%' 、'<#' ..., 默认为'<%'
     * @param {String}  可选 要匹配的结束选择符 '%>' 、'%]' 、'#>' ..., 默认为'%>'
     * @param {Boolean} 可选 默认为true
     * @return {String}
     * 注意1: 输出"\"时, 要转义,用"\\"或者实体字符"\";
     *　　　  输出"开始选择符"或"结束选择符"时, 至少其中一个字符要转成实体字符。
     *　　　  html实体对照表：http://www.f2e.org/utils/html_entities.html
     * 注意2: 模板拼接时用单引号。
     * 注意3: 数据源尽量不要有太多的冗余数据。
     */
    var cache={};
    return function(str, data, startSelector, endSelector, isCache){
        var fn, d=data, valueArr=[], isCache=isCache!=undefined ? isCache : true;
        if(isCache && cache[str]){
            for (var i=0, list=cache[str].propList, len=list.length; i<len; i++){valueArr.push(d[list[i]]);}
            fn=cache[str].parsefn;
        }else{
            var propArr=[], formatTpl=(function(str, startSelector, endSelector){
                if(!startSelector){var startSelector='<%';}
                if(!endSelector){var endSelector='%>';}
                var tpl=str.indexOf(startSelector) == -1 ? document.getElementById(str).innerHTML : str;
                return tpl
                    .replace(/\\/g, "\\\\")
                    .replace(/[\r\t\n]/g, " ")
                    .split(startSelector).join("\t")
                    .replace(new RegExp("((^|"+endSelector+")[^\t]*)'","g"), "$1\r")
                    .replace(new RegExp("\t=(.*?)"+endSelector,"g"), "';\n s+=$1;\n s+='")
                    .split("\t").join("';\n")
                    .split(endSelector).join("\n s+='")
                    .split("\r").join("\\'");
            })(str, startSelector, endSelector);
            for (var p in d) {propArr.push(p);valueArr.push(d[p]);}
            fn = new Function(propArr, " var s='';\n s+='" + formatTpl+ "';\n return s");
            isCache && (cache[str]={parsefn:fn, propList:propArr});
        }

        try{
            return fn.apply(null,valueArr);
        }catch(e){
            function globalEval(strScript) {
                var ua = navigator.userAgent.toLowerCase(), head=document.getElementsByTagName("head")[0], script = document.createElement("script");
                if(ua.indexOf('gecko') > -1 && ua.indexOf('khtml') == -1){window['eval'].call(window, fnStr); return}
                script.innerHTML = strScript;
                head.appendChild(script);
                head.removeChild(script);
            }

            var fnName='txTpl' + new Date().getTime(), fnStr='var '+ fnName+'='+fn.toString();
            globalEval(fnStr);
            window[fnName].apply(null,valueArr);
        }
    }
})()


function $getQuery(name,url){
//参数：变量名，url为空则表从当前页面的url中取
    var u  = arguments[1] || window.location.search,
        reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"),
        r = u.substr(u.indexOf("\?")+1).match(reg);
    return r!=null?r[2]:"";
};

function $getCookie(name){
//读取COOKIE
    var reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)"),
        val=document.cookie.match(reg);//如果获取不到会提示null
    return val?unescape(val[2]):null;
};

function $setCookie(name,value,expiresd,path,domain,secure){
    //写入COOKIES
    var expdate = new  Date(),
        expires = arguments[2] || null,
        path  	= arguments[3] || "/",
        domain  = arguments[4] || null,
        secure  = arguments[5] || false;
    expires?expdate.setMinutes(expdate.getMinutes() + parseInt(expires)):"";
    var cookietemp =escape(name) + '=' + escape(value) + (expires ? '; expires=' + expdate.toGMTString() : '') + (path ? '; path=' + path : '')+ (domain ? '; domain=' + domain : '')+(secure ? '; secure' : '');
    document.cookie=cookietemp;
};

function $getValue(name){
    //专门用于check和radio取值，单独取值请直接写value
    var objs=document.getElementsByName(name),
        returnvar=[];
    for(var i=0,len=objs.length;i<len;i++){
        var t=objs[i];
        if(t.tagName.toLowerCase()=="input"){
            if((t.type.toLowerCase()=="checkbox" || t.type.toLowerCase()=="radio") ){	//设置单选复选框的值
                if(t.checked==true){
                    returnvar.push(t.value);
                }
            }
        }
    };
    returnvar=returnvar.join(',');
    return returnvar;
};