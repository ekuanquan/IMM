package com.znyw.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.znyw.dao.UserStateMonitorDao;
import com.znyw.pojo.McsDevstatusPojo;
import com.znyw.tool.Objects;
import com.znyw.tool.SetField;

@Repository("UserStateMonitorDao")
public class UserStateMonitorDaoImpl implements UserStateMonitorDao {
	private final Logger log = LoggerFactory.getLogger(this.getClass());

	@Resource
	private JdbcTemplate jdbcTemplate;

	@Override
	@Transactional
	public List getUserIndustryDao() {
		String sql = "SELECT businessId,businessName FROM imm_business";
		try {
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			for (int i = 0; i < list.size(); i++) {
				SetField.reflect(list.get(i));
			}
			return list;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	@Transactional
	public Map getUserStateListDao(String areaId, String groupId,
			String queryValue, String checkId, String pageSize,
			String currentPage) {
		Map<String, Object> map = new HashMap<String, Object>();
		int pageSizeInt = Integer.parseInt(pageSize);
		int currentPageInt = Integer.parseInt(currentPage);
		List<Map<String, Object>> list = null;
		int totalNum = 0;

		StringBuffer sqlSb = new StringBuffer(
				"select u.userId,u.userName,u.cMobile,dev.devId,dev.devStatus,dev.isActivation,dev.isTimeout FROM ");
		StringBuffer sqlNumSb = new StringBuffer("select count(*) as num FROM ");
		// 总数和查询公用的sql部分
		StringBuffer publicSb = new StringBuffer(
				"(select * from userinfo_view WHERE 1=1 ");
		if (!groupId.equals("") && groupId != null) {
			publicSb.append(" AND userId IN (SELECT mcs_group_user.userId FROM mcs_group_user WHERE groupId='"
					+ groupId + "') ");
		}

		/*
		 * if (!queryValue.equals("") && queryValue != null) {
		 * publicSb.append(" AND (userId LIKE '%" + queryValue +
		 * "%' OR userName LIKE '%" + queryValue
		 * 
		 * + "%' OR cMobile LIKE '%" + queryValue + "%') "); }
		 */
		if (!queryValue.equals("") && queryValue != null) {
			publicSb.append(" AND (LOCATE('" + queryValue
					+ "',userId)>0 OR LOCATE('" + queryValue
					+ "',userName)>0    OR  LOCATE('" + queryValue
					+ "',cMobile)>0  ) ");
		}
		publicSb.append(" ) u ");
		if (!"".equals(checkId.trim()) && checkId != null) {
			// 有状态条件就用join
			publicSb.append("JOIN (select * from devinfostatus_view where ");
			switch (checkId) {
			case "isBF": // 布防
				publicSb.append(" devStatus = '1' ");
				break;
			case "noBF": // 撤防
				publicSb.append(" devStatus = '0' ");
				break;
			case "isTimeout": // 离线
				publicSb.append(" isTimeout = '1' ");
				break;
			case "isBYpass": // 旁路
				publicSb.append(" devStatus = '2' ");
				break;
			default:
				publicSb.append("1=1");
			}
			publicSb.append(") dev  ON u.userId=dev.ownerId ");
			sqlNumSb.append(publicSb.toString());
		} else {
			// 无状态条件查总量就是查user的总量
			sqlNumSb.append(publicSb.toString());
			// 无状态条件就用left join
			publicSb.append("LEFT JOIN devinfostatus_view dev  ON u.userId=dev.ownerId   ");
		}

		sqlSb.append(publicSb.toString());
		sqlSb.append(" LIMIT " + (currentPageInt - 1) * pageSizeInt + ","
				+ pageSize + " ");

		try {
			list = jdbcTemplate.queryForList(sqlSb.toString());
			// totalNum = jdbcTemplate.queryForObject(sqlNumSb.toString(),
			// Integer.class);

			List<Map<String, Object>> lists = jdbcTemplate
					.queryForList(sqlNumSb.toString());
			totalNum = Objects.isNull(lists) ? 0 : Integer.valueOf(lists.get(0)
					.get("num").toString());
		} catch (Exception e) {
			list = null;
			totalNum = 0;
		}

		for (int i = 0; i < list.size(); i++) {
			try {
				SetField.reflect(list.get(i));
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		map.put("list", list);
		map.put("totalNum", totalNum);
		return map;

	}

	@Override
	@Transactional
	public Map queryAddUserStateListDao(String userId, String userValue,
			String businessId, String pageSize, String currentPage) {
		Map<String, Object> map = new HashMap<String, Object>();
		int pageSizeInt = Integer.parseInt(pageSize);
		int currentPageInt = Integer.parseInt(currentPage);
		List<Map<String, Object>> list = null;
		int totalNum = 0;

		String sql = " SELECT i.userId,i.userName,imm_customerattr.businessId,b.businessName FROM  imm_userinfo i "
				+ " LEFT JOIN imm_customerattr ON imm_customerattr.userId = i.userId"
				+ " LEFT JOIN imm_business b on b.businessId=imm_customerattr.businessId"
				+ " WHERE i.userType = '1' AND i.areaId IS NOT NULL ";
		// + " = (SELECT areaId FROM imm_userinfo WHERE userId = '"+userId+"')";
		/*
		 * if (!userValue.equals("") && userValue != null) { sql = sql +
		 * " AND (i.userName LIKE '%" + userValue + "%'OR i.userId LIKE '%" +
		 * userValue + "%') "; }
		 */
		if (!userValue.equals("") && userValue != null) {
			sql = sql + "AND (LOCATE('" + userValue
					+ "',i.userName)>0 OR LOCATE('" + userValue
					+ "',i.userId)>0 ) ";
		}
		if (!businessId.equals("") && businessId != null) {
			sql = sql + " AND imm_customerattr.businessId='" + businessId + "'";
		}
		sql = sql + " order By i.userId ASC LIMIT " + (currentPageInt - 1)
				* pageSizeInt + "," + pageSize + " ";

		String sqlNum = "SELECT COUNT(*) FROM imm_userinfo i "
				+ " LEFT JOIN imm_customerattr ON imm_customerattr.userId = i.userId"
				+ " LEFT JOIN imm_business b on b.businessId=imm_customerattr.businessId"
				+ " WHERE i.userType = '1' AND i.areaId IS NOT NULL ";
		// + " = (SELECT areaId FROM imm_userinfo WHERE userId = '"+userId+"')
		// ";
		if (!userValue.equals("") && userValue != null) {
			sqlNum = sqlNum + " AND (i.userName LIKE '%" + userValue
					+ "%'OR i.userId LIKE '%" + userValue + "%') ";
		}
		if (!businessId.equals("") && businessId != null) {
			sqlNum = sqlNum + " AND imm_customerattr.businessId='" + businessId
					+ "'";
		}

		try {
			list = jdbcTemplate.queryForList(sql);
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
	public boolean addGroupDao(String groupId, String groupName, String areaId,
			JSONArray addUserList) {
		try {
			String sql = "INSERT INTO mcs_group (groupId,groupName,areaId) VALUES (?,?,?) ";
			jdbcTemplate.update(sql,
					new Object[] { groupId, groupName, areaId });
			String sqlString = "INSERT INTO mcs_group_user (groupId,userId) VALUES (?,?) ";
			for (int i = 0; i < addUserList.size(); i++) {
				String addUserId = addUserList.getString(i);
				jdbcTemplate.update(sqlString, new Object[] { groupId,
						addUserId });
			}
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public int queryGroupNum(String groupName) throws Exception {
		String sqlDev = "SELECT COUNT(*) FROM mcs_group WHERE groupName=? ";
		Object[] param = new Object[] { groupName };
		List<Map<String, Object>> lists = jdbcTemplate.queryForList(sqlDev,
				param);
		int groupNum = (Objects.isNull(lists) ? 0 : Integer.valueOf(lists
				.get(0).get("count(*)").toString()));
		return groupNum;
	}

	@Override
	public int queryGroupNum(String groupName, String groupId) throws Exception {
		String sqlDev = "SELECT COUNT(*) FROM mcs_group WHERE groupName=? and groupId<>? ";
		Object[] param = new Object[] { groupName, groupId };
		List<Map<String, Object>> lists = jdbcTemplate.queryForList(sqlDev,
				param);
		int groupNum = (Objects.isNull(lists) ? 0 : Integer.valueOf(lists
				.get(0).get("count(*)").toString()));
		return groupNum;
	}

	@Override
	@Transactional
	public String getAreaId(String userId) {
		String sqlString = "SELECT areaId FROM imm_userinfo WHERE userId = ? ";
		try {
			/*
			 * String areaId = jdbcTemplate.queryForObject(sqlString, new
			 * String[] { userId }, String.class); return areaId;
			 */
			List<Map<String, Object>> lists = jdbcTemplate.queryForList(
					sqlString, new Object[] { userId });
			return Objects.isNull(lists) ? null : lists.get(0).get("areaId")
					.toString();
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List getGroupDao(String areaId) {
		String sql = "SELECT groupId,groupName FROM mcs_group ";
		// + "WHERE areaId = ?";
		List<Map<String, Object>> list = null;
		try {
			list = jdbcTemplate.queryForList(sql);
		} catch (Exception e) {
			throw e;
		}
		for (int i = 0; i < list.size(); i++) {
			try {
				SetField.reflect(list.get(i));
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return list;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public List queryGroupDataDao(String groupId) {
		/*
		 * String sql =
		 * "SELECT mcs_group_user.groupId,i.userId,i.userName,imm_customerattr.businessId,imm_customerattr.businessName "
		 * +
		 * " FROM  mcs_group_user LEFT JOIN imm_userinfo i ON i.userId = mcs_group_user.userId"
		 * + " LEFT JOIN mcs_customer_status m ON i.userId = m.userId" +
		 * " LEFT JOIN imm_customerattr ON imm_customerattr.userId = i.userId" +
		 * " WHERE mcs_group_user.groupId = ?" + " order By m.userId DESC ";
		 */
		String sql = "SELECT mcs_group_user.groupId,i.userId,i.userName,imm_customerattr.businessId,b.businessName "
				+ " FROM  mcs_group_user LEFT JOIN imm_userinfo i ON i.userId = mcs_group_user.userId"
				+ " LEFT JOIN imm_customerattr ON imm_customerattr.userId = i.userId"
				+ " LEFT JOIN imm_business b on b.businessId=imm_customerattr.businessId"
				+ " WHERE mcs_group_user.groupId = ?"
				+ " order By mcs_group_user.userId DESC ";
		List<Map<String, Object>> list = null;
		try {
			list = jdbcTemplate.queryForList(sql, groupId);
		} catch (Exception e) {
			throw e;
		}
		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}
		return list;
	}

	@Override
	public boolean editGroupDao(String groupId, String groupName,
			JSONArray addUserList) {
		try {
			String sql = "UPDATE mcs_group set groupName=? where groupId=?";
			jdbcTemplate.update(sql, new Object[] { groupName, groupId });
			String delsql = "DELETE FROM mcs_group_user WHERE groupId = ?";
			jdbcTemplate.update(delsql, new Object[] { groupId });
			String sqlString = "INSERT INTO mcs_group_user (groupId,userId) VALUES (?,?) ";
			for (int i = 0; i < addUserList.size(); i++) {
				String addUserId = addUserList.getString(i);
				jdbcTemplate.update(sqlString, new Object[] { groupId,
						addUserId });
			}
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean deleteGroupDao(String groupId) {
		try {
			String delsql = "DELETE FROM mcs_group_user WHERE groupId = ?";
			jdbcTemplate.update(delsql, new Object[] { groupId });
			String delsql2 = "DELETE FROM mcs_group WHERE groupId = ?";
			jdbcTemplate.update(delsql2, new Object[] { groupId });
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List getUserStateDataDao(String userId) {
		String sql = "SELECT i.userId,isAlarm,alarmSyscode,alarmTime,isBF,bcfSyscode,bcfTime,isBYpass,isTimeout, "
				+ "timeoutTime,isActivation,m.updateTime FROM imm_userinfo i "
				+ "LEFT JOIN mcs_customer_status m ON i.userId = m.userId WHERE i.userId = ? ";
		List<Map<String, Object>> list = null;
		try {
			list = jdbcTemplate.queryForList(sql, userId);
		} catch (Exception e) {
			throw e;
		}
		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}
		return list;
	}

	@Override
	public List getByPassDataDao(String userId) {
		String sql = "SELECT imm_userinfo.userId,roleZoneName,mcs_bypass_status.userZoneId,mcs_bypass_status.bypassSyscode FROM imm_rolezone"
				+ " LEFT JOIN imm_userinfo ON imm_userinfo.roleId = imm_rolezone.roleId"
				+ " LEFT JOIN mcs_bypass_status ON mcs_bypass_status.userId = imm_userinfo.userId AND mcs_bypass_status.userZoneId = imm_rolezone.roleZoneName"
				+ " WHERE imm_userinfo.userId = ? ";
		List<Map<String, Object>> list = null;
		try {
			list = jdbcTemplate.queryForList(sql, userId);
		} catch (Exception e) {
			throw e;
		}
		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}
		return list;
	}

	@Override
	public List addGroupAllUserDao(String userId, String businessId,
			String userValue) {
		String sql = "SELECT i.userId,i.userName,imm_customerattr.businessId,b.businessName FROM  imm_userinfo i "
				// + " LEFT JOIN mcs_customer_status m ON i.userId = m.userId"
				+ " LEFT JOIN imm_customerattr ON imm_customerattr.userId = i.userId"
				+ "  LEFT JOIN imm_business b on b.businessId=imm_customerattr.businessId"
				+ " WHERE i.userType = '1' AND i.areaId IS NOT NULL ";
		// + " = (SELECT areaId FROM imm_userinfo WHERE userId = '"+userId+"')";
		if (!userValue.equals("") && userValue != null) {
			sql = sql + " AND (i.userName LIKE '%" + userValue
					+ "%'OR i.userId LIKE '%" + userValue + "%') ";
		}
		if (!businessId.equals("") && businessId != null) {
			sql = sql + " AND imm_customerattr.businessId='" + businessId + "'";
		}
		sql = sql + " order By i.userId DESC LIMIT 0,500 ";
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

	@Override
	public McsDevstatusPojo queryDevStatus(String devId) throws Exception {
		// mcs_devstatus_view是一个视图
		String sql = "SELECT * FROM mcs_devstatus_view WHERE devId = ?";
		try {
			return jdbcTemplate.query(sql, new Object[] { devId },
					new ResultSetExtractor<McsDevstatusPojo>() {
						@Override
						public McsDevstatusPojo extractData(ResultSet rs)
								throws SQLException, DataAccessException {
							rs.next();
							McsDevstatusPojo pojo = new McsDevstatusPojo();
							pojo.setDevId(rs.getString("devId"));
							pojo.setOwnId(rs.getString("ownId"));
							pojo.setDevStatus(rs.getInt("devStatus"));
							pojo.setUpdateTime(rs.getString("updateTime"));
							return pojo;
						}
					});
		} catch (Exception e) {
			log.warn("queryDevStatus dao warn:" + e.getMessage(), e);
			return null;
		}

	}

	@Override
	public List<McsDevstatusPojo> queryDevSubSysStatus(String devId)
			throws Exception {
		String sql = "SELECT m.*,sub.fMemo fMemo,sub.subRange subRange FROM mcs_devstatus m,imm_sub_sys_of_alarm_host sub "
				+ "WHERE m.devId = ? AND m.devId = sub.devId AND m.subSysId = sub.subSysId";
		try {
			return jdbcTemplate.query(sql, new Object[] { devId },
					new RowMapper<McsDevstatusPojo>() {
						@Override
						public McsDevstatusPojo mapRow(ResultSet rs, int rowNum)
								throws SQLException {
							McsDevstatusPojo pojo = new McsDevstatusPojo();
							pojo.setDevId(rs.getString("devId"));
							pojo.setSubSysId(rs.getString("subSysId"));
							pojo.setOwnId(rs.getString("ownId"));
							pojo.setDevStatus(rs.getInt("devStatus"));
							pojo.setUpdateTime(rs.getString("updateTime"));
							pojo.setfMemo(rs.getString("fMemo"));
							pojo.setSubRange(rs.getString("subRange"));
							return pojo;
						}
					});
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	@Transactional
	public Map getUserStateListByWorkStationDao(List<String> userIds,
			String groupId, String queryValue, String checkId, String pageSize,
			String currentPage) {

		Map<String, Object> map = new HashMap<String, Object>();
		int pageSizeInt = Integer.parseInt(pageSize);
		int currentPageInt = Integer.parseInt(currentPage);
		List<Map<String, Object>> list = null;
		int totalNum = 0;

		StringBuffer sqlSb = new StringBuffer(
				"select u.userId,u.userName,u.cMobile,dev.devId,dev.devStatus,dev.isActivation,dev.isTimeout FROM ");
		StringBuffer sqlNumSb = new StringBuffer("select count(*) as num FROM ");
		// 总数和查询公用的sql部分
		StringBuffer publicSb = new StringBuffer(
				"(select * from userinfo_view WHERE 1=1 ");

		if (Objects.isNotNullString(userIds)) {
			publicSb.append(" AND userId IN ('"
					+ Objects.Joiner("','", userIds) + "') ");
		}

		if (Objects.isNotNullString(groupId)) {
			publicSb.append(" AND userId IN (SELECT mcs_group_user.userId FROM mcs_group_user WHERE groupId='"
					+ groupId + "') ");
		}

		if (Objects.isNotNullString(queryValue)) {
			publicSb.append(" AND (userId LIKE '%" + queryValue
					+ "%' OR userName LIKE '%" + queryValue
					+ "%' OR cMobile LIKE '%" + queryValue + "%') ");
		}
		publicSb.append(" ) u ");

		if (Objects.isNotNullString(checkId)) {
			// 有状态条件就用join
			publicSb.append("JOIN (select * from devinfostatus_view where ");
			switch (checkId) {
			case "isBF": // 布防
				publicSb.append(" devStatus = '1' ");
				break;
			case "noBF": // 撤防
				publicSb.append(" devStatus = '0' ");
				break;
			case "isTimeout": // 离线
				publicSb.append(" isTimeout = '1' ");
				break;
			case "isBYpass": // 旁路
				publicSb.append(" devStatus = '2' ");
				break;
			default:
				publicSb.append("1=1");
			}
			publicSb.append(") dev  ON u.userId=dev.ownerId ");
			sqlNumSb.append(publicSb.toString());
		} else {
			// 无状态条件查总量就是查user的总量
			sqlNumSb.append(publicSb.toString());
			// 无状态条件就用left join
			publicSb.append("LEFT JOIN devinfostatus_view dev  ON u.userId=dev.ownerId   ");
		}

		sqlSb.append(publicSb.toString());
		sqlSb.append(" LIMIT " + (currentPageInt - 1) * pageSizeInt + ","
				+ pageSize + " ");

		try {
			list = jdbcTemplate.queryForList(sqlSb.toString());
			/*
			 * totalNum = jdbcTemplate.queryForObject(sqlNumSb.toString(),
			 * Integer.class);
			 */
			List<Map<String, Object>> lists = jdbcTemplate
					.queryForList(sqlNumSb.toString());
			totalNum = Objects.isNull(lists) ? 0 : Integer.valueOf(lists.get(0)
					.get("num").toString());
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

}
