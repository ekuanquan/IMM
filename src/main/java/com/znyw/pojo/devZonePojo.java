package com.znyw.pojo;

public class devZonePojo {
      private String devId;
      private String devZoneId;
      
	public devZonePojo() {
		super();
	}

	public devZonePojo(String devId, String devZoneId) {
		super();
		this.devId = devId;
		this.devZoneId = devZoneId;
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
}