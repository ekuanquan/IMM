package com.znyw.service;

import com.alibaba.fastjson.JSONObject;


public interface RoleService {
	public JSONObject getRoleListByRDService(JSONObject jsonObject);
	
	public JSONObject delRoleService(String roleId);
	
	public JSONObject roleDevService(String roleId);
	
	public JSONObject getlRolePermissionService(String roleId);
	
	public JSONObject getAddDevNumService(JSONObject json);
	
	public JSONObject transmitListService();
	
	public JSONObject transmitSetRoleService(JSONObject json);
	
	public JSONObject transmitGetRoleService(JSONObject json);
	
	public JSONObject transmitDeletRoleService(JSONObject json);
	
	public JSONObject queryRoleService(String roleType, boolean handleOnly, String sort, String pageSize,
			String currentPage, String value);
	
}
