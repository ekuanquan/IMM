package com.znyw.dao.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.systemcfg.dao.AssembleCfgDao;
import com.znyw.dao.RoleDao;
import com.znyw.pojo.RolePojo;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.Objects;
import com.znyw.tool.SetField;

@Repository
public class RoleDaoImpl implements RoleDao {
	private static Logger logger = Logger.getLogger(RoleDaoImpl.class);
	@Resource
	JdbcTemplate jdbcTemplate;
	@Resource
	private AssembleCfgDao assembleCfgDao;

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	@Transactional
	public Map roleInfo(String roleType, String pageSize, String currentPage) { // 根据角色类型查询角色信息

		Map<String, Object> map = new HashMap<String, Object>();
		int pageSizeInt = Integer.parseInt(pageSize);
		int currentPageInt = Integer.parseInt(currentPage);

		List<RolePojo> list = null;
		int totalNum = 0;
		if (roleType != null && !roleType.equals("")) {

			String sql = " SELECT roleId,roleType,roleName,fMemo FROM imm_roleinfo WHERE roleType = "
					+ roleType
					+ " order By roleId asc LIMIT "
					+ (currentPageInt - 1) * pageSizeInt + "," + pageSize + " ";
			String sqlNum = " SELECT count(*) FROM imm_roleinfo WHERE roleType = "
					+ roleType + "";

			try {
				list = jdbcTemplate.query(sql, new BeanPropertyRowMapper(
						RolePojo.class));
				totalNum = jdbcTemplate.queryForInt(sqlNum);
			} catch (Exception e) {
				logger.error(e.getMessage(), e);
				list = null;
				totalNum = 0;
			}
		}

		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}

		map.put("list", list);
		map.put("totalNum", totalNum);
		return map;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	@Transactional
	public Map<?, ?> queryRoleDao(String roleType, boolean handleOnly,
			String sort, String pageSize, String currentPage, String value) throws Exception {// 根据角色类型、角色编号、角色名称，模糊查询角色列表

		Map<String, Object> map = new HashMap<String, Object>();
		int pageSizeInt = Integer.parseInt(pageSize);
		int currentPageInt = Integer.parseInt(currentPage);

		List<RolePojo> list = null;
		int totalNum = 0;
		if (roleType != null && !roleType.equals("")) {

			String platformSql = "";

			if (handleOnly) {
				String localPlatformId = ConfigUtil.getPlatformId();
				platformSql = " and a.platformId = '" + localPlatformId + "' ";
			}

			String sql = " SELECT a.roleId,a.roleType,a.roleName,a.fMemo,a.platformId,b.platform_name as platformName,u.userNum "
					+" FROM imm_roleinfo a LEFT JOIN (select COUNT(userId) userNum,roleId FROM imm_userinfo GROUP BY roleId) u ON a.roleId=u.roleId ,imm_assemble_cfg b "
					+" WHERE a.platformId=b.platform_id and roleType = "
					+ roleType
					+ platformSql
					+ "  AND (locate('"+value+"', a.roleId) > 0 OR locate('" + value + "', roleName) > 0) order By roleId "
					+ sort
					+ " LIMIT "
					+ (currentPageInt - 1) * pageSizeInt + "," + pageSize + " ";
			String sqlNum = " SELECT count(*) from imm_roleinfo a,imm_assemble_cfg b WHERE a.platformId=b.platform_id and roleType = "
					+ roleType
					+ platformSql
					+ " AND (locate('" + value + "', roleId) > 0 OR locate('" + value + "', roleName) > 0)";

			try {
				list = jdbcTemplate.query(sql, new BeanPropertyRowMapper(
						RolePojo.class));
				totalNum = jdbcTemplate.queryForInt(sqlNum);
			} catch (Exception e) {
				throw e;
			}
		}

		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}

		map.put("list", list);
		map.put("totalNum", totalNum);
		return map;
	}

	@SuppressWarnings({ "deprecation", "unchecked" })
	@Override
	@Transactional
	public Map getRole(String pageSize, String currentPage) throws Exception {

		Map<String, Object> map = new HashMap<String, Object>();
		int pageSizeInt = Integer.parseInt(pageSize);
		int currentPageInt = Integer.parseInt(currentPage);

		List<RolePojo> list = null;
		int totalNum = 0;

		String sql = " SELECT roleId,roleType,roleName,fMemo FROM imm_roleinfo order By roleId asc LIMIT "
				+ (currentPageInt - 1) * pageSizeInt + "," + pageSize + " ";
		String sqlNum = " SELECT count(*) FROM imm_roleinfo ";

		try {
			list = jdbcTemplate.query(sql, new BeanPropertyRowMapper(
					RolePojo.class));
			totalNum = jdbcTemplate.queryForInt(sqlNum);
		} catch (Exception e) {
			throw e;
		}

		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}

		map.put("list", list);
		map.put("totalNum", totalNum);
		return map;
	}

	@Override
	@Transactional
	public List getRoleDev(String roleId) {

		System.out.println("roleId: " + roleId);
		String sql = "SELECT distinct imm_devinfo.devId,imm_devinfo.devType,devName,areaName,devTypeName,devModelName,devState "
				+ "FROM imm_devinfo INNER JOIN imm_roledev ON imm_devinfo.devId=imm_roledev.devId "
				+ "LEFT JOIN imm_area ON imm_devinfo.areaId= imm_area.areaId "
				+ "LEFT JOIN imm_devtype ON imm_devinfo.devType=imm_devtype.devType "
				+ "LEFT JOIN imm_devmodel ON imm_devinfo.devModelId=imm_devmodel.devModelId "
				+ "WHERE imm_devinfo.devId = imm_roledev.devId AND imm_roledev.roleId= ? "
				+ "AND (imm_devinfo.devType!=8 AND imm_devinfo.devType!=11 "
				+ "     AND imm_devinfo.devType!=12 AND imm_devinfo.devType!=14)";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,
				new Object[] { roleId });
		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}
		return list;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List getlRolePermissionDao(String roleId) {

		String sql = "SELECT applicationId FROM imm_roleapp WHERE roleId = ?";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,
				new Object[] { roleId });
		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}
		return list;
	}

	@Override
	@Transactional
	public JSONObject delRoleDao(String roleId) {

		// 删除角色表的记录
		String sql1 = "DELETE FROM imm_roleinfo WHERE roleId = ?";
		jdbcTemplate.update(sql1, roleId);

		// 删除角色-设备关系表的记录
		String sql2 = "DELETE FROM imm_roledev WHERE roleId = ?";
		jdbcTemplate.update(sql2, roleId);

		// 删除角色防区表的记录
		String sql3 = "DELETE FROM imm_rolezone WHERE roleId = ?";
		jdbcTemplate.update(sql3, roleId);

		// 根据角色编号，查询【用户基本信息表】获取用户列表
		String sqlq1 = "SELECT userId FROM imm_userinfo WHERE roleId = ?";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sqlq1,
				new Object[] { roleId });
		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}

		// 从用户基本信息表中删清除这批用户的角色
		for (int i = 0; i < list.size(); i++) {
			JSONObject jsonObject = (JSONObject) JSONObject.toJSON(list.get(i));
			String sql4 = "UPDATE imm_userinfo SET roleId = '' WHERE userId = ?";
			jdbcTemplate.update(sql4,
					new Object[] { jsonObject.getString("userId") });
		}
		// 删除角色-应用关系表的记录
		String sql5 = "DELETE FROM imm_roleapp WHERE roleId = ?";
		jdbcTemplate.update(sql5, roleId);

		// 根据用户列表，查询【设备基本信息表】获取机主为该批用户的设备，清理设备信息中机主相关信息
		for (int i = 0; i < list.size(); i++) {
			JSONObject jsonObject = (JSONObject) JSONObject.toJSON(list.get(i));
			String sql = "UPDATE imm_devinfo SET userId = '' WHERE userId = ?";
			jdbcTemplate.update(sql,
					new Object[] { jsonObject.getString("userId") });
		}
		return null;

	}

	@Override
	@Transactional
	public int getRoleInfo(String roleId) {
		String sql = "SELECT roleId,roleType,roleName,fMemo FROM imm_roleinfo WHERE roleId = ?";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,
				new Object[] { roleId });

		if (list.size() > 0) {
			return 1;
		} else if (list.size() == 0) { 
			return 2;
		} else { 
			return 3;
		}

	}

	@Override
	@Transactional
	public boolean addRoleDao(String roleId, String roleName, String roleType,
			String fMemo, JSONArray devList, List permissionsList) {
		// 在【角色表】中添加记录，记录角色信息
		String sql1 = "insert into imm_roleinfo (roleId,roleName,roleType,fMemo) values (?,?,?,?)";
		jdbcTemplate.update(sql1, new Object[] { roleId, roleName, roleType,
				fMemo });

		// 在【角色-操作权限关系表】中根据模块编号、操作编号、角色编号添加多条记录（暂时只有应用）
		String sql3 = "insert into imm_roleapp (roleId,applicationId) values (?,?)";
		for (int i = 0; i < permissionsList.size(); i++) {
			String applicationId = (String) permissionsList.get(i);
			jdbcTemplate.update(sql3, new Object[] { roleId, applicationId });
		}

		// 在【角色-设备关系表】中根据设备编号、角色编号添加多条记录
		for (int i = 0; i < devList.size(); i++) {
			JSONObject dev = (JSONObject) devList.get(i);
			String devId = dev.getString("devId");
			String sql = "insert into imm_roledev (roleId,devId) values (?,?)";
			jdbcTemplate.update(sql, new Object[] { roleId, devId });
		}

		// 根据设备编号列表，查询【设备防区表】中防区探测器编号有值的记录
		// 根据设备编号列表，查询【设备基本信息表】的信息
		String sql = "SELECT imm_roledev.roleId,imm_devzone.devId,imm_devzone.devZoneId"
				+ ",imm_devinfo.mapId,imm_devzone.snModeId 'snModelId',imm_devzone.x,imm_devzone.y, "
				+ "imm_devzone.updatetime,imm_devzone.fMemo,imm_devzone.syncTime FROM imm_devzone "
				+ "LEFT JOIN imm_devinfo ON imm_devzone.devId=imm_devinfo.devId "
				+ "LEFT JOIN imm_roledev ON imm_roledev.devId=imm_devzone.devId "
				+ "WHERE imm_roledev.roleId= ? ";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,
				new Object[] { roleId });
		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}

		// 根据上面查询结果，在【角色防区表】中添加记录。记录根据角色编号、设备编号、防区编号、角色防区名称（程序生成默认信息）、防区图编号
		for (int i = 0; i < list.size(); i++) {
			JSONObject jsonObject = (JSONObject) JSONObject.toJSON(list.get(i));
			String numString = String.valueOf(i + 1);
			String roleZoneName = "";
			if (numString.length() == 1) {
				roleZoneName = "000" + numString;
			} else if (numString.length() == 2) {
				roleZoneName = "00" + numString;
			} else if (numString.length() == 3) {
				roleZoneName = "0" + numString;
			} else if (numString.length() == 4) {
				roleZoneName = numString;
			}
			String sql2 = "INSERT INTO imm_rolezone"
					+ "(roleId,devId,devZoneId,roleZoneName,mapId,snModelId,x,y,updatetime,fMemo,syncTime) "
					+ "VALUES(?,?,?,?,?,?,?,?,?,?,?)";
			jdbcTemplate.update(
					sql2,
					new Object[] { roleId, jsonObject.getString("devId"),
							jsonObject.getString("devZoneId"), roleZoneName,
							jsonObject.getString("mapId"),
							jsonObject.getString("snModelId"),
							jsonObject.getString("x"),
							jsonObject.getString("y"),
							jsonObject.getString("updatetime"),
							jsonObject.getString("fMemo"),
							jsonObject.getString("syncTime") });
		}
		return true;

	}

	@Override
	@Transactional
	public List getAddDevNum(String devType, String userType) {
		String sql = new String();
		if (userType.equals("1")) {
			// 机主用户查询设备编号
			sql = "SELECT distinct imm_devinfo.devId,devName,areaName,devTypeName,devModelName,devState FROM imm_devinfo "
					+ "LEFT JOIN imm_area ON imm_devinfo.areaId= imm_area.areaId "
					+ "LEFT JOIN imm_devtype ON imm_devinfo.devType=imm_devtype.devType "
					+ "LEFT JOIN imm_devmodel ON imm_devinfo.devModelId=imm_devmodel.devModelId "
					+ "WHERE imm_devinfo.devType = ? AND imm_devinfo.userId IS NULL LIMIT 0,1000";
		} else {
			// 一般用户查询编号
			sql = "SELECT distinct imm_devinfo.devId,devName,areaName,devTypeName,devModelName,devState FROM imm_devinfo "
					+ "LEFT JOIN imm_area ON imm_devinfo.areaId= imm_area.areaId "
					+ "LEFT JOIN imm_devtype ON imm_devinfo.devType=imm_devtype.devType "
					+ "LEFT JOIN imm_devmodel ON imm_devinfo.devModelId=imm_devmodel.devModelId "
					+ "WHERE imm_devinfo.devType = ? LIMIT 0,10";
		}
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,
				new Object[] { devType });
		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}
		return list;

	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List getRoleDevList(String roleId) {
		String sqll1 = "SELECT * FROM imm_roledev WHERE roleId = ?";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sqll1,
				new Object[] { roleId });
		return list;
	}

	@Override
	public String findHost(String roleId) throws Exception {
		String sql = "SELECT userId FROM imm_userinfo WHERE roleId = ? AND userType = '1'";
		try {
			/*String userId = jdbcTemplate.queryForObject(sql,
					new String[] { roleId }, String.class);
			return userId;*/
			List<Map<String,Object>> lists=jdbcTemplate.queryForList(sql, new Object[] {roleId});
			return Objects.isNull(lists)?null:lists.get(0).get("userId").toString();
		} catch (Exception e) {
			throw e;
		}

	}

	@Override
	@Transactional
	public boolean addRoleDev(String roleId, JSONArray addDev) {
		// 根据添加的设备列表修改角色设备关系表的记录
		for (int i = 0; i < addDev.size(); i++) {
			JSONObject dev = (JSONObject) addDev.get(i);
			String devId = dev.getString("devId");
			String sql = "insert into imm_roledev (roleId,devId) values (?,?)";
			jdbcTemplate.update(sql, new Object[] { roleId, devId });

		}
		return true;

	}

	@Override
	@Transactional
	public boolean delRoleDev(String roleId, JSONArray delDev) {
		// 存在要移除的设备，根据角色编号，查询【用户基本信息表】获取用户列表
		String sql1 = "SELECT * FROM imm_userinfo WHERE roleId = ? ";
		List<Map<String, Object>> userList = jdbcTemplate.queryForList(sql1,
				new Object[] { roleId });
		// 根据用户编号列表、设备编号列表，查询【设备基本信息表】这批设备中机主为这批用户的记录。如果存在，则清理掉设备中机主的设置信息。
		if (userList.size() > 0) {
			for (int i = 0; i < delDev.size(); i++) {
				JSONObject job = delDev.getJSONObject(i);
				String devId = job.getString("devId");
				String sql2 = "UPDATE imm_devinfo SET userId = '' WHERE devId = ? AND userId =?";
				for (int j = 0; j < userList.size(); j++) {
					JSONObject user = delDev.getJSONObject(j);
					String userId = user.getString("userId");
					jdbcTemplate.update(sql2, new Object[] { devId, userId });
				}
			}
		}

		for (int i = 0; i < delDev.size(); i++) {
			// 存在要移除的设备，根据角色编号、设备编号，移除【角色-设备关系表】相关记录
			JSONObject job = delDev.getJSONObject(i);
			String devId = job.getString("devId");
			String sql3 = "DELETE FROM imm_roledev where roleId= ? AND devId = ? ";
			jdbcTemplate.update(sql3, new Object[] { roleId, devId });

			// 根据角色编号、设备编号，移除【角色防区表】相关记录
			String sql4 = "DELETE FROM imm_rolezone WHERE roleId= ? AND devId = ?";
			jdbcTemplate.update(sql4, new Object[] { roleId, devId });

		}

		return true;

	}

	@Override
	@Transactional
	public boolean upDataRolePermission(String roleId, List permissionsList) {
		// 删除角色-操作权限关系表的记录
		String sql5 = "DELETE FROM imm_roleapp WHERE roleId = ?";
		jdbcTemplate.update(sql5, roleId);
		// 重新插入权限
		String sql3 = "insert into imm_roleapp (roleId,applicationId) values (?,?)";
		for (int i = 0; i < permissionsList.size(); i++) {
			String applicationId = (String) permissionsList.get(i);
			jdbcTemplate.update(sql3, new Object[] { roleId, applicationId });
		}
		return true;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public Map queryAppRoleDao(String applicationId) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();

		List<RolePojo> list = null;
		if (applicationId != null && !applicationId.equals("")) {

			String sql = "SELECT imm_roleinfo.roleId,roleType,roleName,fMemo FROM imm_roleinfo "
					+ " LEFT JOIN imm_roleapp ON imm_roleinfo.roleId = imm_roleapp.roleId"
					+ " WHERE applicationId = ?";

			try {
				list = jdbcTemplate.query(sql, new Object[] { applicationId },
						new BeanPropertyRowMapper(RolePojo.class));
			} catch (Exception e) {
				throw e;
			}
		}
		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}

		map.put("list", list);
		return map;
	}

	@Override
	public Map queryAppUserDao(String applicationId) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();

		List<Map<String, Object>> list = null;
		if (applicationId != null && !applicationId.equals("")) {

			String sql = "SELECT userId,userAccount,areaId,imm_userinfo.roleId,userName,userType,centerId "
					+ " FROM imm_userinfo LEFT JOIN imm_roleapp ON imm_userinfo.roleId = imm_roleapp.roleId"
					+ " WHERE imm_roleapp.applicationId = ?;";

			try {
				list = jdbcTemplate.queryForList(sql,
						new Object[] { applicationId });
			} catch (Exception e) {
				throw e;
			}
		}
		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}

		map.put("list", list);
		return map;
	}

	@Override
	public List getRoleListByRDDao() {
		String sql = "SELECT DISTINCT imm_roleapp.roleId, imm_roleinfo.roleName FROM imm_roleapp"
				+ " LEFT JOIN imm_roleinfo ON imm_roleapp.roleId = imm_roleinfo.roleId"
				+ " WHERE imm_roleapp.applicationId = 'RDAcenter';";
		List<Map<String, Object>> list = null;
		try {
			list = jdbcTemplate.queryForList(sql);
		} catch (Exception e) {
			throw e;
		}
		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}
		return list;
	}
}
