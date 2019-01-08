package com.znyw.dao;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.McsDevstatusPojo;

public interface UserStateMonitorDao {
	public List getUserIndustryDao();
	
	public Map getUserStateListDao(String areaId,String groupId,String queryValue,String checkId,String pageSize,String currentPage);
	
	public Map queryAddUserStateListDao(String userId,String userValue, String businessId,String pageSize,String currentPage);
	
	public boolean addGroupDao(String groupId, String groupName,String areaId, JSONArray addUserList);

	public int queryGroupNum(String groupName) throws Exception;
	public int queryGroupNum(String groupName,String groupId) throws Exception;
	
	public String  getAreaId(String userId);
	
	public List  getGroupDao(String areaId);
	
	public List  queryGroupDataDao(String groupId);
	
	public boolean editGroupDao(String groupId, String groupName,JSONArray addUserList);
	
	public boolean deleteGroupDao(String groupId);
	
	public List  getUserStateDataDao(String userId);
	
	public List getByPassDataDao(String userId);
	
	public List addGroupAllUserDao(String userId,String businessId,String userValue);

	public Map getUserStateListByWorkStationDao(List<String> userIds, String groupId,String queryValue,String checkId,String pageSize,String currentPage);
	
	/**
	 * 通过id获取设备布撤防信息
	 * @param devId
	 * @return
	 * @throws Exception
	 */
	public  McsDevstatusPojo queryDevStatus(String devId) throws Exception;
	
	/**
	 * 通过设备id获取设备下子系统的布撤防信息
	 * @param devId
	 * @return
	 * @throws Exception
	 */
	public  List<McsDevstatusPojo> queryDevSubSysStatus(String devId) throws Exception;
}
