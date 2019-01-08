package com.znyw.pojo;

/**
 * 相关设备信息对象封装
 * @author ywhl
 *
 */
public class DeviceInfo {
	String devId;
	String devName;
	String areaId;
	String areaName;
	String devTypeId;
	String devTypeName;
	String devModelId;
	String devModelName;
	String devAddr;
	String installUnit;
	String installName;
	String installDate;
	String powerAddr;
	String keyboardAddr;
	String internetTel;
	String TelAddr;
	String wirelessTel;
	String accountNum;
	String fMemo;
	String devIP;
	String devPort;
	String loginName;
	String loginPass;
	String devTutkID;
	String devChannelSum;
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
	public String getDevTypeId() {
		return devTypeId;
	}
	public void setDevTypeId(String devTypeId) {
		this.devTypeId = devTypeId;
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
	public String getDevAddr() {
		return devAddr;
	}
	public void setDevAddr(String devAddr) {
		this.devAddr = devAddr;
	}
	public String getInstallUnit() {
		return installUnit;
	}
	public void setInstallUnit(String installUnit) {
		this.installUnit = installUnit;
	}
	public String getInstallName() {
		return installName;
	}
	public void setInstallName(String installName) {
		this.installName = installName;
	}
	public String getInstallDate() {
		return installDate;
	}
	public void setInstallDate(String installDate) {
		this.installDate = installDate;
	}
	public String getPowerAddr() {
		return powerAddr;
	}
	public void setPowerAddr(String powerAddr) {
		this.powerAddr = powerAddr;
	}
	public String getKeyboardAddr() {
		return keyboardAddr;
	}
	public void setKeyboardAddr(String keyboardAddr) {
		this.keyboardAddr = keyboardAddr;
	}
	public String getInternetTel() {
		return internetTel;
	}
	public void setInternetTel(String internetTel) {
		this.internetTel = internetTel;
	}
	public String getTelAddr() {
		return TelAddr;
	}
	public void setTelAddr(String telAddr) {
		TelAddr = telAddr;
	}
	public String getWirelessTel() {
		return wirelessTel;
	}
	public void setWirelessTel(String wirelessTel) {
		this.wirelessTel = wirelessTel;
	}
	public String getAccountNum() {
		return accountNum;
	}
	public void setAccountNum(String accountNum) {
		this.accountNum = accountNum;
	}
	public String getfMemo() {
		return fMemo;
	}
	public void setfMemo(String fMemo) {
		this.fMemo = fMemo;
	}
	public String getDevIP() {
		return devIP;
	}
	public void setDevIP(String devIP) {
		this.devIP = devIP;
	}
	public String getDevPort() {
		return devPort;
	}
	public void setDevPort(String devPort) {
		this.devPort = devPort;
	}
	public String getLoginName() {
		return loginName;
	}
	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}
	public String getLoginPass() {
		return loginPass;
	}
	public void setLoginPass(String loginPass) {
		this.loginPass = loginPass;
	}
	public String getDevTutkID() {
		return devTutkID;
	}
	public void setDevTutkID(String devTutkID) {
		this.devTutkID = devTutkID;
	}
	public String getDevChannelSum() {
		return devChannelSum;
	}
	public void setDevChannelSum(String devChannelSum) {
		this.devChannelSum = devChannelSum;
	}
	@Override
	public String toString() {
		return "Equipment [devId=" + devId + ", devName=" + devName
				+ ", areaId=" + areaId + ", areaName=" + areaName
				+ ", devTypeId=" + devTypeId + ", devTypeName=" + devTypeName
				+ ", devModelId=" + devModelId + ", devModelName="
				+ devModelName + ", devAddr=" + devAddr + ", installUnit="
				+ installUnit + ", installName=" + installName
				+ ", installDate=" + installDate + ", powerAddr=" + powerAddr
				+ ", keyboardAddr=" + keyboardAddr + ", internetTel="
				+ internetTel + ", TelAddr=" + TelAddr + ", wirelessTel="
				+ wirelessTel + ", accountNum=" + accountNum + ", fMemo="
				+ fMemo + ", devIP=" + devIP + ", devPort=" + devPort
				+ ", loginName=" + loginName + ", loginPass=" + loginPass
				+ ", devTutkID=" + devTutkID + ", devChannelSum="
				+ devChannelSum + "]";
	}
	public DeviceInfo() {
		super();
		// TODO Auto-generated constructor stub
	}
	
}
