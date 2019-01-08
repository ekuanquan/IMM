package com.znyw.pojo;


public class RoleZonePojo {

	private String ownerId;
	private String ownerZoneName;
	private String devId;
	private String devZoneId;
	private String mapId;
	private String areaId;
	private Integer snModelId;
	private String x;
	private String y;
	private String updatetime;
	private String fMemo;
	private String dataFrom;
	public RoleZonePojo() {
		super();
	}

	public RoleZonePojo(String ownerId, String devId, String devZoneId,
			String ownerZoneName, String mapId, String areaId,
			Integer snModelId, String x, String y, String updatetime,
			String fMemo) {
		super();
		this.ownerId = ownerId;
		this.devId = devId;
		this.devZoneId = devZoneId;
		this.ownerZoneName = ownerZoneName;
		this.mapId = mapId;
		this.areaId = areaId;
		this.snModelId = snModelId;
		this.x = x;
		this.y = y;
		this.updatetime = updatetime;
		this.fMemo = fMemo;
	}

	public String getDataFrom() {
		return dataFrom;
	}

	public void setDataFrom(String dataFrom) {
		this.dataFrom = dataFrom;
	}

	public String getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(String ownerId) {
		this.ownerId = ownerId;
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


	public String getOwnerZoneName() {
		return ownerZoneName;
	}

	public void setOwnerZoneName(String ownerZoneName) {
		this.ownerZoneName = ownerZoneName;
	}

	public String getMapId() {
		return mapId;
	}

	public void setMapId(String mapId) {
		this.mapId = mapId;
	}

	public String getAreaId() {
		return areaId;
	}

	public void setAreaId(String areaId) {
		this.areaId = areaId;
	}

	public Integer getSnModelId() {
		return snModelId;
	}

	public void setSnModelId(Integer snModelId) {
		this.snModelId = snModelId;
	}

	public String getX() {
		return x;
	}

	public void setX(String x) {
		this.x = x;
	}

	public String getY() {
		return y;
	}

	public void setY(String y) {
		this.y = y;
	}

	public String getUpdatetime() {
		return updatetime;
	}

	public void setUpdatetime(String updatetime) {
		this.updatetime = updatetime;
	}

	public String getfMemo() {
		return fMemo;
	}

	public void setfMemo(String fMemo) {
		this.fMemo = fMemo;
	}
}