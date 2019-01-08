package com.znyw.pojo;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

/**
 * 布撤防任务信息表实体类
 * 
 * @author Administrator
 *
 */
public class BCFPlanPojo {
	private String ownerId;// 用户编号
	private String starDateTime;// 任务开始时间
	private String overDateTime;// 任务结束时间
	private String bFdevId;// 布放设备编号
	private String bFfMemo;// 布放备注
	private String cFdevId;// 撤防设备编号
	private String cFfMemo;// 撤防备注

	/**
	 * 周1布放信息
	 */
	private Integer bFsymbol1;// 是否布放
	private String bFStartime1;// 布放开始时间
	private String bFOvertime1;// 布放结束时间
	private String bFLastCheckDate1;// 布放最后一次检查时间

	/**
	 * 周2布放信息
	 */
	private Integer bFsymbol2;
	private String bFStartime2;
	private String bFOvertime2;
	private String bFLastCheckDate2;

	/**
	 * 周3布放信息
	 */
	private Integer bFsymbol3;
	private String bFStartime3;
	private String bFOvertime3;
	private String bFLastCheckDate3;

	/**
	 * 周4布放信息
	 */
	private Integer bFsymbol4;
	private String bFStartime4;
	private String bFOvertime4;
	private String bFLastCheckDate4;

	/**
	 * 周5布放信息
	 */
	private Integer bFsymbol5;
	private String bFStartime5;
	private String bFOvertime5;
	private String bFLastCheckDate5;

	/**
	 * 周6布放信息
	 */
	private Integer bFsymbol6;
	private String bFStartime6;
	private String bFOvertime6;
	private String bFLastCheckDate6;

	/**
	 * 周7布放信息
	 */
	private Integer bFsymbol7;
	private String bFStartime7;
	private String bFOvertime7;
	private String bFLastCheckDate7;

	/**
	 * 周1撤防信息
	 */
	private Integer cFsymbol1;
	private String cFStartime1;
	private String cFOvertime1;
	private String cFLastCheckDate1;

	/**
	 * 周2撤防信息
	 */
	private Integer cFsymbol2;
	private String cFStartime2;
	private String cFOvertime2;
	private String cFLastCheckDate2;

	/**
	 * 周3撤防信息
	 */
	private Integer cFsymbol3;
	private String cFStartime3;
	private String cFOvertime3;
	private String cFLastCheckDate3;

	/**
	 * 周4撤防信息
	 */
	private Integer cFsymbol4;
	private String cFStartime4;
	private String cFOvertime4;
	private String cFLastCheckDate4;

	/**
	 * 周5撤防信息
	 */
	private Integer cFsymbol5;
	private String cFStartime5;
	private String cFOvertime5;
	private String cFLastCheckDate5;

	/**
	 * 周6撤防信息
	 */
	private Integer cFsymbol6;
	private String cFStartime6;
	private String cFOvertime6;
	private String cFLastCheckDate6;

	/**
	 * 周7撤防信息
	 */
	private Integer cFsymbol7;
	private String cFStartime7;
	private String cFOvertime7;
	private String cFLastCheckDate7;

	public String getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(String ownerId) {
		this.ownerId = ownerId;
	}

	public String getStarDateTime() {
		return starDateTime;
	}

	public void setStarDateTime(String starDateTime) {
		this.starDateTime = starDateTime;
	}

	public String getOverDateTime() {
		return overDateTime;
	}

	public void setOverDateTime(String overDateTime) {
		this.overDateTime = overDateTime;
	}

	public String getBFdevId() {
		return bFdevId;
	}

	public void setBFdevId(String bFdevId) {
		this.bFdevId = bFdevId;
	}

	public String getBFfMemo() {
		return bFfMemo;
	}

	public void setBFfMemo(String bFfMemo) {
		this.bFfMemo = bFfMemo;
	}

	public String getCFdevId() {
		return cFdevId;
	}

	public void setCFdevId(String cFdevId) {
		this.cFdevId = cFdevId;
	}

	public String getCFfMemo() {
		return cFfMemo;
	}

	public void setCFfMemo(String cFfMemo) {
		this.cFfMemo = cFfMemo;
	}

	public Integer getBFsymbol1() {
		return bFsymbol1;
	}

	public void setBFsymbol1(Integer bFsymbol1) {
		this.bFsymbol1 = bFsymbol1;
	}

	public String getBFStartime1() {
		return bFStartime1;
	}

	public void setBFStartime1(String bFStartime1) {
		this.bFStartime1 = bFStartime1;
	}

	public String getBFOvertime1() {
		return bFOvertime1;
	}

	public void setBFOvertime1(String bFOvertime1) {
		this.bFOvertime1 = bFOvertime1;
	}

	public String getBFLastCheckDate1() {
		return bFLastCheckDate1;
	}

	public void setBFLastCheckDate1(String bFLastCheckDate1) {
		this.bFLastCheckDate1 = bFLastCheckDate1;
	}

	public Integer getBFsymbol2() {
		return bFsymbol2;
	}

	public void setBFsymbol2(Integer bFsymbol2) {
		this.bFsymbol2 = bFsymbol2;
	}

	public String getBFStartime2() {
		return bFStartime2;
	}

	public void setBFStartime2(String bFStartime2) {
		this.bFStartime2 = bFStartime2;
	}

	public String getBFOvertime2() {
		return bFOvertime2;
	}

	public void setBFOvertime2(String bFOvertime2) {
		this.bFOvertime2 = bFOvertime2;
	}

	public String getBFLastCheckDate2() {
		return bFLastCheckDate2;
	}

	public void setBFLastCheckDate2(String bFLastCheckDate2) {
		this.bFLastCheckDate2 = bFLastCheckDate2;
	}

	public Integer getBFsymbol3() {
		return bFsymbol3;
	}

	public void setBFsymbol3(Integer bFsymbol3) {
		this.bFsymbol3 = bFsymbol3;
	}

	public String getBFStartime3() {
		return bFStartime3;
	}

	public void setBFStartime3(String bFStartime3) {
		this.bFStartime3 = bFStartime3;
	}

	public String getBFOvertime3() {
		return bFOvertime3;
	}

	public void setBFOvertime3(String bFOvertime3) {
		this.bFOvertime3 = bFOvertime3;
	}

	public String getBFLastCheckDate3() {
		return bFLastCheckDate3;
	}

	public void setBFLastCheckDate3(String bFLastCheckDate3) {
		this.bFLastCheckDate3 = bFLastCheckDate3;
	}

	public Integer getBFsymbol4() {
		return bFsymbol4;
	}

	public void setBFsymbol4(Integer bFsymbol4) {
		this.bFsymbol4 = bFsymbol4;
	}

	public String getBFStartime4() {
		return bFStartime4;
	}

	public void setBFStartime4(String bFStartime4) {
		this.bFStartime4 = bFStartime4;
	}

	public String getBFOvertime4() {
		return bFOvertime4;
	}

	public void setBFOvertime4(String bFOvertime4) {
		this.bFOvertime4 = bFOvertime4;
	}

	public String getBFLastCheckDate4() {
		return bFLastCheckDate4;
	}

	public void setBFLastCheckDate4(String bFLastCheckDate4) {
		this.bFLastCheckDate4 = bFLastCheckDate4;
	}

	public Integer getBFsymbol5() {
		return bFsymbol5;
	}

	public void setBFsymbol5(Integer bFsymbol5) {
		this.bFsymbol5 = bFsymbol5;
	}

	public String getBFStartime5() {
		return bFStartime5;
	}

	public void setBFStartime5(String bFStartime5) {
		this.bFStartime5 = bFStartime5;
	}

	public String getBFOvertime5() {
		return bFOvertime5;
	}

	public void setBFOvertime5(String bFOvertime5) {
		this.bFOvertime5 = bFOvertime5;
	}

	public String getBFLastCheckDate5() {
		return bFLastCheckDate5;
	}

	public void setBFLastCheckDate5(String bFLastCheckDate5) {
		this.bFLastCheckDate5 = bFLastCheckDate5;
	}

	public Integer getBFsymbol6() {
		return bFsymbol6;
	}

	public void setBFsymbol6(Integer bFsymbol6) {
		this.bFsymbol6 = bFsymbol6;
	}

	public String getBFStartime6() {
		return bFStartime6;
	}

	public void setBFStartime6(String bFStartime6) {
		this.bFStartime6 = bFStartime6;
	}

	public String getBFOvertime6() {
		return bFOvertime6;
	}

	public void setBFOvertime6(String bFOvertime6) {
		this.bFOvertime6 = bFOvertime6;
	}

	public String getBFLastCheckDate6() {
		return bFLastCheckDate6;
	}

	public void setBFLastCheckDate6(String bFLastCheckDate6) {
		this.bFLastCheckDate6 = bFLastCheckDate6;
	}

	public Integer getBFsymbol7() {
		return bFsymbol7;
	}

	public void setBFsymbol7(Integer bFsymbol7) {
		this.bFsymbol7 = bFsymbol7;
	}

	public String getBFStartime7() {
		return bFStartime7;
	}

	public void setBFStartime7(String bFStartime7) {
		this.bFStartime7 = bFStartime7;
	}

	public String getBFOvertime7() {
		return bFOvertime7;
	}

	public void setBFOvertime7(String bFOvertime7) {
		this.bFOvertime7 = bFOvertime7;
	}

	public String getBFLastCheckDate7() {
		return bFLastCheckDate7;
	}

	public void setBFLastCheckDate7(String bFLastCheckDate7) {
		this.bFLastCheckDate7 = bFLastCheckDate7;
	}

	public Integer getCFsymbol1() {
		return cFsymbol1;
	}

	public void setCFsymbol1(Integer cFsymbol1) {
		this.cFsymbol1 = cFsymbol1;
	}

	public String getCFStartime1() {
		return cFStartime1;
	}

	public void setCFStartime1(String cFStartime1) {
		this.cFStartime1 = cFStartime1;
	}

	public String getCFOvertime1() {
		return cFOvertime1;
	}

	public void setCFOvertime1(String cFOvertime1) {
		this.cFOvertime1 = cFOvertime1;
	}

	public String getCFLastCheckDate1() {
		return cFLastCheckDate1;
	}

	public void setCFLastCheckDate1(String cFLastCheckDate1) {
		this.cFLastCheckDate1 = cFLastCheckDate1;
	}

	public Integer getCFsymbol2() {
		return cFsymbol2;
	}

	public void setCFsymbol2(Integer cFsymbol2) {
		this.cFsymbol2 = cFsymbol2;
	}

	public String getCFStartime2() {
		return cFStartime2;
	}

	public void setCFStartime2(String cFStartime2) {
		this.cFStartime2 = cFStartime2;
	}

	public String getCFOvertime2() {
		return cFOvertime2;
	}

	public void setCFOvertime2(String cFOvertime2) {
		this.cFOvertime2 = cFOvertime2;
	}

	public String getCFLastCheckDate2() {
		return cFLastCheckDate2;
	}

	public void setCFLastCheckDate2(String cFLastCheckDate2) {
		this.cFLastCheckDate2 = cFLastCheckDate2;
	}

	public Integer getCFsymbol3() {
		return cFsymbol3;
	}

	public void setCFsymbol3(Integer cFsymbol3) {
		this.cFsymbol3 = cFsymbol3;
	}

	public String getCFStartime3() {
		return cFStartime3;
	}

	public void setCFStartime3(String cFStartime3) {
		this.cFStartime3 = cFStartime3;
	}

	public String getCFOvertime3() {
		return cFOvertime3;
	}

	public void setCFOvertime3(String cFOvertime3) {
		this.cFOvertime3 = cFOvertime3;
	}

	public String getCFLastCheckDate3() {
		return cFLastCheckDate3;
	}

	public void setCFLastCheckDate3(String cFLastCheckDate3) {
		this.cFLastCheckDate3 = cFLastCheckDate3;
	}

	public Integer getCFsymbol4() {
		return cFsymbol4;
	}

	public void setCFsymbol4(Integer cFsymbol4) {
		this.cFsymbol4 = cFsymbol4;
	}

	public String getCFStartime4() {
		return cFStartime4;
	}

	public void setCFStartime4(String cFStartime4) {
		this.cFStartime4 = cFStartime4;
	}

	public String getCFOvertime4() {
		return cFOvertime4;
	}

	public void setCFOvertime4(String cFOvertime4) {
		this.cFOvertime4 = cFOvertime4;
	}

	public String getCFLastCheckDate4() {
		return cFLastCheckDate4;
	}

	public void setCFLastCheckDate4(String cFLastCheckDate4) {
		this.cFLastCheckDate4 = cFLastCheckDate4;
	}

	public Integer getCFsymbol5() {
		return cFsymbol5;
	}

	public void setCFsymbol5(Integer cFsymbol5) {
		this.cFsymbol5 = cFsymbol5;
	}

	public String getCFStartime5() {
		return cFStartime5;
	}

	public void setCFStartime5(String cFStartime5) {
		this.cFStartime5 = cFStartime5;
	}

	public String getCFOvertime5() {
		return cFOvertime5;
	}

	public void setCFOvertime5(String cFOvertime5) {
		this.cFOvertime5 = cFOvertime5;
	}

	public String getCFLastCheckDate5() {
		return cFLastCheckDate5;
	}

	public void setCFLastCheckDate5(String cFLastCheckDate5) {
		this.cFLastCheckDate5 = cFLastCheckDate5;
	}

	public Integer getCFsymbol6() {
		return cFsymbol6;
	}

	public void setCFsymbol6(Integer cFsymbol6) {
		this.cFsymbol6 = cFsymbol6;
	}

	public String getCFStartime6() {
		return cFStartime6;
	}

	public void setCFStartime6(String cFStartime6) {
		this.cFStartime6 = cFStartime6;
	}

	public String getCFOvertime6() {
		return cFOvertime6;
	}

	public void setCFOvertime6(String cFOvertime6) {
		this.cFOvertime6 = cFOvertime6;
	}

	public String getCFLastCheckDate6() {
		return cFLastCheckDate6;
	}

	public void setCFLastCheckDate6(String cFLastCheckDate6) {
		this.cFLastCheckDate6 = cFLastCheckDate6;
	}

	public Integer getCFsymbol7() {
		return cFsymbol7;
	}

	public void setCFsymbol7(Integer cFsymbol7) {
		this.cFsymbol7 = cFsymbol7;
	}

	public String getCFStartime7() {
		return cFStartime7;
	}

	public void setCFStartime7(String cFStartime7) {
		this.cFStartime7 = cFStartime7;
	}

	public String getCFOvertime7() {
		return cFOvertime7;
	}

	public void setCFOvertime7(String cFOvertime7) {
		this.cFOvertime7 = cFOvertime7;
	}

	public String getCFLastCheckDate7() {
		return cFLastCheckDate7;
	}

	public void setCFLastCheckDate7(String cFLastCheckDate7) {
		this.cFLastCheckDate7 = cFLastCheckDate7;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this, ToStringStyle.JSON_STYLE);
	}
}
