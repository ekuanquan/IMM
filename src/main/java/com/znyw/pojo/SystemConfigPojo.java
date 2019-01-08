package com.znyw.pojo;
/**
 * 系统配置相关操作
 */

public class SystemConfigPojo {

	private String isRecordShoot = "";// 是否启动设备录像
	private String recordShootLen = "";// 存储时长（s）
	private String isScreenshots = "";// 是否启动联动抓图
	private String isPreset = "";// 是否启动预置位跳转
	private String fileType = "";// 截图的文件类型
	private String recordShootIP = "";// 视频录像存储的服务器IP
	private String recordShootPort = "";// 视频录像存储的服务器Port
	private String forward110 = "";// 事件转发110预案的事件类型（多个，分号隔开）
	private String linkage = "";// 事件联动方案的事件类型（多个，分号隔开）
	public String getIsRecordShoot() {
		return isRecordShoot;
	}
	public void setIsRecordShoot(String isRecordShoot) {
		this.isRecordShoot = isRecordShoot;
	}
	public String getRecordShootLen() {
		return recordShootLen;
	}
	public void setRecordShootLen(String recordShootLen) {
		this.recordShootLen = recordShootLen;
	}
	public String getIsScreenshots() {
		return isScreenshots;
	}
	public void setIsScreenshots(String isScreenshots) {
		this.isScreenshots = isScreenshots;
	}
	public String getIsPreset() {
		return isPreset;
	}
	public void setIsPreset(String isPreset) {
		this.isPreset = isPreset;
	}
	public String getFileType() {
		return fileType;
	}
	public void setFileType(String fileType) {
		this.fileType = fileType;
	}
	public String getRecordShootIP() {
		return recordShootIP;
	}
	public void setRecordShootIP(String recordShootIP) {
		this.recordShootIP = recordShootIP;
	}
	public String getRecordShootPort() {
		return recordShootPort;
	}
	public void setRecordShootPort(String recordShootPort) {
		this.recordShootPort = recordShootPort;
	}
	public String getForward110() {
		return forward110;
	}
	public void setForward110(String forward110) {
		this.forward110 = forward110;
	}
	public String getLinkage() {
		return linkage;
	}
	public void setLinkage(String linkage) {
		this.linkage = linkage;
	}
	@Override
	public String toString() {
		return "SystemConfigPojo [isRecordShoot=" + isRecordShoot
				+ ", recordShootLen=" + recordShootLen + ", isScreenshots="
				+ isScreenshots + ", isPreset=" + isPreset + ", fileType="
				+ fileType + ", recordShootIP=" + recordShootIP
				+ ", recordShootPort=" + recordShootPort + ", forward110="
				+ forward110 + ", linkage=" + linkage + "]";
	}
	
	
	
}
