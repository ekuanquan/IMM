package com.znyw.pojo;

public class CustomerInfo {
	String userId = "";
	String userName = "";
	String userType = "";
	String userAddr = "";
	String userProperty = "";
	String businessId = "";
	String centerId = "";
	String payNO = "";
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getUserType() {
		return userType;
	}
	public void setUserType(String userType) {
		this.userType = userType;
	}
	public String getUserAddr() {
		return userAddr;
	}
	public void setUserAddr(String userAddr) {
		this.userAddr = userAddr;
	}
	public String getUserProperty() {
		return userProperty;
	}
	public void setUserProperty(String userProperty) {
		this.userProperty = userProperty;
	}
	public String getBusinessId() {
		return businessId;
	}
	public void setBusinessId(String businessId) {
		this.businessId = businessId;
	}
	public String getCenterId() {
		return centerId;
	}
	public void setCenterId(String centerId) {
		this.centerId = centerId;
	}
	public String getPayNO() {
		return payNO;
	}
	public void setPayNO(String payNO) {
		this.payNO = payNO;
	}
	@Override
	public String toString() {
		return "customerInfo [userId=" + userId + ", userName=" + userName
				+ ", userType=" + userType + ", userAddr=" + userAddr
				+ ", userProperty=" + userProperty + ", businessId="
				+ businessId + ", centerId=" + centerId + ", payNO=" + payNO
				+ "]";
	}
	public CustomerInfo() {
		super();
	}
	
}
