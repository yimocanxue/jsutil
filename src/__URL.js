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
    deleteQuery: function(url, ref) {
        var str = "";
        if (~url.indexOf('?')) {
            str = url.substr(url.indexOf('?') + 1);
        }
        else {
            return url;
        }
        var arr = "";
        var returnurl = "";
        var setparam = "";
        if (~str.indexOf('&')) {
            arr = str.split('&');
            for (var i in arr) {
                if (arr[i].split('=')[0] != ref) {
                    returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
                }
            }
            return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
        }
        else {
            arr = str.split('=');
            if (arr[0] == ref) {
                return url.substr(0, url.indexOf('?'));
            }
            else {
                return url;
            }
        }
    },
};