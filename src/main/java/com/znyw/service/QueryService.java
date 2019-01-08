package com.znyw.service;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.ResultPojo;

public interface QueryService {
	public JSONObject ctrlUserQuery(JSONObject param);

	/**
	 * 操作员列表查询
	 * 
	 * @param param
	 * @return
	 */
	public JSONObject operatorUserQuery(JSONObject param);
	public JSONObject userServiceQueryRDA(JSONObject param);
	public JSONObject getCphEquipmentData(JSONObject param);
	public JSONObject RDANvrHave(JSONObject param);
	public JSONObject RDANvrNo(JSONObject param);
	public ResultPojo getOwnerDropDownRDA(String dropDownName);
	public JSONObject ctrlUser(String userId);
	public JSONObject userServiceRelat(String accountNum);
	public JSONObject getLatLngSer(JSONObject param);
	public JSONObject getMapPicByUserId(String userId);
	public JSONObject getUserZoneByUserId(String userId);
	public JSONObject getCodeMemo(String codeTypeId);
	public JSONObject getNVRVideoUrl(String cameraIdList);
	public String eventQuery(String paramStr);
	public String verifyQuery(String paramStr);
	public String alertProcessingQuery(String paramStr);
	public String maintenanceQuery(String paramStr);
	public ResultPojo findAreaById(String areaId);
	public ResultPojo findCenterById(String centerId);
	public ResultPojo getUserInfoByUserIdDTPP(String userId);
	public String alertPretreatment(String paramStr);
	public String alarmStatus(String paramStr);
	public String QueryLogListByAuid(String paramStr);
	public String QueryLogList(String paramStr);
	public String getInspectionFormById(String paramStr);
	public String getInspectionForms(String paramStr);
	public String queryEventStatistics(String paramStr);
	public String queryCodeTypeStatistics(String paramStr);
//	public String getCodeMemoRDA(String paramStr);
	public String queryEventStatisticsByDay(String paramStr);
	public String querySysCodeStatistics(String paramStr);
	public JSONObject CtrlGetCodeTypeList(JSONObject param);
	public String getPictureListByDisposalAlarmNumServer(String paramStr);
}
