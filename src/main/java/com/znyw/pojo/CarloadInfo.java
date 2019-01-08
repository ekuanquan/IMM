package com.znyw.pojo;

public class CarloadInfo {
	String id="";
	String name = "";
	String terGroupId = "";
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getTerGroupId() {
		return terGroupId;
	}
	public void setTerGroupId(String terGroupId) {
		this.terGroupId = terGroupId;
	}
	@Override
	public String toString() {
		return "CarloadInfo [id=" + id + ", name=" + name + ", terGroupId="
				+ terGroupId + "]";
	}
}
