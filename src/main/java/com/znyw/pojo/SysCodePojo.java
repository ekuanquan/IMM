package com.znyw.pojo;

public class SysCodePojo {
	private String codeId    ;//系统码编号
	private int codeTypeId;//事件类型编号
	private String codeType;//事件类型名称
	private String codeMemo  ;//系统码事件描述
	private String er_Color  ;//颜色
	private String er_Wave   ;//声音
	private String e_tail    ;//报警描述
	private String r_tail    ;//恢复描述
	private String userZone  ;//用户/防区
	private String deaLWay   ;//
	private int evtWay    ;//事件归类
	private String evtWayName;//事件归类名称
	private int codeLevel ;//事件级别
	public String getCodeId() {
		return codeId;
	}
	public void setCodeId(String codeId) {
		this.codeId = codeId;
	}
	public int getCodeTypeId() {
		return codeTypeId;
	}
	public void setCodeTypeId(int codeTypeId) {
		this.codeTypeId = codeTypeId;
	}
	public String getCodeType() {
		return codeType;
	}
	public void setCodeType(String codeType) {
		this.codeType = codeType;
	}
	public String getCodeMemo() {
		return codeMemo;
	}
	public void setCodeMemo(String codeMemo) {
		this.codeMemo = codeMemo;
	}
	public String getEr_Color() {
		return er_Color;
	}
	public void setEr_Color(String er_Color) {
		this.er_Color = er_Color;
	}
	public String getEr_Wave() {
		return er_Wave;
	}
	public void setEr_Wave(String er_Wave) {
		this.er_Wave = er_Wave;
	}
	public String getE_tail() {
		return e_tail;
	}
	public void setE_tail(String e_tail) {
		this.e_tail = e_tail;
	}
	public String getR_tail() {
		return r_tail;
	}
	public void setR_tail(String r_tail) {
		this.r_tail = r_tail;
	}
	public String getUserZone() {
		return userZone;
	}
	public void setUserZone(String userZone) {
		this.userZone = userZone;
	}
	public String getDeaLWay() {
		return deaLWay;
	}
	public void setDeaLWay(String deaLWay) {
		this.deaLWay = deaLWay;
	}
	public int getEvtWay() {
		return evtWay;
	}
	public void setEvtWay(int evtWay) {
		this.evtWay = evtWay;
	}
	public String getEvtWayName() {
		return evtWayName;
	}
	public void setEvtWayName(String evtWayName) {
		this.evtWayName = evtWayName;
	}
	public int getCodeLevel() {
		return codeLevel;
	}
	public void setCodeLevel(int codeLevel) {
		this.codeLevel = codeLevel;
	}
	@Override
	public String toString() {
		return "SysCodePojo [codeId=" + codeId + ", codeTypeId=" + codeTypeId
				+ ", codeType=" + codeType + ", codeMemo=" + codeMemo
				+ ", er_Color=" + er_Color + ", er_Wave=" + er_Wave
				+ ", e_tail=" + e_tail + ", r_tail=" + r_tail + ", userZone="
				+ userZone + ", deaLWay=" + deaLWay + ", evtWay=" + evtWay
				+ ", evtWayName=" + evtWayName + ", codeLevel=" + codeLevel
				+ "]";
	}
	
	
}
