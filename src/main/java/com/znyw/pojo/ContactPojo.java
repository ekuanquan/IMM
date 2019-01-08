package com.znyw.pojo;

public class ContactPojo {
	private String userId;
	private String contId;
	private String cName;
	private String contPwd;
	private String cphone1;
	private String cphone2;
	private String hmPhone;
	private String hdPhone;
	private String fMemo;
	private String dataFrom;

	public String getDataFrom() {
		return dataFrom;
	}

	public void setDataFrom(String dataFrom) {
		this.dataFrom = dataFrom;
	}

	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getContId() {
		return contId;
	}
	public void setContId(String contId) {
		this.contId = contId;
	}
	
	public String getCName() {
		return cName;
	}
	public void setCName(String cName) {
		this.cName = cName;
	}
	public String getContPwd() {
		return contPwd;
	}
	public void setContPwd(String contPwd) {
		this.contPwd = contPwd;
	}
	public String getCphone1() {
		return cphone1;
	}
	public void setCphone1(String cphone1) {
		this.cphone1 = cphone1;
	}
	public String getCphone2() {
		return cphone2;
	}
	public void setCphone2(String cphone2) {
		this.cphone2 = cphone2;
	}
	public String getHmPhone() {
		return hmPhone;
	}
	public void setHmPhone(String hmPhone) {
		this.hmPhone = hmPhone;
	}
	public String getHdPhone() {
		return hdPhone;
	}
	public void setHdPhone(String hdPhone) {
		this.hdPhone = hdPhone;
	}
	
	public String getfMemo() {
		return fMemo;
	}
	public void setfMemo(String fMemo) {
		this.fMemo = fMemo;
	}
	@Override
	public String toString() {
		return "ContactPojo [userId=" + userId + ", contId=" + contId + ", cName=" + cName + ", contPwd=" + contPwd
				+ ", cphone1=" + cphone1 + ", cphone2=" + cphone2 + ", hmPhone=" + hmPhone + ", hdPhone=" + hdPhone
				+ ", fMemo=" + fMemo + "]";
	}
	
	
}
