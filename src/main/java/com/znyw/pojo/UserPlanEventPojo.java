package com.znyw.pojo;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class UserPlanEventPojo {
	private String userId                ="";//用户编号                          
	private String starDateTime          ="";//任务开始时间                      
	private String overDateTime          ="";//任务结束时间                      
	private int noRptChecksymbol         =0;//是否无报告检查启用（0：否；1：是）
	private int noRptCheckHour           =0;//检查小时数                        
	private String lastNoRptCheckDateTime="";//上次执行时间（无报警检查）
	private String dataFrom;

	public String getDataFrom() {
		return dataFrom;
	}

	public void setDataFrom(String dataFrom) {
		this.dataFrom = dataFrom;
	}

	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getStarDateTime() {
		return starDateTime;
	}
	public void setStarDateTime(String starDateTime) {
		if(starDateTime == null || "".equals(starDateTime)){
			starDateTime = "";
		}
		else{
			try {
				Date date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(starDateTime);
				String dateFomat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date);
				this.starDateTime = dateFomat;
			} catch (ParseException e) {
				e.printStackTrace();
			} 
		}
	}
	public String getOverDateTime() {
		return overDateTime;
	}
	public void setOverDateTime(String overDateTime) {
		if(overDateTime == null || "".equals(overDateTime)){
			overDateTime = "";
		}
		else{
			try {
				Date date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(overDateTime);
				String dateFomat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date);
				this.overDateTime = dateFomat;
			} catch (ParseException e) {
				e.printStackTrace();
			} 
		}
	}
	public int getNoRptChecksymbol() {
		return noRptChecksymbol;
	}
	public void setNoRptChecksymbol(int noRptChecksymbol) {
		this.noRptChecksymbol = noRptChecksymbol;
	}
	public int getNoRptCheckHour() {
		return noRptCheckHour;
	}
	public void setNoRptCheckHour(int noRptCheckHour) {
		this.noRptCheckHour = noRptCheckHour;
	}
	public String getLastNoRptCheckDateTime() {
		return lastNoRptCheckDateTime;
	}
	public void setLastNoRptCheckDateTime(String lastNoRptCheckDateTime) {

		if(lastNoRptCheckDateTime == null || "".equals(lastNoRptCheckDateTime)){
			lastNoRptCheckDateTime = "";
		}
		else{
			try {
				Date date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(lastNoRptCheckDateTime);
				String dateFomat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date);
				this.lastNoRptCheckDateTime = dateFomat;
			} catch (ParseException e) {
				e.printStackTrace();
			} 
		}
	}
	@Override
	public String toString() {
		return "UserPlanEventPojo [userId=" + userId + ", starDateTime="
				+ starDateTime + ", overDateTime=" + overDateTime
				+ ", noRptChecksymbol=" + noRptChecksymbol
				+ ", noRptCheckHour=" + noRptCheckHour
				+ ", lastNoRptCheckDateTime=" + lastNoRptCheckDateTime + "]";
	}
	
}
