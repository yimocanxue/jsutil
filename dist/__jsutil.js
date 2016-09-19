/*!
 * =====================================================
 * jsutil v1.0.0 (https://github.com/yimocanxue/jsutil)
 * =====================================================
 */
/**
* 判断工具类
*
*/
var __CK = {

    isUndefined:function(val)
    {
        return "undefined" === typeof(val);
    },
    isNull:function(val)
    {
        /**
        *常见复杂的写法
        *!exp && typeof exp != "undefined" && exp != 0
        * 
        */
        return null === val;
    },
    isEmpty:function(val)
    {
        return "string" === typeof(val) && val.length === 0 ;
    },

    /**
    * 变量是null或undefined或空字符串
    */
    isNoValue:function(val)
    {
        if(this.isUndefined(val))
            return true;
        if(this.isNull(val))
            return true;
        if(this.isEmpty(val))
            return true;

        return  false;
    },


    /**
     * 电子邮件验证
     * @param {string} strEmail
     * @returns {boolean}
     */
    isEmail:function(strEmail) 
    {
        return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(strEmail);
    },

    /**
     * 手机号验证
     * @param {string} value
     * @returns {boolean}
     */
    isMobile:function(value) 
    {
        return /^1(3|5|8|7)\d{9}$/g.test(value);
    },

    /**
    * 判断固定电话(0755-123456、020-1234567、020-12345678)
    * @param string value
    *
    */
    isTel:function(value)
    {
        return  /^\d{3,4}-\d{6,8}$/.test(value);
    },


    /**
    * 支持15位和18位身份证号，支持地址编码、出生日期、校验位验证
    *
    * 根据〖中华人民共和国国家标准 GB 11643-1999〗中有关公民身份号码的规定，公民身份号码是特征组合码，由十七位数字本体码和一位数字校验码组成。排列顺序从左至右依次为：六位数字地址码，八位数字出生日期码，三位数字顺序码和一位数字校验码。
    * 地址码表示编码对象常住户口所在县(市、旗、区)的行政区划代码。
    * 出生日期码表示编码对象出生的年、月、日，其中年份用四位数字表示，年、月、日之间不用分隔符。
    * 顺序码表示同一地址码所标识的区域范围内，对同年、月、日出生的人员编定的顺序号。顺序码的奇数分给男性，偶数分给女性。
    * 校验码是根据前面十七位数字码，按照ISO 7064:1983.MOD 11-2校验码计算出来的检验码。
     
    * 出生日期计算方法。
    * 位的身份证编码首先把出生年扩展为4位，简单的就是增加一个19或18,这样就包含了所有1800-1999年出生的人;
    * 年后出生的肯定都是18位的了没有这个烦恼，至于1800年前出生的,那啥那时应该还没身份证号这个东东，⊙﹏⊙b汗...
    * 下面是正则表达式:
    * 出生日期1800-2099 (18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])
    * 身份证正则表达式 /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i 
    * 位校验规则 6位地址编码+6位出生日期+3位顺序号
    * 位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位
    *
    * 校验位规则 公式:∑(ai×Wi)(mod 11)……………………………………(1)
    * 公式(1)中： 
    * i----表示号码字符从由至左包括校验码在内的位置序号； 
    * ai----表示第i位置上的号码字符值； 
    * Wi----示第i位置上的加权因子，其数值依据公式Wi=2^(n-1）(mod 11)计算得出。
    * i 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
    * Wi 7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 1
    */
    isIDCard:function(code) 
    { 
        var tip = "";
        var city = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};

        var pass = true;

        //身份证号格式错误
        if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code))
            return false;

        //地址编码错误
        if(!city[code.substr(0,2)])
            return false;


         //18位身份证需要验证最后一位校验位
        if(code.length == 18){

            code = code.split('');
             //∑(ai×Wi)(mod 11)
             //加权因子
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
             //校验位
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++)
             {
                 ai = code[i];
                 wi = factor[i];
                 sum += ai * wi;
             }
            var last = parity[sum % 11];

            //校验位错误
            if(parity[sum % 11] != code[17])
                return false;
        }
        
        return true;
     },

    /**
     * 银行账号验证
     * @param str
     * @returns {boolean}
     */
    isBankNO:function(str) 
    {
        return /^\d{16,25}$/.test(str);
    },
    /**
    * 验证车牌号
    */
    isCarPlateNo:function(str)
    {
        return /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/.test(str);
    },

};
/**
*   扩展JS内容String对象
*/


/**
 * 计算字符串所占的内存字节数，默认使用UTF-8的编码方式计算，也可制定为UTF-16
 * UTF-8 是一种可变长度的 Unicode 编码格式，使用一至四个字节为每个字符编码
 * 
 * 000000 - 00007F(128个代码)      0zzzzzzz(00-7F)                             一个字节
 * 000080 - 0007FF(1920个代码)     110yyyyy(C0-DF) 10zzzzzz(80-BF)             两个字节
 * 000800 - 00D7FF 
   00E000 - 00FFFF(61440个代码)    1110xxxx(E0-EF) 10yyyyyy 10zzzzzz           三个字节
 * 010000 - 10FFFF(1048576个代码)  11110www(F0-F7) 10xxxxxx 10yyyyyy 10zzzzzz  四个字节
 * 
 * 注: Unicode在范围 D800-DFFF 中不存在任何字符
 * {@link http://zh.wikipedia.org/wiki/UTF-8}
 * 
 * UTF-16 大部分使用两个字节编码，编码超出 65535 的使用四个字节
 * 000000 - 00FFFF  两个字节
 * 010000 - 10FFFF  四个字节
 * 
 * {@link http://zh.wikipedia.org/wiki/UTF-16}
 * @param  {String} charset utf-8, utf-16
 * @return {Number}
 */
String.prototype.sizeof = function(charset)
{
    
    var that = this,
        total = 0,
        charCode,
        i,
        len;
    charset = charset ? charset.toLowerCase() : 'utf-8';

    if(charset === 'utf-16' || charset === 'utf16'){
        for(i = 0, len = that.length; i < len; i++){
            charCode = that.charCodeAt(i);
            if(charCode <= 0xffff){
                total += 2;
            }else{
                total += 4;
            }
        }
    }else{

        for(i = 0, len = that.length; i < len; i++){
            charCode = that.charCodeAt(i);
            if(charCode <= 0x007f) {
                total += 1;
            }else if(charCode <= 0x07ff){
                total += 2;
            }else if(charCode <= 0xffff){
                total += 3;
            }else{
                total += 4;
            }
        }
    }

    return total;
};



/**
* 去除字符串左右两边标签，默认去空格
* @param string tag 要去除的标签
* @return 去除标签后的新字符串
*/
String.prototype.trim = function(tag)
{
    if (!tag) { 

        tag = '\\s';

    }else { 

        if (tag == '\\') { 
            tag = '\\\\'; 
        } else if (tag == ',' || tag == '|' || tag == ';') { 
            tag = '\\' + tag; 
        }else { 
            tag = '\\s'; 
        } 
    }
    eval('var reg=/(^' + tag + '+)|(' + tag + '+$)/g;'); 

    //返回新字符串
    return this.replace(reg, '');
};




/**
* 去掉左空格
*/
String.prototype.ltrim = function()  
{  
    return this.replace(/(^\s*)/g, "");  
};

/**
* 去掉右空格
*/

String.prototype.rtrim = function()  
{  
    return this.replace(/(\s*$)/g, "");  
}; 


/**
* 字符串是否以tag开始
* @param string tag 检测字符
* @return boolean 
*
*/
String.prototype.startWith = function(tag)
{
    return this.substring(0, tag.length) == tag;
};

/**
* 字符串是否以tag结尾
* @param string tag 检测字符
* @return boolean 
*/
String.prototype.endWith = function(tag)
{
    return this.substring(this.length - tag.length) == tag;
};

/**
* 将字符串中的s1全部替换成s2
* @param string 被替换的字符串
* @param string 替换字符串
* @return 替换以后的新字符串
*/
String.prototype.replaceAll = function(s1,s2)
{
    return this.replace(new RegExp(s1,"gm"),s2);
};

/**
 * 单词首字母大写
 * @param str
 * @returns {string}
*/
String.prototype.upperFirstChar = function () 
{
    var reg = /\b(\w)|\s(\w)/g;
    return this.toLowerCase().replace(reg, function (m) {
        return m.toUpperCase();
    });
};


/**
 * 截取字符串
 * @param count {int} 截取个数
 * @param suffix {string} 后缀
 * @returns {string}
 */
String.prototype.truncate = function(count,suffix) 
{
    suffix = suffix | "...";
    return this.length > count ? this.substring(0, count) + suffix : this;
};

var __ST = {

    /**
    * 获取随机字符串
    */
    random:function(len)
    {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var res = "";
        for(var i = 0; i < len; i ++){
            res += chars[Math.ceil(Math.random()*35)];
        }
        return res;
    }

};

/**
*   扩展JS内容Date对象
*/


/**
 * 根据给定的格式把时间戳格式化，和PHP的date作用相同
 * @param  {string} format    格式
 * @param  {int}    timestamp 要格式化的时间 默认为当前时间 以秒为单位
 * @return {string}           格式化的时间字符串
 */
Date.prototype.date = function(format, timestamp)
{ 
    var a, jsdate=((timestamp) ? new Date(timestamp*1000) : new Date());
    var pad = function(n, c){
        if((n = n + "").length < c){
            return new Array(++c - n.length).join("0") + n;
        } else {
            return n;
        }
    };
    var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var txt_ordin = {1:"st", 2:"nd", 3:"rd", 21:"st", 22:"nd", 23:"rd", 31:"st"};
    var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; 
    var f = {
        // Day
        d: function(){return pad(f.j(), 2);},
        D: function(){return f.l().substr(0,3);},
        j: function(){return jsdate.getDate();},
        l: function(){return txt_weekdays[f.w()];},
        N: function(){return f.w() + 1;},
        S: function(){return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th';},
        w: function(){return jsdate.getDay();},
        z: function(){return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0;},

        // Week
        W: function(){
            var a = f.z(), b = 364 + f.L() - a;
            var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
            if(b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b){
                return 1;
            } else{
                if(a <= 2 && nd >= 4 && a >= (6 - nd)){
                    nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
                    return date("W", Math.round(nd2.getTime()/1000));
                } else{
                    return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
                }
            }
        },

        // Month
        F: function(){return txt_months[f.n()];},
        m: function(){return pad(f.n(), 2);},
        M: function(){return f.F().substr(0,3);},
        n: function(){return jsdate.getMonth() + 1;},
        t: function(){
            var n;
            if( (n = jsdate.getMonth() + 1) == 2 ){
                return 28 + f.L();
            } else{
                if( n & 1 && n < 8 || !(n & 1) && n > 7 ){
                    return 31;
                } else{
                    return 30;
                }
            }
        },

        // Year
        L: function(){var y = f.Y();return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0;},
        //o not supported yet
        Y: function(){return jsdate.getFullYear();},
        y: function(){return (jsdate.getFullYear() + "").slice(2);},

        // Time
        a: function(){return jsdate.getHours() > 11 ? "pm" : "am";},
        A: function(){return f.a().toUpperCase();},
        B: function(){
            // peter paul koch:
            var off = (jsdate.getTimezoneOffset() + 60)*60;
            var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
            var beat = Math.floor(theSeconds/86.4);
            if (beat > 1000) beat -= 1000;
            if (beat < 0) beat += 1000;
            if ((String(beat)).length == 1) beat = "00"+beat;
            if ((String(beat)).length == 2) beat = "0"+beat;
            return beat;
        },
        g: function(){return jsdate.getHours() % 12 || 12;},
        G: function(){return jsdate.getHours();},
        h: function(){return pad(f.g(), 2);},
        H: function(){return pad(jsdate.getHours(), 2);},
        i: function(){return pad(jsdate.getMinutes(), 2);},
        s: function(){return pad(jsdate.getSeconds(), 2);},
        //u not supported yet

        // Timezone
        //e not supported yet
        //I not supported yet
        O: function(){
            var t = pad(Math.abs(jsdate.getTimezoneOffset()/60*100), 4);
            if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t;
            return t;
        },
        P: function(){var O = f.O();return (O.substr(0, 3) + ":" + O.substr(3, 2));},
        //T not supported yet
        //Z not supported yet

        // Full Date/Time
        c: function(){return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P();},
        //r not supported yet
        U: function(){return Math.round(jsdate.getTime()/1000);}
    };

    return format.replace(/[\\]?([a-zA-Z])/g, function(t, s){
        if( t!=s ){
            // escaped
            ret = s;
        } else if( f[s] ){
            // a date function exists
            ret = f[s]();
        } else{
            // nothing special
            ret = s;
        }
        return ret;
    });
};



/**  
 * 根据给定的日期时间格式，格式化当前日期  
 * @params strFormat 格式化字符串， 如："yyyy-MM-dd" 默认格式为：“yyyy-MM-dd HH:mm:ss”  
 * @return 返回根据给定格式的字符串表示的时间日期格式<br>  
 *         如果传入不合法的格式，则返回日期的字符串格式{@see Date#toLocaleString()}  
 */    
Date.prototype.format =  function(strFormat,date)
{    
    var d = (arguments.length > 1 && date instanceof Date) ? date : new Date();
    var o = {
        "M+": d.getMonth() + 1, //month
        "d+": d.getDate(), //day
        "h+": d.getHours(), //hour
        "m+": d.getMinutes(), //minute
        "s+": d.getSeconds(), //second
        "q+": Math.floor((d.getMonth() + 3) / 3), //quarter
        "S": d.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    
    return format; 
};   



   


/**  
 * 比较两个日期的差距  
 * @param date1 Date类型的时间  
 * @param date2 Dete 类型的时间  
 * @param isFormat boolean 是否对得出的时间进行格式化,<br>   
 *       false:返回毫秒数，true：返回格式化后的数据  
 * @return 返回两个日期之间的毫秒数 或者是格式化后的结果  
 */    
Date.prototype.compareTo = function(date1, date2, isFormat)
{

    try{    

        var len = arguments.length;    
        var tmpdate1 = new Date();    
        var tmpdate2 = new Date();    
        
        if(len == 1){    
            tmpdate1 = date1;    
        }else if(len >= 2){    
            tmpdate1 = date1;    
            tmpdate2 = date2;    
        } 

        if(!(tmpdate1 instanceof Date) || !(tmpdate2 instanceof Date)){    
            
            return 0;    
        
        }else{

            var time1 = tmpdate1.getTime();     
            var time2 = tmpdate2.getTime();    
            var time = Math.max(time1, time2) - Math.min(time1, time2);    
            if(!isNaN(time) && time > 0){    
                if(isFormat){    
                    var date = new Date(time);    
                    var result = {};    
                    result['year']   = (date.getFullYear() - 1970) > 0? (date.getFullYear() - 1970): '0';    
                    result['month']  = (date.getMonth() - 1) > 0? (date.getMonth() - 1): '0';    
                    result['day']    = (date.getDate() - 1) > 0? (date.getDate() - 1): '0';    
                    result['hour']   = (date.getHours() - 8) > 0? (date.getHours() - 1): '0';    
                    result['minute'] = date.getMinutes() > 0? date.getMinutes(): '0';    
                    result['second'] = date.getSeconds() > 0? date.getSeconds(): '0';    

                    return result;    

                }else {    
                    return time;    
                }    
            }else{    
                return 0;    
            }    
        }    

    }catch(e){   

        this.debug('比较时间出现异常' + e.message);    
    
    }    
};


/**
* 获取当前时间戳 默认以分为单位
* @param unit_msec boolean 当为ture时以毫秒为单位
* @return 当前时间戳的毫秒数或描述
*/
Date.prototype.getCurrentStamp = function(unit_msec)
{
    if(unit_msec)
        return new Date().getTime();

    return Math.round((new Date().getTime()) / 1000 );
};


/**
*   对h5 localstorage封装
*   解决在iphone/ipad操作时偶尔的QUOTA_EXCEEDED_ERR错误
*   以及localstorage不支持过期时间的问题
*/
var __CH = {
    
    setItem:function(key,value,time_expiration)
    {

        if(localStorage.getItem(key) !== null)  //避免iphone/ipad莫名其妙错误
            this.removeItem(key);

        if(arguments.length > 2){
            if(isNaN(time_expiration)){
                throw new error("arguments time_expiration must be a  number");
            }
            //设置过期时间
            this.setExpiration(key,time_expiration);
        }
        return localStorage.setItem(key,value);
    },

    getItem:function(key)
    {

        var time_expiration = localStorage.getItem(this.timekey(key));
        if( time_expiration !== null){
            
            var temp = time_expiration.split(",");

            var expiration = parseInt(temp[0]);


            var current_stamp = this.getCurrentStamp();

            if(expiration >= current_stamp){

                this.setExpiration(key,parseInt(temp[1]));  //客户端刷新过期时间
                
                return localStorage.getItem(key);

            }else{

                this.removeItem(key);
                this.removeItem(this.timekey(key));
                
                return null;
            }
                
        }
        return localStorage.getItem(key);
    },
    removeItem:function(key)
    {
        return localStorage.removeItem(key);
    },

    clear:function()
    {
        return localStorage.clear();
    },

    //获取localStorage的属性名称（键名称）
    key:function(index)
    {
        return localStorage.key(index);
    },

    timekey:function(key)
    {
        return key + "___expiration";
    },

    setExpiration:function(key,time_expiration)
    {
        var stamp = this.getCurrentStamp();
        var expiration_str =  stamp + time_expiration + "," + time_expiration;
        return localStorage.setItem(this.timekey(key),expiration_str);
    },

    //获取以秒为单位的时间戳
    getCurrentStamp:function()
    {
        return Math.round((new Date().getTime()) / 1000 ); //获取毫秒时间戳并转换成秒时间戳
    }

};
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
;(function(win,doc,undefined){
    
    var padding = parseInt(win.innerWidth) > 320 ? 18 : 17;
    var Calendar = function(options)
    {
        var self = this;
        var defaults = {
            month:'current',        //显示月份 默认为当前月份 next表示下月 last表示上月
            canSelect: true,        //日历是否可选择
            selected:[],            //选中的日期 
            selectedMax:-1,         //允许选中的最大日期数量 -1表示不限制
            daysOpts:[],            //针对具体日期的配置[{date:'2016-7-10',selectable:false,cls:'checking'},...]
            pastSelectable:false,   //过期是否可选择？
            todaySelectable:false,  //今日是否可选择
            restCb:null,            //重置回调函数
            tapCb:null              //单击可选日期时回调
        };
        //Object.assign(defaults,options);        //android不兼容

        for(var key in options){
            defaults[key] = options[key];
        }

        self.options = defaults;
        
        self.init();
        return self;
    };  

    Calendar.prototype = {

        reset:function()
        {
            var date = new Date();
            var year = arguments[0]||date.getFullYear();
            var month = arguments.length > 1 ? arguments[1] : date.getMonth();

            this.year = year;
            this.month = month;

            this.setMonthShow();    //设置头部年月标题

            this.elem.removeChild(this.elem.querySelector(".calendar-main"));   //先删除

            //this.options.selected = [];     //清空已选择日期
            this.setDateList(); 

            //重置回调
            this.options.restCb && this.options.restCb(this.year,this.month,this.days,this.maxLine);
        },
        init:function(){

            var self = this;
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth();

            if(self.options.month == 'last'){
                month = month > 0 ? month - 1 : 11;
                year = month > 0 ? year : year - 1;
            }
            if(self.options.month == 'next'){
                month = month < 11 ? month + 1 : 0;
                year = month < 11 ? year : year + 1;
            }
            if(!isNaN(self.options.month)){
                month = parseInt(self.options.month) - 1;
            }

            self.year = year;
            self.month = month;


            self.setWrap();
            self.setHeader();     
            self.setMonthShow();    //设置头部年月标题
            self.setDateList();
        },
        setSelected:function(sel){
            this.options.selected = sel;
        },
        setMaxDays:function(max){
            if(isNaN(max))
                return;
            this.options.selectedMax = parseInt(max);
        },
        setCanSelect:function(can){
            this.options.canSelect = can ? true : false;
        },
        setWrap:function(){
            var elem = doc.createElement("div");
            elem.className = "cph-calendar";
            doc.querySelector(this.options.container).appendChild(elem);
            this.elem = elem;
        },
        setHeader:function(){

            var self = this;
            var monthDiv = doc.createElement("div");
            monthDiv.className = "calendar-month";
            monthDiv.innerHTML = '<b class="calendar-month-show"></b>'+
                    '<span class="go-current">今日</span>';
            self.elem.appendChild(monthDiv);

            var weekDiv = doc.createElement("div");
            weekDiv.className = "calendar-title";

            weekDiv.innerHTML ='<a>日</a><a>一</a><a>二</a><a>三</a><a>四</a><a>五</a><a>六</a>';
            self.elem.appendChild(weekDiv);  
            
            self.elem.querySelector(".go-current").addEventListener("tap",function(){
                self.goLastMonth();
                var date = new Date();
                self.reset(date.getFullYear(),date.getMonth());
            });
            /*
            self.elem.querySelector(".mui-icon-arrowright").addEventListener("tap",function(){
                self.goNextMonth();
            });*/
        },
        goLastMonth:function(){
            var self = this;
            var new_month = self.month > 0 ? parseInt(self.month) - 1 : 11;
            var new_year = self.month > 0 ? self.year : parseInt(self.year) - 1 ;
            self.reset(new_year,new_month);
        },
        goNextMonth:function(){
            var self = this;
            var new_month = self.month < 11 ? parseInt(self.month + 1) : 0;
            var new_year = self.month < 11 ? self.year : parseInt(self.year + 1) ;
            self.reset(new_year,new_month);
        },
        setMonthShow:function(){
            this.elem.querySelector(".calendar-month-show").innerHTML = this.year + '年' + (parseInt(this.month) + 1)+"月";            
        },
        
        setDaysOpts:function(opts){
            var self = this;
            self.options.daysOpts = opts;
            var date = new Date();
            self.reset(date.getFullYear(),date.getMonth());
        },
        setDateList:function(){

            var self = this;
            var days = new Date(self.year,self.month + 1,0).getDate();  //当月天数

            var daysDiv = doc.createElement("div");
            daysDiv.className = "calendar-main";
            self.elem.appendChild(daysDiv);

            var ul = doc.createElement("ul");
            ul.className = "calendar-days-list";
            daysDiv.appendChild(ul);

            var week_start = new Date(self.year,self.month,1).getDay();
            var current = new Date();
            var current_year = current.getFullYear();
            var current_month = current.getMonth();
            var current_date = current.getDate();

            var max_line = Math.ceil((week_start + days) / 7);  //显示行数
            self.maxLine = max_line;
            self.days = days;

            var day = 1,fullDate,day_class,selectable,style,month;
            for(var i = 0;i < max_line * 7;i++){
                var li = doc.createElement("li");
                if(day <= days){
                    if(i >= week_start){
                        style = day < 10 ? "style='padding:12px "+padding+"px;'":"";
                        li.innerHTML = '<span '+style+'>'+day+'</span>';
                        month = (parseInt(self.month)+1);
                        fullDate = self.year +"-" + (month < 10 ? '0' + month : month)  + "-" + (day < 10 ? '0' + day :day);        //完整日期
                        day_class = '';
                        selectable = true;  //日历是否可选择
                        //今天前的日期
                        if(current_year > self.year ||(current_year == self.year && current_month > self.month) || (current_year == self.year && current_month == self.month && current_date > day)){
                            day_class = 'pass';
                            selectable = self.options.pastSelectable;
                        }
                        //默认选中的日期
                        if(~self.options.selected.indexOf(fullDate)){
                            day_class = 'selected';
                        }
                        //今日
                        if(self.year == current_year && self.month == current_month && day == current_date){
                            selectable = self.options.todaySelectable;     
                            day_class = 'today';
                        }
                        

                        //特殊日期的配置
                        for(var j = self.options.daysOpts.length - 1 ; j >= 0 ; j--){
                            if(self.options.daysOpts[j].date == fullDate){
                                day_class = day_class + " " + self.options.daysOpts[j].cls;
                                selectable = self.options.daysOpts[j].selectable;
                            }
                        }

                        li.className = day_class;

                        if(selectable){
                            li.addEventListener("tap",function(){
                                //不可选择
                                if(!self.options.canSelect)
                                    return;

                                var current_day = parseInt(this.querySelector("span").innerHTML);
                                var isSelect = this.classList.contains("selected") ? false : true;
                                var current_m = (parseInt(self.month) + 1) ;
                                var fulldate  = self.year +"-" + 
                                                (current_m < 10 ? '0' + current_m : current_m) + "-" + 
                                                (current_day < 10 ? '0' + current_day : current_day);

                                //要选中时查看有无数量限制
                                if(isSelect){
     
                                    if(self.options.selectedMax > -1){
                                        if(self.getSelected().length >= self.options.selectedMax){
                                            self.options.tapCb&&self.options.tapCb(this,fulldate,null);
                                            return;
                                        }
                                    }
                                }
                                self.setDayChecked(this);
                                self.options.tapCb&&self.options.tapCb(this,fulldate,isSelect);
                            });   
                        }
                        
                        day++;
                    }  
                }

                ul.appendChild(li);
            }
            ul.addEventListener("swipeleft",function(e){
                self.goNextMonth();
            });
            ul.addEventListener("swiperight",function(e){
                self.goLastMonth();
            });

        },

        setDayChecked:function(el)
        {
            var self = this;
            var current_day = parseInt(el.querySelector("span").innerHTML);
            var isSelect = el.classList.contains("selected") ? false : true;
            el.classList.toggle("selected");

            var current_m = (parseInt(self.month) + 1) ;
            var fulldate  = self.year +"-" + 
                            (current_m < 10 ? '0' + current_m : current_m) + "-" + 
                            (current_day < 10 ? '0' + current_day : current_day);

            if(isSelect){
                self.options.selected.push(fulldate);
            }else{
                for(var i=0; i < self.options.selected.length; i++) {
                    if(self.options.selected[i] == fulldate) {
                        self.options.selected.splice(i, 1);
                        break;
                    }
                }
            }
        },
        getSelected:function(){
            return this.options.selected;
        }
    };

    win.Calendar = Calendar;

})(window,document);
/**！
* 车牌号选择键盘
*/
;(function(win){

    var keyboardPicker = function()
    {
        this.cls = 'plugin-keyboard';
        this.elem = document.getElementById(arguments[0]);
        this.inputCallback = arguments[1];
    };

    keyboardPicker.prototype = {

        __init:function()
        {

            this.activeLi = null;

            this.__addInput();
            this.__bindEvent();
            this.__addStyle();
            if(typeof arguments[0] == 'string' && arguments[0] !== '')
                this.setPlateNo(arguments[0]);

            return this;
        },
        /**
        *  设置车牌号
        */
        setPlateNo: function(plateNo) 
        {
            var keys = this.elem.getElementsByTagName("li");
            if(typeof plateNo==='string'&& plateNo!==''){                
                for(var i=0;i<7;i++){
                    keys[i].innerHTML = plateNo[i]||"";     //修复资料中车牌不全时显示undefined的问题
                }
                this.plateInput.value = plateNo;
            } else {

                for(var i=0;i<7;i++){
                    keys[i].innerHTML = '';
                }
                this.plateInput.value = '#######';
            }
        },

        getPlateNo: function() 
        {
            return this.plateInput.value.replace(/#/g,'');
        },

        __addInput: function()
        {
            var input = document.createElement("input");
            input.setAttribute("type","hidden");
            input.value="#######";
            this.elem.appendChild(input);
            this.plateInput = input;

            return this;
        },

        __addStyle:function()
        {   
            //后面考虑把css移到这里
            return this;
        },

        __bindEvent: function(){
            var that = this;
            var childNodes = that.elem.getElementsByTagName("li");

            //输入框点击事件
            for(var i=0;i<childNodes.length;i++){
                childNodes[i].addEventListener("tap",function(e){
                    
                    //让其它输入框失去焦点，关闭系统键盘
                    that.__inputBlur();

                    var index = that.__getElemIndex(this,childNodes);
    
                    that.__activeInput(index);

                    that.__showSoftKeyBorad(index);

                    e.stopPropagation();
                });
            }

            //点击其它区域关闭键盘
            document.addEventListener("tap",function(e){
                that.__hideSoftKeyBorad();
            });
            return this;
        },

        __inputBlur:function()
        {
            var inputList = document.getElementsByTagName("input");
            var areaList = document.getElementsByTagName("textarea");
            if(inputList.length > 0){
                for (var x =0, len = inputList.length; x < len; x++){
                    inputList[x].blur();
                }
            }
            if(areaList.length > 0){

                for (var y =0, len = areaList.length; y < len; y++){
                    areaList[y].blur();
                }
            }
        },

        __nextLi: function()
        {
            if (this.activeIndex < 6){
                this.activeIndex += 1;
                this.__activeInput(this.activeIndex);
                this.__showSoftKeyBorad(this.activeIndex);
            }
            return this;
        },

        __activeInput:function(index)
        {
            if(index < 7){

                var childNodes = this.elem.getElementsByTagName("li");

                for(var j=0;j<childNodes.length;j++){
                    if(j === index){
                        childNodes[j].setAttribute('class','selected');
                        this.activeIndex = j;
                        this.activeLi = childNodes[j];
                    }else{
                        childNodes[j].removeAttribute('class');
                    }
                    
                }
            }
        },

        __showSoftKeyBorad: function(index)
        {    
            var keyBoardCls = ['province','alphabet','numberAlphabet'];

            var boardType = (index < 2) ? index:2;

            var clsName = this.cls + ' ' + keyBoardCls[boardType];
            var hasKey = this.__getElementsByClassName(clsName).length;

            //先隐藏所有键盘
            this.__hideAllKeyboard();
            if(hasKey === 0){
                if(boardType == 0)
                    this.__addProvinceKey();
                if(boardType == 1)
                    this.__addAlphKey();
                if(boardType == 2)
                    this.__addNumAlphKey();
            }
            //显示当前键盘
            this.__getElementsByClassName(clsName)[0].style.display="block";
        },

        __addProvinceKey:function()
        {
            var provice = ['京','沪','津','渝','黑','辽','蒙','冀','新','甘','青','陕','宁','豫','鲁','晋','皖','鄂','湘','苏','川','贵','桂','云','藏','浙','赣','闽','台','港','粤','澳','琼','琼'];
            this.__addKeyboard('province',provice);
        },

        __addAlphKey:function()
        {
            var chars = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

            this.__addKeyboard('alphabet',chars);
        },

        __addNumAlphKey:function()
        {
            var chars = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];       
            this.__addKeyboard('numberAlphabet',chars);
        },

        __addKeyboard:function(cls,keys)
        {
            var tempDiv = document.createElement("div");
            tempDiv.setAttribute('class',this.cls + ' ' + cls);
            
            var tempUl,tempLi;

            for(var i = 0,length = keys.length;i<length;i++){

                tempUl = tempUl || document.createElement("ul");

                tempLi = document.createElement("li");
                tempLi.innerHTML = keys[i];

                tempUl.appendChild(tempLi);

                if((i + 1) % 10 === 0 || i == length -1 ){

                    //处理最后一排按键居中
                    var mod = length % 10;
                    if(i== length -1 &&  mod > 0){
                        var dif = 10 - mod;
                        var offset = (((dif/2)/10)*100).toFixed(2);
                        tempUl.style.margin="0 "+offset+"%";
                    }   

                    tempDiv.appendChild(tempUl);

                    //阻止冒泡关闭键盘
                    tempUl.addEventListener("tap",function(e){
                        e.stopPropagation();    
                        return false;
                    });
                    tempUl = null;
                }
            }

            //阻止冒泡关闭键盘
            tempDiv.addEventListener("tap",function(e){
                e.stopPropagation();    
                return false;
            });
            document.body.appendChild(tempDiv);


            //键盘按键
            var that = this;
            var keys = tempDiv.getElementsByTagName("li");
            for(var n = 0 ,length = keys.length; n < length; n++){
                keys[n].addEventListener('tap',function(e){

                    var char = this.innerHTML;
                    
                    var currPlate = that.plateInput.value;
                    
                    currPlate = currPlate.slice(0,that.activeIndex) + char + currPlate.slice(that.activeIndex+1);
     
                    that.plateInput.value = currPlate;
                    that.activeLi.innerHTML = char;

                    that.__nextLi();

                    that.inputCallback && that.inputCallback(char,that.activeIndex - 1);
                    e.stopPropagation();
                });
            }
            
        },

        __hideSoftKeyBorad: function(){
            if (this.activeLi !== null)
                this.activeLi.removeAttribute('class');
            this.__hideAllKeyboard();
        },

        __hideAllKeyboard:function()
        {
            var keyList = this.__getElementsByClassName(this.cls);
            for(var j=0,length=keyList.length;j<length;j++){
                keyList[j].style.display="none";
            }
        },



        //根据类名成获取DOM对象
        __getElementsByClassName:function(className)
        { 
            // 查找所有匹配标签 
            var allTags = document.getElementsByTagName("*"); 
            var classElements = []; 

            // 创建一个正则表达是来判断className的正确性 
            className = className.replace(/\-/g, "\\-"); 
            var regex = new RegExp("(^|\\s)" + className + "(\\s|$)"); 
            var elenemt; 
            // 检查每个元素 
            for(var i=0; i<allTags.length; i++){ 
                elem = allTags[i]; 
                if(regex.test(elem.className)){ 
                    classElements.push(elem); 
                } 
            } 
            return classElements; 
        },

        //获取元素的索引下标
        __getElemIndex: function(current, obj){ 
            for (var i = 0, length = obj.length; i<length; i++) { 
                if (obj[i] == current) { 
                    return i; 
                } 
            } 
        }


    };


    win.keyboardPicker = function()
    {
        //按键回调函数
        var cb = (arguments.length > 1 && typeof arguments[1] === 'function') ? arguments[1] : null;
        var picker = new keyboardPicker(arguments[0],cb);
        return picker.__init(arguments[1]||"");
    };

})(window);