package com.znyw.dao;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONArray;


public interface EventSettingDao {
	
	public List<Map<String, Object>> getEventSettingListDao(String userId, String ZoneCHFlag);
	
	public boolean delEventSettingDao(JSONArray UserEvtList);
	
	public boolean editEventSettingDao(String UserEvtId,String fMemo,String isVideo);
	
	public boolean addEventSettingDao(String userId,
			int isVideo, List addZoonIdList,
			List addUserMonitorIdList,String dataFrom);
	
	public List<Map<String, Object>> getUserMonitorIdByCameraIdDao(String devId, String userId);
	
	public List<Map<String, Object>> getEvtCantListDao(String UserEvtId);
	
	public boolean editEvtCantListDao(String UserEvtId ,String contList);
	
	public boolean ListEditEvtCantListDao(List UserEvtIdList ,String contList);
	
	public List<Map<String, Object>> getUserMonitorIdByUserIdDao(String userId);
	
	public boolean  checkSvaeLinkageSettingDao(String UserEvtId,
			String cameraId);
	
	public boolean hookSaveLinkageSettingDao(List UserEvtIdList,
			String cameraId);
}
