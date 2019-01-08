package com.znyw.dao.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONObject;
import com.systemcfg.dao.AssembleCfgDao;
import com.znyw.dao.RoleAreaDao;
import com.znyw.pojo.Pagepojo;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.Objects;
import com.znyw.tool.SqlGenerateUtils;

@Repository
public class RoleAreaDaoImp implements RoleAreaDao {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(RoleAreaDaoImp.class);

	private static final String QUERY_SQL = "select a.*,b.areaName from imm_rolearea a,imm_area b where %s and a.areaId=b.areaId order by %s %s limit %d,%d";
	private static final String QUERY_ROLEINFO_SQL = "select a.roleId,a.roleName,a.roleType,b.roleTypeName,a.fMemo from imm_roleinfo a left join imm_roletype b ON a.roleType=b.roleTypeId where %s order by %s %s limit %d,%d";
	private static final String QUERY_NO_LIMIT_SQL = "select a.roleId, a.*,c.areaName from imm_rolearea a "
			+ "left join imm_roleinfo b on a.roleId=b.roleId "
			+ "left join imm_area c on a.areaId=c.areaId "
			+ "where %s and b.default_accept_syscodes like '%s' order by %s %s";
	private static final String COUNT_ROLEAREA_SQL = "select count(*) from imm_rolearea a,imm_area b where %s and a.areaId=b.areaId";
	private static final String INSERT_ROLEAREA_SQL = "insert into imm_rolearea %s ";
	private static final String INSERT_ROLEINFO_SQL = "insert into imm_roleinfo %s ";
	private static final String COUNT_ROLEINFO_SQL = "select count(*) from imm_roleinfo a left join imm_roletype b ON a.roleType=b.roleTypeId  where %s ";
	private static final String INSERT_ROLEMODULE_SQL = "insert into imm_rolemodule %s ";
	private static final String INSERT_ROLEAPP_SQL = "insert into imm_roleapp %s";
	private static final String QUERY_ROLEAREA_BY_ROLEID = "SELECT DISTINCT a.areaId,d.areaName,a.browse_handle_data_only,a.real_time_handel"
			+ " FROM imm_rolearea a LEFT JOIN imm_area d ON a.areaId=d.areaId WHERE a.roleId=? ";

	private static final String QUERY_ROLEAREA_BY_ROLEID_AND_ISDATANODE_AND_ISHANDLENODE = "SELECT a.areaId,d.areaName,a.browse_handle_data_only,a.real_time_handel"
			+ " FROM imm_rolearea a LEFT JOIN imm_area d ON a.areaId=d.areaId WHERE a.roleId=? and a.is_data_node=? and a.is_handle_node=? ";
	private static final String QUERY_PURVIEW_BY_ROLE = "select roleId,areaId,is_data_node from imm_rolearea where roleId=? and is_handle_node = '0'";
	private static final String QUERY_APPLICATIONID_BY_ROLEID = "select applicationId from imm_roleapp where roleId=?";
	private static final String QUERY_MODULEID_BY_ROLEID = "select moduleId from imm_rolemodule where roleId=?";
	private static final String UPDATE_ROLEINFO_SQL = "update imm_roleinfo set %s where roleId='%s'";
	private static final String DELETE_FROM_ROLEAREA_BY_ROLEID = "delete from imm_roleArea where roleId=?";
	private static final String DELETE_FROM_ROLEAPP_BY_ROLEID = "delete from imm_roleapp where roleId=?";
	private static final String DELETE_FROM_ROLEMODULE_BY_ROLEID = "delete from imm_rolemodule where roleId=?";
	private static final String DELETE_FROM_ROLEINFO_BY_ROLEID = "delete from imm_roleinfo where roleId=?";
	@Resource
	private JdbcTemplate jdbcTemplate;
	@Resource
	private AssembleCfgDao assembleCfgDao;

	@Override
	public List<Map<String, Object>> findRoleArea(JSONObject jsonObject,
			Pagepojo pagepojo) {
		try {

			String order = pagepojo.getOrderBy().split("\\|")[0];
			String sort = pagepojo.getOrderBy().split("\\|")[1];
			int offset = (pagepojo.getCurrentPage() - 1)
					* pagepojo.getPageSize();
			int limit = pagepojo.getPageSize();

			String querySql = " 1 = ? ";
			Object[] values = new Object[] { 1 };
			if (jsonObject != null) {
				String json = jsonObject.toJSONString();
				querySql = SqlGenerateUtils.getSimpleQuerySql(json);
				values = SqlGenerateUtils.getSimpleValues(json, false);
			}

			return jdbcTemplate.queryForList(String.format(QUERY_SQL, querySql,
					order, sort, offset, limit), values);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map<String, Object>> findRoleInfo(JSONObject jsonObject,
			Pagepojo pagepojo) {
		try {

			String order = pagepojo.getOrderBy().split("\\|")[0];
			String sort = pagepojo.getOrderBy().split("\\|")[1];
			int offset = (pagepojo.getCurrentPage() - 1)
					* pagepojo.getPageSize();
			int limit = pagepojo.getPageSize();

			String querySql = " 1 = ? ";
			Object[] values = new Object[] { 1 };
			if (jsonObject != null) {
				String json = jsonObject.toJSONString();
				querySql = SqlGenerateUtils.getSimpleQuerySql(json);
				values = SqlGenerateUtils.getSimpleValues(json, false);
			}

			return jdbcTemplate.queryForList(String.format(QUERY_ROLEINFO_SQL,
					querySql, order, sort, offset, limit), values);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map<String, Object>> findByKey(JSONObject jsonObject,
			String syscode) {
		try {

			String querySql = " 1 = ? ";
			Object[] values = new Object[] { 1 };
			if (jsonObject != null) {
				String json = jsonObject.toJSONString();
				querySql = SqlGenerateUtils
						.getSimpleQuerySql(json, true, "and");
				values = SqlGenerateUtils.getSimpleValues(json, true);
			}
			return jdbcTemplate.queryForList(String.format(QUERY_NO_LIMIT_SQL,
					querySql, syscode, "roleId", "ASC"), values);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean addRoleArea(JSONObject jsonObject) throws Exception {
		try {
			return jdbcTemplate.update(String.format(INSERT_ROLEAREA_SQL,
					SqlGenerateUtils.generateSqlForInsert(jsonObject
							.toJSONString())), SqlGenerateUtils
					.getInsertValues(jsonObject.toJSONString())) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean addRoleinfo(JSONObject jsonObject) {
		try {
			return jdbcTemplate.update(String.format(INSERT_ROLEINFO_SQL,
					SqlGenerateUtils.generateSqlForInsert(jsonObject
							.toJSONString())), SqlGenerateUtils
					.getInsertValues(jsonObject.toJSONString())) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean deleteRoleInfo(String roleId) {
		try {
			return jdbcTemplate.update(DELETE_FROM_ROLEINFO_BY_ROLEID, roleId) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean addRoleApp(JSONObject jsonObject) {
		try {
			return jdbcTemplate.update(String.format(INSERT_ROLEAPP_SQL,
					SqlGenerateUtils.generateSqlForInsert(jsonObject
							.toJSONString())), SqlGenerateUtils
					.getInsertValues(jsonObject.toJSONString())) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean addRoleModule(JSONObject jsonObject) {
		try {
			return jdbcTemplate.update(String.format(INSERT_ROLEMODULE_SQL,
					SqlGenerateUtils.generateSqlForInsert(jsonObject
							.toJSONString())), SqlGenerateUtils
					.getInsertValues(jsonObject.toJSONString())) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings("deprecation")
	@Override
	public int countRoleArea(JSONObject jsonObject) {
		try {
			String querySql = " 1 = ? ";
			Object[] values = new Object[] { 1 };
			if (jsonObject != null) {
				String json = jsonObject.toJSONString();
				querySql = SqlGenerateUtils.getSimpleQuerySql(json);
				values = SqlGenerateUtils.getSimpleValues(json, false);
			}

			return jdbcTemplate.queryForInt(
					String.format(COUNT_ROLEAREA_SQL, querySql), values);
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings("deprecation")
	@Override
	public int countRoleInfo(JSONObject jsonObject) {
		try {
			String querySql = " 1 = ? ";
			Object[] values = new Object[] { 1 };
			if (jsonObject != null) {
				String json = jsonObject.toJSONString();
				querySql = SqlGenerateUtils.getSimpleQuerySql(json);
				values = SqlGenerateUtils.getSimpleValues(json, false);
			}
			return jdbcTemplate.queryForInt(
					String.format(COUNT_ROLEINFO_SQL, querySql), values);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map<String, Object>> getRoleAreasByRoleId(String roleId) {
		try {
			return jdbcTemplate.queryForList(QUERY_ROLEAREA_BY_ROLEID, roleId);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map<String, Object>> getRoleAreasByRoleId(String roleId,
			String isDataNode, String isHandleNode, String platformId) {
		try {
			platformId = "".equals(platformId)?"":" and d.platformId='" + platformId + "' ";
			return jdbcTemplate.queryForList(
					QUERY_ROLEAREA_BY_ROLEID_AND_ISDATANODE_AND_ISHANDLENODE + platformId,
					roleId, isDataNode, isHandleNode);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map<String, Object>> getRoleIdsByAreaId(String areaId,
			String isDataNode, String isHandleNode, String browseHandleDataOnly) {
		String sql = "select distinct roleId from imm_rolearea where areaId=? and is_data_node=? and is_handle_node=? and browse_handle_data_only=?";
		try {
			return jdbcTemplate.queryForList(sql, areaId, isDataNode,
					isHandleNode, browseHandleDataOnly);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map<String, Object>> getPurviewAreaByRoleId(String roleId) {
		try {
			return jdbcTemplate.queryForList(QUERY_PURVIEW_BY_ROLE, roleId);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<String> getApplicationIdByRoleId(String roleId) {
		List<String> applicationIds = new ArrayList<String>();

		try {
			List<Map<String, Object>> result = jdbcTemplate.queryForList(
					QUERY_APPLICATIONID_BY_ROLEID, roleId);

			if (result != null && !result.isEmpty()) {
				for (Map<String, Object> map : result) {
					applicationIds.add(map.get("applicationId").toString());
				}
			}
			return applicationIds;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<String> getModuleIdByRoleId(String roleId) {
		List<String> moduleIds = new ArrayList<String>();
		try {
			List<Map<String, Object>> result = jdbcTemplate.queryForList(
					QUERY_MODULEID_BY_ROLEID, roleId);
			if (result != null && !result.isEmpty()) {
				for (Map<String, Object> map : result) {
					moduleIds.add(map.get("moduleId").toString());
				}
			}
			return moduleIds;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean updateRoleinfo(JSONObject jsonObject, String roleId) {
		try {
			return jdbcTemplate.update(String.format(UPDATE_ROLEINFO_SQL,
					SqlGenerateUtils.generateSqlForUpdate(jsonObject), roleId),
					SqlGenerateUtils.getNewValuesForUpdate(jsonObject)) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean deleteRoleAreaByRoleId(String roleId) {
		try {
			return jdbcTemplate.update(DELETE_FROM_ROLEAREA_BY_ROLEID, roleId) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	public boolean deleteRoleAreaByAreaIds(Set<String> areaIds) {
		String sql = "delete from imm_rolearea where areaId in ('%s') ";
		try {
			return jdbcTemplate.update(String.format(sql,
					Objects.Joiner("','", areaIds))) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean deleteRoleAppByRoleId(String roleId) {
		try {
			return jdbcTemplate.update(DELETE_FROM_ROLEAPP_BY_ROLEID, roleId) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean deleteRoleModuleByRoleId(String roleId) {
		try {
			return jdbcTemplate
					.update(DELETE_FROM_ROLEMODULE_BY_ROLEID, roleId) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean setRoleId2NullForUserinfo(String roleId) {
		try {
			return jdbcTemplate.update(
					"update imm_userinfo set roleId=null where roleId=?",
					roleId) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<String> getPurviewAreaIdsByRoleId(String roleId)
			throws Exception {
		List<String> areaIds = new ArrayList<String>();

		if (roleId == null) {
			return areaIds;
		}

		try {
			String sql = "select areaId from imm_rolearea where is_data_node='1' and roleId=? and is_handle_node='0' ";
			List<Map<String, Object>> result = jdbcTemplate.queryForList(sql,
					roleId);
			for (Map<String, Object> map : result) {
				if (map.get("areaId") != null) {
					areaIds.add(map.get("areaId").toString());
				}
			}
			return areaIds;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<String> getUserAccountsByRoleId(String roleId) {
		List<String> userAccount = new ArrayList<String>();

		if (roleId == null) {
			return userAccount;
		}
		try {
			String sql = "select userAccount from imm_userinfo where roleId=? ";
			List<Map<String, Object>> result = jdbcTemplate.queryForList(sql,
					roleId);
			for (Map<String, Object> map : result) {
				if (map.get("userAccount") != null) {
					userAccount.add(map.get("userAccount").toString());
				}
			}
			return userAccount;
		} catch (Exception e) {
			throw e;
		}

	}

	@SuppressWarnings("deprecation")
	@Override
	public boolean hasRecord(String areaId, int isHandleNode) {
		String sql = "select count(*) from imm_rolearea where areaId=? and is_handle_node=?";
		try {
			return jdbcTemplate.queryForInt(sql, areaId, isHandleNode) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map<String, Object>> getAlreadyChooseHandleAreas(String roleId) {

		String sql = "";

		if (Objects.isNotNullString(roleId)) {
			sql = "select distinct areaId from imm_rolearea where is_data_node=1 and is_handle_node=1 and roleId<>'"
					+ roleId + "'";
		} else {
			sql = "select distinct areaId from imm_rolearea where is_data_node=1 and is_handle_node=1 ";
		}

		try {
			return jdbcTemplate.queryForList(sql);
		} catch (Exception e) {
			throw e;
		}
	}

	public List<Map<String, Object>> getAllRoleAreaByAreaIdWithDataNode(
			String areaId, String isHandleNode) throws Exception {
		String sql = "select * from imm_rolearea where is_data_node=1 and areaId=? and is_handle_node=? ";
		try {
			return jdbcTemplate.queryForList(sql, areaId, isHandleNode);
		} catch (Exception e) {
			throw e;
		}
	}

	public List<Map<String, Object>> getRoleInfoByRoleId(String roleId) {
		String sql = "select a.roleId,a.roleType,a.roleName,a.default_accept_syscodes,a.fMemo,a.platformId,b.platform_name as platformName from imm_roleinfo a,imm_assemble_cfg b where a.platformId=b.platform_id and roleId=?";

		try {
			return jdbcTemplate.queryForList(sql, roleId);
		} catch (Exception e) {
			throw e;
		}
	}

	public boolean isLocalRole(String roleId) {
		List<Map<String, Object>> roleInfo = getRoleInfoByRoleId(roleId);
		if (roleInfo != null && !roleInfo.isEmpty()) {
			return ConfigUtil.getPlatformId().equals(
					roleInfo.get(0).get("platformId").toString());
		}
		return false;
	}

	public boolean deleteByAreaIds(Set<String> areaIds) throws Exception {

		String sql = "delete from imm_rolearea where areaId in ('%s') ";
		try {
			jdbcTemplate.update(String.format(sql,
					Objects.Joiner("','", areaIds)));
			return true;
		} catch (Exception e) {
			throw e;
		}
	}
}
