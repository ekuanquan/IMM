package com.znyw.tool;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtil {
	
	 /**
     * 获取当前时间
     * 
     * @return
     */
    public static String getNow() {
    	return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
    }
	
	/**
     * 将日期字符串转成连起的字符串+7位随机数
     * @param time  yyyy-MM-dd HH:mm:ss
     */
    public static String TimeToStrSix(String time) {
    	String s1 = time.replace("-","");
    	String s2 = s1.replace(" ","");
    	String s3 = s2.replace(":","");
    	int i =(int)((Math.random()*9+1)*1000000);
    	String Si = String.valueOf(i);
    	StringBuffer stringBuffer = new StringBuffer(s3);
    	stringBuffer.append(Si);
    	String string = stringBuffer.toString();
		return string;
	}
    
    /**
     * 10位随机数
     * @param 
     */
    public static String ten() {
    	int i =(int)((Math.random()*9+1)*1000000000);
    	String Si = String.valueOf(i);
		return Si;
	}
}
