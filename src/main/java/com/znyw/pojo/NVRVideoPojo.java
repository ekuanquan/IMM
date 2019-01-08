package com.znyw.pojo;

public class NVRVideoPojo {
	private String cameraId;        //摄像机id
	private String cameraName;		//摄像机名称
	private String devLoginName;	//设备登录用户名	（互联网NVR）
	private String devLoginPwd;		//设备登录密码      （互联网NVR）
	private String devChannelId;	//通道号
	private String devTUTKID;		//tutkId   （互联网NVR）
	private String videoServer;		//流转服务（IP(15)），与nvr内容一致
	private String videoUrlSuf;		//视频播放串后缀
	private String manufacturer;	//设备厂商
	private String devType;			//设备类型  （摄像机类型） 8 11 12
	private String wireDevLoginName;	//设备登录用户名		（有线NVR）
	private String wireDevLoginPwd;		//设备登录密码 		（有线NVR）
	private String wireDevIp;			//设备IP 			（有线NVR）
	private String wireDevPort;			//设备端口 			（有线NVR）
	private String nvrDevType;			//设备类型			（NVR设备类型）  9 10
	
	public String getCameraId() {
		return cameraId;
	}
	public void setCameraId(String cameraId) {
		this.cameraId = cameraId;
	}
	public String getCameraName() {
		return cameraName;
	}
	public void setCameraName(String cameraName) {
		this.cameraName = cameraName;
	}
	public String getDevLoginName() {
		return devLoginName;
	}
	public void setDevLoginName(String devLoginName) {
		this.devLoginName = devLoginName;
	}
	public String getDevLoginPwd() {
		return devLoginPwd;
	}
	public void setDevLoginPwd(String devLoginPwd) {
		this.devLoginPwd = devLoginPwd;
	}
	public String getDevChannelId() {
		return devChannelId;
	}
	public void setDevChannelId(String devChannelId) {
		this.devChannelId = devChannelId;
	}
	public String getDevTUTKID() {
		return devTUTKID;
	}
	public void setDevTUTKID(String devTUTKID) {
		this.devTUTKID = devTUTKID;
	}
	public String getVideoServer() {
		return videoServer;
	}
	public void setVideoServer(String videoServer) {
		this.videoServer = videoServer;
	}
	public String getVideoUrlSuf() {
		return videoUrlSuf;
	}
	public void setVideoUrlSuf(String videoUrlSuf) {
		this.videoUrlSuf = videoUrlSuf;
	}
	
	
	public String getManufacturer() {
		return manufacturer;
	}
	public void setManufacturer(String manufacturer) {
		this.manufacturer = manufacturer;
	}
	public String getDevType() {
		return devType;
	}
	public void setDevType(String devType) {
		this.devType = devType;
	}
	public String getWireDevLoginName() {
		return wireDevLoginName;
	}
	public void setWireDevLoginName(String wireDevLoginName) {
		this.wireDevLoginName = wireDevLoginName;
	}
	public String getWireDevLoginPwd() {
		return wireDevLoginPwd;
	}
	public void setWireDevLoginPwd(String wireDevLoginPwd) {
		this.wireDevLoginPwd = wireDevLoginPwd;
	}
	public String getWireDevIp() {
		return wireDevIp;
	}
	public void setWireDevIp(String wireDevIp) {
		this.wireDevIp = wireDevIp;
	}
	public String getWireDevPort() {
		return wireDevPort;
	}
	public void setWireDevPort(String wireDevPort) {
		this.wireDevPort = wireDevPort;
	}
	public String getNvrDevType() {
		return nvrDevType;
	}
	public void setNvrDevType(String nvrDevType) {
		this.nvrDevType = nvrDevType;
	}
	@Override
	public String toString() {
		return "NVRVideoPojo [cameraId=" + cameraId + ", devLoginName="
				+ devLoginName + ", devLoginPwd=" + devLoginPwd
				+ ", devChannelId=" + devChannelId + ", devTUTKID=" + devTUTKID
				+ ", videoServer=" + videoServer + ", videoUrlSuf="
				+ videoUrlSuf + ", manufacturer=" + manufacturer + ", devType="
				+ devType + ", wireDevLoginName=" + wireDevLoginName
				+ ", wireDevLoginPwd=" + wireDevLoginPwd + ", wireDevIp="
				+ wireDevIp + ", wireDevPort=" + wireDevPort + ", nvrDevType="
				+ nvrDevType + "]";
	}
	
	
	
}
