package com.znyw.tool;

import java.text.SimpleDateFormat;
import java.util.Date;

import com.alibaba.fastjson.JSONObject;

public class ErrorAbnormal {
	
	/**
	 * 查询数据无结果
	 * @return
	 */
	public JSONObject noResult(){
		JSONObject error = new JSONObject() ;
		JSONObject errorResult = new JSONObject() ;
		JSONObject errorUserInformation = new JSONObject();
		errorResult.put("message", "Error");
		errorResult.put("code", "401");
		error.put("result", errorResult);
		error.put("userInformation", errorUserInformation);
		System.out.println(error);
		return error;
	}
	
	
	public static long timeToTen() { 
		  Date dNow = new Date();
	      SimpleDateFormat ft = new SimpleDateFormat ("yyMMddhhmmss");
	      long num = Long.valueOf(ft.format(dNow)).longValue();	
	      return num;
	}
	
}
