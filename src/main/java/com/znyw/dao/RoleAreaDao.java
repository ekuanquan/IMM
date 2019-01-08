package com.znyw.dao;

import java.util.List;
import java.util.Map;
import java.util.Set;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.Pagepojo;

public interface RoleAreaDao {

	List<Map<String, Object>> findRoleArea(JSONObject jsonObject,
			Pagepojo pagepojo) throws Exception;

	List<Map<String, Object>> findRoleInfo(JSONObject jsonObject,
			Pagepojo pagepojo) throws Exception;

	List<Map<String, Object>> findByKey(JSONObject jsonObject, String syscode)
			throws Exception;

	boolean addRoleArea(JSONObject jsonObject) throws Exception;

	boolean deleteRoleAreaByRoleId(String roleId) throws Exception;

	boolean deleteRoleAreaByAreaIds(Set<String> areaIds) throws Exception;

	boolean addRoleinfo(JSONObject jsonObject) throws Exception;

	boolean deleteRoleInfo(String roleId) throws Exception;

	boolean updateRoleinfo(JSONObject jsonObject, String roleId)
			throws Exception;

	boolean addRoleApp(JSONObject jsonObject) throws Exception;

	boolean deleteRoleAppByRoleId(String roleId) throws Exception;

	boolean addRoleModule(JSONObject jsonObject) throws Exception;

	boolean deleteRoleModuleByRoleId(String roleId) throws Exception;

	boolean setRoleId2NullForUserinfo(String roleId) throws Exception;

	int countRoleArea(JSONObject jsonObject) throws Exception;

	int countRoleInfo(JSONObject jsonObject) throws Exception;

	List<Map<String, Object>> getRoleAreasByRoleId(String roleId)
			throws Exception;

	List<Map<String, Object>> getRoleAreasByRoleId(String roleId,
			String isDataNode, String isHandleNode, String platformId) throws Exception;

	List<Map<String, Object>> getRoleIdsByAreaId(String areaId,
			String isDataNode, String isHandleNode, String browseHandleDataOnly)
			throws Exception;

	/**
	 * 获取指定角色的权限区域
	 * 
	 * @param roleId
	 * @return
	 */
	List<Map<String, Object>> getPurviewAreaByRoleId(String roleId)
			throws Exception;

	List<String> getApplicationIdByRoleId(String roleId) throws Exception;

	List<String> getModuleIdByRoleId(String roleId) throws Exception;

	List<String> getPurviewAreaIdsByRoleId(String roleId) throws Exception;

	List<String> getUserAccountsByRoleId(String roleId) throws Exception;

	boolean hasRecord(String areaId, int isHandleNode) throws Exception;

	List<Map<String, Object>> getAlreadyChooseHandleAreas(String roleId)
			throws Exception;

	List<Map<String, Object>> getAllRoleAreaByAreaIdWithDataNode(String areaId,
			String isHandleNode) throws Exception;

	List<Map<String, Object>> getRoleInfoByRoleId(String roleId)
			throws Exception;

	boolean isLocalRole(String roleId) throws Exception;

	boolean deleteByAreaIds(Set<String> areaIds) throws Exception;

}
