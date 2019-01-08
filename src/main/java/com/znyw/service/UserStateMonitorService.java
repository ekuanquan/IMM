package com.znyw.service;

import java.util.List;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public interface UserStateMonitorService {
	public JSONObject getUserIndustryService();

	public JSONObject getUserStateListService(String userId, String groupId, String queryValue, String checkId,
			String pageSize, String currentPage);

	public JSONObject queryAddUserStateListService(String userId, String userValue, String businessId, String pageSize,
			String currentPage);

	public JSONObject addGroupService(String groupId, String groupName, String userId, JSONArray addUserList);

	public JSONObject getGroupService(String userId);

	public JSONObject queryGroupDataService(String groupId);

	public JSONObject editGroupService(String groupId, String groupName, JSONArray addUserList);

	public JSONObject deleteGroupService(String groupId);

	public JSONObject getUserStateDataService(String userId);

	public JSONObject getByPassDataService(String userId);

	public JSONObject addGroupAllUserService(String userId, String businessId, String userValue);

	
	public JSONObject getUserStateListByWorkStationService(List<String> userIds,String groupId, String queryValue, String checkId,
			String pageSize, String currentPage);
	/**
	 * 通过设备的id获取设备和设备子系统的布撤防状态
	 * @param devId
	 * @return
	 * @throws Exception
	 */
	public JSONObject getChildInfoByDevId(String devId) throws Exception;
}
