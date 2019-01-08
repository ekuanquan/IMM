    //获取当前时间
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
        return currentdate;
    }
    //获取3天前的时间
    function getBeforeFormatDate() {
        var date = new Date();
        //获取3天前的时间
        var time = (date.getTime() - 259200000);
        time = formatDateTime(time);
        return time;
    }
    //获取一周前时间
    function getBeforeWeekFormatDate() {
        var date = new Date();
        //获取3天前的时间
        var time = (date.getTime() - 604800000);
        time = formatDateTime(time);
        return time;
    }

    //获取一天前时间
    function getBeforeDayFormatDate() {
        var date = new Date();
        var time = (date.getTime() - 86400000);
        time = formatDateTime(time);
        return time;
    }

     //时间戳转换成 yyyy-MM-dd HH:mm:ss
     function formatDateTime(inputTime) {
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    };

    function getNowYearMonth(){
       var date=new Date;
       var year=date.getFullYear(); 
       var month=date.getMonth()+1;
       month =(month<10 ? "0"+month:month); 
       var mydate = (year.toString()+"-"+month.toString());
       return mydate;
   }



   /* var now = new Date();
    var nowTime = now.getTime() ;
    var day = now.getDay();
    var oneDayLong = 24*60*60*1000 ;


    var MondayTime = nowTime - (day-1)*oneDayLong  ;
    var SundayTime =  nowTime + (7-day)*oneDayLong ;


    var monday = new Date(MondayTime);
    var sunday = new Date(SundayTime);
    console.log(monday) ;
    console.log(sunday) ;*/
   /*
    function getWeekTime() {
        var now = new Date();
        var nowTime = now.getTime() ;
        var day = now.getDay();
        var oneDayLong = 24*60*60*1000 ;


        var MondayTime = nowTime - (day-1)*oneDayLong  ;
        var SundayTime =  nowTime + (7-day)*oneDayLong ;


        var monday = new Date(MondayTime);
        var sunday = new Date(SundayTime);
        monday = formatDateTime(monday);
        sunday = formatDateTime(sunday);
        return monday+";"+sunday;
    }*/
    
    function getMonday() {
        var now = new Date();
        var nowTime = now.getTime() ;
        var day = now.getDay();
        var oneDayLong = 24*60*60*1000 ;
        var MondayTime = nowTime - (day-1)*oneDayLong  ;
        var monday = new Date(MondayTime);
        monday = formatDateTime(monday);
        return monday;
    }
    function getSunday() {
        var now = new Date();
        var nowTime = now.getTime() ;
        var day = now.getDay();
        var oneDayLong = 24*60*60*1000 ;
        var SundayTime =  nowTime + (7-day)*oneDayLong ;
        var sunday = new Date(SundayTime);
        sunday = formatDateTime(sunday);
        return sunday;
    }
    
    function getStartTime() {
        var startTime = new Date(0);
        startTime = formatDateTime(startTime);
        return startTime;
    }

    function getTodayTime() {
        var oneDayLong = 24*60*60*1000 ;
        var now = new Date();
        var nowTime = now.getTime() ;
        var beforTime = nowTime - oneDayLong;
        var afterTime = nowTime + oneDayLong;
        var yestoday = formatDateTime(beforTime);
        yestoday = yestoday.split(" ")[0]+" 23:59:59";
        var afterday = formatDateTime(afterTime);
        afterday = afterday.split(" ")[0]+" 00:00:00";
        return yestoday+';'+afterday;
    }
    function getYestodayTime() {
        var oneDayLong = 24*60*60*1000 ;
        var now = new Date();
        var nowTime = now.getTime() - oneDayLong;
        var beforTime = nowTime - oneDayLong;
        var afterTime = nowTime + oneDayLong;
        var yestoday = formatDateTime(beforTime);
        yestoday = yestoday.split(" ")[0]+" 23:59:59";
        var afterday = formatDateTime(afterTime);
        afterday = afterday.split(" ")[0]+" 00:00:00";
        return yestoday+';'+afterday;var now = new Date();
        var nowTime = now.getTime() ;
    }
    
    function getWeekTime() {
        var now = new Date();
        var nowTime = now.getTime() ;
        var day = now.getDay();
        var oneDayLong = 24*60*60*1000 ;
        var sevenDayLong = 7*24*60*60*1000 ;
        if(day == 0){
            nowTime -= sevenDayLong;
        }



        var MondayTime = nowTime - (day-1)*oneDayLong + sevenDayLong;
        var SundayTime =  nowTime + (7-day)*oneDayLong - sevenDayLong;


        var monday = new Date(MondayTime);
        var sunday = new Date(SundayTime);
        monday = formatDateTime(monday);
        sunday = formatDateTime(sunday);
        monday = monday.split(" ")[0]+" 00:00:00";
        sunday = sunday.split(" ")[0]+" 23:59:59";
        return sunday+";"+monday;
    }
    function getMonthTime() {
        var now = new Date();
        var nowTime = now.getTime() ;
        var date = now.getDate();

        var month = now.getMonth();
        var year = now.getYear();
        var monthCount = DayNumOfMonth(year,month);

        var oneDayLong = 24*60*60*1000 ;
        var beforTime = nowTime - ((date)*oneDayLong);
        var endTime =  nowTime +(monthCount-date+1)*oneDayLong ;
        var befor = new Date(beforTime);
        var end = new Date(endTime);
        befor = formatDateTime(befor);
        end = formatDateTime(end);
        befor = befor.split(" ")[0]+" 23:59:59";
        end = end.split(" ")[0]+" 00:00:00";
        return befor+";"+end;
    }

    function getAllTime(){
        var oneDayLong = 24*60*60*1000 ;
        var now = new Date();
        var nowTime = now.getTime();
        var beforeTime = formatDateTime(0);
        var afterTime = nowTime + oneDayLong;
        var afterday = formatDateTime(afterTime);
        afterday = afterday.split(" ")[0]+" 00:00:00";
        return beforeTime+';'+afterday;
    }
    function DayNumOfMonth(Year,Month)
    {
        return 32-new Date(Year,Month,32).getDate();
    }

    function formatNVRDateTime(inputTime) {
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '' + m + '' + d + 'T' + h + '' + minute + '' + second;
    };

//获取半年前时间
    function getBeforeHalfYearFormatDate() {
        var date = new Date();
        var time = (date.getTime() - 15552000000);
        time = formatDateTime(time);
        return time;
    }