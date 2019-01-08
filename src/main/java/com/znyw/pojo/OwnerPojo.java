package com.znyw.pojo;

import java.util.ArrayList;
import java.util.List;

/**
 * 机主用户实体类
 * 
 * @author teclan
 * 
 *         email: tbj621@163.com
 *
 *         2017年11月17日
 */
public class OwnerPojo {
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
	private String userServerType; // 用户服务类型
	private String userServerTypeName; // 用户服务类型名称
	private String contact; // 单位负责人
	private String contactPayNO; // 负责人口令
	private String cHmPhone; // 负责人家庭电话
	private String cPhone; // 负责人电话
	private String cMobile; // 负责人手机
	private String pnlTel; // 联网电话
	private String pnlHdTel;// 无线卡号
	private String nomRpt; // 定期撤布防用户
	private String engageTest; // 定期测试用户
	private String nomTest; // 紧急按钮用户
	private String isVideoCheck; // 短信转发
	private String areaId; // 区域id//所属区域
	private String areaName; // 区域名称
	private String isInsurance; // 投保
	private String hasBak; // 是否来电正常
	private String isPay; // 缴费状态
	private String usrAlmType; // 处警等级
	private String uMem; // 处警注释
	private String operName; // 录入人
	private String define2; // 暂停时间
	private String badMem; // 故障提示
	private String road; // 道路标志
	private String define3; // 布防时间
	private String define1; // 子行业
	private String define6; // 中心号
	private String fMemo; // 备注
	private String define4; // 备注4
	private String instDate; // 安装日期
	private String liveDate; // 入网日期
	private String pnlTelType; // 入网类型
	private String roleId; // 角色Id
	private String dataFrom;
	private String platformId;// 所属平台ID
	private String platformName;// 所属平台名称
	private String masterDevId; // 主设备ID
	private String remoteDevId; // 远程控制设备ID
	private String serveEndTime;// 服务到期时间
	private boolean switchUser;// 是否启用服务

	public String getServeEndTime() {
		return serveEndTime;
	}

	public void setServeEndTime(String serveEndTime) {
		this.serveEndTime = serveEndTime;
	}

	public boolean isSwitchUser() {
		return switchUser;
	}

	public void setSwitchUser(boolean switchUser) {
		this.switchUser = switchUser;
	}

	public String getMasterDevId() {
		return masterDevId;
	}

	public void setMasterDevId(String masterDevId) {
		this.masterDevId = masterDevId;
	}

	public String getRemoteDevId() {
		return remoteDevId;
	}

	public void setRemoteDevId(String remoteDevId) {
		this.remoteDevId = remoteDevId;
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

	/**
	 * 关联的设备编号
	 */
	private List<String> devIds = new ArrayList<String>();

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

	public List<String> getDevIds() {
		return devIds;
	}

	public void setDevIds(List<String> devIds) {
		this.devIds = devIds;
	}

	public String getPnlHdTel() {
		return pnlHdTel;
	}

	public void setPnlHdTel(String pnlHdTel) {
		this.pnlHdTel = pnlHdTel;
	}

	public String getRoleId() {
		return roleId;
	}

	public void setRoleId(String roleId) {
		this.roleId = roleId;
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

	public String getNomRpt() {
		return nomRpt;
	}

	public void setNomRpt(String nomRpt) {
		this.nomRpt = nomRpt;
	}

	public String getEngageTest() {
		return engageTest;
	}

	public void setEngageTest(String engageTest) {
		this.engageTest = engageTest;
	}

	public String getNomTest() {
		return nomTest;
	}

	public void setNomTest(String nomTest) {
		this.nomTest = nomTest;
	}

	public String getIsVideoCheck() {
		return isVideoCheck;
	}

	public void setIsVideoCheck(String isVideoCheck) {
		this.isVideoCheck = isVideoCheck;
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

	public String getIsInsurance() {
		return isInsurance;
	}

	public void setIsInsurance(String isInsurance) {
		this.isInsurance = isInsurance;
	}

	public String getHasBak() {
		return hasBak;
	}

	public void setHasBak(String hasBak) {
		this.hasBak = hasBak;
	}

	public String getIsPay() {
		return isPay;
	}

	public void setIsPay(String isPay) {
		this.isPay = isPay;
	}

	public String getUsrAlmType() {
		return usrAlmType;
	}

	public void setUsrAlmType(String usrAlmType) {
		this.usrAlmType = usrAlmType;
	}

	public String getuMem() {
		return uMem;
	}

	public void setuMem(String uMem) {
		this.uMem = uMem;
	}

	public String getOperName() {
		return operName;
	}

	public void setOperName(String operName) {
		this.operName = operName;
	}

	public String getDefine2() {
		return define2;
	}

	public void setDefine2(String define2) {
		this.define2 = define2;
	}

	public String getBadMem() {
		return badMem;
	}

	public void setBadMem(String badMem) {
		this.badMem = badMem;
	}

	public String getRoad() {
		return road;
	}

	public void setRoad(String road) {
		this.road = road;
	}

	public String getDefine3() {
		return define3;
	}

	public void setDefine3(String define3) {
		this.define3 = define3;
	}

	public String getDefine1() {
		return define1;
	}

	public void setDefine1(String define1) {
		this.define1 = define1;
	}

	public String getDefine6() {
		return define6;
	}

	public void setDefine6(String define6) {
		this.define6 = define6;
	}

	public String getfMemo() {
		return fMemo;
	}

	public void setfMemo(String fMemo) {
		this.fMemo = fMemo;
	}

	public String getDefine4() {
		return define4;
	}

	public void setDefine4(String define4) {
		this.define4 = define4;
	}

	public String getInstDate() {
		return instDate;
	}

	public void setInstDate(String instDate) {
		this.instDate = instDate;
	}

	public String getLiveDate() {
		return liveDate;
	}

	public void setLiveDate(String liveDate) {
		this.liveDate = liveDate;
	}

	public String getPnlTelType() {
		return pnlTelType;
	}

	public void setPnlTelType(String pnlTelType) {
		this.pnlTelType = pnlTelType;
	}

	public String getUserServerType() {
		return userServerType;
	}

	public void setUserServerType(String userServerType) {
		this.userServerType = userServerType;
	}

	public String getUserServerTypeName() {
		return userServerTypeName;
	}

	public void setUserServerTypeName(String userServerTypeName) {
		this.userServerTypeName = userServerTypeName;
	}

	public String getPnlTel() {
		return pnlTel;
	}

	public void setPnlTel(String pnlTel) {
		this.pnlTel = pnlTel;
	}

	// @Override
	// public String toString() {
	// return "OwnerPojo [userAccount=" + userAccount + ", userPwd=" + userPwd
	// + ", createDate=" + createDate + ", userId=" + userId
	// + ", userName=" + userName + ", userType=" + userType
	// + ", userAddr=" + userAddr + ", userProperty=" + userProperty
	// + ", businessId=" + businessId + ", businessName="
	// + businessName + ", centerId=" + centerId + ", centerName="
	// + centerName + ", payNO=" + payNO + ", contact=" + contact
	// + ", contactPayNO=" + contactPayNO + ", cHmPhone=" + cHmPhone
	// + ", cPhone=" + cPhone + ", cMobile=" + cMobile + ", nomRpt="
	// + nomRpt + ", engageTest=" + engageTest + ", nomTest="
	// + nomTest + ", isVideoCheck=" + isVideoCheck + ", areaId="
	// + areaId + ", areaName=" + areaName + ", isInsurance="
	// + isInsurance + ", hasBak=" + hasBak + ", isPay=" + isPay
	// + ", usrAlmType=" + usrAlmType + ", uMem=" + uMem
	// + ", operName=" + operName + ", define2=" + define2
	// + ", badMem=" + badMem + ", road=" + road + ", define3="
	// + define3 + ", define1=" + define1 + ", define6=" + define6
	// + ", fMemo=" + fMemo + ", define4=" + define4 + ", instDate="
	// + instDate + ", liveDate=" + liveDate + ", pnlTelType="
	// + pnlTelType + ", roleId=" + roleId + ", pnlTel=" + pnlTel
	// + "]";
	// }

	public String toLog() {
		StringBuffer sbf = new StringBuffer();
		sbf.append("[userId=" + userId);
		sbf.append("userName=" + userName);
		sbf.append("userType=" + userType);
		sbf.append("areaId=" + areaId);
		sbf.append("areaName=" + areaName);
		sbf.append("createDate=" + createDate + "]");
		return sbf.toString();
	}

	@Override
	public String toString() {
		return "OwnerPojo [userAccount=" + userAccount + ", userPwd=" + userPwd
				+ ", createDate=" + createDate + ", userId=" + userId
				+ ", userName=" + userName + ", userType=" + userType
				+ ", userAddr=" + userAddr + ", userProperty=" + userProperty
				+ ", businessId=" + businessId + ", businessName="
				+ businessName + ", centerId=" + centerId + ", centerName="
				+ centerName + ", payNO=" + payNO + ", userServerType="
				+ userServerType + ", userServerTypeName=" + userServerTypeName
				+ ", contact=" + contact + ", contactPayNO=" + contactPayNO
				+ ", cHmPhone=" + cHmPhone + ", cPhone=" + cPhone
				+ ", cMobile=" + cMobile + ", pnlTel=" + pnlTel + ", pnlHdTel="
				+ pnlHdTel + ", nomRpt=" + nomRpt + ", engageTest="
				+ engageTest + ", nomTest=" + nomTest + ", isVideoCheck="
				+ isVideoCheck + ", areaId=" + areaId + ", areaName="
				+ areaName + ", isInsurance=" + isInsurance + ", hasBak="
				+ hasBak + ", isPay=" + isPay + ", usrAlmType=" + usrAlmType
				+ ", uMem=" + uMem + ", operName=" + operName + ", define2="
				+ define2 + ", badMem=" + badMem + ", road=" + road
				+ ", define3=" + define3 + ", define1=" + define1
				+ ", define6=" + define6 + ", fMemo=" + fMemo + ", define4="
				+ define4 + ", instDate=" + instDate + ", liveDate=" + liveDate
				+ ", pnlTelType=" + pnlTelType + ", roleId=" + roleId
				+ ", dataFrom=" + dataFrom + ", platformId=" + platformId
				+ ", platformName=" + platformName + ", masterDevId="
				+ masterDevId + ", remoteDevId=" + remoteDevId
				+ ", serveEndTime=" + serveEndTime + ", switchUser="
				+ switchUser + ", devIds=" + devIds + "]";
	}

}
