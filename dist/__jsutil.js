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
String.prototype = {

    /**
    * 去除字符串左右两边标签，默认去空格
    * @param string tag 要去除的标签
    * @return 去除标签后的新字符串
    */
    trim:function(tag)
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
    },

    /**
    * 去掉左空格
    */
    ltrim:function()  
    {  
        return this.replace(/(^\s*)/g, "");  
    },


    /**
    * 去掉右空格
    */
    rtrim:function()  
    {  
        return this.replace(/(\s*$)/g, "");  
    },  

    /**
    * 字符串是否以tag开始
    * @param string tag 检测字符
    * @return boolean 
    *
    */
    startWith:function(tag){
        return this.substring(0, tag.length) == tag;
    },

    /**
    * 字符串是否以tag结尾
    * @param string tag 检测字符
    * @return boolean 
    */
    endWith:function(tag){
        return this.substring(this.length - tag.length) == tag;
    },

    /**
    * 将字符串中的s1全部替换成s2
    * @param string 被替换的字符串
    * @param string 替换字符串
    * @return 替换以后的新字符串
    */
    replaceAll:function(s1,s2){
        return this.replace(new RegExp(s1,"gm"),s2);
    } 

};
/**
*   扩展JS内容Date对象
*/

Date.prototype = {

    //定义一些常用的日期格式的常量     
    DEFAULT_DATE_FORMAT: 'yyyy-MM-dd',    
    DEFAULT_MONTH_FORMAT: 'yyyy-MM',    
    DEFAULT_YEAR_FORMAT: 'yyyy',    
    DEFAULT_TIME_FORMAT: 'HH:mm:ss',    
    DEFAULT_DATETIME_FORMAT: 'yyyy-MM-dd HH:mm:ss',    
    DEFAULT_YEAR: 'YEAR',    
    DEFAULT_MONTH: 'MONTH',    
    DEFAULT_DATE: 'DATE',    
    DEFAULT_HOUR: 'HOUR',    
    DEFAULT_MINUTE: 'MINUTE',    
    DEFAULT_SECOND: 'SECOND',    


    /**
     * 根据给定的格式把时间戳格式化，和PHP的date作用相同
     * @param  {string} format    格式
     * @param  {int}    timestamp 要格式化的时间 默认为当前时间 以秒为单位
     * @return {string}           格式化的时间字符串
     */
    date:function(format, timestamp)
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
    },



    /**  
     * 根据给定的日期时间格式，格式化当前日期  
     * @params strFormat 格式化字符串， 如："yyyy-MM-dd" 默认格式为：“yyyy-MM-dd HH:mm:ss”  
     * @return 返回根据给定格式的字符串表示的时间日期格式<br>  
     *         如果传入不合法的格式，则返回日期的字符串格式{@see Date#toLocaleString()}  
     */    
    format: function(strFormat,date)
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
    },    



   


    /**  
     * 比较两个日期的差距  
     * @param date1 Date类型的时间  
     * @param date2 Dete 类型的时间  
     * @param isFormat boolean 是否对得出的时间进行格式化,<br>   
     *       false:返回毫秒数，true：返回格式化后的数据  
     * @return 返回两个日期之间的毫秒数 或者是格式化后的结果  
     */    
    compareTo: function(date1, date2, isFormat)
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
    },   


    /**
    * 获取当前时间戳 默认以分为单位
    * @param unit_msec boolean 当为ture时以毫秒为单位
    * @return 当前时间戳的毫秒数或描述
    */
    getCurrentStamp:function(unit_msec)
    {
        if(unit_msec)
            return new Date().getTime();

        return Math.round((new Date().getTime()) / 1000 );
    }


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