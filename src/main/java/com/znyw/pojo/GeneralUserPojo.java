package com.znyw.pojo;

public class GeneralUserPojo {
	private String userAccount; // 用户帐号
	private String userPwd; // 用户密码
	private String createDate; // 创建日期
	private String userId; // 用户编号
	private String userName; // 用户名称
	private String userType; // 用户类型
	private String userAddr; // 用户地址
	private String userProperty; // 用户属性
	private String businessId; // 用户行业id
	private String businessName; // 用户行业名称
    
	private String centerId; // 所属分中心id
	private String centerName; // 所属分中心（名称）
	private String payNO; // 口令
	private String userServerType; // 服务类型
	private String contact; // 单位负责人
	private String contactPayNO; // 负责人口令
	private String cHmPhone; // 负责人家庭电话
	private String cPhone; // 负责人电话
	private String cMobile; // 负责人手机
	private String areaId; // 所属区域id
	private String areaName; // 区域名称
	private String isVideoCheck; // 短信转发
	private String isPay; // 缴费状态
    private String roleId;
	private String operName;// 录入人
	private String operTime;// 录入时间
	private String instDate;// 录入时间
	private String platformId;// 所属平台ID
	private String platformName;// 所属平台名称

	public String getPlatformId() {
		return platformId;
	}

	public void setPlatformId(String platformId) {
		this.platformId = platformId;
	}

	public String getPlatformName() {
		return platformName;
	}

	public void setPlatformName(String platformName) {
		this.platformName = platformName;
	}

	public String getOperTime() {
		return operTime;
	}

	public void setOperTime(String operTime) {
		this.operTime = operTime;
	}

	public String getcHmPhone() {
		return cHmPhone;
	}

	public void setcHmPhone(String cHmPhone) {
		this.cHmPhone = cHmPhone;
	}

	public String getcPhone() {
		return cPhone;
	}

	public void setcPhone(String cPhone) {
		this.cPhone = cPhone;
	}

	public String getcMobile() {
		return cMobile;
	}

	public void setcMobile(String cMobile) {
		this.cMobile = cMobile;
	}

	public String getOperName() {
		return operName;
	}

	public void setOperName(String operName) {
		this.operName = operName;
	}

	public String getInstDate() {
		return instDate;
	}

	public void setInstDate(String instDate) {
		this.instDate = instDate;
	}
	public String getUserAccount() {
		return userAccount;
	}
	public void setUserAccount(String userAccount) {
		this.userAccount = userAccount;
	}
	public String getUserPwd() {
		return userPwd;
	}
	public void setUserPwd(String userPwd) {
		this.userPwd = userPwd;
	}
	public String getCreateDate() {
		return createDate;
	}
	public void setCreateDate(String createDate) {
		this.createDate = createDate;
	}
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
	public String getBusinessName() {
		return businessName;
	}
	public void setBusinessName(String businessName) {
		this.businessName = businessName;
	}
	public String getCenterId() {
		return centerId;
	}
	public void setCenterId(String centerId) {
		this.centerId = centerId;
	}
	public String getCenterName() {
		return centerName;
	}
	public void setCenterName(String centerName) {
		this.centerName = centerName;
	}
	public String getPayNO() {
		return payNO;
	}
	public void setPayNO(String payNO) {
		this.payNO = payNO;
	}
	public String getUserServerType() {
		return userServerType;
	}
	public void setUserServerType(String userServerType) {
		this.userServerType = userServerType;
	}
	public String getContact() {
		return contact;
	}
	public void setContact(String contact) {
		this.contact = contact;
	}
	public String getContactPayNO() {
		return contactPayNO;
	}
	public void setContactPayNO(String contactPayNO) {
		this.contactPayNO = contactPayNO;
	}
	public String getCHmPhone() {
		return cHmPhone;
	}
	public void setCHmPhone(String cHmPhone) {
		this.cHmPhone = cHmPhone;
	}
	public String getCPhone() {
		return cPhone;
	}
	public void setCPhone(String cPhone) {
		this.cPhone = cPhone;
	}
	public String getCMobile() {
		return cMobile;
	}
	public void setCMobile(String cMobile) {
		this.cMobile = cMobile;
	}
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
	public String getIsVideoCheck() {
		return isVideoCheck;
	}
	public void setIsVideoCheck(String isVideoCheck) {
		this.isVideoCheck = isVideoCheck;
	}
	public String getIsPay() {
		return isPay;
	}
	public void setIsPay(String isPay) {
		this.isPay = isPay;
	}
	
	public String getRoleId() {
		return roleId;
	}
	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}
	@Override
	public String toString() {
		return "GeneralUserPojo [userAccount=" + userAccount + ", userPwd=" + userPwd + ", createDate=" + createDate
				+ ", userId=" + userId + ", userName=" + userName + ", userType=" + userType + ", userAddr=" + userAddr
				+ ", userProperty=" + userProperty + ", businessId=" + businessId + ", businessName=" + businessName
				+ ", centerId=" + centerId + ", centerName=" + centerName + ", payNO=" + payNO + ", userServerType="
				+ userServerType + ", contact=" + contact + ", contactPayNO=" + contactPayNO + ", cHmPhone=" + cHmPhone
				+ ", cPhone=" + cPhone + ", cMobile=" + cMobile + ", areaId=" + areaId + ", areaName=" + areaName
				+ ", isVideoCheck=" + isVideoCheck + ", isPay=" + isPay + ", roleId=" + roleId + "]";
	}
	
	public String toLog() {
		StringBuffer sbf = new StringBuffer();
		sbf.append("[userId=" + userId);
		sbf.append("userName=" + userName);
		sbf.append("userType=" + userType);
		sbf.append("areaId=" + areaId);
		sbf.append("areaName=" + areaName);
		sbf.append("createDate=" + createDate + "]");
		return "";
	}

    
    
}
