package com.znyw.pojo;

/**
 * 相关联系人封装对象
 * 
 * @author ywhl
 *
 */
public class Relat {
	String accountNum = "";
	String rIndex = "";
	String rName = "";
	/*String rTitle="";*/
	String rPhone = "";
	String rPhone2 = "";
	String rTel = "";
	String rMobile = "";
	String rEmail = "";
	String rPass = "";
	String memo = "";


	public String getAccountNum() {
		return accountNum;
	}


	public void setUserId(String accountNum) {
		this.accountNum = accountNum;
	}


	public String getrIndex() {
		return rIndex;
	}


	public void setContId(String rIndex) {
		this.rIndex = rIndex;
	}


	public String getrName() {
		return rName;
	}


	public void setCName(String rName) {
		this.rName = rName;
	}


	public String getrPhone() {
		return rPhone;
	}


	public void setCphone1(String rPhone) {
		this.rPhone = rPhone;
	}


	public String getrPhone2() {
		return rPhone2;
	}


	public void setCphone2(String rPhone2) {
		this.rPhone2 = rPhone2;
	}


	public String getrTel() {
		return rTel;
	}


	public void setHmPhone(String rTel) {
		this.rTel = rTel;
	}


	public String getrMobile() {
		return rMobile;
	}


	public void setHdPhone(String rMobile) {
		this.rMobile = rMobile;
	}


	public String getrEmail() {
		return rEmail;
	}


	public void setrEmail(String rEmail) {
		this.rEmail = rEmail;
	}


	public String getrPass() {
		return rPass;
	}


	public void setrPass(String rPass) {
		this.rPass = rPass;
	}


	public String getMemo() {
		return memo;
	}


	public void setFMemo(String memo) {
		this.memo = memo;
	}


	@Override
	public String toString() {
		return "Relat [accountNum=" + accountNum + ", rIndex=" + rIndex
				+ ", rName=" + rName + ", rPhone=" + rPhone + ", rPhone2="
				+ rPhone2 + ", rTel=" + rTel + ", rMobile=" + rMobile
				+ ", rEmail=" + rEmail + ", rPass=" + rPass + ", memo=" + memo
				+ "]";
	}


	public Relat() {
	}

}
