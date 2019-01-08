package com.znyw.pojo;

/**
 * 多表关联对象封装
 * @author ywhl
 *
 */
public class UserInfo {
	
	/*String sql = " SELECT u.userId ,u.centerId,u.userName,u.userType,u.areaId,c.userAddr,c.badMem,c.businessId,c.contactPayNO, "
			+ " c.contact,c.cPhone,c.cMobile,c.define1,c.instDate,c.uMem,u.fMemo,imm_area.areaName,imm_center.centerName "
			+ " FROM imm_userinfo u,imm_customerattr c,imm_area,imm_center "
			+ " WHERE u.userId=c.userId AND u.areaId=imm_area.areaId AND u.centerId=imm_center.centerId AND u.userId='"+UserId+"' ";*/
	
	String accountNum="";					//机主编号（用户编号）
	String centerid="";						//所属分中心（编号）
	String centerName="";					//所属分中心（文字）
	String accountName="";					//用户名称
	String devIds="";						//设备编号（关联设备编号）
	String accountTypeId="";				//用户类型（编号)
	String accountTypeName="";				//用户类型（文字)
	String accountAddr="";					//用户地址
	String faultRemind="";					//故障提示
	String accountBusinessId="";			//用户行业（编号）
	String accountBusinessName="";			//用户行业（文字）
	String cPayNO="";						//负责人口令
	String police_subName="";				//派出所
	String policeName="";					//分局
	String contact="";						//单位负责人
	String cPhone="";						//负责人电话
	String cMobile="";						//负责人手机
	String operName="";						//录入人（文字）
	String areaId="";						//区域名称（编号）
	String areaName="";						//区域名称（文字）
	String business_subId="";				//子行业（编号）
	String business_subName="";				//子行业（文字）
	String instDate="";						//安装日期
	String InternetTe="";					//主机电话(联网电话)
	String wirelessTel="";					//无线电话(无线卡号)
	String annotation="";					//处警注释
	String fMemo="";						//备注
	public String getAccountNum() {
		return accountNum;
	}
	public void setUserId(String accountNum) {
		this.accountNum = accountNum;
	}
	public String getCenterid() {
		return centerid;
	}
	public void setCenterid(String centerid) {
		this.centerid = centerid;
	}
	public String getCenterName() {
		return centerName;
	}
	public void setCenterName(String centerName) {
		this.centerName = centerName;
	}
	public String getAccountName() {
		return accountName;
	}
	public void setUserName(String accountName) {
		this.accountName = accountName;
	}
	public String getDevIds() {
		return devIds;
	}
	public void setDevIds(String devIds) {
		this.devIds = devIds;
	}
	public String getAccountTypeId() {
		return accountTypeId;
	}
	public void setUserType(String accountTypeId) {
		this.accountTypeId = accountTypeId;
	}
	public String getAccountTypeName() {
		return accountTypeName;
	}
	public void setAccountTypeName(String accountTypeName) {
		this.accountTypeName = accountTypeName;
	}
	public String getAccountAddr() {
		return accountAddr;
	}
	public void setUserAddr(String accountAddr) {
		this.accountAddr = accountAddr;
	}
	public String getFaultRemind() {
		return faultRemind;
	}
	public void setBadMem(String faultRemind) {
		this.faultRemind = faultRemind;
	}
	public String getAccountBusinessId() {
		return accountBusinessId;
	}
	public void setBusinessId(String accountBusinessId) {
		this.accountBusinessId = accountBusinessId;
	}
	public String getAccountBusinessName() {
		return accountBusinessName;
	}
	public void setBusinessName(String accountBusinessName) {
		this.accountBusinessName = accountBusinessName;
	}
	public String getcPayNO() {
		return cPayNO;
	}
	public void setcPayNO(String cPayNO) {
		this.cPayNO = cPayNO;
	}
	public String getPolice_subName() {
		return police_subName;
	}
	public void setPolice_subName(String police_subName) {
		this.police_subName = police_subName;
	}
	public String getPoliceName() {
		return policeName;
	}
	public void setPoliceName(String policeName) {
		this.policeName = policeName;
	}
	public String getContact() {
		return contact;
	}
	public void setContact(String contact) {
		this.contact = contact;
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
	public String getOperName() {
		return operName;
	}
	public void setOperName(String operName) {
		this.operName = operName;
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
	public String getBusiness_subId() {
		return business_subId;
	}
	public void setDefine1(String business_subId) {
		this.business_subId = business_subId;
	}
	public String getBusiness_subName() {
		return business_subName;
	}
	public void setBusiness_subName(String business_subName) {
		this.business_subName = business_subName;
	}
	public String getInstDate() {
		return instDate;
	}
	public void setInstDate(String instDate) {
		this.instDate = instDate;
	}
	public String getInternetTe() {
		return InternetTe;
	}
	public void setInternetTe(String internetTe) {
		InternetTe = internetTe;
	}
	public String getWirelessTel() {
		return wirelessTel;
	}
	public void setWirelessTel(String wirelessTel) {
		this.wirelessTel = wirelessTel;
	}
	public String getAnnotation() {
		return annotation;
	}
	public void setUMem(String annotation) {
		this.annotation = annotation;
	}
	public String getfMemo() {
		return fMemo;
	}
	public void setfMemo(String fMemo) {
		this.fMemo = fMemo;
	}
	public UserInfo() {
		super();
		// TODO Auto-generated constructor stub
	}
	@Override
	public String toString() {
		return "UserInfo [accountNum=" + accountNum + ", centerid=" + centerid
				+ ", centerName=" + centerName + ", accountName=" + accountName
				+ ", devIds=" + devIds + ", accountTypeId=" + accountTypeId
				+ ", accountTypeName=" + accountTypeName + ", accountAddr="
				+ accountAddr + ", faultRemind=" + faultRemind
				+ ", accountBusinessId=" + accountBusinessId
				+ ", accountBusinessName=" + accountBusinessName + ", cPayNO="
				+ cPayNO + ", police_subName=" + police_subName
				+ ", policeName=" + policeName + ", contact=" + contact
				+ ", cPhone=" + cPhone + ", cMobile=" + cMobile + ", operName="
				+ operName + ", areaId=" + areaId + ", areaName=" + areaName
				+ ", business_subId=" + business_subId + ", business_subName="
				+ business_subName + ", instDate=" + instDate
				+ ", InternetTel=" + InternetTe + ", wirelessTel="
				+ wirelessTel + ", annotation=" + annotation + ", fMemo="
				+ fMemo + "]";
	}
	
	
}
