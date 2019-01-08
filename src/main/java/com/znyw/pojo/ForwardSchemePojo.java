package com.znyw.pojo;
/**
 * 转发方案的实体类
 * 
 * @author 007
 *
 */
public class ForwardSchemePojo {
	/**
	 * 设备编号
	 */
	private String devId;
	/**
	 * 工作站编号
	 */
	private String stationNum;
	public String getDevId() {
		return devId;
	}
	public void setDevId(String devId) {
		this.devId = devId;
	}
	public String getStationNum() {
		return stationNum;
	}
	public void setStationNum(String stationNum) {
		this.stationNum = stationNum;
	}
	@Override
	public String toString() {
		return "ForwardSchemePojo [devId=" + devId + ", stationNum="
				+ stationNum + ", getDevId()=" + getDevId()
				+ ", getStationNum()=" + getStationNum() + ", getClass()="
				+ getClass() + ", hashCode()=" + hashCode() + ", toString()="
				+ super.toString() + "]";
	}
}
