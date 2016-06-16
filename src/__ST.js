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
String.prototype.sizeof = function()
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



