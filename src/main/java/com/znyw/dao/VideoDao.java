package com.znyw.dao;

import java.util.List;
import java.util.Map;

import com.znyw.pojo.NVRVideoPojo;

public interface VideoDao {
	public List<NVRVideoPojo> findNVRVideoByUserId(String [] cameraIdArry) throws Exception;

	public String getCameraIdList(String userId, String zoneCHValue,String zoneCHFlag);

	/**
	 * 根据设备编号列表获取防区信息
	 * 
	 * @param devIds
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getCameraByDevIds(List<String> devIds) throws Exception;
	

	/**
	 * 根据机主编号获取最大用户监控点编号
	 * 
	 * @param ownerId
	 * @return
	 * @throws Exception
	 */
	public String getCurrentMaxOwnerMonitorId(String ownerId) throws Exception;
}
