package com.znyw.pojo;

public class DeviceDataPojo {

	private String deviceId;// 接入设备id，第三方id

	private String deviceName;// 设备名称

	private String parentId;// 父节点ID

	private String deviceType;// 设备类型

	private Integer deviceStatus;// 节点状态 断线 上线 等

	private double lng;// 经度

	private double lat;// 纬度

	private String iconSkin;// 图标类型(在线) 不在线在之后+"_outline"  为空则使用icon_deviceType表设备默认类型

	private Boolean isParent;// 判断元素是否为父节点

	private Boolean open;// Tree节点是否展开

	private String ownerId; // 机主编号(用户编号)

	public DeviceDataPojo() {
		super();
	}

	public DeviceDataPojo(String deviceId, String deviceName, String parentId, String deviceType, Integer deviceStatus,
			double lng, double lat, String iconSkin, Boolean isParent, Boolean open) {
		super();
		this.deviceId = deviceId;
		this.deviceName = deviceName;
		this.parentId = parentId;
		this.deviceType = deviceType;
		this.deviceStatus = deviceStatus;
		this.lng = lng;
		this.lat = lat;
		this.iconSkin = iconSkin;
		this.isParent = isParent;
		this.open = open;
	}

	public String getDeviceId() {
		return deviceId;
	}

	public void setDeviceId(String deviceId) {
		this.deviceId = deviceId;
	}

	public String getDeviceName() {
		return deviceName;
	}

	public void setDeviceName(String deviceName) {
		this.deviceName = deviceName;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public String getDeviceType() {
		return deviceType;
	}

	public void setDeviceType(String deviceType) {
		this.deviceType = deviceType;
	}

	public Integer getDeviceStatus() {
		return deviceStatus;
	}

	public void setDeviceStatus(Integer deviceStatus) {
		this.deviceStatus = deviceStatus;
	}

	public double getLng() {
		return lng;
	}

	public void setLng(double lng) {
		this.lng = lng;
	}

	public double getLat() {
		return lat;
	}

	public void setLat(double lat) {
		this.lat = lat;
	}

	public String getIconSkin() {
		return iconSkin;
	}

	public void setIconSkin(String iconSkin) {
		this.iconSkin = iconSkin;
	}

	public Boolean getIsParent() {
		return isParent;
	}

	public void setIsParent(Boolean isParent) {
		this.isParent = isParent;
	}

	public Boolean getOpen() {
		return open;
	}

	public void setOpen(Boolean open) {
		this.open = open;
	}

	public String getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(String ownerId) {
		this.ownerId = ownerId;
	}

	@Override
	public String toString() {
		return "DeviceDataPojo [deviceId=" + deviceId + ", deviceName=" + deviceName + ", parentId=" + parentId
				+ ", deviceType=" + deviceType + ", deviceStatus=" + deviceStatus + ", lng=" + lng + ", lat=" + lat
				+ ", iconSkin=" + iconSkin + ", isParent=" + isParent + ", open=" + open + "]";
	}

}
