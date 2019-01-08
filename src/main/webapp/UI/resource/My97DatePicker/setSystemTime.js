/**
 * Created by Administrator on 2015/9/22 0022.
 */
/*-----
function:获取当天凌晨0时0分0秒作为开始时间，当前系统时间作为结束时间
return：返回字符串，用分号隔开，第一个为开始时间，第二个为结束时间*/
function getSystemTime(){
    var inner = "";
    var inner1= "";
    var NowTime =new Date();

    var Date_Year = NowTime.getFullYear();
    var Date_Month= NowTime.getMonth()+1;
    var Data_Date = NowTime.getDate();
    var Data_Hours= NowTime.getHours();
    var Data_Minutes=NowTime.getMinutes();
    var Data_Seconds=NowTime.getSeconds();
    inner=Date_Year+"-";
    if(Date_Month<10)  inner +="0"+Date_Month+"-";
    else inner +=Date_Month+"-";
    if(Data_Date<10)  inner +="0"+Data_Date+" ";
    else inner +=Data_Date+" ";
    if(Data_Hours<10)  inner +="0"+Data_Hours+":";
    else inner +=Data_Hours+":";
    if(Data_Minutes<10)  inner +="0"+Data_Minutes+":";
    else inner +=Data_Minutes+":";
    if(Data_Seconds<10)  inner +="0"+Data_Seconds;
    else inner +=Data_Seconds;

    inner1=Date_Year+"-";
    if(Date_Month<10)  inner1 +="0"+Date_Month+"-";
    else inner1 +=Date_Month+"-";
    if(Data_Date<10)  inner1 +="0"+Data_Date+" ";
    else inner1 +=Data_Date+" ";
    inner1+="00:00:00";
    return inner1+";"+inner;
    //2天前
    //var NowTimeTmp= new Date().getTime()-172800000;
    //var NowTime1 = new Date(NowTimeTmp);
    //var Date_Yeat1 = NowTime1.getFullYear();
    //var Data_Date1 = NowTime1.getDate();
    //var Data_Hours1 = NowTime1.getHours();
    //var Date_Month1 = NowTime1.getMonth() + 1;
    //var Data_Minutes1 = NowTime1.getMinutes();
    //var Data_Seconds1 = NowTime1.getSeconds();
    //// var inner1 = Date_Yeat1+ "-" + Date_Month1 + "-" + Data_Date1 + " " + Data_Hours1 + ":" + Data_Minutes1 + ":" + Data_Seconds1;
    //var inner1=Date_Yeat1+"-";
    //if(Date_Month1<10)  inner1 +="0"+Date_Month1+"-";
    //else inner1 +=Date_Month1+"-";
    //if(Data_Date1<10)  inner1 +="0"+Data_Date1+" ";
    //else inner1 +=Data_Date1+" ";
    //if(Data_Hours1<10)  inner1 +="0"+Data_Hours1+":";
    //else inner1 +=Data_Hours1+":";
    //if(Data_Minutes1<10)  inner1 +="0"+Data_Minutes1+":";
    //else inner1 +=Data_Minutes1+":";
    //if(Data_Seconds1<10)  inner1 +="0"+Data_Seconds1;
    //else inner1 +=Data_Seconds1;
    //document.getElementById("CaseList_Query_startTime").value=inner1;
    //document.getElementById("CaseList_Query_endTime").value=inner;
}