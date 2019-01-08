package com.znyw.pojo;

import java.util.Date;

/**
 * 设备表实体类
 * 
 * @author Administrator
 *
 */
public class McsDevstatusPojo {
	/**
	 * 设备编号Id
	 */
	private String devId;
	/**
	 * 设备子系统id
	 */
	private String subSysId;
	/**
	 * 设备所属用户
	 */
	private String ownId;
	/**
	 * 设备状态，0为撤防，1为布防，2为旁路
	 */
	private Integer devStatus;
	/**
	 * 更新时间
	 */
	private String updateTime;
	/**
	 * 备注
	 */
	private String fMemo;
	/**
	 * 系统范围
	 */
	private String subRange;

	public String getDevId() {
		return devId;
	}

	public void setDevId(String devId) {
		this.devId = devId;
	}

	public String getSubSysId() {
		return subSysId;
	}

	public void setSubSysId(String subSysId) {
		this.subSysId = subSysId;
	}

	public String getOwnId() {
		return ownId;
	}

	public void setOwnId(String ownId) {
		this.ownId = ownId;
	}

	public Integer getDevStatus() {
		return devStatus;
	}

	public void setDevStatus(Integer devStatus) {
		this.devStatus = devStatus;
	}

	public String getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}

	public String getfMemo() {
		return fMemo;
	}

	public void setfMemo(String fMemo) {
		this.fMemo = fMemo;
	}

	public String getSubRange() {
		return subRange;
	}

	public void setSubRange(String subRange) {
		this.subRange = subRange;
	}

}
