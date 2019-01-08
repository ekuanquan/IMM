package com.znyw.pojo;

public class TertypePojo {
	int terTypeId;
	String terTypeName;
	@Override
	public String toString() {
		return "TertypePojo [terTypeId=" + terTypeId + ", terTypeName="
				+ terTypeName + ", getClass()=" + getClass() + ", hashCode()="
				+ hashCode() + ", toString()=" + super.toString() + "]";
	}
	public int getTerTypeId() {
		return terTypeId;
	}
	public void setTerTypeId(int terTypeId) {
		this.terTypeId = terTypeId;
	}
	public String getTerTypeName() {
		return terTypeName;
	}
	public void setTerTypeName(String terTypeName) {
		this.terTypeName = terTypeName;
	}
	public TertypePojo() {
		super();
		// TODO Auto-generated constructor stub
	}
	
}
