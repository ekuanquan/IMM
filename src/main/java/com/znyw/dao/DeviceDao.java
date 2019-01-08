package com.znyw.dao;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.AssociatedDevicePojo;
import com.znyw.pojo.DeviceInfo;
import com.znyw.pojo.MtaDevZonePojo;

public interface DeviceDao {
	public List<DeviceInfo> getDeviceInfos(String accountNum) throws Exception;

	public Map cphQueeyEquipmentData(int pageSize, int currentPage,
			String sort, String devModelId, String devMaster, String areaId,
			String timeStart, String timeEnt, String fuzzyKey, String fuzzyValue)
			throws Exception; // 综合查询---设备信息查询

	/**
	 * 查询一键报警
	 * 
	 * @param pageSize
	 * @param currentPage
	 * @param sort
	 * @param devModelId
	 * @param isowner
	 * @param areaId
	 * @param timeStart
	 * @param timeEnt
	 * @param fuzzyKey
	 * @param fuzzyValue
	 * @return
	 */
	public Map<String, Object> queryOneClickDev(int pageSize, int currentPage,
			String sort, String devModelId, String isowner, String areaId,
			String devState, String timeStart, String timeEnt, String platformId, String fuzzyKey,
			String fuzzyValue) throws Exception;

	public List<MtaDevZonePojo> getDeviceZone(String devId) throws Exception;

	public List<AssociatedDevicePojo> findAssociatedDeviceByUserId(String userId)
			throws Exception;

	public boolean updateDeviceOwnerByRoleId(String roleId, String userId)
			throws Exception;

	public JSONObject findMonitorInfoByDevId(String devId) throws Exception;

	/**
	 * 向角色监控表插入数据
	 * 
	 * @param roleId
	 * @param devId
	 * @param devMonitorId
	 * @param userMonitorId
	 * @return
	 * @throws Exception
	 */
	public boolean addOwnermonitor(String roleId, String devId,
			String devMonitorId, String userMonitorId, String dataFrom)
			throws Exception;

	public boolean updateUserMonitor(String roleId, String devId,
			String devMonitorId, String userMonitorId) throws Exception;

	public boolean deleteUserMonitor(String roleId, String devId,
			String devMonitorId) throws Exception;

	public boolean findUserMonitorRoleIdDevIdDevMonitorId(String roleId,
			String devId, String devMonitorId) throws Exception;

	public boolean findUserMonitorByRoleIdUserMonitorId(String roleId,
			String userMonitorId) throws Exception;

	/**
	 * 获取指定设备编号的所属区域ID
	 * 
	 * @param devId
	 * @return
	 */
	public String getAreaIdByDevId(Object devId) throws Exception;

	/**
	 * 修改指定的 devIds 的机主和区域
	 * 
	 * @param devIds
	 * @param ownerId
	 * @param areaId
	 * @return
	 */
	public boolean updateOwnerIdAndAreaIdForDevInfoByDevIds(
			List<String> devIds, String ownerId, String areaId)
			throws Exception;

	/**
	 * 将对应 userId 的设备变成无主设备
	 * 
	 * @param userId
	 * @return
	 */
	public boolean setOwnerId2NullForDevByOwnerId(String ownerId)
			throws Exception;

	public boolean setOwnerId2NullForDevByOwnerIdAndDevIds(String ownerId,
			List<String> devIds) throws Exception;

	/**
	 * 从给定的设备 devId 列表中，返回已经有主的设备 devId 列表
	 * 
	 * @param devIds
	 * @return
	 */
	public List<String> getAlreadyHasOwnerDevIds(List<String> devIds)
			throws Exception;

	/**
	 * 从给定的设备 devId 列表中，返回已经有主的但不是指定机主的设备 devId 列表
	 * 
	 * @param devIds
	 * @return
	 */
	public List<String> getAlreadyHasOwnerDevIdsButNotSpecifyOwner(
			List<String> devIds, String ownerId) throws Exception;

	/**
	 * 通过用户编号获取设备摘要信息：设备编号、设备名称、 设备类型、设备经纬度
	 * 
	 * @param ownerId
	 * @return
	 */
	public List<Map<String, Object>> getDevinfoAbstractByOwnerIdFromDTPP(
			String ownerId) throws Exception;

	/**
	 * 将机主下的所有设备的区域改成机主所在区域
	 * 
	 * @param areaId
	 * @param ownerId
	 * @return
	 */
	public boolean updateAreaIdForDevInfo(String areaId, String ownerId)
			throws Exception;

	public List<Map<String, Object>> getDevIdByDevSn(String devSn)
			throws Exception;

	/**
	 * 根据机主编号查询关联设备
	 * 
	 * @param ownerId
	 * @return
	 */
	public List<String> getDevIdsByOwnerId(String ownerId) throws Exception;

	/**
	 * 根据机主编号查询关联设备，但不包含摄像机
	 * 
	 * @param ownerId
	 * @return
	 */
	public List<String> getDevIdsButNotCamerasByOwnerId(String ownerId) throws Exception;

	/**
	 * 设置设备控制类型，主设备或远程控制设备
	 * 
	 * @param masterDevId
	 * @param remoterDevId
	 * @return
	 */
	public boolean setControType(String masterDevId, String remoterDevId)
			throws Exception;

	public boolean setMasterDevId(String masterDevId) throws Exception;

	public boolean setRemoterDevId(String remoterDevId) throws Exception;

	/**
	 * 
	 * @param type
	 *            master|remote
	 * @param ownerId
	 * @return
	 */
	public String getControlDevsByownerId(String type, String ownerId)
			throws Exception;

	public boolean updateOneClickDevOnlineState(String devId, int devState)
			throws Exception;

	/**
	 * 修改设备编号
	 * 
	 * @param oldDevId
	 * @param newDevId
	 * @return
	 */
	public boolean modifyDevId(String oldDevId, String newDevId)
			throws Exception;

	/**
	 * 获取报警主机位置信息（经纬度）
	 * 
	 * @param devId
	 * @return
	 */
	public Map<String, Object> getAlarmHostLocationInfo(String devId)
			throws Exception;

	/**
	 * 删除设备
	 * 
	 * @param devId
	 * @return
	 * @throws Exception
	 */
	public boolean deleteByDevId(String devId) throws Exception;

	/**
	 * 一键报警 添加设备防区
	 * 
	 * @param data
	 * @return
	 */
	public boolean addDevZoneForOneClickDev(JSONObject data) throws Exception;

	/**
	 * 一键报警 修改设备防区
	 * 
	 * @param data
	 * @param condition
	 * @return
	 */
	public boolean updateDevZoneForOneClickDev(JSONObject data,
			JSONObject condition) throws Exception;

	/**
	 * 一键报警 删除设备防区
	 * 
	 * @param condition
	 * @return
	 */
	public boolean deleteDevZoneForOneClickDev(JSONObject condition)
			throws Exception;

	/**
	 * 一键报警 查询设备防区
	 * 
	 * @param devId
	 * @return
	 */
	public List<Map<String, Object>> queryDevZoneForOneClickDev(String devId)
			throws Exception;

	/**
	 * 根据设备编号，删除用户防区
	 * 
	 * @param devIds
	 * @return
	 */
	public boolean deleteOwnerZoneByOwnerIdAndDevIds(String ownerId,
			List<String> devIds) throws Exception;

	/**
	 * 根据设备编号和设备防区编号删除用户防区
	 * 
	 * @param devId
	 * @param devZoneIds
	 * @return
	 */
	public boolean deleteOwnerZoneByDevIdAndDevZoneIds(String devId,
			String[] devZoneIds) throws Exception;

	/**
	 * 根据设备编号和机主编号获取用户防区信息
	 * 
	 * @param devId
	 * @return
	 */
	public List<Map<String, Object>> getOwnerZoneByDevIdAndOwnerId(
			String devIds, String ownerId) throws Exception;

	/**
	 * 根据设备编号和机主编号获取用户防区编号信息
	 * 
	 * @param devId
	 * @return
	 */

	public List<String> getOwnerZoneNameByDevIdsAndOwnerId(List<String> devIds,
			String ownerId) throws Exception;

	/**
	 * 根据防区编号和机主编号删除事件配置
	 * 
	 * @param devIds
	 * @param ownerId
	 * @return
	 */
	public boolean deleteOwnerevtrecordByDevZoneIdsAndOwnerId(
			List<String> devZoneIds, String ownerId) throws Exception;

	/**
	 * 批量删除用户监控点
	 * 
	 * @param ownerId
	 * @param userMonitorId
	 * @return
	 * @throws Exception
	 */
	public boolean deleteUserMonitorBatch(String ownerId,
			List<String> userMonitorId) throws Exception;

	/**
	 * 一键报警批量删除设备防区
	 * 
	 * @param devId
	 * @param devZoneIds
	 * @return
	 * @throws Exception
	 */
	public boolean deleteBatchDevZoneForOneClickDev(String devId,
			List<String> devZoneIds) throws Exception;

	/**
	 * 修改指定NVR设备所关联的摄像机的机主
	 * @param devIds NVR 设备
	 * @param ownerId
	 * @return
	 * @throws Exception
	 */
	public boolean updateCamrasOwnerByDevIds(List<String> devIds, String ownerId) throws Exception;

	/**
	 * 获取指定设备的机主
	 * 
	 * @param devId
	 * @return
	 */
	public String getOwnerIdByDevId(String devId);

	/**
	 * 根据设备编号，删除用户监控点
	 * 
	 * @param devIds
	 * @return
	 */
	public boolean deleteOwnerMonitorByOwnerIdAndDevIds(String ownerId,
			List<String> devIds) throws Exception;

	/**
	 * 设备控制类型置空
	 * 
	 * @param devId
	 * @return
	 */
	public boolean setControlType2Null(String devId) throws Exception;

	/**
	 * 移除指定的控制类型
	 * 
	 * @param devId
	 * @param controlType
	 * @return
	 * @throws Exception
	 */
	public boolean removeControlType(String devId, String controlType) throws Exception;


}
