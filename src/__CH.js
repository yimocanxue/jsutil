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