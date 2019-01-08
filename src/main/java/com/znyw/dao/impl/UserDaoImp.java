package com.znyw.dao.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.CustomerInfo;
import com.znyw.pojo.Ztrdevice;
import com.znyw.tool.Objects;
import com.znyw.tool.SetField;

@Repository
public class UserDaoImp {

	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	@Resource
	JdbcTemplate jdbcTemplate;

	private static String[] tablesNeedToUpdateAndWithOwnerIdColumn;
	private static String[] tablesNeedToUpdateAndWithUserIdColumn;

	static {
		// 机主防区图表,机主布撤防任务计划表,机主防区表,处警预案表,设备基本信息表,机主事件配置表,机主监控点表
		tablesNeedToUpdateAndWithOwnerIdColumn = new String[] { "imm_mappic",
				"imm_owner_dev_bcf_plan", "imm_ownerzone", "imm_dealway",
				"imm_devinfo", "imm_ownerevtrecord", "imm_ownermonitor" };

		// 用户基本信息表,用户属性表,用户事件计划,相关联系人表,超测任务,用户状态,用户分组
		tablesNeedToUpdateAndWithUserIdColumn = new String[] { "imm_userinfo",
				"imm_customerattr", "imm_userplanevent", "imm_usercont",
				"mcs_customer_status", "mcs_group_user" };
	}

	public String getMaxCreateDateFromUserinfo() throws Exception {

		Map<String, Object> map = jdbcTemplate
				.queryForMap("select max(createDate) as max from imm_userinfo where createDate!=''");
		return map.get("max").toString();
	}

	public String getMinCreateDateFromUserinfo() throws Exception {

		Map<String, Object> map = jdbcTemplate
				.queryForMap("select min(createDate) as min from imm_userinfo where createDate!=''");
		return map.get("min").toString();
	}

	public JSONObject getUser(String UserId) throws Exception { // 接处警获取用户信息
		List<Map<String, Object>> list = null;
		JSONObject associatedjson;

		String sql = "SELECT a.userId,a.userName,a.switchUser,a.serveEndTime,c.userAddr,c.pnlTel,c.pnlHdTel,c.contact,c.cMobile as contactMobile,c.contact as firstCont,c.road,c.cMobile as firstContPhone,a.userType,a.areaId,a.fMemo,a.createDate,b.devId, "
				+ " c.isPay,c.uMem,c.businessId,c.define1,c.userServerType,c.badMem,c.instDate, c.cMobile,c.cPhone,c.payNO contactPayNO,c.usrAlmType,c.nomRpt,c.isVideoCheck, c.operName,c.payNO,c.engageTest,a.platformId,imm_assemble_cfg.platform_name as platformName, "
				+ "d.businessName, e.areaName,h.userServerTypeName FROM imm_userinfo a LEFT JOIN imm_devInfo b  ON a.userId=b.ownerId  LEFT JOIN imm_customerattr c ON a.userId=c.userId"
				+ " LEFT JOIN imm_business d ON c.businessId=d.businessId  LEFT JOIN imm_area e ON a.areaId=e.areaId  "
				+ "LEFT JOIN imm_userServerType h ON c.userServerType=h.userServerType "
				+ "LEFT JOIN imm_assemble_cfg on a.platformId=imm_assemble_cfg.platform_id WHERE a.userId = ?";

		try {
			list = jdbcTemplate.queryForList(sql, UserId);
			if (list == null || list.isEmpty()) {
				return null;
			}
			Map<String, Object> mepPojo = list.get(0);
			SetField.reflect(mepPojo);
			associatedjson = (JSONObject) JSONObject.toJSON(mepPojo);
			return associatedjson;
		} catch (Exception e) {
			throw e;
		}
	}

	public List<Map<String, Object>> getZonesByRoleId(String roleId)
			throws Exception {

		String sql = "SELECT a.devId,a.devZoneId,a.roleZoneName,a.x,a.y,"
				+ "b.snModeId,b.atPos,b.wantDo,b.almType,b.snNum,b.snType,b.instDate,b.fMemo, d.snModelName,"
				+ " e.snTypeName, f.almTypeName FROM imm_rolezone a "
				+ "LEFT JOIN imm_userinfo c ON a.roleId = c.roleId"
				+ " LEFT JOIN imm_devzone b ON  a.devId = b.devId AND a.devZoneId = b.devZoneId"
				+ " LEFT JOIN imm_snmodel d ON b.snModeId=d.snModelId LEFT JOIN imm_sntype e ON e.snType=b.snType"
				+ " LEFT JOIN imm_almtype f ON f.almType=b.almType WHERE a.roleId = ?";
		try {
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,
					roleId);
			return list;
		} catch (Exception e) {
			throw e;
		}
	}

	public List<Map<String, Object>> getUserzoneByOwnerId(String ownerId,
			String mapId) throws Exception {
		List<Map<String, Object>> list = null;
		String sql = "SELECT a.devId,a.devZoneId,a.mapId,a.ownerZoneName,a.x,a.y,"
				+ "d.snModelId ,b.atPos,b.wantDo,b.almType,b.snNum,b.snType,b.instDate,b.fMemo, d.snModelName,"
				+ "e.snTypeName, f.almTypeName,g.wantDoName FROM imm_ownerzone a "
				+ "LEFT JOIN imm_devzone b ON a.devId = b.devId AND a.devZoneId = b.devZoneId "
				+ "LEFT JOIN imm_snmodel d ON b.snModeId=d.snModelId LEFT JOIN imm_sntype e ON e.snType=b.snType "
				+ "LEFT JOIN imm_almtype f ON f.almType=b.almType "
				+ "LEFT JOIN imm_wantdo g ON b.wantDo=g.wantDo  WHERE a.ownerId = ?";

		try {

			if (Objects.isNotNullString(mapId)) {
				sql += " and a.mapId=?";
				list = jdbcTemplate.queryForList(sql, new Object[] { ownerId,
						mapId });
			} else {
				list = jdbcTemplate.queryForList(sql, new Object[] { ownerId });
			}

		} catch (Exception e) {
			throw e;
		}

		List<Map<String, Object>> listPojo = new ArrayList<Map<String, Object>>();
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> mepPojo = new HashMap<String, Object>();
			Map<String, Object> map2 = list.get(i);
			for (Map.Entry<String, Object> entry : map2.entrySet()) {
				mepPojo.put(entry.getKey(), entry.getValue());
				if (entry.getValue() == null) {
					mepPojo.put(entry.getKey(), "");
				}
			}
			listPojo.add(mepPojo);
		}

		return listPojo;
	}

	/**
	 * 一般客户列表查询
	 * 
	 * @param sort
	 * @param pageSizeInt
	 * @param currentPageInt
	 * @param areaId
	 * @param businessId
	 * @param userServerType
	 * @param nomRpt
	 * @param timeStart
	 * @param timeEnt
	 * @param fuzzyKey
	 * @param fuzzyValue
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "deprecation" })
	public Map<String, Object> getCustomerInfo(String sort, int pageSizeInt,
			int currentPageInt, String areaId, String businessId,
			String userServerType, String nomRpt, String timeStart,
			String timeEnt, String fuzzyKey, String fuzzyValue)
			throws Exception { // 综合查询获取用户信息

		areaId = " and " + areaId + " ";
		businessId = businessId.equals("all") ? " "
				: " AND customer.businessId='" + businessId + "' ";
		userServerType = userServerType.equals("all") ? " "
				: " AND customer.userServerType='" + userServerType + "' ";

		fuzzyKey = getFuzzyKeyForGeneraluserOrOperator(fuzzyKey, fuzzyValue);

		Map<String, Object> map = new HashMap<String, Object>();

		List<Map<String, Object>> list = null;
		int totalNum = 0;

		String timeSql = "";
		if (Objects.isNotNullString(timeStart)) {
			timeSql += " AND customer.instDate > DATE_SUB('" + timeStart
					+ "',INTERVAL 1 DAY) ";
		}
		if (Objects.isNotNullString(timeEnt)) {
			timeSql += " AND customer.instDate < DATE_SUB('" + timeEnt
					+ "',INTERVAL -1 DAY) ";
		}

		String sql = " select user.userAccount,user.userPwd,user.createDate,user.userId,user.userName,customer.userProperty,customer.payNo,customer.userAddr,customer.contact,customer.payNo,customer.cPhone,"
				+ " customer.cMobile,customer.cHmPhone,userservertype.userservertype,userservertype.userServerTypeName,"
				+ "area.areaId,area.areaName, user.userType, user.platformId,imm_assemble_cfg.platform_name as platformName,"
				+ "customer.operName,customer.instDate as operTime,customer.isPay,customer.isVideoCheck,customer.instDate,customer.businessId,customer.businessName "
				+ "from imm_userinfo user,imm_customerattr customer,imm_area area,imm_assemble_cfg,imm_userservertype userservertype "
				+ " where user.userType='0' and user.areaId=area.areaId  and user.userId=customer.userId and user.platformId = imm_assemble_cfg.platform_id AND user.platformId IS NOT NULL "
				+ "and userservertype.userServerType=customer.userServerType and user.userType=0 "
				+ timeSql
				+ fuzzyKey
				+ areaId
				+ businessId
				+ userServerType
				+ " ORDER BY user.userId "
				+ sort
				+ " LIMIT "
				+ (currentPageInt - 1) * pageSizeInt + "," + pageSizeInt;

		String sqlNum = " select count(*) from imm_userinfo user,imm_customerattr customer,imm_area area,imm_assemble_cfg,imm_userservertype userservertype "
				+ " where user.userType='0' and user.areaId=area.areaId  and user.userId=customer.userId and user.platformId = imm_assemble_cfg.platform_id AND user.platformId IS NOT NULL "
				+ " and userservertype.userServerType=customer.userServerType and user.userType=0 "
				+ timeSql + fuzzyKey + areaId + businessId + userServerType;
		try {
			list = jdbcTemplate.queryForList(sql);
			totalNum = jdbcTemplate.queryForInt(sqlNum);
		} catch (Exception e) {
			throw e;
		}

		List listPojo = (list == null || list.isEmpty()) ? new ArrayList()
				: SetField.removeNull(list);
		map.put("list", listPojo);
		map.put("totalNum", totalNum);

		return map;

	}

	/**
	 * 操作员列表查询
	 * 
	 * @param sort
	 * @param pageSizeInt
	 * @param currentPageInt
	 * @param areaId
	 * @param acctType
	 * @param timeStart
	 * @param timeEnt
	 * @param fuzzyKey
	 * @param fuzzyValue
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "deprecation" })
	public Map<String, Object> getOperatorsInfo(String sort, int pageSizeInt,
			int currentPageInt, String areaId, String acctType,
			String timeStart, String timeEnt, String fuzzyKey, String fuzzyValue)
			throws Exception { // 综合查询获取用户信息

		areaId = " and " + areaId + " ";

		acctType = acctType.equals("all") ? " "
				: " AND operatorattr.acctType='" + acctType + "' ";

		fuzzyKey = getFuzzyKeyForOperator(fuzzyKey, fuzzyValue);

		Map<String, Object> map = new HashMap<String, Object>();

		List<Map<String, Object>> list = null;
		int totalNum = 0;

		String timeSql = "";
		if (Objects.isNotNullString(timeStart)) {
			timeSql += " AND operatorattr.operTime > DATE_SUB('" + timeStart
					+ "',INTERVAL 1 DAY) ";
		}

		if (Objects.isNotNullString(timeEnt)) {
			timeSql += " AND   operatorattr.operTime < DATE_SUB('" + timeEnt
					+ "',INTERVAL -1 DAY) ";
		}

		String sql = "select user.userId,user.userName,user.userAccount,user.userType,user.userPwd,user.platformId,imm_assemble_cfg.platform_name as platformName,user.createDate,operatorattr.acctType,area.areaId,area.areaName, operatorattr.overDateTime, "
				+ "operatorattr.acctIP,operatorattr.sex,operatorattr.telephone,operatorattr.email,operatorattr.education, "
				+ "operatorattr.office,user.userPWDhint,user.userType,operatorattr.acctDY,user.fMemo, operatorattr.operName,"
				+ "operatorattr.operTime from imm_userinfo user,imm_operatorattr operatorattr,imm_area area,imm_assemble_cfg "
				+ "where user.areaId=area.areaId and user.platformId=imm_assemble_cfg.platform_id and user.userId=operatorattr.userId  and (user.userType='2' or user.userType='3') "
				+ timeSql
				+ areaId
				+ acctType
				+ fuzzyKey
				+ "  ORDER BY user.userId  "
				+ sort
				+ " LIMIT "
				+ (currentPageInt - 1) * pageSizeInt + "," + pageSizeInt;

		String sqlNum = "select count(*)  from imm_userinfo user,imm_operatorattr operatorattr,imm_area area,imm_assemble_cfg "
				+ "where user.areaId=area.areaId and user.platformId=imm_assemble_cfg.platform_id  and user.userId=operatorattr.userId  and (user.userType='2' or user.userType='3') "
				+ timeSql + areaId + acctType + fuzzyKey;

		try {
			list = jdbcTemplate.queryForList(sql);
			totalNum = jdbcTemplate.queryForInt(sqlNum);
		} catch (Exception e) {
			throw e;
		}

		List listPojo = (list == null || list.isEmpty()) ? new ArrayList()
				: SetField.removeNull(list);
		map.put("list", listPojo);
		map.put("totalNum", totalNum);

		return map;

	}

	/**
	 * 机主客户列表查询
	 * 
	 * @param sort
	 * @param pageSizeInt
	 * @param currentPageInt
	 * @param areaId
	 * @param businessId
	 * @param userServerType
	 * @param nomRpt
	 * @param timeStart
	 * @param timeEnt
	 * @param fuzzyKey
	 * @param fuzzyValue
	 * @param userType
	 *            用户类型，"0":一般用户 ,"1":机主客户
	 * @return
	 * @throws Exception
	 */
	public Map<String, Object> getOwnerInfo(String sort, int pageSizeInt,
			int currentPageInt, String areaId, String businessId,
			String userServerType, String nomRpt, String timeStart,
			String timeEnt, String fuzzyKey, String fuzzyValue, String userType)
			throws Exception {

		areaId = " and " + areaId;
		businessId = businessId.equals("all") ? " " : " AND b.businessId='"
				+ businessId + "' ";
		userServerType = userServerType.equals("all") ? " "
				: " AND b.userServerType='" + userServerType + "' ";
		nomRpt = nomRpt.equals("all") ? " " : " AND b.nomRpt='" + nomRpt + "' ";
		userType = String.format(" AND a.userType='%s'  ", userType);

		fuzzyKey = getFuzzyKeyUserQueryRDA(fuzzyKey, fuzzyValue);

		Map<String, Object> map = new HashMap<String, Object>();

		List<Map<String, Object>> list = null;
		int totalNum = 0;

		String timeSql = "";
		if (Objects.isNotNullString(timeStart)) {
			timeSql += " AND b.instDate > DATE_SUB('" + timeStart
					+ "',INTERVAL 1 DAY) ";
		}
		if (Objects.isNotNullString(timeEnt)) {
			timeSql += " AND b.instDate < DATE_SUB('" + timeEnt
					+ "',INTERVAL -1 DAY) ";
		}

		String sql = " SELECT DISTINCT  a.userId,a.roleId,a.createDate,a.userName,a.userType,a.areaId,a.fMemo,a.platformId,a.switchUser,a.serveEndTime,imm_assemble_cfg.platform_name as platformName,"
				+ " b.*,"
				+ " c.areaName, d.businessName,h.userServerTypeName"
				+ " FROM imm_userinfo a "
				+ "  LEFT JOIN imm_assemble_cfg ON a.platformId = imm_assemble_cfg.platform_id"
				+ " LEFT JOIN imm_usercont i ON a.userId=i.userId ,imm_customerattr b"
				+ " LEFT JOIN imm_business d ON b.businessId=d.businessId "
				+ " LEFT JOIN imm_userservertype h ON b.userServerType=h.userServerType,imm_area c"
				+ " WHERE a.areaId=c.areaId AND a.userId=b.userId AND a.userType=1 AND a.platformId IS NOT NULL "
				+ userType
				+ timeSql
				+ fuzzyKey
				+ areaId
				+ businessId
				+ userServerType
				+ nomRpt
				+ "  ORDER BY a.userId "
				+ sort
				+ " LIMIT "
				+ (currentPageInt - 1)
				* pageSizeInt
				+ ","
				+ pageSizeInt;

		String sqlNum = " SELECT count(DISTINCT a.userId) as num FROM imm_userinfo a "
				+ "  LEFT JOIN imm_assemble_cfg ON a.platformId = imm_assemble_cfg.platform_id"
				+ " LEFT JOIN imm_usercont i ON a.userId=i.userId ,imm_customerattr b"
				+ " LEFT JOIN imm_business d ON b.businessId=d.businessId "
				+ " LEFT JOIN imm_userservertype h ON b.userServerType=h.userServerType,imm_area c"
				+ " WHERE a.areaId=c.areaId AND a.userId=b.userId AND a.userType=1 AND a.platformId IS NOT NULL "
				+ userType
				+ timeSql
				+ fuzzyKey
				+ areaId
				+ businessId
				+ userServerType + nomRpt;
		try {

			list = jdbcTemplate.queryForList(sql);
			/*
			 * Number number = jdbcTemplate.queryForObject(sqlNum,
			 * Integer.class); totalNum = number != null ? number.intValue() :
			 * 0;
			 */
			List<Map<String, Object>> lists = jdbcTemplate.queryForList(sqlNum);
			// totalNum =
			// Objects.isNull(lists)?0:Integer.valueOf(lists.get(0).toString());
			totalNum = Objects.isNull(lists) ? 0 : Integer.valueOf(lists.get(0)
					.get("num").toString());

		} catch (Exception e) {
			throw e;
		}

		List listPojo = (list == null || list.isEmpty()) ? new ArrayList()
				: SetField.removeNull(list);
		map.put("list", listPojo);
		map.put("totalNum", totalNum);

		return map;
	}

	@SuppressWarnings("rawtypes")
	public Map<String, Object> getOwnerInfo1(String sort, int pageSizeInt,
			int currentPageInt, String areaId, String businessId,
			String userServerType, String nomRpt, String timeStart,
			String timeEnt, String fuzzyKey, String fuzzyValue, String userType)
			throws Exception {

		areaId = " and " + areaId;
		businessId = businessId.equals("all") ? " " : " AND b.businessId='"
				+ businessId + "' ";
		userServerType = userServerType.equals("all") ? " "
				: " AND b.userServerType='" + userServerType + "' ";
		nomRpt = nomRpt.equals("all") ? " " : " AND b.nomRpt='" + nomRpt + "' ";
		userType = String.format(" AND a.userType='%s'  ", userType);

		fuzzyKey = getFuzzyKeyUserQueryRDA(fuzzyKey, fuzzyValue);

		Map<String, Object> map = new HashMap<String, Object>();

		List<Map<String, Object>> list = null;
		int totalNum = 0;

		String timeSql = "";
		if (Objects.isNotNullString(timeStart)) {
			timeSql += " AND b.instDate > DATE_SUB('" + timeStart
					+ "',INTERVAL 1 DAY) ";
		}
		if (Objects.isNotNullString(timeEnt)) {
			timeSql += " AND b.instDate < DATE_SUB('" + timeEnt
					+ "',INTERVAL -1 DAY) ";
		}

		String sql = " SELECT DISTINCT  a.userId,a.roleId,a.createDate,a.userName,a.userType,a.areaId,a.fMemo,a.platformId,imm_assemble_cfg.platform_name as platformName,"
				+ " b.*,"
				+ " c.areaName, d.businessName,h.userServerTypeName"
				+ " FROM imm_userinfo a "
				+ "  LEFT JOIN imm_assemble_cfg ON a.platformId = imm_assemble_cfg.platform_id"
				+ " LEFT JOIN imm_usercont i ON a.userId=i.userId ,imm_customerattr b"
				+ " LEFT JOIN imm_business d ON b.businessId=d.businessId "
				+ " LEFT JOIN imm_userservertype h ON b.userServerType=h.userServerType,imm_area c"
				+ " WHERE a.areaId=c.areaId AND a.userId=b.userId AND a.userType=1 AND a.platformId IS NOT NULL "
				+ userType
				+ timeSql
				+ fuzzyKey
				+ areaId
				+ businessId
				+ userServerType
				+ nomRpt
				+ "  ORDER BY "
				+ sort
				+ " LIMIT "
				+ (currentPageInt - 1) * pageSizeInt + "," + pageSizeInt;

		String sqlNum = " SELECT count(DISTINCT a.userId) as num  FROM imm_userinfo a "
				+ "  LEFT JOIN imm_assemble_cfg ON a.platformId = imm_assemble_cfg.platform_id"
				+ " LEFT JOIN imm_usercont i ON a.userId=i.userId ,imm_customerattr b"
				+ " LEFT JOIN imm_business d ON b.businessId=d.businessId "
				+ " LEFT JOIN imm_userservertype h ON b.userServerType=h.userServerType,imm_area c"
				+ " WHERE a.areaId=c.areaId AND a.userId=b.userId AND a.userType=1 AND a.platformId IS NOT NULL "
				+ userType
				+ timeSql
				+ fuzzyKey
				+ areaId
				+ businessId
				+ userServerType + nomRpt;
		try {

			list = jdbcTemplate.queryForList(sql);
			/*
			 * Number number = jdbcTemplate.queryForObject(sqlNum,
			 * Integer.class); totalNum = number != null ? number.intValue() :
			 * 0;
			 */

			List<Map<String, Object>> lists = jdbcTemplate.queryForList(sqlNum);
			totalNum = Objects.isNull(lists) ? 0 : Integer.valueOf(lists.get(0)
					.get("num").toString());
		} catch (Exception e) {
			throw e;
		}

		List listPojo = (list == null || list.isEmpty()) ? new ArrayList()
				: SetField.removeNull(list);
		map.put("list", listPojo);
		map.put("totalNum", totalNum);

		return map;
	}

	/**
	 * 构造一般客户查询和操作员查询的模糊字段
	 * 
	 * @param fuzzyKey
	 * @param fuzzyValue
	 * @return
	 */
	private String getFuzzyKeyForOperator(String fuzzyKey, String fuzzyValue)
			throws Exception {

		if (Objects.isNullString(fuzzyValue)) {
			fuzzyKey = fuzzyValue = " ";
		} else {
			switch (fuzzyKey) {

			case "all":
				fuzzyKey = String
						.format(" and ( locate('%s',user.userId)>0 or locate('%s',user.userName)>0 ) ",
								fuzzyValue, fuzzyValue, fuzzyValue);
				break;
			case "userId": // 用于精确查询，根据用户ID查询用户信息
				fuzzyKey = String.format(" and user.userId='%s' ", fuzzyValue);
				break;
			case "accountNum": // 用于模糊查询，根据操作员编号查询用户信息
				fuzzyKey = String.format(" and locate('%s',user.userId)>0 ", fuzzyValue);
				break;
			case "accountName":
				fuzzyKey = String.format(" and locate('%s',user.userName)>0 ",
						fuzzyValue);
				break;
			default:
				LOGGER.error("关键字错误 ，fuzzyKey：" + fuzzyKey);
				fuzzyKey = fuzzyValue = "";
			}
		}
		return fuzzyKey;
	}

	/**
	 * 构造一般客户查询和操作员查询的模糊字段
	 * 
	 * @param fuzzyKey
	 * @param fuzzyValue
	 * @return
	 */
	private String getFuzzyKeyForGeneraluserOrOperator(String fuzzyKey,
			String fuzzyValue) throws Exception {

		if (Objects.isNullString(fuzzyValue)) {
			fuzzyKey = fuzzyValue = " ";
		} else {
			switch (fuzzyKey) {

			case "all":
				fuzzyKey = String
						.format(" and ( locate('%s',user.userId)>0 or locate('%s',user.userName)>0 or locate('%s',customer.cMobile)>0 ) ",
								fuzzyValue, fuzzyValue, fuzzyValue);
				break;

			case "accountNum":
				fuzzyKey = String.format(" and locate('%s',user.userId)>0 ",
						fuzzyValue);
				break;
			case "userId": // 用于精确查询，根据用户ID查询用户信息
				fuzzyKey = String.format(" and user.userId='%s' ", fuzzyValue);
				break;
			case "accountName":
				fuzzyKey = String.format(" and locate('%s',user.userName)>0 ",
						fuzzyValue);
				break;
			case "cMobile":
				fuzzyKey = String.format(
						" and locate('%s',customer.cMobile)>0 ", fuzzyValue);
				break;
			default:
				LOGGER.error("关键字错误 ，fuzzyKey：" + fuzzyKey);
				fuzzyKey = fuzzyValue = "";
			}
		}
		return fuzzyKey;
	}

	/**
	 * 构造机主客户的模糊查询字段
	 * 
	 * @param fuzzyKey
	 * @param fuzzyValue
	 * @return
	 */
	private String getFuzzyKeyUserQueryRDA(String fuzzyKey, String fuzzyValue)
			throws Exception {
		if (isNull(fuzzyValue) || isNull(fuzzyKey)) {
			fuzzyKey = fuzzyValue = "";
		} else {

			switch (fuzzyKey) {

			case "_userId": // 通过用户编号精确查找，用于查看机主信息
				fuzzyKey = String.format(" and a.userId = '%s' ", fuzzyValue);
				break;

			case "all":
				fuzzyKey = String
						.format(" and (locate('%s',a.userId)>0 or locate('%s',a.userName)>0 or locate('%s',b.contact)>0 or "
								+ "locate('%s',i.cName)>0 or locate('%s',b.contact) or locate('%s',i.cphone1)>0 or locate('%s',i.cphone2)>0 or "
								+ "locate('%s',i.hmphone)>0 or locate('%s',i.hdPhone)>0 or locate('%s',b.cHmPhone)>0 or "
								+ "locate('%s',b.cPhone)>0 or locate('%s',b.cMobile)>0 or locate('%s',b.pnlTel)>0 or locate('%s',b.pnlHdTel)>0 "
								+ "or locate('%s',b.userAddr)>0 or locate('%s',i.fMemo)>0 or locate('%s',a.fMemo)>0)",
								fuzzyValue, fuzzyValue, fuzzyValue, fuzzyValue,
								fuzzyValue, fuzzyValue, fuzzyValue, fuzzyValue,
								fuzzyValue, fuzzyValue, fuzzyValue, fuzzyValue,
								fuzzyValue, fuzzyValue, fuzzyValue, fuzzyValue,
								fuzzyValue);
				break;
			case "userId":
				fuzzyKey = String.format(" and locate('%s',a.userId)>0 ",
						fuzzyValue);
				break;
			case "userName":
				fuzzyKey = String
						.format(" and ( locate('%s',a.userName)>0 or locate('%s',b.contact)>0 or  locate('%s',i.cName)) ",
								fuzzyValue, fuzzyValue, fuzzyValue);
				break;
			case "cphone":
				fuzzyKey = String
						.format(" and ( locate('%s',i.cphone1)>0 or locate('%s',i.cphone2)>0 or locate('%s',i.hmphone)>0 or locate('%s',i.hdPhone)>0 or locate('%s',b.cHmPhone)>0 or locate('%s',b.cPhone)>0 or locate('%s',b.cMobile)>0 or locate('%s',b.pnlTel)>0 or locate('%s',b.pnlHdTel)>0 )",
								fuzzyValue, fuzzyValue, fuzzyValue, fuzzyValue,
								fuzzyValue, fuzzyValue, fuzzyValue, fuzzyValue,
								fuzzyValue);
				break;
			case "userAddr":
				fuzzyKey = String.format(" and locate('%s',b.userAddr) ",
						fuzzyValue);
				break;
			default:
				LOGGER.error("关键字错误 ，fuzzyKey：" + fuzzyKey);
				fuzzyKey = fuzzyValue = "";
			}
		}
		return fuzzyKey;
	}

	private boolean isNull(String value) throws Exception {
		return (value == null || "".equals(value) || "".equals(value.trim()));
	}

	public List<Map<String, Object>> getUserRelat(String accountNum)
			throws Exception { // 综合查询获取相关联系人信息
		List<Map<String, Object>> list = null;
		String sql = "SELECT * FROM imm_usercont WHERE userId=? ";
		try {
			list = jdbcTemplate.queryForList(sql, new Object[] { accountNum });
		} catch (Exception e) {
			throw e;
		}

		List<Map<String, Object>> listPojo = new ArrayList<Map<String, Object>>();
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> mepPojo = new HashMap<String, Object>();
			Map<String, Object> map2 = list.get(i);
			for (Map.Entry<String, Object> entry : map2.entrySet()) {
				mepPojo.put(entry.getKey(), entry.getValue());
				if (entry.getValue() == null) {
					mepPojo.put(entry.getKey(), "");
				}
			}
			listPojo.add(mepPojo);
		}

		return listPojo;
	}

	public Map<String, Object> getDevice(String areaId, String pageSize,
			String currentPage) throws Exception { // 根据树插件设备所属区域编号查询设备信息。

		Map<String, Object> map = new HashMap<String, Object>();
		int pageSizeInt = Integer.parseInt(pageSize);
		int currentPageInt = Integer.parseInt(currentPage);

		List<Ztrdevice> list = null;
		int totalNum = 0;
		if (areaId != null && !areaId.equals("")) {
			String sql = " SELECT * FROM imm_alarmMainframe WHERE areaId = ? LIMIT ?,? ";
			String sqlNum = " SELECT count(*) as num FROM imm_alarmMainframe WHERE areaId = ? ";

			try {
				String page = (currentPageInt - 1) * pageSizeInt + "";
				list = jdbcTemplate.query(sql, new Object[] { areaId, page,
						pageSize }, new BeanPropertyRowMapper<Ztrdevice>(
						Ztrdevice.class));
				/*
				 * Number number = jdbcTemplate.queryForObject(sqlNum,
				 * Integer.class); totalNum = number != null ? number.intValue()
				 * : 0;
				 */

				List<Map<String, Object>> lists = jdbcTemplate
						.queryForList(sqlNum);
				totalNum = Objects.isNull(lists) ? 0 : Integer.valueOf(lists
						.get(0).get("num").toString());
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

	public List<Map<String, Object>> getDevinfo(String devId) throws Exception {
		String sql = "  SELECT a.devId,a.devType, a.ownerId,a.userName,a.userAddr,a.areaId,a.devModelId,a.switchUser,a.serveEndTime,d.devModelName, e.areaName"
				+ " FROM ("
				+ " SELECT d.devId,d.devType,d.ownerId,i.userName,i.switchUser,i.serveEndTime,c.userAddr,d.areaId,d.devModelId FROM imm_devinfo d"
				+ " LEFT JOIN imm_userinfo i ON i.userId=d.ownerId"
				+ " LEFT JOIN imm_customerattr c ON c.userId = i.userId"
				+ " WHERE d.devId=? "
				+ " ) a, "
				+ " imm_devmodel d,imm_area e "
				+ " WHERE a.devModelId=d.devModelId AND a.areaId=e.areaId";
		List<Map<String, Object>> list = null;
		try {
			list = jdbcTemplate.queryForList(sql, devId);
			return list;
		} catch (Exception e) {
			throw e;
		}
	}

	public List<Map<String, Object>> getUseinfo(String userId) throws Exception {
		String sql = " SELECT usrAlmType FROM imm_customerattr WHERE userId=? ";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,
				new Object[] { userId });
		return list;
	}

	public List<Map<String, Object>> getDevZoninfo(String devId,
			String devZoneId) throws Exception {
		String sql = " SELECT c.atPos,c.snType,imm_sntype.snTypeName,c.almType,imm_almtype.almTypeName, "
				+ "c.wantDo,imm_wantdo.wantDoName,c.snModeId,k.snModelName FROM "
				+ "(SELECT atPos,snType,almType,wantDo,snModeId FROM imm_devzone WHERE devId=? AND devZoneId=? ) c "
				+ "LEFT JOIN imm_sntype ON imm_sntype.snType = c.snType "
				+ "LEFT JOIN imm_almtype on imm_almtype.almType = c.almType "
				+ "LEFT JOIN imm_wantdo ON imm_wantdo.wantDo = c.wantDo , imm_snmodel k WHERE c.snModeId=k.snModelId ";
		List<Map<String, Object>> list = null;
		try {
			list = jdbcTemplate.queryForList(sql, devId, devZoneId);
			return list;
		} catch (Exception e) {
			throw e;
		}
	}

	public List<Map<String, Object>> getUseZoninfo(String devId,
			String devZoneId) throws Exception {
		String sql = " SELECT ownerZoneName FROM imm_ownerzone WHERE devId=? AND devZoneId=? ";
		List<Map<String, Object>> list = null;
		try {
			list = jdbcTemplate.queryForList(sql, devId, devZoneId);
			return list;
		} catch (Exception e) {
			throw e;
		}
	}

	public Map<String, Object> customerInfo(String areaId, String pageSize,
			String currentPage) throws Exception { // 根据客户所属区域编号查询客户信息。

		List<CustomerInfo> list = null;
		int currentPageInt = Integer.parseInt(currentPage);
		int pageSizeInt = Integer.parseInt(pageSize);

		String sql = "SELECT us.userId,us.userName,us.userType,us.centerId,cust.userAddr,cust.userProperty,cust.businessId,cust.payNO "
				+ "FROM imm_userinfo us,imm_customerattr cust "
				+ "WHERE us.userId=cust.userId AND areaId=? LIMIT ?,? ";

		String sqlNum = "SELECT count(*) as num "
				+ "FROM imm_userinfo us,imm_customerattr cust "
				+ "WHERE us.userId=cust.userId AND areaId=? ";
		int totalNum;
		try {
			String page = (currentPageInt - 1) * pageSizeInt + "";
			list = jdbcTemplate
					.query(sql.toString(), new String[] { areaId, page,
							pageSizeInt + "" },
							new BeanPropertyRowMapper<CustomerInfo>(
									CustomerInfo.class));
			/*
			 * Number number = jdbcTemplate.queryForObject(sqlNum,
			 * Integer.class); totalNum = number != null ? number.intValue() :
			 * 0;
			 */
			List<Map<String, Object>> lists = jdbcTemplate.queryForList(sqlNum);
			totalNum = Objects.isNull(lists) ? 0 : Integer.valueOf(lists.get(0)
					.get("num").toString());
			if (list.size() > 0) {
				SetField.reflect(list.get(0));
			}
		} catch (Exception e) {
			throw e;
		}

		Map<String, Object> map = new HashMap<String, Object>();

		map.put("list", list);
		map.put("totalNum", totalNum);

		return map;
	}

	@SuppressWarnings("rawtypes")
	public Map<String, Object> RDANvrHaveDao(int pageSizeInt,
			int currentPageInt, String sort, String devModelId,
			String devMaster, String areaId, String timeStart, String timeEnt,
			String fuzzyKey, String fuzzyValue) throws Exception {
		devModelId = devModelId.equals("all") ? " " : " AND a.devModelId ='"
				+ devModelId + "' ";

		if (devMaster.equals("all")) {
			devMaster = " ";
		} else if (devMaster.equals("1")) {
			devMaster = " AND (a.ownerId IS NOT NULL AND a.ownerId <> '' ) ";
		} else if (devMaster.equals("0")) {
			devMaster = " AND (a.ownerId IS NULL OR a.ownerId = '' ) ";
		}
		if ("".equals(fuzzyValue) || fuzzyValue == null) {
			fuzzyKey = "";
		} else {
			switch (fuzzyKey) {

			case "all":
				fuzzyKey = String
						.format(" and ( locate('%s',a.devId)>0 or locate('%s',a.devName)>0 ) ",
								fuzzyValue, fuzzyValue);
				break;
			case "devId":
				fuzzyKey = String.format(" and locate('%s',a.devId)>0 ",
						fuzzyValue);
				break;

			case "devName":
				fuzzyKey = String.format(" and locate('%s',a.devName)>0 ",
						fuzzyValue);
				break;

			default:
				LOGGER.error(String.format("[查询统计]->[有线NVR] 未知的模糊查询字段:%s ",
						fuzzyKey));
				fuzzyKey = fuzzyValue = " ";
			}
		}
		String timeSql = "";

		if (Objects.isNotNullString(timeStart)) {
			timeSql += " AND a.devInstDate > DATE_SUB('" + timeStart
					+ "',INTERVAL 1 DAY) ";

		}
		if (Objects.isNotNullString(timeEnt)) {
			timeSql += " AND a.devInstDate < DATE_SUB('" + timeEnt
					+ "',INTERVAL -1 DAY) ";

		}

		String sql = "(SELECT a.manufacturer,a.devId,a.ownerId,a.devName,a.pnlActID,a.areaId,a.devType,a.devModelId,"
				+ "a.devLng,a.devlat,a.instMan,a.instUnit,a.devInstDate,a.pnlAddr,a.fMemo,a.manufacturer,g.platform_id,g.platform_name"
				+ " b.areaName, c.devTypeName, d.devModelName,d.ChannelNum,a.define5 as gbId,"
				+ " e.devLoginName,e.devLoginPwd,e.devIp,e.devPort,e.videoServer"
				+ " FROM imm_devinfo a "
				+ " LEFT JOIN imm_area b ON a.areaId=b.areaId"
				+ " LEFT JOIN imm_devtype c ON a.devType=c.devType"
				+ " LEFT JOIN imm_devmodel d ON a.devModelId=d.devModelId"
				+ " LEFT JOIN imm_wirenvrattr e ON a.devId=e.devId"
				+ " LEFT JOIN imm_assemble_cfg g ON a.platformId=g.platform_id"
				+ " WHERE a.devType = '9' "
				+ devModelId
				+ "  "
				+ devMaster
				+ areaId
				+ fuzzyKey
				+ timeSql
				+ " ORDER BY a.devId "
				+ sort
				+ " ) LIMIT "
				+ (currentPageInt - 1)
				* pageSizeInt
				+ ","
				+ pageSizeInt;

		String sqlNum = "SELECT COUNT(*) AS num  FROM imm_devinfo a "
				+ "LEFT JOIN imm_area b ON a.areaId=b.areaId "
				+ "LEFT JOIN imm_assemble_cfg c ON a.platformId=c.platform_id "
				+ "LEFT JOIN imm_devmodel d ON a.devModelId=d.devModelId "
				+ "LEFT JOIN imm_wirenvrattr e ON a.devId=e.devId "
				+ " WHERE a.devType = '9' " + devModelId + "  " + devMaster
				+ areaId + fuzzyKey + timeSql;
		List<Map<String, Object>> list = null;
		Number number = null;
		int totalNum = 0;

		try {
			list = jdbcTemplate.queryForList(sql);
			List<Map<String, Object>> lists = jdbcTemplate.queryForList(sqlNum);
			totalNum = Objects.isNull(lists) ? 0 : Integer.valueOf(lists.get(0)
					.get("num").toString());

		} catch (Exception e) {
			throw e;
		}
		// int totalNum = number != null ? number.intValue() : 0;

		List resultList = null;

		if (list.size() > 0)
			resultList = SetField.removeNull(list);

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list", resultList);
		map.put("totalNum", totalNum);

		return map;
	}

	public List<Map<String, Object>> getCodeType() throws Exception { // 用户防区信息
		List<Map<String, Object>> list = null;
		String sql = "select codeTypeId,codeType from imm_codetype";
		try {
			list = jdbcTemplate.queryForList(sql);
			return list;
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings({ "rawtypes", "null" })
	public Map<String, Object> RDANvrNoDao(int pageSizeInt, int currentPageInt,
			String sort, String devModelId, String devMaster, String areaId,
			String timeStart, String timeEnt, String fuzzyKey, String fuzzyValue)
			throws Exception {

		devModelId = devModelId.equals("all") ? "" : "AND a.devModelId ='"
				+ devModelId + "' ";

		if (devMaster.equals("all")) {
			devMaster = " ";
		} else if (devMaster.equals("1")) {
			devMaster = " AND (a.ownerId IS NOT NULL AND a.ownerId <> '' ) ";
		} else if (devMaster.equals("0")) {
			devMaster = " AND (a.ownerId IS NULL OR a.ownerId = '' ) ";
		}

		switch (fuzzyKey) {

		case "all":
			fuzzyKey = String
					.format(" and ( locate('%s',a.devId)>0 or locate('%s',a.devName)>0 ) ",
							fuzzyValue, fuzzyValue);
			break;
		case "devId":
			fuzzyKey = String
					.format(" and locate('%s',a.devId)>0 ", fuzzyValue);
			break;

		case "devName":
			fuzzyKey = String.format(" and locate('%s',a.devName)>0 ",
					fuzzyValue);
			break;

		default:
			LOGGER.error(String.format("[查询统计]->[互联网NVR] 未知的模糊查询字段:%s ",
					fuzzyKey));
			fuzzyKey = fuzzyValue = " ";
		}

		String timeSql = "";
		if (Objects.isNotNullString(timeStart)) {
			timeSql += " AND a.devInstDate > DATE_SUB('" + timeStart
					+ "',INTERVAL 1 DAY) ";
		}
		if (Objects.isNotNullString(timeEnt)) {
			timeSql += "  AND a.devInstDate < DATE_SUB('" + timeEnt
					+ "',INTERVAL -1 DAY)";
		}

		String sql = "  (SELECT a.manufacturer,a.devId,a.ownerId,a.devName,a.pnlActID,a.areaId,a.devType,a.devModelId,a.devLng,a.devlat,a.instMan,a.instUnit,a.devInstDate,a.pnlAddr,a.fMemo,a.manufacturer,"
				+ " b.areaName, c.devTypeName, d.devModelName,d.ChannelNum,a.define5 as gbId,"
				+ " e.devLoginName,e.devLoginPwd,e.devTUTKID,e.videoServer,g.platform_id,g.platform_name"
				+ " FROM imm_devinfo a "
				+ " LEFT JOIN imm_area b ON a.areaId=b.areaId"
				+ " LEFT JOIN imm_devtype c ON a.devType=c.devType"
				+ " LEFT JOIN imm_devmodel d ON a.devModelId=d.devModelId"
				+ " LEFT JOIN imm_netnvrattr e ON a.devId=e.devId"
				+ " LEFT JOIN imm_customerattr f ON a.ownerId=f.userId"
				+ " LEFT JOIN imm_assemble_cfg g ON a.platformId=g.platform_id "
				+ " WHERE a.devType = '10' "
				+ devModelId
				+ devMaster
				+ areaId
				+ fuzzyKey
				+ timeSql
				+ " ORDER BY a.devId "
				+ sort
				+ ") LIMIT "
				+ (currentPageInt - 1) * pageSizeInt + "," + pageSizeInt;

		String sqlNum = "  SELECT COUNT(*) as num " + " FROM imm_devinfo a "
				+ " LEFT JOIN imm_area b ON a.areaId=b.areaId"
				+ " LEFT JOIN imm_devtype c ON a.devType=c.devType"
				+ " LEFT JOIN imm_devmodel d ON a.devModelId=d.devModelId"
				+ " LEFT JOIN imm_netnvrattr e ON a.devId=e.devId"
				+ " LEFT JOIN imm_customerattr f ON a.ownerId=f.userId"
				+ " WHERE a.devType = '10' " + devModelId + "  " + devMaster
				+ areaId + fuzzyKey + timeSql;
		List<Map<String, Object>> list = null;
		Number number = null;
		int totalNum = 0;
		try {
			list = jdbcTemplate.queryForList(sql);
			// number = jdbcTemplate.queryForObject(sqlNum, Integer.class);

			List<Map<String, Object>> lists = jdbcTemplate.queryForList(sqlNum);
			totalNum = Objects.isNull(lists) ? 0 : Integer.valueOf(lists.get(0)
					.get("num").toString());
		} catch (Exception e) {
			throw e;
		}

		// int totalNum = number != null ? number.intValue() : 0;

		List resultList = null;
		if (list.size() > 0)
			resultList = SetField.removeNull(list);

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list", resultList);
		map.put("totalNum", totalNum);

		return map;
	}

	public List<Map<String, Object>> getCodeMemo(String codeTypeId)
			throws Exception { // 用户防区信息
		List<Map<String, Object>> list = null;
		String sql = "";
		if (codeTypeId == "-1" || codeTypeId.equals("-1")) {
			sql = "select codeId,codeTypeId,codeMemo from imm_syscode where 1=1";
		} else {
			sql = "select codeId,codeTypeId,codeMemo from imm_syscode where codeTypeId ='"
					+ codeTypeId + "'";
		}

		try {
			list = jdbcTemplate.queryForList(sql);
			return list;
		} catch (Exception e) {
			throw e;
		}
	}

	public List<Map<String, Object>> getEveTypeImp() throws Exception {
		List<Map<String, Object>> list = null;
		String sql = " SELECT * FROM imm_codetype ";

		try {
			list = jdbcTemplate.queryForList(sql);
			return list;
		} catch (Exception e) {
			throw e;
		}
	}

	public List<Map<String, Object>> getDescribeImp() throws Exception {
		List<Map<String, Object>> list = null;
		String sql = " SELECT codeMemo FROM imm_syscode ";

		try {
			list = jdbcTemplate.queryForList(sql);
			return list;
		} catch (Exception e) {
			throw e;
		}
	}

	public List<Map<String, Object>> getCodeTypeListImp() throws Exception {
		List<Map<String, Object>> list = null;

		String sql = " SELECT codeTypeId,codeType FROM imm_codetype  ";
		try {
			list = jdbcTemplate.queryForList(sql);
		} catch (Exception e) {
			throw e;
		}
		return list;
	}

	public List<Map<String, Object>> getLatLngImp(String devId)
			throws Exception {
		List<Map<String, Object>> list = null;

		String sql = " SELECT devLng,devlat FROM imm_devinfo WHERE devId = ? ";
		try {
			list = jdbcTemplate.queryForList(sql, new Object[] { devId });
		} catch (Exception e) {
			throw e;
		}
		return list;
	}

	public boolean modifyOwnerId(String oldUserId, String newUserId)
			throws Exception {

		String updateWithOwnerIdSql = "update %s set ownerId=? where ownerId=?";
		String updateWithUserIdSql = "update %s set userId=? where userId=?";

		try {

			for (String table : tablesNeedToUpdateAndWithOwnerIdColumn) {
				jdbcTemplate.update(String.format(updateWithOwnerIdSql, table),
						newUserId, oldUserId);
			}

			for (String table : tablesNeedToUpdateAndWithUserIdColumn) {
				jdbcTemplate.update(String.format(updateWithUserIdSql, table),
						newUserId, oldUserId);
			}
			return true;
		} catch (Exception e) {
			// 此处特意抛出异常，以便服务层回滚
			throw e;
		}
	}

	public boolean deleteByOwnerId(String ownerId) throws Exception {

		/*
		 * String delOwnerSQL = "call owner_delete_owner_byId(?)"; Object[]
		 * userDeviceParam = new Object[] { ownerId }; try {
		 * jdbcTemplate.update(delOwnerSQL, userDeviceParam); return true; }
		 * catch (Exception e) { return false; }
		 */

		String updateWithOwnerIdSql = "delete from %s where ownerId=?";
		String updateWithUserIdSql = "delete from %s where userId=?";
		String setOwnerId2NullSql = "update %s set ownerId=null where ownerId=?";

		try {
			for (String table : tablesNeedToUpdateAndWithOwnerIdColumn) {

				if ("imm_devinfo".equalsIgnoreCase(table)) {
					jdbcTemplate.update(
							String.format(setOwnerId2NullSql, "imm_devinfo"),
							ownerId);
				} else {

					jdbcTemplate
							.update(String.format(updateWithOwnerIdSql, table),
									ownerId);
				}
			}

			for (String table : tablesNeedToUpdateAndWithUserIdColumn) {
				jdbcTemplate.update(String.format(updateWithUserIdSql, table),
						ownerId);
			}
			return true;
		} catch (Exception e) {
			throw e;
		}

	}

	public String getAreaIdByUserId(String userId) throws Exception {

		String sql = "select areaId from imm_userinfo where userId=?";

		List<Map<String, Object>> lists = jdbcTemplate
				.queryForList(sql, userId);

		if (Objects.isNotNull(lists)) {
			return lists.get(0).get("areaId").toString();
		}
		return "";
	}

	// 根据联络电话（负责人电话、负责人手机）查询用户列表
	public List<String> getUserIdIdByCphone(String cphone) throws Exception {

		String sql = "SELECT userId FROM imm_customerattr WHERE cPhone = ? OR cMobile = ?";
		List<Map<String, Object>> lists = jdbcTemplate.queryForList(sql,
				cphone, cphone);

		List<String> userIds = new ArrayList<String>();

		if (Objects.isNotNull(lists)) {

			for (Map<String, Object> map : lists) {
				userIds.add(map.get("userId").toString());
			}
		}
		return userIds;
	}
}