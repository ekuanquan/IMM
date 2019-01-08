package com.znyw.pojo;

/*
* createDate：2017-6-8 By Zhou
* 
* 表名 ：mta_DevZone  设备防区表
* */
public class MtaDevZonePojo {

	private String DevId;                //主键，设备编号
	private String DevZoneId;           //主键，设备防区编号
	private String AtPos;              //防区位置
	private String WantDo;            //反应类型
	private String AlmType;          //警情类型
	private String SnNum;          //探头数量
	private String SnType;         //探头类型
	private String InstDate;      //安装时间
	private String LiveDate;
	private String FMemo;       //备注
	private String SnModeId;  //探头型号
	private String Updatetime;//更新时间
	
	public MtaDevZonePojo() {
		super();
	}

	public MtaDevZonePojo(String devId, String devZoneId, String atPos,
			String wantDo, String almType, String snNum, String snType,
			String instDate, String liveDate, String fMemo, String snModeId,
			String updatetime) {
		super();
		DevId = devId;
		DevZoneId = devZoneId;
		AtPos = atPos;
		WantDo = wantDo;
		AlmType = almType;
		SnNum = snNum;
		SnType = snType;
		InstDate = instDate;
		LiveDate = liveDate;
		FMemo = fMemo;
		SnModeId = snModeId;
		Updatetime = updatetime;
	}

	public String getDevId() {
		return DevId;
	}

	public void setDevId(String devId) {
		DevId = devId;
	}

	public String getDevZoneId() {
		return DevZoneId;
	}

	public void setDevZoneId(String devZoneId) {
		DevZoneId = devZoneId;
	}

	public String getAtPos() {
		return AtPos;
	}

	public void setAtPos(String atPos) {
		AtPos = atPos;
	}

	public String getWantDo() {
		return WantDo;
	}

	public void setWantDo(String wantDo) {
		WantDo = wantDo;
	}

	public String getAlmType() {
		return AlmType;
	}

	public void setAlmType(String almType) {
		AlmType = almType;
	}

	public String getSnNum() {
		return SnNum;
	}

	public void setSnNum(String snNum) {
		SnNum = snNum;
	}

	public String getSnType() {
		return SnType;
	}

	public void setSnType(String snType) {
		SnType = snType;
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

	public String getFMemo() {
		return FMemo;
	}

	public void setFMemo(String fMemo) {
		FMemo = fMemo;
	}

	public String getSnModeId() {
		return SnModeId;
	}

	public void setSnModeId(String snModeId) {
		SnModeId = snModeId;
	}

	public String getUpdatetime() {
		return Updatetime;
	}

	public void setUpdatetime(String updatetime) {
		Updatetime = updatetime;
	}
}