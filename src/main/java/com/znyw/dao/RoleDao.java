package com.znyw.dao;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public interface RoleDao {
	public List getRoleListByRDDao();
	
	public Map<?, ?> roleInfo(String roleType, String pageSize,
			String currentPage);

	public Map<?, ?> queryRoleDao(String roleType, boolean handleOnly, String sort,
			String pageSize, String currentPage, String value) throws Exception;

	public Map<?, ?> getRole(String pageSize, String currentPage) throws Exception;

	public List<?> getRoleDev(String roleId);

	public JSONObject delRoleDao(String roleId);

	public int getRoleInfo(String roleId);

	public boolean addRoleDao(String roleId, String roleName, String roleType,
			String fMemo, JSONArray devList, List permissionsList);

	public List<?> getAddDevNum(String devType, String userType);

	public List<?> getRoleDevList(String roleId);

	public String findHost(String roleId) throws Exception;

	public boolean addRoleDev(String roleId, JSONArray addDev);

	public boolean delRoleDev(String roleId, JSONArray delDev);

	public List<?> getlRolePermissionDao(String roleId);

	public boolean upDataRolePermission(String roleId, List permissionsList);

	public Map<?, ?> queryAppRoleDao(String applicationId) throws Exception;

	public Map<?, ?> queryAppUserDao(String applicationId) throws Exception;
}
