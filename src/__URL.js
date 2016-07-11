
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
    $.getQuery = function()
    {
        var url = this.url;
        var name = arguments[0];
        if(arguments.length >1){
            url = arguments[0];
            name = arguments[1];
        }
        var reg = new RegExp("(\\?|\\&)" + name + "=([^\\&]*)(\\&|$)");
        var r = url.match(reg);
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
        var reg1 = new RegExp("\\?" + name + "=([^\\&]*)");
        var reg2 = new RegExp("\\&" + name + "=([^\\&]*)");
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
        var url = this.url;
        var params = {};
        if(arguments.length == 1 && typeof arguments[0] != "object"){
            throw "arguments is error";
        }

        if(arguments.length == 1){
            params = arguments[0];
        }
        else if(arguments.length == 2){
            if(typeof arguments[1] == 'object'){
                url = arguments[0];
                params = arguments[1];
            }else{
                params[arguments[0]] = arguments[1];
            }
        }
        else if(arguments.length == 3){
            url = arguments[0];
            params[arguments[1]] = arguments[2];
        }else{
            throw "arguments is error";
        }
        
        var new_url = url;
        for(var key in params){
            new_url = this.deleteQuery(new_url,key);
            new_url = ~new_url.indexOf("?") ? 
                        new_url + "&" + key + "=" + encodeURIComponent(params[key]) : 
                        new_url + "?" + key + "=" + encodeURIComponent(params[key]);
        }
        
        return new_url;
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


    /**
    *  获取当前URL或指定URL的文件名
    */
    $.getFilename = function(url)
    {
        url = url||this.url;
        var filename = url.substr(url.lastIndexOf("/") + 1);
        filename = ~filename.indexOf("?") ? filename.substr(0,filename.indexOf("?")) : filename;
        return  filename;
    };

    /**
    * 返回当前应用的根目录
    */
    $.getRootPath = function()
    { 
        var strPath = window.document.location.pathname; 
        var postPath = strPath.substring(0,strPath.substr(1).indexOf('/')+1); 
        return (postPath + "/"); 
    }; 

    return $;

})(window);