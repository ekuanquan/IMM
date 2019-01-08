package com.znyw.pojo;

public class ZTreeInfo {

	private String areaId;

	private String areaName;

	private String parentAreaId;

	private String fMemo;

	private String areaType;

	private String parents;

	private ZTreeInfo children;

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

	public String getParentAreaId() {
		return parentAreaId;
	}

	public void setParentAreaId(String parentAreaId) {
		this.parentAreaId = parentAreaId;
	}

	public String getfMemo() {
		return fMemo;
	}

	public void setfMemo(String fMemo) {
		this.fMemo = fMemo;
	}

	public String getAreaType() {
		return areaType;
	}

	public void setAreaType(String areaType) {
		this.areaType = areaType;
	}

	public String getParents() {
		return parents;
	}

	public void setParents(String parents) {
		this.parents = parents;
	}

	public ZTreeInfo getChildren() {
		return children;
	}

	public void setChildren(ZTreeInfo children) {
		this.children = children;
	}

	@Override
	public String toString() {
		return "ZTreeInfo [areaId=" + areaId + ", areaName=" + areaName
				+ ", parentAreaId=" + parentAreaId + ", fMemo=" + fMemo
				+ ", areaType=" + areaType + ", parents=" + parents
				+ ", children=" + children + "]";
	}

}
