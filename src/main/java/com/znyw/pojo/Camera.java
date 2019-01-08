package com.znyw.pojo;

public class Camera {
	String id="";
	String channel="";
	String name="";
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getChannel() {
		return channel;
	}
	public void setChannel(String channel) {
		this.channel = channel;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	@Override
	public String toString() {
		return "Camera [id=" + id + ", channel=" + channel + ", name=" + name
				+ ", getId()=" + getId() + ", getChannel()=" + getChannel()
				+ ", getName()=" + getName() + ", getClass()=" + getClass()
				+ ", hashCode()=" + hashCode() + ", toString()="
				+ super.toString() + "]";
	}
	public Camera() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
}
