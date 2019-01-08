package com.znyw.pojo;
/**
 * 添加报警主机对象
 * @author ywhl
 *
 */
public class AlarmhostPojo {

	String devId = "";
	String devName = "";
	String pnlActID = "";
	String areaId = "";
	String devType = "";
	String devModelId = "";
	String instMan = "";   
	String telAddr = "";  //imm_alarmhostattr
	String pnlTel = "";  //imm_alarmhostattr
	String devInstDate = "";
	String devLng = "";
	String devlat = "";
	String keyboardAddr = "";  //imm_alarmhostattr
	String pnlAddr = "";
	String pnlPowerAddr = ""; //imm_alarmhostattr
	String instUnit = "";
	String pnlHdTel = "";   //imm_alarmhostattr
	String RegexPWD = "";  //imm_alarmhostattr
	String fMemo = "";
	String devIndex = "";  //imm_alarmhostattr
	int devState;
	String areaName=""; //imm_area
	String devTypeName = "";//imm_devtype
	String devModelName="";//imm_devmodel
	String passCode="";
	String devLoginPwd="";
	String userId="";
	String manufacturer="";
	String ownerId = "";
	String platformId = "";
	String platformName = "";
	
	
	public String getPlatformId() {
		return platformId;
	}

	public void setPlatformId(String platformId) {
		this.platformId = platformId;
	}

	public String getPlatformName() {
		return platformName;
	}

	public void setPlatformName(String platformName) {
		this.platformName = platformName;
	}

	public String getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(String ownerId) {
		this.ownerId = ownerId;
	}
	public String getManufacturer() {
		return manufacturer;
	}
	public void setManufacturer(String manufacturer) {
		this.manufacturer = manufacturer;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getDevLoginPwd() {
		return devLoginPwd;
	}
	public void setDevLoginPwd(String devLoginPwd) {
		this.devLoginPwd = devLoginPwd;
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
	public String getPnlActID() {
		return pnlActID;
	}
	public void setPnlActID(String pnlActID) {
		this.pnlActID = pnlActID;
	}
	public String getAreaId() {
		return areaId;
	}
	public void setAreaId(String areaId) {
		this.areaId = areaId;
	}
	public String getDevType() {
		return devType;
	}
	public void setDevType(String devType) {
		this.devType = devType;
	}
	public String getDevModelId() {
		return devModelId;
	}
	public void setDevModelId(String devModelId) {
		this.devModelId = devModelId;
	}
	public String getInstMan() {
		return instMan;
	}
	public void setInstMan(String instMan) {
		this.instMan = instMan;
	}
	public String getTelAddr() {
		return telAddr;
	}
	public void setTelAddr(String telAddr) {
		this.telAddr = telAddr;
	}
	public String getPnlTel() {
		return pnlTel;
	}
	public void setPnlTel(String pnlTel) {
		this.pnlTel = pnlTel;
	}
	public String getDevInstDate() {
		return devInstDate;
	}
	public void setDevInstDate(String devInstDate) {
		this.devInstDate = devInstDate;
	}
	public String getDevLng() {
		return devLng;
	}
	public void setDevLng(String devLng) {
		this.devLng = devLng;
	}
	public String getDevlat() {
		return devlat;
	}
	public void setDevlat(String devlat) {
		this.devlat = devlat;
	}
	public String getKeyboardAddr() {
		return keyboardAddr;
	}
	public void setKeyboardAddr(String keyboardAddr) {
		this.keyboardAddr = keyboardAddr;
	}
	public String getPnlAddr() {
		return pnlAddr;
	}
	public void setPnlAddr(String pnlAddr) {
		this.pnlAddr = pnlAddr;
	}
	public String getPnlPowerAddr() {
		return pnlPowerAddr;
	}
	public void setPnlPowerAddr(String pnlPowerAddr) {
		this.pnlPowerAddr = pnlPowerAddr;
	}
	public String getInstUnit() {
		return instUnit;
	}
	public void setInstUnit(String instUnit) {
		this.instUnit = instUnit;
	}
	public String getPnlHdTel() {
		return pnlHdTel;
	}
	public void setPnlHdTel(String pnlHdTel) {
		this.pnlHdTel = pnlHdTel;
	}
	public String getRegexPWD() {
		return RegexPWD;
	}
	public void setRegexPWD(String regexPWD) {
		RegexPWD = regexPWD;
	}
	public String getfMemo() {
		return fMemo;
	}
	public void setfMemo(String fMemo) {
		this.fMemo = fMemo;
	}
	public String getDevIndex() {
		return devIndex;
	}
	public void setDevIndex(String devIndex) {
		this.devIndex = devIndex;
	}
	public int getDevState() {
		return devState;
	}
	public void setDevState(int devState) {
		this.devState = devState;
	}
	public String getAreaName() {
		return areaName;
	}
	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}
	public String getDevTypeName() {
		return devTypeName;
	}
	public void setDevTypeName(String devTypeName) {
		this.devTypeName = devTypeName;
	}
	public String getDevModelName() {
		return devModelName;
	}
	public void setDevModelName(String devModelName) {
		this.devModelName = devModelName;
	}
	public String getPassCode() {
		return passCode;
	}
	public void setPassCode(String passCode) {
		this.passCode = passCode;
	}
	public AlarmhostPojo() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
	@Override
	public String toString() {
		return "alarmhostPojo [devId=" + devId + ", devName=" + devName
				+ ", pnlActID=" + pnlActID + ", areaId=" + areaId
				+ ", devType=" + devType + ", devModelId=" + devModelId
				+ ", instMan=" + instMan + ", telAddr=" + telAddr + ", pnlTel="
				+ pnlTel + ", devInstDate=" + devInstDate + ", devLng="
				+ devLng + ", devlat=" + devlat + ", keyboardAddr="
				+ keyboardAddr + ", pnlAddr=" + pnlAddr + ", pnlPowerAddr="
				+ pnlPowerAddr + ", instUnit=" + instUnit + ", pnlHdTel="
				+ pnlHdTel + ", RegexPWD=" + RegexPWD + ", fMemo=" + fMemo
				+ ", devIndex=" + devIndex + ", devState=" + devState
				+ ", areaName=" + areaName + ", devTypeName=" + devTypeName
				+ ", devModelName=" + devModelName + ", passCode=" + passCode
				+ ", devLoginPwd=" + devLoginPwd + ", userId=" + userId
				+ ", manufacturer=" + manufacturer + "]";
	}
	public AlarmhostPojo(String devId, String devName, String pnlActID,
			String areaId, String devType, String devModelId, String instMan,
			String telAddr, String pnlTel, String devInstDate, String devLng,
			String devlat, String keyboardAddr, String pnlAddr,
			String pnlPowerAddr, String instUnit, String pnlHdTel,
			String regexPWD, String fMemo, String devIndex, int devState,
			String areaName, String devTypeName, String devModelName,
			String passCode, String devLoginPwd, String userId,
			String manufacturer) {
		super();
		this.devId = devId;
		this.devName = devName;
		this.pnlActID = pnlActID;
		this.areaId = areaId;
		this.devType = devType;
		this.devModelId = devModelId;
		this.instMan = instMan;
		this.telAddr = telAddr;
		this.pnlTel = pnlTel;
		this.devInstDate = devInstDate;
		this.devLng = devLng;
		this.devlat = devlat;
		this.keyboardAddr = keyboardAddr;
		this.pnlAddr = pnlAddr;
		this.pnlPowerAddr = pnlPowerAddr;
		this.instUnit = instUnit;
		this.pnlHdTel = pnlHdTel;
		RegexPWD = regexPWD;
		this.fMemo = fMemo;
		this.devIndex = devIndex;
		this.devState = devState;
		this.areaName = areaName;
		this.devTypeName = devTypeName;
		this.devModelName = devModelName;
		this.passCode = passCode;
		this.devLoginPwd = devLoginPwd;
		this.userId = userId;
		this.manufacturer = manufacturer;
	}

	
	
}
