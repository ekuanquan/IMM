package com.znyw.pojo;

public class Relatinfor {
	String accountNum = "";//用户编号（机主）（店家）
	String accountName = "";//用户名称
	String accountAddr = "";//用户地址
	String accountZone = "";//用户防区
	String devId = "";//设备编号
	String devZoneId = "";//设备防区
	String devType = "";//
	String devModelName = "";//设备型号
	String zoneAtPos = "";//防区位置
	String snType = "";//探头类型
	String almType = "";//警情类型
	String wantDo = "";//反应类型
	String snTypeName = "";//探头类型mingzi
	String almTypeName = "";//警情类型mingzi
	String wantDoName = "";//反应类型mingzi
	String isCallAbnor = "";//来电异常
	String callID = "";//来电显示
	String areaId = "";;//区域编号
	String areaName = "";//区域名称
	String snModelName = "";//探头型号
	String sysCode = "";//系统码编号
	String eventDesc = "";  //系统码事件描述
	int codeTypeId; //事件类型编号
	String codeType = ""; //事件类型
	String evtWay = ""; //事件归类
	
	String usrAlmType = ""; //处警等级
	String cameraName = ""; //摄像机名称
	String userMonitorId = ""; //角色监控点编号（用户监控点编号）
	String atPos = ""; //摄像机位置
	String cameraModelId = ""; //设备监控点编号（监控点编号）
	
	
	
	public String getDevType() {
		return devType;
	}

	public void setDevType(String devType) {
		this.devType = devType;
	}

	public String getSnTypeName() {
		return snTypeName;
	}

	public void setSnTypeName(String snTypeName) {
		this.snTypeName = snTypeName;
	}

	public String getAlmTypeName() {
		return almTypeName;
	}

	public void setAlmTypeName(String almTypeName) {
		this.almTypeName = almTypeName;
	}

	public String getWantDoName() {
		return wantDoName;
	}

	public void setWantDoName(String wantDoName) {
		this.wantDoName = wantDoName;
	}

	public String getCameraModelId() {
		return cameraModelId;
	}

	public void setCameraModelId(String cameraModelId) {
		this.cameraModelId = cameraModelId;
	}

	public String getUsrAlmType() {
		return usrAlmType;
	}

	public void setUsrAlmType(String usrAlmType) {
		this.usrAlmType = usrAlmType;
	}

	public String getCameraName() {
		return cameraName;
	}

	public void setCameraName(String cameraName) {
		this.cameraName = cameraName;
	}

	public String getUserMonitorId() {
		return userMonitorId;
	}

	public void setUserMonitorId(String userMonitorId) {
		this.userMonitorId = userMonitorId;
	}

	public String getAtPos() {
		return atPos;
	}

	public void setAtPos(String atPos) {
		this.atPos = atPos;
	}

	public String getEvtWay() {
		return evtWay;
	}

	public void setEvtWay(String evtWay) {
		this.evtWay = evtWay;
	}

	public Relatinfor() {
		super();
	}
	
	public String getAccountNum() {
		return accountNum;
	}
	public void setAccountNum(String accountNum) {
		this.accountNum = accountNum;
	}
	public String getAccountName() {
		return accountName;
	}
	public void setAccountName(String accountName) {
		this.accountName = accountName;
	}
	public String getAccountAddr() {
		return accountAddr;
	}
	public void setAccountAddr(String accountAddr) {
		this.accountAddr = accountAddr;
	}
	public String getAccountZone() {
		return accountZone;
	}
	public void setAccountZone(String accountZone) {
		this.accountZone = accountZone;
	}
	public String getDevId() {
		return devId;
	}
	public void setDevId(String devId) {
		this.devId = devId;
	}
	public String getDevZoneId() {
		return devZoneId;
	}
	public void setDevZoneId(String devZoneId) {
		this.devZoneId = devZoneId;
	}
	public String getDevModelName() {
		return devModelName;
	}
	public void setDevModelName(String devModelName) {
		this.devModelName = devModelName;
	}
	public String getZoneAtPos() {
		return zoneAtPos;
	}
	public void setZoneAtPos(String zoneAtPos) {
		this.zoneAtPos = zoneAtPos;
	}
	public String getSnType() {
		return snType;
	}
	public void setSnType(String snType) {
		this.snType = snType;
	}
	public String getAlmType() {
		return almType;
	}
	public void setAlmType(String almType) {
		this.almType = almType;
	}
	public String getWantDo() {
		return wantDo;
	}
	public void setWantDo(String wantDo) {
		this.wantDo = wantDo;
	}
	public String getIsCallAbnor() {
		return isCallAbnor;
	}
	public void setIsCallAbnor(String isCallAbnor) {
		this.isCallAbnor = isCallAbnor;
	}
	public String getCallID() {
		return callID;
	}
	public void setCallID(String callID) {
		this.callID = callID;
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
	public String getSnModelName() {
		return snModelName;
	}
	public void setSnModelName(String snModelName) {
		this.snModelName = snModelName;
	}
	public String getSysCode() {
		return sysCode;
	}
	public void setSysCode(String sysCode) {
		this.sysCode = sysCode;
	}
	public String getEventDesc() {
		return eventDesc;
	}
	public void setEventDesc(String eventDesc) {
		this.eventDesc = eventDesc;
	}

	public int getCodeTypeId() {
		return codeTypeId;
	}

	public void setCodeTypeId(int codeTypeId) {
		this.codeTypeId = codeTypeId;
	}
	public String getCodeType() {
		return codeType;
	}

	public void setCodeType(String codeType) {
		this.codeType = codeType;
	}

	@Override
	public String toString() {
		return "Relatinfor [accountNum=" + accountNum + ", accountName="
				+ accountName + ", accountAddr=" + accountAddr
				+ ", accountZone=" + accountZone + ", devId=" + devId
				+ ", devZoneId=" + devZoneId + ", devModelName=" + devModelName
				+ ", zoneAtPos=" + zoneAtPos + ", snType=" + snType
				+ ", almType=" + almType + ", wantDo=" + wantDo
				+ ", isCallAbnor=" + isCallAbnor + ", callID=" + callID
				+ ", areaId=" + areaId + ", areaName=" + areaName
				+ ", snModelName=" + snModelName + ", sysCode=" + sysCode
				+ ", eventDesc=" + eventDesc + ", codeTypeId=" + codeTypeId
				+ ", codeType=" + codeType + ", evtWay=" + evtWay
				+ ", usrAlmType=" + usrAlmType + ", cameraName=" + cameraName
				+ ", userMonitorId=" + userMonitorId + ", atPos=" + atPos
				+ ", cameraModelId=" + cameraModelId + "]";
	}

	


	
	
	
}