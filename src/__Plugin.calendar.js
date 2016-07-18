;(function(win,doc,undefined){
    
    var Calendar = function(options)
    {
        var self = this;
        var defaults = {
            month:'current',        //显示月份 默认为当前月份 next表示下月 last表示上月
            selected:[],            //选中的日期
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

            this.options.selected = [];     //清空已选择日期
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
            monthDiv.innerHTML = '<span class="mui-icon mui-icon-arrowleft"></span>'+
                    '<b class="calendar-month-show"></b>'+
                    '<span class="mui-icon mui-icon-arrowright"></span>';
            self.elem.appendChild(monthDiv);

            var weekDiv = doc.createElement("div");
            weekDiv.className = "calendar-title";

            weekDiv.innerHTML ='<a>日</a><a>一</a><a>二</a><a>三</a><a>四</a><a>五</a><a>六</a>';
            self.elem.appendChild(weekDiv);  

            self.elem.querySelector(".mui-icon-arrowleft").addEventListener("tap",function(){
                self.goLastMonth();
            });
            self.elem.querySelector(".mui-icon-arrowright").addEventListener("tap",function(){
                self.goNextMonth();
            });
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
            this.elem.querySelector(".calendar-month-show").innerHTML = this.year + ' / ' + (parseInt(this.month) + 1);            
        },
        setDateList:function(){

            var self = this;
            var days = new Date(self.year,self.month + 1,0).getDate();

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

            var day = 1,day_class,selectable;
            for(var i = 0;i < max_line * 7;i++){
                var li = doc.createElement("li");
                if(day <= days){
                    if(i >= week_start){
                        li.innerHTML = day;
                        day_class = '';
                        selectable = true;  //日历是否可选择
                        if(current_year > self.year ||(current_year == self.year && current_month > self.month) || (current_year == self.year && current_month == self.month && current_date > day)){
                            day_class = 'pass';
                            selectable = self.options.pastSelectable;
                        }

                        if(~self.options.selected.indexOf(day)){
                            day_class = 'selected';
                        }
                        if(self.year == current_year && self.month == current_month && day == current_date){
                            selectable = self.options.todaySelectable;     
                            day_class = 'today';
                        }
                        li.className = day_class;

                        if(selectable){
                            li.addEventListener("tap",function(e){

                                var current_day = parseInt(this.innerHTML);
                                var isSelect = this.classList.contains("selected") ? false : true;
                                
                                self.setDayChecked(this);

                                var fulldate  = self.year +"-" + self.month  + "-" + current_day;
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
            var current_day = parseInt(el.innerHTML);
            var isSelect = el.classList.contains("selected") ? false : true;
            el.classList.toggle("selected");

            if(isSelect){
                self.options.selected.push(current_day);
            }else{
                for(var i=0; i < self.options.selected.length; i++) {
                    if(self.options.selected[i] == current_day) {
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