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
                // 此处事件必须绑定为click，否则无法关闭系统键盘
                childNodes[i].addEventListener("click",function(e){
                    
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
            var provice = ['京','沪','津','渝','冀','晋','蒙','辽','吉','黑','苏','浙','皖','闽','赣','鲁','豫','鄂','湘','粤','桂','琼','川','贵','云','藏','陕','甘','青','宁','新'];
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