package com.device.dao;

import java.util.List;

import com.alibaba.fastjson.JSONObject;




public interface IModDevDao {

	public boolean modDevInfo(String devId,JSONObject json);
	
	public boolean modAlarmhostInfo(String devId, JSONObject json) throws Exception;
	
	public boolean modWirenvrInfo(String devId, JSONObject json) throws Exception;
	
	public boolean modNetnvrInfo(String devId, JSONObject json) throws Exception;

	public boolean modChannelNumByModelId(int devModelId,int ChannelNum);
	
	public boolean modifyDevzone(String devId, String devZoneId, JSONObject json) throws Exception;
	
	public boolean modifyCamera(String devId, JSONObject json) throws Exception;
	
	public int queryAlalmhostcha(String devId) throws Exception;
	
	public int queryNVRCamerNum(String devId) throws Exception;
	
	public int queryNVRCamerNumZone(String devId) throws Exception;
	
	public List<?> queryCammer(String devId);
	
	public void addNVRCammer(List<?> list, JSONObject json);
		
	public boolean delAlarmhostInfo(String devId);
	
	public boolean delWirenvrInfo(String devId);
	
	public boolean delNetnvrInfo(String devId);
	
	public List<?> queryCammerIdByNvrId(String devId);
	
	public boolean delCameraInfo(String devId);
	
	public int queryNVRCammer(String devId);
	
	public boolean delRoledevByDevId(String devId) ;
	
	public List<?> queryNVRCamerInfo(String devId) throws Exception;

	int delRolezoneByDevId(String devId);

	int delRolemonitorByDevId(String devId);
	
	public boolean qudapeCameraDevInfo(JSONObject json) throws Exception;
	
	public void addNVRHaveCammer(JSONObject info, JSONObject json, String cameraDevId, int xitNum) throws Exception;
	
	public void addNVRNoCammer(JSONObject info, JSONObject json, String cameraDevId, int xitNum) throws Exception;
	
	public boolean copyDevice(List<String> deviceList,JSONObject json) throws Exception;

}