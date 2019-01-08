package com.device.service;

import java.util.List;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.Pagepojo;

public interface IQueryDevService {

	public JSONObject queryAlarmhostList(Pagepojo pagepojo,
			JSONObject queryTond, String userId);

	public JSONObject queryAlarmhostZoneList(JSONObject jsonParam);

	public JSONObject queryAlarmhostZoneInfo(JSONObject jsonParam);

	public JSONObject queryAlarmhostInfo(JSONObject jsonParam);

	public JSONObject queryWirenvrInfo(JSONObject jsonParam);

	public JSONObject queryNetnvrInfo(JSONObject jsonParam);

	public JSONObject queryCameraList(JSONObject jsonParam);

	public JSONObject queryDeviceId(JSONObject jsonParam);

	public JSONObject queryCameraInfo(JSONObject jsonParam);

	public JSONObject queryCameraUrl(JSONObject jsonParam);

	public JSONObject queryAlmtypeList();

	public JSONObject queryWanttoList();

	public JSONObject querySnmodelList();

	public JSONObject querySntypeList();

	/**
	 * 查询摄像机型号
	 * 
	 * @return
	 */
	JSONObject queryCameraModelList();

	/**
	 * 查询摄像机类型
	 * 
	 * @return
	 */
	JSONObject queryCameraTypeList();

	/**
	 * 根据指定id 【cameraType】 获取对应摄像机信息
	 * 
	 * @return
	 */
	JSONObject queryCameraTypeById(String cameraType);

	public JSONObject queryAlarmhostAllList(Pagepojo pagepojo,
			JSONObject queryTond, String userId) throws Exception;
	

}