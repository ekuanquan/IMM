package com.device.dao;

import java.util.List;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.AlarmhostPojo;

public interface IQueryDevDao {

	public List<AlarmhostPojo> queAlarmhostList(String isowner, String areaId, String key, String queryId, String sort, String platformId, String outDevId,
			int index,
			int size) throws Exception;

	public int queAlarmhostListTotalNum(String areaId, String key, String queryId, String isowner, String platformId, String outDevId) throws Exception;

	public JSONArray queryAlarmhostZoneList(String devId) throws Exception;

	public JSONObject queryAlarmhostZoneInfo(String devId, String devZoneId) throws Exception;

	public JSONObject queryDevInfo(String devId) throws Exception;

	public AlarmhostPojo queryAlarmhostInfo(String devId) throws Exception;

	public JSONObject queryWirenvrInfo(String devId) throws Exception;

	public JSONObject queryNetnvrInfo(String devId) throws Exception;

	public JSONArray queryCameraListByRelateNVR(String relateNVR) throws Exception;

	public JSONArray queryDeviceId(String relateNVR, String channelNo) throws Exception;

	public JSONObject queryCameraInfoByDevId(String devId, String flag) throws Exception; // flag=alowNull查找条目不存在时返回null

	public JSONArray queryAlmtypeList() throws Exception;

	public JSONArray queryWanttoList() throws Exception;

	public JSONArray querySnmodelList() throws Exception;

	public JSONArray querySntypeList() throws Exception;

	public String queSnmodelNameByDid(int snModelId) throws Exception;

	JSONArray queryCameraModelList() throws Exception;

	JSONArray queryCameraTypeList() throws Exception;

	/**
	 * 根据指定id 【cameraType】 获取对应摄像机信息
	 * 
	 * @return
	 * @throws Exception
	 */
	JSONObject queryCameraTypeById(String cameraType) throws Exception;

}
