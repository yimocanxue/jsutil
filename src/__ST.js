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