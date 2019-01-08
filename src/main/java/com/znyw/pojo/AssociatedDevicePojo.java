package com.znyw.pojo;

public class AssociatedDevicePojo {
	private String userId;			//用户id
	private String devId;			//设备编号
	private String devName;			//设备名称
	private String devType;			//设备类型id
	private String devTypeName;		//设备类型名称
	private String devModelId;		//设备型号id
	private String devModelName;	//设备型号名称
	private String areaId;			//区域id
	private String areaName;		//区域名称
	private String devState;		//设备状态 		2017-08-07 新增
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getDevId() {
		return devId;
	}
	public void setDevId(String devId) {
		this.devId = devId;
	}
	public String getDevName() {
		return devName;
	}
	public void setDevName(String devName) {
		this.devName = devName;
	}
	public String getDevType() {
		return devType;
	}
	public void setDevType(String devType) {
		this.devType = devType;
	}
	public String getDevTypeName() {
		return devTypeName;
	}
	public void setDevTypeName(String devTypeName) {
		this.devTypeName = devTypeName;
	}
	public String getDevModelId() {
		return devModelId;
	}
	public void setDevModelId(String devModelId) {
		this.devModelId = devModelId;
	}
	public String getDevModelName() {
		return devModelName;
	}
	public void setDevModelName(String devModelName) {
		this.devModelName = devModelName;
	}
	public String getAreaId() {
		return areaId;
	}
	public void setAreaId(String areaId) {
		this.areaId = areaId;
	}
	public String getAreaName() {
		return areaName;
	}
	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}
	public String getDevState() {
		return devState;
	}
	public void setDevState(String devState) {
		this.devState = devState;
	}
	@Override
	public String toString() {
		return "AssociatedDevicePojo [userId=" + userId + ", devId=" + devId + ", devName=" + devName + ", devType="
				+ devType + ", devTypeName=" + devTypeName + ", devModelId=" + devModelId + ", devModelName="
				+ devModelName + ", areaId=" + areaId + ", areaName=" + areaName + ", devState=" + devState + "]";
	}
	
	
}
