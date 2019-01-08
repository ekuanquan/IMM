package com.znyw.pojo;

public class ZonePojo {
	private String userId;
	private String devId;
	private String devZoneId;
	private String roleZoneName;
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getDevId() {
		return devId;
	}
	public void setDevId(String devId) {
		this.devId = devId;
	}
	public String getDevZoneId() {
		return devZoneId;
	}
	public void setDevZoneId(String devZoneId) {
		this.devZoneId = devZoneId;
	}
	public String getRoleZoneName() {
		return roleZoneName;
	}
	public void setRoleZoneName(String roleZoneName) {
		this.roleZoneName = roleZoneName;
	}
	@Override
	public String toString() {
		return "ZonePojo [userId=" + userId + ", devId=" + devId + ", devZoneId=" + devZoneId + ", roleZoneName="
				+ roleZoneName + "]";
	}
	
	
}
