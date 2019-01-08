package com.znyw.pojo;

public class OperatorPojo {
	private String userAccount;    //操作员帐号
	private String userPwd;        //操作员密码
	private String createDate;        //创建日期
	private String userId;            //操作员编号
	private String userName;        //操作员名称
	private String userType;        //操作员类型
	private String areaId;            //区域id//所属区域
	private String areaName;        //区域名称  	2
	private String overDateTime;   //过期时间  	1
	private String acctIP;        //操作员ip	1
	private String sex;            //操作员性别	1
	private String telephone;        //操作员电话	1
	private String email;            //邮箱		1
	private String education;        //操作员学历	1
	private String office;            //操作员职务	1
	private String userPWDhint;    //密码提示
	private String centerId;        //所属分中心id
	private String centerName;        //所属分中心（名称）	2
	private String acctDY;            //订阅    7
	private String fMemo;            //备注
	private String roleId;            //角色ID
	private String operName;            //录入人
	private String operTime;            //录入时间
	private String dataFrom;
	private String platformId;// 所属平台ID
	private String platformName;// 所属平台名称

	public String getfMemo() {
		return fMemo;
	}

	public void setfMemo(String fMemo) {
		this.fMemo = fMemo;
	}

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

	public String getDataFrom() {
		return dataFrom;
	}

	public void setDataFrom(String dataFrom) {
		this.dataFrom = dataFrom;
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
	public String getOverDateTime() {
		return overDateTime;
	}
	public void setOverDateTime(String overDateTime) {
		this.overDateTime = overDateTime;
	}
	public String getAcctIP() {
		return acctIP;
	}
	public void setAcctIP(String acctIP) {
		this.acctIP = acctIP;
	}
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	public String getTelephone() {
		return telephone;
	}
	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getEducation() {
		return education;
	}
	public void setEducation(String education) {
		this.education = education;
	}
	public String getOffice() {
		return office;
	}
	public void setOffice(String office) {
		this.office = office;
	}
	public String getUserPWDhint() {
		return userPWDhint;
	}
	public void setUserPWDhint(String userPWDhint) {
		this.userPWDhint = userPWDhint;
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
	
	public String getAcctDY() {
		return acctDY;
	}
	public void setAcctDY(String acctDY) {
		this.acctDY = acctDY;
	}
	public String getFMemo() {
		return fMemo;
	}
	public void setFMemo(String fMemo) {
		this.fMemo = fMemo;
	}
	
	public String getRoleId() {
		return roleId;
	}
	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}
	public String getFmemo() {
		return fMemo;
	}
	public void setFmemo(String fMemo) {
		this.fMemo = fMemo;
	}
	public String getOperName() {
		return operName;
	}
	public void setOperName(String operName) {
		this.operName = operName;
	}
	public String getOperTime() {
		return operTime;
	}
	public void setOperTime(String operTime) {
		this.operTime = operTime;
	}
	@Override
	public String toString() {
		return "OperatorPojo [userAccount=" + userAccount + ", userPwd="
				+ userPwd + ", createDate=" + createDate + ", userId=" + userId
				+ ", userName=" + userName + ", userType=" + userType
				+ ", areaId=" + areaId + ", areaName=" + areaName
				+ ", overDateTime=" + overDateTime + ", acctIP=" + acctIP
				+ ", sex=" + sex + ", telephone=" + telephone + ", email="
				+ email + ", education=" + education + ", office=" + office
				+ ", userPWDhint=" + userPWDhint + ", centerId=" + centerId
				+ ", centerName=" + centerName + ", acctDY=" + acctDY
				+ ", fMemo=" + fMemo + ", roleId=" + roleId + ", operName="
				+ operName + ", operTime=" + operTime + "]";
	}
	
	
	
}
