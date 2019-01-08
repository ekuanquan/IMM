package com.znyw.service;

import java.util.List;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.Pagepojo;

public interface RoleAreaService {

	JSONObject findRoleArea(JSONObject fuzzy, Pagepojo pagepojo)
			throws Exception;

	/**
	 * 如果参数中有 devId,则通过设备所在区域返回所有角色
	 * 
	 * @param jsonObject
	 * @return
	 * @throws Exception
	 */
	JSONObject findByKey(JSONObject jsonObject) throws Exception;

	JSONObject addRoleArea(JSONObject jsonObejct) throws Exception;

	JSONObject updateRoleArea(JSONObject jsonObejct) throws Exception;

	JSONObject deleteRoleArea(JSONObject jsonObejct) throws Exception;

	JSONObject listRoleInfo(JSONObject fuzzy, Pagepojo pagepojo)
			throws Exception;

	JSONObject getRoleInfoByRoleId(JSONObject jsonObject) throws Exception;

	JSONObject getRoleInfoByUserId(JSONObject jsonObject) throws Exception;

	List<String> getPurviewAreaIdsByUserId(String userId) throws Exception;

	List<String> getPurviewAreaIdsByRoleId(String roleId) throws Exception;

	List<String> getUserAccountsByRoleId(String roleId) throws Exception;

	JSONObject getUserIdsBydevId(JSONObject jsonObject) throws Exception;

	JSONObject getAlreadyChooseHandleAreas(JSONObject jsonObject)
			throws Exception;

	JSONObject getUserIdsByRoleIds(List<String> roleIds) throws Exception;

}
