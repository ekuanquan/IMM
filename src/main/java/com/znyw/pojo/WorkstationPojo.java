package com.znyw.pojo;


/**
 * 工作站的实体类
 * 
 * @author 007
 *
 */
public class WorkstationPojo {

	/**
	 * id
	 */
	private int id;
	/**
	 * 工作站名称
	 */
	private String stationName;
	/**
	 * 工作站Ip
	 */
	private String stationHost;
	/**
	 * 工作站编码
	 */
	private String stationNum;
	/**
	 * 工作站端口
	 */
	private int stationPort;
	/**
	 * 事件订阅系统码
	 */
	private String sysCode;
	/**
	 * 备注
	 */
	private String fMemo;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getStationName() {
		return stationName;
	}
	public void setStationName(String stationName) {
		this.stationName = stationName;
	}
	public String getStationHost() {
		return stationHost;
	}
	public void setStationHost(String stationHost) {
		this.stationHost = stationHost;
	}
	public String getStationNum() {
		return stationNum;
	}
	public void setStationNum(String stationNum) {
		this.stationNum = stationNum;
	}
	public int getStationPort() {
		return stationPort;
	}
	public void setStationPort(int stationPort) {
		this.stationPort = stationPort;
	}
	public String getSysCode() {
		return sysCode;
	}
	public void setSysCode(String sysCode) {
		this.sysCode = sysCode;
	}
	public String getfMemo() {
		return fMemo;
	}
	public void setfMemo(String fMemo) {
		this.fMemo = fMemo;
	}
	@Override
	public String toString() {
		return "WorkstationPojo [id=" + id + ", stationName=" + stationName
				+ ", stationHost=" + stationHost + ", stationNum=" + stationNum
				+ ", stationPort=" + stationPort + ", sysCode=" + sysCode
				+ ", fMemo=" + fMemo + ", getId()=" + getId()
				+ ", getStationName()=" + getStationName()
				+ ", getStationHost()=" + getStationHost()
				+ ", getStationNum()=" + getStationNum()
				+ ", getStationPort()=" + getStationPort() + ", getSysCode()="
				+ getSysCode() + ", getfMemo()=" + getfMemo() + ", getClass()="
				+ getClass() + ", hashCode()=" + hashCode() + ", toString()="
				+ super.toString() + "]";
	}
	
}
