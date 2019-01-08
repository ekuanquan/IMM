package com.znyw.pojo;

public class CameraInfo {

	String devId;
	String gbId;
	String cameraName;
	String devChannelId;
	String atPos;
	String instDate;
	String almType;
	String almTypeName;
	String wantDo;
	String cameraType;
	String cameraModeId;
	String fMemo;
	String devMonitorId;
	String videoUrlSuf;
	String videoServer;
	String cameraModelName;
	String cameraTypeName;
	String wantDoName;

	public String getGbId() {
		return gbId;
	}

	public void setGbId(String gbId) {
		this.gbId = gbId;
	}

	public String getAlmTypeName() {
		return almTypeName;
	}

	public void setAlmTypeName(String almTypeName) {
		this.almTypeName = almTypeName;
	}

	public String getCameraTypeName() {
		return cameraTypeName;
	}

	public void setCameraTypeName(String cameraTypeName) {
		this.cameraTypeName = cameraTypeName;
	}

	public String getWantDoName() {
		return wantDoName;
	}

	public void setWantDoName(String wantDoName) {
		this.wantDoName = wantDoName;
	}

	public String getCameraModelName() {
		return cameraModelName;
	}

	public void setCameraModelName(String cameraModelName) {
		this.cameraModelName = cameraModelName;
	}

	public String getVideoUrlSuf() {
		return videoUrlSuf;
	}

	public void setVideoUrlSuf(String videoUrlSuf) {
		this.videoUrlSuf = videoUrlSuf;
	}

	public String getVideoServer() {
		return videoServer;
	}

	public void setVideoServer(String videoServer) {
		this.videoServer = videoServer;
	}

	public String getDevMonitorId() {
		return devMonitorId;
	}

	public void setDevMonitorId(String devMonitorId) {
		this.devMonitorId = devMonitorId;
	}

	public String getDevId() {
		return devId;
	}

	public void setDevId(String devId) {
		this.devId = devId;
	}

	public String getCameraName() {
		return cameraName;
	}

	public void setCameraName(String cameraName) {
		this.cameraName = cameraName;
	}

	public String getDevChannelId() {
		return devChannelId;
	}

	public void setDevChannelId(String devChannelId) {
		this.devChannelId = devChannelId;
	}

	public String getAtPos() {
		return atPos;
	}

	public void setAtPos(String atPos) {
		this.atPos = atPos;
	}

	public String getInstDate() {
		return instDate;
	}

	public void setInstDate(String instDate) {
		this.instDate = instDate;
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

	public String getCameraType() {
		return cameraType;
	}

	public void setCameraType(String cameraType) {
		this.cameraType = cameraType;
	}

	public String getCameraModeId() {
		return cameraModeId;
	}

	public void setCameraModeId(String cameraModeId) {
		this.cameraModeId = cameraModeId;
	}

	public String getfMemo() {
		return fMemo;
	}

	public void setfMemo(String fMemo) {
		this.fMemo = fMemo;
	}

	@Override
	public String toString() {
		return "CameraInfo [devId=" + devId + ", cameraName=" + cameraName + ", devChannelId=" + devChannelId
				+ ", atPos=" + atPos + ", instDate=" + instDate + ", almType=" + almType + ", wantDo=" + wantDo
				+ ", cameraType=" + cameraType + ", cameraModeId=" + cameraModeId + ", fMemo=" + fMemo
				+ ", devMonitorId=" + devMonitorId + ", videoUrlSuf=" + videoUrlSuf + ", videoServer=" + videoServer
				+ ", cameraModelName=" + cameraModelName + ", cameraTypeName=" + cameraTypeName + ", wantDoName="
				+ wantDoName + "]";
	}

}
