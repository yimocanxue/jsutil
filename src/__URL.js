var __URL = {

    /**
     * URL编码
     * @param str
     * @return string 编码后的url
     */
    urlEncode: function (str) 
    {
        str = (str + '').toString();   
        return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').  
            replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');  
    },

    /**
     * 获取URL中指定变量的值
     *
     * @param name {string} 变量名
     * @return {string|null} 变量值
     */
    getQuery:function(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(!__CK.isNull(r))
            return  decodeURIComponent(r[2]); 
        return null;
    },

    /**
     * 删除url中指定参数
     *
     * @param url {string} URL
     * @param ref {string} 要删除的变量名
     * @return {string} 删除变量后的url
     */
    deleteQuery: function(url, ref) 
    {
        if (url.indexOf('?') == -1) {
            return url;
        }
        var reg1 = new RegExp("\\?" + ref + "=\\w+");
        var reg2 = new RegExp("\\&" + ref + "=\\w+");
        if(reg1.test(url)){
            return url.replace(reg1,"").replace("&","?");
        }
        if(reg2.test(url)){
            return url.replace(reg2,"");
        }
        return url;    
    },
};