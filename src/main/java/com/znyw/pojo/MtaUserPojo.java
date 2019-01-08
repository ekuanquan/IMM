package com.znyw.pojo;

/*
* createDate：2017-6-8 By Zhou
* 
* 表名 ：mta_User  用户基本信息表
* */
public class MtaUserPojo {

	private String UserId;                          //主键，用户编号
	private String AreaId;                         //区域编号
	private String AcctId;                        //所属操作员编号
	private String DevId;                        //关联设备编号
	private String roleId;                      // 角色编号
	private String UsrName;                     //用户名称
	private Integer UsrType;                   //用户类型
	private String UsrBusiness;               //用户行业
	private String UsrAddr;                  //用户地址
	private String UsrEmail;                //用户电子邮箱
	private String PayKind;                //开户银行
	private String PayNO;                 //口令
	private String Contact;              //单位负责人
	private String CPhone;              //负责人电话
	private String CMobile;            //负责人手机
	private String CRank;             //负责人职衔
	private String Road;             //道路标志
	private Integer NomRpt;         //定期撤布防用户
	private Integer EngageTest;    //定期测试用户
	private Integer NomTest;      //紧急按钮用户
	private String UMem;         //处警注释
	private String RegistryDay; //录入时间
	private String OperName;   //录入人
	private Integer Property; //用户属性
	private Integer IsPay;   //缴费状态
	private Integer IsInsurance;                   //投保
	private String Centerid;                      //所属分中心编号
	private String PoliceId;                     //分局
	private String PoliceId_sub;                //派出所
	private String InstDate;                   //安装日期
	private String LiveDate;                  //入网日期
	private String Define1;                  //子行业
	private String Define2;                 //暂停时间
	private String Define3;                //布防时间
	private String Define4;
	private String Define5;
	private String Define6;             //中心号
	private String Define7;            //查布防和固话属地
	private String Define8;
	private Integer Define9;
	private Integer Define10;
	private String Define11;        //暂停离网时间
	private String Define12;
	private String FMemo;
	private String UsrAlmType;    //处警等级
	private String BadMem;       //故障提示
	private String PnlTelType;  //入网类型
	private String InsuredAmount;
	private String InsureDate;
	private Integer IsNet;
	private String HmPhone;  //负责人家庭电话
	private String Rout_Type;//转发类型
	private Integer IsVideoCheck;//短信转发
	private Integer HasBak; //是否来电正常
	private String PropertyChar;
	private String Updatetime;
	
	public MtaUserPojo() {
		super();
	}

	public MtaUserPojo(String userId, String areaId, String acctId,
			String devId, String roleId, String usrName, Integer usrType,
			String usrBusiness, String usrAddr, String usrEmail,
			String payKind, String payNO, String contact, String cPhone,
			String cMobile, String cRank, String road, Integer nomRpt,
			Integer engageTest, Integer nomTest, String uMem,
			String registryDay, String operName, Integer property,
			Integer isPay, Integer isInsurance, String centerid,
			String policeId, String policeId_sub, String instDate,
			String liveDate, String define1, String define2, String define3,
			String define4, String define5, String define6, String define7,
			String define8, Integer define9, Integer define10, String define11,
			String define12, String fMemo, String usrAlmType, String badMem,
			String pnlTelType, String insuredAmount, String insureDate,
			Integer isNet, String hmPhone, String rout_Type,
			Integer isVideoCheck, Integer hasBak, String propertyChar,
			String updatetime) {
		super();
		UserId = userId;
		AreaId = areaId;
		AcctId = acctId;
		DevId = devId;
		this.roleId = roleId;
		UsrName = usrName;
		UsrType = usrType;
		UsrBusiness = usrBusiness;
		UsrAddr = usrAddr;
		UsrEmail = usrEmail;
		PayKind = payKind;
		PayNO = payNO;
		Contact = contact;
		CPhone = cPhone;
		CMobile = cMobile;
		CRank = cRank;
		Road = road;
		NomRpt = nomRpt;
		EngageTest = engageTest;
		NomTest = nomTest;
		UMem = uMem;
		RegistryDay = registryDay;
		OperName = operName;
		Property = property;
		IsPay = isPay;
		IsInsurance = isInsurance;
		Centerid = centerid;
		PoliceId = policeId;
		PoliceId_sub = policeId_sub;
		InstDate = instDate;
		LiveDate = liveDate;
		Define1 = define1;
		Define2 = define2;
		Define3 = define3;
		Define4 = define4;
		Define5 = define5;
		Define6 = define6;
		Define7 = define7;
		Define8 = define8;
		Define9 = define9;
		Define10 = define10;
		Define11 = define11;
		Define12 = define12;
		FMemo = fMemo;
		UsrAlmType = usrAlmType;
		BadMem = badMem;
		PnlTelType = pnlTelType;
		InsuredAmount = insuredAmount;
		InsureDate = insureDate;
		IsNet = isNet;
		HmPhone = hmPhone;
		Rout_Type = rout_Type;
		IsVideoCheck = isVideoCheck;
		HasBak = hasBak;
		PropertyChar = propertyChar;
		Updatetime = updatetime;
	}

	public String getUserId() {
		return UserId;
	}

	public void setUserId(String userId) {
		UserId = userId;
	}

	public String getAreaId() {
		return AreaId;
	}

	public void setAreaId(String areaId) {
		AreaId = areaId;
	}

	public String getAcctId() {
		return AcctId;
	}

	public void setAcctId(String acctId) {
		AcctId = acctId;
	}

	public String getDevId() {
		return DevId;
	}

	public void setDevId(String devId) {
		DevId = devId;
	}

	public String getRoleId() {
		return roleId;
	}

	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}

	public String getUsrName() {
		return UsrName;
	}

	public void setUsrName(String usrName) {
		UsrName = usrName;
	}

	public Integer getUsrType() {
		return UsrType;
	}

	public void setUsrType(Integer usrType) {
		UsrType = usrType;
	}

	public String getUsrBusiness() {
		return UsrBusiness;
	}

	public void setUsrBusiness(String usrBusiness) {
		UsrBusiness = usrBusiness;
	}

	public String getUsrAddr() {
		return UsrAddr;
	}

	public void setUsrAddr(String usrAddr) {
		UsrAddr = usrAddr;
	}

	public String getUsrEmail() {
		return UsrEmail;
	}

	public void setUsrEmail(String usrEmail) {
		UsrEmail = usrEmail;
	}

	public String getPayKind() {
		return PayKind;
	}

	public void setPayKind(String payKind) {
		PayKind = payKind;
	}

	public String getPayNO() {
		return PayNO;
	}

	public void setPayNO(String payNO) {
		PayNO = payNO;
	}

	public String getContact() {
		return Contact;
	}

	public void setContact(String contact) {
		Contact = contact;
	}

	public String getCPhone() {
		return CPhone;
	}

	public void setCPhone(String cPhone) {
		CPhone = cPhone;
	}

	public String getCMobile() {
		return CMobile;
	}

	public void setCMobile(String cMobile) {
		CMobile = cMobile;
	}

	public String getCRank() {
		return CRank;
	}

	public void setCRank(String cRank) {
		CRank = cRank;
	}

	public String getRoad() {
		return Road;
	}

	public void setRoad(String road) {
		Road = road;
	}

	public Integer getNomRpt() {
		return NomRpt;
	}

	public void setNomRpt(Integer nomRpt) {
		NomRpt = nomRpt;
	}

	public Integer getEngageTest() {
		return EngageTest;
	}

	public void setEngageTest(Integer engageTest) {
		EngageTest = engageTest;
	}

	public Integer getNomTest() {
		return NomTest;
	}

	public void setNomTest(Integer nomTest) {
		NomTest = nomTest;
	}

	public String getUMem() {
		return UMem;
	}

	public void setUMem(String uMem) {
		UMem = uMem;
	}

	public String getRegistryDay() {
		return RegistryDay;
	}

	public void setRegistryDay(String registryDay) {
		RegistryDay = registryDay;
	}

	public String getOperName() {
		return OperName;
	}

	public void setOperName(String operName) {
		OperName = operName;
	}

	public Integer getProperty() {
		return Property;
	}

	public void setProperty(Integer property) {
		Property = property;
	}

	public Integer getIsPay() {
		return IsPay;
	}

	public void setIsPay(Integer isPay) {
		IsPay = isPay;
	}

	public Integer getIsInsurance() {
		return IsInsurance;
	}

	public void setIsInsurance(Integer isInsurance) {
		IsInsurance = isInsurance;
	}

	public String getCenterid() {
		return Centerid;
	}

	public void setCenterid(String centerid) {
		Centerid = centerid;
	}

	public String getPoliceId() {
		return PoliceId;
	}

	public void setPoliceId(String policeId) {
		PoliceId = policeId;
	}

	public String getPoliceId_sub() {
		return PoliceId_sub;
	}

	public void setPoliceId_sub(String policeId_sub) {
		PoliceId_sub = policeId_sub;
	}

	public String getInstDate() {
		return InstDate;
	}

	public void setInstDate(String instDate) {
		InstDate = instDate;
	}

	public String getLiveDate() {
		return LiveDate;
	}

	public void setLiveDate(String liveDate) {
		LiveDate = liveDate;
	}

	public String getDefine1() {
		return Define1;
	}

	public void setDefine1(String define1) {
		Define1 = define1;
	}

	public String getDefine2() {
		return Define2;
	}

	public void setDefine2(String define2) {
		Define2 = define2;
	}

	public String getDefine3() {
		return Define3;
	}

	public void setDefine3(String define3) {
		Define3 = define3;
	}

	public String getDefine4() {
		return Define4;
	}

	public void setDefine4(String define4) {
		Define4 = define4;
	}

	public String getDefine5() {
		return Define5;
	}

	public void setDefine5(String define5) {
		Define5 = define5;
	}

	public String getDefine6() {
		return Define6;
	}

	public void setDefine6(String define6) {
		Define6 = define6;
	}

	public String getDefine7() {
		return Define7;
	}

	public void setDefine7(String define7) {
		Define7 = define7;
	}

	public String getDefine8() {
		return Define8;
	}

	public void setDefine8(String define8) {
		Define8 = define8;
	}

	public Integer getDefine9() {
		return Define9;
	}

	public void setDefine9(Integer define9) {
		Define9 = define9;
	}

	public Integer getDefine10() {
		return Define10;
	}

	public void setDefine10(Integer define10) {
		Define10 = define10;
	}

	public String getDefine11() {
		return Define11;
	}

	public void setDefine11(String define11) {
		Define11 = define11;
	}

	public String getDefine12() {
		return Define12;
	}

	public void setDefine12(String define12) {
		Define12 = define12;
	}

	public String getFMemo() {
		return FMemo;
	}

	public void setFMemo(String fMemo) {
		FMemo = fMemo;
	}

	public String getUsrAlmType() {
		return UsrAlmType;
	}

	public void setUsrAlmType(String usrAlmType) {
		UsrAlmType = usrAlmType;
	}

	public String getBadMem() {
		return BadMem;
	}

	public void setBadMem(String badMem) {
		BadMem = badMem;
	}

	public String getPnlTelType() {
		return PnlTelType;
	}

	public void setPnlTelType(String pnlTelType) {
		PnlTelType = pnlTelType;
	}

	public String getInsuredAmount() {
		return InsuredAmount;
	}

	public void setInsuredAmount(String insuredAmount) {
		InsuredAmount = insuredAmount;
	}

	public String getInsureDate() {
		return InsureDate;
	}

	public void setInsureDate(String insureDate) {
		InsureDate = insureDate;
	}

	public Integer getIsNet() {
		return IsNet;
	}

	public void setIsNet(Integer isNet) {
		IsNet = isNet;
	}

	public String getHmPhone() {
		return HmPhone;
	}

	public void setHmPhone(String hmPhone) {
		HmPhone = hmPhone;
	}

	public String getRout_Type() {
		return Rout_Type;
	}

	public void setRout_Type(String rout_Type) {
		Rout_Type = rout_Type;
	}

	public Integer getIsVideoCheck() {
		return IsVideoCheck;
	}

	public void setIsVideoCheck(Integer isVideoCheck) {
		IsVideoCheck = isVideoCheck;
	}

	public Integer getHasBak() {
		return HasBak;
	}

	public void setHasBak(Integer hasBak) {
		HasBak = hasBak;
	}

	public String getPropertyChar() {
		return PropertyChar;
	}

	public void setPropertyChar(String propertyChar) {
		PropertyChar = propertyChar;
	}

	public String getUpdatetime() {
		return Updatetime;
	}

	public void setUpdatetime(String updatetime) {
		Updatetime = updatetime;
	}
}