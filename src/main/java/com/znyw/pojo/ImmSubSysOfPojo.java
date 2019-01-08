package com.znyw.pojo;

/**
 * 设备子系统表的实体类
 * 
 * @author Administrator
 *
 */
public class ImmSubSysOfPojo {
	/**
	 * 报警主机编号
	 */
	private String devId;
	/**
	 * 子系统编号
	 */
	private String subSysId;
	/**
	 * 子系统范围
	 */
	private String subRange;
	/**
	 * 备注
	 */
	private String fMemo;
	/**
	 * 数据来源
	 */
	private String dataFrom;
	/**
	 * 布撤防,增加一个旁路状态
	 */
	private int bf;

	public int getBf() {
		return bf;
	}

	public void setBf(int bf) {
		this.bf = bf;
	}

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

	public String getSubRange() {
		return subRange;
	}

	public void setSubRange(String subRange) {
		this.subRange = subRange;
	}

	public String getfMemo() {
		return fMemo;
	}

	public void setfMemo(String fMemo) {
		this.fMemo = fMemo;
	}

	public String getDataFrom() {
		return dataFrom;
	}

	public void setDataFrom(String dataFrom) {
		this.dataFrom = dataFrom;
	}

}
