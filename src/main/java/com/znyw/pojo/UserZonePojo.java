package com.znyw.pojo;

public class UserZonePojo {
	private String snType;
	private String atPos;
	private String snNum;
	//private String userId;
	private String roleZoneName;
	private String devId;
	private String devZoneId;
	private Double x;
	private Double y;
	private String mapPath;
	public String getSnType() {
		return snType;
	}
	public void setSnType(String snType) {
		this.snType = snType;
	}
	public String getAtPos() {
		return atPos;
	}
	public void setAtPos(String atPos) {
		this.atPos = atPos;
	}
	public String getSnNum() {
		return snNum;
	}
	public void setSnNum(String snNum) {
		this.snNum = snNum;
	}
	public String getRoleZoneName() {
		return roleZoneName;
	}
	public void setRoleZoneName(String roleZoneName) {
		this.roleZoneName = roleZoneName;
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
	public Double getX() {
		return x;
	}
	public void setX(Double x) {
		this.x = x;
	}
	public Double getY() {
		return y;
	}
	public void setY(Double y) {
		this.y = y;
	}
	
	public String getMapPath() {
		return mapPath;
	}
	public void setMapPath(String mapPath) {
		this.mapPath = mapPath;
	}
	@Override
	public String toString() {
		return "UserZonePojo [snType=" + snType + ", atPos=" + atPos + ", snNum=" + snNum + ", roleZoneName="
				+ roleZoneName + ", devId=" + devId + ", devZoneId=" + devZoneId + ", x=" + x + ", y=" + y
				+ ", mapPath=" + mapPath + "]";
	}
	
	
}
