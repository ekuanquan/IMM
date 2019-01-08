package com.znyw.service;

import java.util.List;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.ResultPojo;

public interface DeviceService {
	public JSONObject getDeviceInfos(String accountNum) throws Exception;

	public JSONObject getCphQueeyEquipmentData(JSONObject JSON);

	public JSONObject getDeviceZone(String devId);

	public ResultPojo getAssociatedDeviceByUserId(String userId);

	public ResultPojo getMonitorInfoByDevId(String devId);

	public ResultPojo addUserMonitorInfo(JSONObject jsonObject)
			throws Exception;

	public ResultPojo updateUserMonitorInfo(JSONObject jsonObject);

	public ResultPojo delUserMonitorInfo(String roleId, String devId,
			String devMonitorId, String userMonitorId);

	/**
	 * 提供给DTPP的接口，根据用户编号获取设备摘要：
	 * 
	 * 设备编号、设备名称、 设备类型、设备经纬度
	 * 
	 * @param jsonObject
	 * @return
	 */
	public ResultPojo getDevinfoAbstractByOwnerIdFromDTPP(JSONObject jsonObject);

	public String getDevIdByDevSn(String devSn) throws Exception;

	public boolean updateOneClickDevOnlineState(String devId, String sysCode)
			throws Exception;

	/**
	 * 修改设备编号 {"oldDevId":"旧编号","newDevId":"新编号"}
	 * 
	 * @param jsonObject
	 * @return
	 */
	public JSONObject modifyDevId(JSONObject jsonObject);

	/**
	 * 获取设备信息（经纬度）
	 * 
	 * @param jsonObject
	 * @return
	 */
	public JSONObject getAlarmHostLocationInfo(JSONObject jsonObject);

	/**
	 * 一键报警 添加设备防区
	 * 
	 * @param jsonObejct
	 * @return
	 */
	public JSONObject addDevZoneForOneClickDev(JSONObject jsonObejct);

	/**
	 * 一键报警 修改设备防区
	 * 
	 * @param jsonObejct
	 * @return
	 */
	public JSONObject updateDevZoneForOneClickDev(JSONObject jsonObejct);

	/**
	 * 一键报警 删除设备防区
	 * 
	 * @param jsonObejct
	 * @return
	 */
	public JSONObject deleteDevZoneForOneClickDev(JSONObject jsonObejct);

	/**
	 * 一键报警 查询设备防区
	 * 
	 * @param jsonObject
	 * @return
	 */
	public JSONObject queryDevZoneForOneClickDev(JSONObject jsonObject);

	public ResultPojo delUserMonitorInfoBatch(String ownerId,
			List<String> userMonitorId);

	public ResultPojo deleteBatchDevZoneForOneClickDev(String devId,
			List<String> devZoneIds);

}
