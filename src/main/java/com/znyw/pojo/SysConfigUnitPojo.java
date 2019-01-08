package com.znyw.pojo;
/**
 * 系统配置相关操作
 */
public class SysConfigUnitPojo {
	private String id        ="";//Id                        
	private String dataName  ="";//字典名称（字母）          
	private String dataValue ="";//值                        
	private String isUse     ="";//是否使用（0不使用，1使用）
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getDataName() {
		return dataName;
	}
	public void setDataName(String dataName) {
		this.dataName = dataName;
	}
	public String getDataValue() {
		return dataValue;
	}
	public void setDataValue(String dataValue) {
		this.dataValue = dataValue;
	}
	public String getIsUse() {
		return isUse;
	}
	public void setIsUse(String isUse) {
		this.isUse = isUse;
	}
	@Override
	public String toString() {
		return "SysConfigUnitPojo [id=" + id + ", dataName=" + dataName
				+ ", dataValue=" + dataValue + ", isUse=" + isUse + "]";
	}
	
}
