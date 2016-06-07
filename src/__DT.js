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

