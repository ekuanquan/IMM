package com.znyw.pojo;

public class TergroupPojo {
	
	String id="";				//车载设备编号
	String name="";		//车载设备名称
	
	
	
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
	
	@Override
	public String toString() {
		return "TergroupPojo [id=" + id + ", name=" + name + ", getId()="
				+ getId() + ", getName()=" + getName() + ", getClass()="
				+ getClass() + ", hashCode()=" + hashCode() + ", toString()="
				+ super.toString() + "]";
	}

	public TergroupPojo() {
		super();
		// TODO Auto-generated constructor stub
	}
	
}
