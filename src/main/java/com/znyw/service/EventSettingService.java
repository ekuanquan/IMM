package com.znyw.service;

import java.util.List;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public interface EventSettingService {
	
	public JSONObject getEventSettingListService(String userId ,String zoneCHFlag);
	
	public JSONObject delEventSettingService(JSONArray userEvtList);
	
	public JSONObject editEventSettingService(String userEvtId,String fMemo,String isVideo);
	
	public JSONObject addEventSettingService(String userId, int isVideo, List<?> addZoonIdList,
			List<?> addUserMonitorIdList,String dataFrom);
	
	public JSONObject getUserMonitorIdByCameraIdService(String devId ,String userId);
	
	public JSONObject getEvtCantListService(String userEvtId);
	
	public JSONObject editEvtCantListService(String userEvtId ,String contList);
	
	public JSONObject listEditEvtCantListService(List<?> userEvtIdList, String contList);
	
	public JSONObject getUserMonitorIdByUserIdService(String userId);

	public JSONObject checkSvaeLinkageSettingService(String userEvtId,String cameraId);
	
	public JSONObject hookSvaeLinkageSettingService(List<?> userEvtIdList, String cameraId);
}
