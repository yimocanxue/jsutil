
var __URL = (function(win,undefined){


    var $ = function(url){
        return new wrap(url);
    };

    var wrap = function(url) {
        $.url = url;
        return $;
    };

    $.url = win.location.href;

    
    /**
     * 获取URL中指定变量的值
     *
     * @param name {string} 变量名
     * @return {string|null} 变量值
     */
    $.getQuery = function(name)
    {
        var reg = new RegExp("(\\?|\\&)" + name + "=(\\w+)");
        var r = this.url.match(reg);
        if(!__CK.isNull(r))
            return  decodeURIComponent(r[2]); 
        return null;
    };


    /**
     * 删除url中指定参数 deleteQuery(url,name)或deleteQuery(name)
     *
     * @param url {string} URL
     * @param name {string} 要删除的参数名
     * @return {string} 删除参数后的url
     */
    $.deleteQuery = function() 
    {
        var url = this.url;
        var name = arguments[0];
        if(arguments.length > 1){
            url = arguments[0];
            name = arguments[1];
        }
        if (url.indexOf('?') == -1) {
            return url;
        }
        var reg1 = new RegExp("\\?" + name + "=\\w+");
        var reg2 = new RegExp("\\&" + name + "=\\w+");
        if(reg1.test(url)){
            return url.replace(reg1,"").replace("&","?");
        }
        if(reg2.test(url)){
            return url.replace(reg2,"");
        }
        return url;    
    };



    /**
     * 设置url中指定参数 setQuery(url,name,value)或deleteQuery(name,value)
     *
     * @param url {string} URL
     * @param name {string} 设置的参数名
     * @param value {string} 设置参数值
     * @return {string} 设置参数后的url
     */
    $.setQuery = function() 
    {
        if(arguments.length < 2){
            throw "number off arguments is error";
        }

        var url = this.url;
        var name = arguments[0];
        var value = arguments[1];

        if(arguments.length > 2){
            url = arguments[0];
            name = arguments[1];
            value = arguments[2];
        }

        var new_url = this.deleteQuery(url,name);

        return ~new_url.indexOf("?") ? new_url + "&" + name + "=" + value : new_url + "?" + name + "=" + value;
 
    };


    /**
     * URL编码
     * @param url 编码的URL
     * @return string 编码后的url
     */
    $.urlEncode = function (url) 
    {
        url = url || this.url;
        url = (url + '').toString();   
        return encodeURIComponent(url).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').  
            replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');  
    };

    return $;
    
})(window);