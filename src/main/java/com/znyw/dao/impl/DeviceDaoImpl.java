package com.znyw.dao.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.DeviceDao;
import com.znyw.pojo.AssociatedDevicePojo;
import com.znyw.pojo.MtaDevZonePojo;
import com.znyw.tool.Objects;
import com.znyw.tool.SetField;
import com.znyw.tool.SqlGenerateUtils;

@Repository("DeviceDao")
public class DeviceDaoImpl implements DeviceDao {

	private Logger log = Logger.getLogger(getClass());
	@Resource
	private JdbcTemplate jdbcTemplate;

	private static String[] tablesNeedToUpdateAndWithDevIdColumn;
	private static String[] tablesNeedToUpdateAndWithRelateNVRColum;

	private static final String INSERT_DEVZONE_SQL = "insert into imm_devzone %s";
	private static final String UPDATE_DEVZONE_SQL = "update imm_devzone set %s where %s";
	private static final String DELETE_DEVZONE_SQL = "delete from imm_devzone where %s";

	static {
		// 设备基本信息表,报警主机属性表,设备转发方案,设备防区表,互联网NVR属性表,有线NVR属性表,报警主机子系统表,车载设备表,一键报警设备属性表,
		// 用户防区表,用户监控点表
		tablesNeedToUpdateAndWithDevIdColumn = new String[] { "imm_devinfo", "imm_alarmhostattr", "imm_alarm_forward",
				"imm_devzone", "imm_netnvrattr", "imm_wirenvrattr", "imm_sub_sys_of_alarm_host", "imm_tgpscarattr",
				"imm_one_click_dev_attr", "mcs_devstatus", "imm_ownerzone", "imm_ownermonitor" };

		// 设备基本信息表，摄像机表
		tablesNeedToUpdateAndWithRelateNVRColum = new String[] { "imm_devinfo", "imm_camera" };
	}

	@Override
	public List getDeviceInfos(String accountNum) throws Exception {
		List<Map<String, Object>> list = null;

		String sql = " SELECT a.devId,a.devName,a.devType,a.devModelId,a.areaId,a.devState," + " b.devTypeName,"
				+ " c.devModelName," + " d.areaName" + " FROM imm_devinfo a"
				+ " LEFT JOIN imm_devtype b ON a.devType= b.devType "
				+ " LEFT JOIN imm_devmodel c ON a.devModelId= c.devModelId "
				+ " LEFT JOIN imm_area d ON a.areaId=d.areaId " + " WHERE a.ownerId=? "
				+ " and a.devType not in ('11','12')";

		try {
			list = jdbcTemplate.queryForList(sql, accountNum);
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
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	@SuppressWarnings({ "rawtypes", "deprecation" })
	public Map cphQueeyEquipmentData(int pageSizeInt, int currentPageInt, String sort, String devModelId,
			String devMaster, String areaId, String timeStart, String timeEnt, String fuzzyKey, String fuzzyValue)
			throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();

		devModelId = devModelId.equals("all") ? " " : " AND a.devModelId ='" + devModelId + "' ";

		if (devMaster.equals("all")) {
			devMaster = " ";
		} else if (devMaster.equals("1")) {
			devMaster = " AND (a.ownerId IS NOT NULL AND a.ownerId <> '' ) ";
		} else if (devMaster.equals("0")) {
			devMaster = " AND (a.ownerId IS NULL OR a.ownerId = '' ) ";
		}

		if (Objects.isNullString(fuzzyValue)) {
			fuzzyKey = " ";
		}

		switch (fuzzyKey) {
		case "all":
			fuzzyKey = String.format(
					" and ( locate('%s',a.devId)>0 or locate('%s',a.devName)>0 or locate('%s',e.pnlTel)>0 or locate('%s',e.pnlHdTel)>0 )",
					fuzzyValue, fuzzyValue, fuzzyValue, fuzzyValue);
			break;

		case "_devId":
			fuzzyKey = String.format(" and a.devId = '%s'", fuzzyValue);
			break;

		case "devId":
			fuzzyKey = String.format(" and ( locate('%s',a.devId)>0 )", fuzzyValue);
			break;

		case "devName":
			fuzzyKey = String.format(" and ( locate('%s',a.devName)>0 )", fuzzyValue);
			break;

		case "pnlTel":
			fuzzyKey = String.format(" and ( locate('%s',e.pnlTel)>0 )", fuzzyValue);
			break;

		case "pnlHdTel":
			fuzzyKey = String.format(" and ( locate('%s',e.pnlHdTel)>0 )", fuzzyValue);
			break;

		default:
			log.error(String.format("[查询统计]->[报警主机] 未知的模糊查询字段:%s ", fuzzyKey));
			fuzzyKey = fuzzyValue = " ";
			break;
		}

		String timeSql = "";
		if (Objects.isNotNullString(timeStart)) {
			timeSql += " AND a.devInstDate > DATE_SUB('" + timeStart + "',INTERVAL 1 DAY) ";
		}
		if (Objects.isNotNullString(timeEnt)) {
			timeSql += "AND a.devInstDate < DATE_SUB('" + timeEnt + "',INTERVAL -1 DAY) ";
		}

		int totalNum = 0;

		String sql = " SELECT a.devId,a.devModelId,a.devType,a.devName,a.ownerId,a.pnlActID,a.areaId,a.devLng,a.devlat,a.pnlAddr,a.instUnit,a.instMan,a.devInstDate,a.fMemo,a.manufacturer,"
				+ " b.devModelName," + " c.devTypeName," + " d.areaName,"
				+ " e.pnlPowerAddr,e.telAddr,e.keyboardAddr,e.pnlTel,e.pnlHdTel,e.RegexPWD,g.platform_id,g.platform_name"
				+ " FROM imm_devinfo a ,imm_devmodel b ,imm_devtype c ,imm_area d ,imm_alarmhostattr e,imm_assemble_cfg g"
				+ " WHERE a.devId=e.devId  AND a.areaId=d.areaId  AND a.devType=c.devType  AND a.devModelId=b.devModelId   AND a.platformId=g.platform_id AND a.devType = '1'"
				+ " " + devModelId + " " + devMaster + "" + areaId + " " + fuzzyKey + " " + timeSql
				+ " order by a.devId " + sort + " LIMIT " + (currentPageInt - 1) * pageSizeInt + "," + pageSizeInt;

		try {
			List<Map<String, Object>> lists = jdbcTemplate.queryForList(sql);

			String sqlCount = " SELECT COUNT(*)"
					+ " FROM imm_devinfo a ,imm_devmodel b ,imm_devtype c ,imm_area d ,imm_alarmhostattr e"
					+ " WHERE a.devId=e.devId  AND a.areaId=d.areaId  AND a.devType=c.devType  AND a.devModelId=b.devModelId  AND a.devType = '1'"
					+ " " + devModelId + " " + devMaster + "" + areaId + " " + fuzzyKey + timeSql;

			totalNum = jdbcTemplate.queryForInt(sqlCount);

			map.put("list", lists);
			map.put("totalNum", totalNum);

			return map;
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public List<MtaDevZonePojo> getDeviceZone(String devId) throws Exception {
		String sql = "SELECT * FROM imm_devzone WHERE devId = ?";
		try {
			List<MtaDevZonePojo> list = jdbcTemplate.query(sql, new String[] { devId },
					new BeanPropertyRowMapper(MtaDevZonePojo.class));
			for (int i = 0; i < list.size(); i++) {
				SetField.reflect(list.get(i));
			}
			return list;
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public List<AssociatedDevicePojo> findAssociatedDeviceByUserId(String userId) throws Exception {
		String sql = "select `imm_devinfo`.`ownerId` AS `userId`,`imm_devinfo`.`devId` AS `devId`, "
				+ "`imm_devinfo`.`devName` AS `devName`,`imm_devinfo`.`devType` AS `devType`, "
				+ "`imm_devtype`.`devTypeName` AS `devTypeName`,`imm_devinfo`.`devModelId` AS `devModelId`, "
				+ "`imm_devmodel`.`devModelName` AS `devModelName`,`imm_devinfo`.`areaId` AS `areaId`, "
				+ "`imm_area`.`areaName` AS `areaName`,`imm_devinfo`.`devState` AS `devState` "
				+ "from imm_devinfo LEFT JOIN imm_devtype on imm_devtype.devType = imm_devinfo.devType "
				+ "LEFT JOIN imm_devmodel ON imm_devmodel.devModelId = imm_devinfo.devModelId "
				+ "LEFT JOIN imm_area ON imm_area.areaId = imm_devinfo.areaId "
				+ "WHERE imm_devinfo.ownerId = ? and(imm_devinfo.devType!=8 AND imm_devinfo.devType!=11 "
				+ "AND imm_devinfo.devType!=12 AND imm_devinfo.devType!=14)";
		List<AssociatedDevicePojo> list = null;

		try {
			list = jdbcTemplate.query(sql, new String[] { userId },
					new BeanPropertyRowMapper(AssociatedDevicePojo.class));
			for (int i = 0; i < list.size(); i++) {
				SetField.reflect(list.get(i));
			}
			return list;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean updateDeviceOwnerByRoleId(String roleId, String userId) throws Exception {
		try {
			String sql = "UPDATE imm_devinfo LEFT JOIN imm_roledev ON imm_devinfo.devId=imm_roledev.devId  "
					+ "SET userId=? WHERE imm_roledev.roleId=? AND (imm_devinfo.userId='' OR imm_devinfo.userId IS NULL)";
			jdbcTemplate.update(sql, new Object[] { userId, roleId });
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public JSONObject findMonitorInfoByDevId(String devId) throws Exception {
		JSONObject json = new JSONObject();
		List list = null;
		try {
			String sql = "SELECT devId,devChannelId,videoUrlSuf,videoServer,cameraName,atPos,instDate,imm_camera.wantDo,imm_wantdo.wantDoName,imm_camera.almType,imm_almtype.almTypeName,imm_camera.cameraModeId,imm_cameramodel.cameraModelName,"
					+ " imm_camera.cameraType,imm_cameratype.cameraTypeName,fMemo,updatetime,syncTime,devMonitorId"
					+ " FROM imm_camera " + " LEFT JOIN imm_wantdo ON imm_camera.wantDo = imm_wantdo.wantDo"
					+ " LEFT JOIN imm_almtype ON imm_camera.almType = imm_almtype.almType"
					+ " LEFT JOIN imm_cameramodel ON imm_camera.cameraModeId = imm_cameramodel.cameraModelId"
					+ " LEFT JOIN imm_cameratype ON imm_camera.cameraType = imm_cameratype.cameraType"
					+ " WHERE devId=?";
			list = jdbcTemplate.queryForList(sql, new Object[] { devId });
			List listPojo = new ArrayList();
			for (int i = 0; i < list.size(); i++) {
				Map<String, Object> mepPojo = new HashMap<String, Object>();
				Map<String, Object> map2 = (Map<String, Object>) list.get(i);
				for (Map.Entry<String, Object> entry : map2.entrySet()) {
					mepPojo.put(entry.getKey(), entry.getValue());
					if (entry.getValue() == null) {
						mepPojo.put(entry.getKey(), "");
					}
				}
				listPojo.add(mepPojo);
			}
			if (listPojo.size() > 0) {
				json = (JSONObject) JSON.toJSON(listPojo.get(0));
			} else {
				json = null;
			}

		} catch (Exception e) {
			throw e;
		}
		return json;
	}

	@Override
	public boolean addOwnermonitor(String ownerId, String devId, String devMonitorId, String ownerMonitorId,
			String dataFrom) throws Exception {
		String updateUserSQL = "INSERT INTO imm_ownermonitor(ownerId,devId,devMonitorId,ownerMonitorId,dataFrom) VALUES(?,?,?,?,?)";
		boolean result = false;
		try {
			int resultUpdateUser = jdbcTemplate.update(updateUserSQL,
					new Object[] { ownerId, devId, devMonitorId, ownerMonitorId, dataFrom });
			if (resultUpdateUser > 0) {
				result = true;
			}
		} catch (Exception e) {
			throw e;
		}
		return result;
	}

	@Override
	public boolean updateUserMonitor(String roleId, String devId, String devMonitorId, String userMonitorId)
			throws Exception {
		String updateUserSQL = "UPDATE imm_ownermonitor SET devId= ?,devMonitorId=?  WHERE ownerMonitorId=? AND ownerId = ?";
		boolean result = false;
		try {
			int resultUpdateUser = jdbcTemplate.update(updateUserSQL,
					new Object[] { devId, devMonitorId, userMonitorId, roleId });
			if (resultUpdateUser > 0) {
				result = true;
			}
		} catch (Exception e) {
			throw e;
		}
		return result;
	}

	@SuppressWarnings("deprecation")
	@Override
	public boolean findUserMonitorRoleIdDevIdDevMonitorId(String roleId, String devId, String devMonitorId)
			throws Exception {

		String sql = "SELECT count(*) FROM imm_ownermonitor WHERE ownerId=? AND devId = ? AND devMonitorId=?";
		try {
			return jdbcTemplate.queryForInt(sql, new Object[] { roleId, devId, devMonitorId }) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings("deprecation")
	@Override
	public boolean findUserMonitorByRoleIdUserMonitorId(String roleId, String userMonitorId) throws Exception {
		String sql = "SELECT count(*) FROM imm_ownermonitor WHERE ownerId=? AND ownerMonitorId = ?";
		try {
			return jdbcTemplate.queryForInt(sql, new Object[] { roleId, userMonitorId }) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean deleteUserMonitor(String roleId, String devId, String devMonitorId) throws Exception {
		String updateUserSQL = "DELETE FROM imm_ownermonitor WHERE ownerId=? AND devId = ? AND devMonitorId=?";
		try {
			return jdbcTemplate.update(updateUserSQL, new Object[] { roleId, devId, devMonitorId }) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public String getAreaIdByDevId(Object devId) throws Exception {
		String sql = "select areaId from imm_devinfo where devId=?";
		try {
			List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, devId);

			if (result != null && !result.isEmpty() && result.get(0).get("areaId") != null) {
				return result.get(0).get("areaId").toString();
			}
			return null;
		} catch (Exception e) {
			throw e;
		}

	}

	@Override
	public boolean updateOwnerIdAndAreaIdForDevInfoByDevIds(List<String> devIds, String ownerId, String areaId)
			throws Exception {

		if (devIds == null || devIds.isEmpty()) {
			return true;
		}

		String sql = "update imm_devinfo set ownerId = ?,areaId=?,controlType='' where (ownerId is null or ownerId ='')  and devId in (%s) ";
		try {

			jdbcTemplate.update(String.format(sql, "'" + Objects.Joiner("','", devIds) + "'"), ownerId, areaId);
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean setOwnerId2NullForDevByOwnerId(String ownerId) {
		String sql = "update imm_devinfo set ownerId = ?,controlType=? where ownerId = ? ";
		try {
			jdbcTemplate.update(sql, null, "", ownerId);
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean setOwnerId2NullForDevByOwnerIdAndDevIds(String ownerId, List<String> devIds) throws Exception {
		String sql = "update imm_devinfo set ownerId = ?,controlType=? where ownerId = ? and devId in ('%s')";
		try {
			jdbcTemplate.update(String.format(sql, Objects.Joiner("','", devIds)), null, "", ownerId);
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<String> getAlreadyHasOwnerDevIds(List<String> devIds) throws Exception {
		String sql = "select devId from imm_devinfo where devId in ('%s') and ownerId is not null AND ownerId <>''";

		List<String> ids = new ArrayList<String>();
		try {
			List<Map<String, Object>> result = jdbcTemplate
					.queryForList(String.format(sql, Objects.Joiner("','", devIds)));

			if (result == null || result.isEmpty()) {
				return ids;
			}
			for (Map<String, Object> map : result) {
				if (map.get("devId") != null) {
					ids.add(map.get("devId").toString());
				}
			}

		} catch (Exception e) {
			throw e;
		}
		return ids;
	}

	@Override
	public List<String> getAlreadyHasOwnerDevIdsButNotSpecifyOwner(List<String> devIds, String ownerId)
			throws Exception {
		String sql = "select devId from imm_devinfo where devId in ('%s') and ownerId is not null AND ownerId <>'' and ownerId<>'%s' ";

		List<String> ids = new ArrayList<String>();
		try {
			List<Map<String, Object>> result = jdbcTemplate
					.queryForList(String.format(sql, Objects.Joiner("','", devIds), ownerId));

			if (result == null || result.isEmpty()) {
				return ids;
			}
			for (Map<String, Object> map : result) {
				if (map.get("devId") != null) {
					ids.add(map.get("devId").toString());
				}
			}

		} catch (Exception e) {
			throw e;
		}
		return ids;
	}

	@Override
	public List<Map<String, Object>> getDevinfoAbstractByOwnerIdFromDTPP(String ownerId) throws Exception {
		String sql = "select a.devId,a.devName,a.devModelId,b.devModelName,a.devLng,a.devLat from imm_devinfo a "
				+ "left join imm_devmodel b on a.devModelId=b.devModelId where a.ownerId=?";
		try {
			return jdbcTemplate.queryForList(sql, ownerId);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean updateAreaIdForDevInfo(String areaId, String ownerId) throws Exception {
		String sql = "update imm_devinfo set areaId=? where ownerId=?";
		try {
			return jdbcTemplate.update(sql, areaId, ownerId) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map<String, Object>> getDevIdByDevSn(String devSn) throws Exception {
		String sql = "select devId from imm_one_click_dev_attr where devSn=?";
		try {
			return jdbcTemplate.queryForList(sql, devSn);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<String> getDevIdsByOwnerId(String ownerId) throws Exception {

		List<String> devIds = new ArrayList<String>();

		String sql = "select devId from imm_devinfo where ownerId=?";
		try {

			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql, ownerId);

			for (Map<String, Object> map : list) {
				devIds.add(map.get("devId").toString());
			}
			return devIds;
		} catch (Exception e) {
			throw e;
		}
	}

	public List<String> getDevIdsButNotCamerasByOwnerId(String ownerId) throws Exception {
		List<String> devIds = new ArrayList<String>();

		String sql = "select devId from imm_devinfo where ownerId=? and devType not in ('11','12')";
		try {

			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql, ownerId);

			for (Map<String, Object> map : list) {
				devIds.add(map.get("devId").toString());
			}
			return devIds;
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings("deprecation")
	@Override
	public Map<String, Object> queryOneClickDev(int pageSizeInt, int currentPageInt, String sort, String devModelId,
			String isowner, String areaId, String devState, String timeStart, String timeEnt, String platformId, String fuzzyKey,
			String fuzzyValue) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();

		devModelId = devModelId.equals("all") ? " " : " AND a.devModelId ='" + devModelId + "' ";
		devState = devState.equals("all") ? " " : " and a.devState='" + devState + "' ";
		platformId = platformId.equals("") ? " " : " and a.platformId='" + platformId + "' ";

		if (isowner.equals("all")) {
			isowner = " ";
		} else if (isowner.equals("1")) { // 有主
			isowner = " AND (a.ownerId IS NOT NULL AND a.ownerId <> '' ) ";
		} else if (isowner.equals("0")) { // 无主
			isowner = " AND (a.ownerId IS NULL OR a.ownerId = '' ) ";
		}

		if (Objects.isNullString(fuzzyValue)) {
			fuzzyKey = " ";
		}

		switch (fuzzyKey) {
		case "all":
			fuzzyKey = String.format(" and ( locate('%s',a.devId)>0 or locate('%s',a.devName)>0)", fuzzyValue,
					fuzzyValue);
			break;

		case "devId":
			fuzzyKey = String.format(" and ( locate('%s',a.devId)>0 )", fuzzyValue);
			break;

		case "devName":
			fuzzyKey = String.format(" and ( locate('%s',a.devName)>0 )", fuzzyValue);
			break;

		// 按 devId 精确查询
		case "_devId":
			fuzzyKey = String.format(" and a.devId='%s' ", fuzzyValue);
			break;

		default:
			log.error(String.format("[查询统计]->[报警主机] 未知的模糊查询字段:%s ", fuzzyKey));
			fuzzyKey = fuzzyValue = " ";
			break;
		}

		String timeSql = "";
		if (Objects.isNotNullString(timeStart)) {
			timeSql += " AND a.devInstDate > DATE_SUB('" + timeStart + "',INTERVAL 1 DAY) ";
		}
		if (Objects.isNotNullString(timeEnt)) {
			timeSql += "AND a.devInstDate < DATE_SUB('" + timeEnt + "',INTERVAL -1 DAY) ";
		}

		int totalNum = 0;

		String sql = "SELECT a.devId,a.devModelId,a.devType,a.devName,a.ownerId,a.pnlActID,a.areaId,a.devLng,a.devlat,a.pnlAddr,a.instUnit,a.instMan,a.devInstDate,a.fMemo,a.manufacturer,a.devState,"
				+ "a.platformId,f.platform_name as platformName, b.devModelName, c.devTypeName, d.areaName,"
				+ " e.devSn,e.Ip,e.PORT,e.tunnelId,e.playCode,e.loginName,e.loginPwd,e.communicateLine,e.communicateProtocol,g.communicateLineName,h.communicateProtocolName "
				+ " FROM imm_devinfo a ,imm_devmodel b ,imm_devtype c ,imm_area d ,imm_one_click_dev_attr e,imm_assemble_cfg f,imm_communicate_line g,imm_communicate_protocol h"
				+ " WHERE a.devId=e.devId  AND a.areaId=d.areaId  AND a.devType=c.devType  AND a.devModelId=b.devModelId  AND a.devType = '15' and a.platformId=f.platform_id "
				+ " and e.communicateLine=g.line and e.communicateProtocol=h.protocol " + platformId + devModelId + " " + isowner
				+ "" + areaId + " " + devState + " " + fuzzyKey + " " + timeSql + " order by a.devId " + sort
				+ " LIMIT " + (currentPageInt - 1) * pageSizeInt + "," + pageSizeInt;

		String sqlCount = "SELECT count(*) FROM imm_devinfo a ,imm_devmodel b ,imm_devtype c ,imm_area d ,imm_one_click_dev_attr e,imm_assemble_cfg f,imm_communicate_line g,imm_communicate_protocol h"
				+ " WHERE a.devId=e.devId  AND a.areaId=d.areaId  AND a.devType=c.devType  AND a.devModelId=b.devModelId  AND a.devType = '15' and a.platformId=f.platform_id "
				+ " and e.communicateLine=g.line and e.communicateProtocol=h.protocol " + platformId +  devModelId + " " + isowner
				+ "" + areaId + " " + devState + " " + fuzzyKey + " " + timeSql;

		List<Map<String, Object>> lists = null;
		try {
			lists = jdbcTemplate.queryForList(sql);
			totalNum = jdbcTemplate.queryForInt(sqlCount);
		} catch (Exception e) {
			throw e;
		}

		map.put("list", lists);
		map.put("totalNum", totalNum);

		return map;
	}

	@Override
	public boolean setMasterDevId(String masterDevId) throws Exception {

		String sql = "UPDATE imm_devinfo SET controlType=? WHERE devId=?";

		String getOriginSql = "select controlType from imm_devinfo where devId=?";

		if (Objects.isNullString(masterDevId)) {
			return true;
		}

		try {

			List<Map<String, Object>> lists = jdbcTemplate.queryForList(getOriginSql, masterDevId);

			if (Objects.isNull(lists)) {
				throw new Exception("设备编号不存在:" + masterDevId);
			}

			String originControlType = Objects.isNull(lists.get(0).get("controlType")) ? null
					: lists.get(0).get("controlType").toString();

			if (Objects.isNullString(originControlType)) {
				return jdbcTemplate.update(sql, "master", masterDevId) > 0;
			} else {
				return jdbcTemplate.update(sql, "both", masterDevId) > 0;
			}
		} catch (Exception e) {
			throw e;
		}

	}

	@Override
	public boolean setRemoterDevId(String remoterDevId) throws Exception {

		String sql = "UPDATE imm_devinfo SET controlType=? WHERE devId=?";
		String getOriginSql = "select controlType from imm_devinfo where devId=?";

		if (Objects.isNullString(remoterDevId)) {
			return true;
		}

		try {

			List<Map<String, Object>> lists = jdbcTemplate.queryForList(getOriginSql, remoterDevId);

			if (Objects.isNull(lists)) {
				throw new Exception("设备编号不存在:" + remoterDevId);
			}

			String originControlType = Objects.isNull(lists.get(0).get("controlType")) ? null
					: lists.get(0).get("controlType").toString();

			if (Objects.isNullString(originControlType)) {
				return jdbcTemplate.update(sql, "remote", remoterDevId) > 0;
			} else {
				return jdbcTemplate.update(sql, "both", remoterDevId) > 0;
			}

		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean setControType(String masterDevId, String remoterDevId) throws Exception {

		try {

			if (Objects.isNotNullString(masterDevId) && Objects.isNotNullString(remoterDevId)
					&& masterDevId.equals(remoterDevId)) {
				return jdbcTemplate.update("update imm_devinfo set controlType=? where devId=?", "both",
						masterDevId) > 0;
			}

			if (Objects.isNotNullString(masterDevId)) {
				setMasterDevId(masterDevId);
			}

			if (Objects.isNotNullString(remoterDevId)) {
				setRemoterDevId(remoterDevId);
			}
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public String getControlDevsByownerId(String type, String ownerId) throws Exception {

		String sql = "";
		switch (type) {
		case "master":
			sql = "select devId from imm_devinfo where (controlType='master' or controlType='both') and ownerId=?";
			break;

		case "remote":
			sql = "select devId from imm_devinfo where (controlType='remote' or controlType='both') and ownerId=?";
			break;

		default:
			log.info("获取控制设备失败，未知的类型标识 :" + type);
			return "";
		}

		List<Map<String, Object>> lists = null;
		try {
			lists = jdbcTemplate.queryForList(sql, ownerId);
		} catch (Exception e) {
			throw e;
		}

		if (lists == null || lists.isEmpty()) {
			return "";
		}

		return lists.get(0).get("devId").toString();
	}

	@Override
	public boolean updateOneClickDevOnlineState(String devId, int devState) throws Exception {

		String sql = "update imm_devinfo set devState=? where devId=?";

		try {
			return jdbcTemplate.update(sql, devState, devId) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean modifyDevId(String oldDevId, String newDevId) throws Exception {

		String updateWithDevIdSql = "update %s set devId=? where devId=?";

		String updateWithRelateNVRSql = "update %s set relateNVR=? where relateNVR=?";

		try {
			for (String table : tablesNeedToUpdateAndWithDevIdColumn) {
				jdbcTemplate.update(String.format(updateWithDevIdSql, table), newDevId, oldDevId);
			}

			for (String table : tablesNeedToUpdateAndWithRelateNVRColum) {
				jdbcTemplate.update(String.format(updateWithRelateNVRSql, table), newDevId, oldDevId);
			}
			return true;
		} catch (Exception e) {
			// 此处特意抛出异常，以便服务层回滚
			throw e;
		}
	}

	@Override
	public Map<String, Object> getAlarmHostLocationInfo(String devId) throws Exception {
		String sql = "select devLng,devlat from imm_devinfo where devId=?";
		Map<String, Object> map = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql, devId);
			if (Objects.isNotNull(list)) {
				return list.get(0);
			}
		} catch (Exception e) {
			throw e;
		}
		return map;
	}

	@Override
	public boolean deleteByDevId(String devId) throws Exception {
		String updateWithDevIdSql = "delete from %s where devId=?";

		String updateWithRelateNVRSql = "delete from %s where relateNVR=?";

		try {
			for (String table : tablesNeedToUpdateAndWithDevIdColumn) {
				jdbcTemplate.update(String.format(updateWithDevIdSql, table), devId);
			}
			for (String table : tablesNeedToUpdateAndWithRelateNVRColum) {
				jdbcTemplate.update(String.format(updateWithRelateNVRSql, table), devId);
			}
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean addDevZoneForOneClickDev(JSONObject data) throws Exception {

		try {
			String json = data.toJSONString();
			jdbcTemplate.update(String.format(INSERT_DEVZONE_SQL, SqlGenerateUtils.generateSqlForInsert(json)),
					SqlGenerateUtils.getInsertValues(json));

			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean updateDevZoneForOneClickDev(JSONObject data, JSONObject condition) throws Exception {

		try {
			String dataJson = data.toJSONString();
			String conditionJson = condition.toJSONString();

			Object[] values = Objects.merge(SqlGenerateUtils.getNewValuesForUpdate(dataJson),
					SqlGenerateUtils.getSimpleValues(conditionJson, true));

			jdbcTemplate.update(String.format(UPDATE_DEVZONE_SQL, SqlGenerateUtils.generateSqlForUpdate(dataJson),
					SqlGenerateUtils.getSimpleQuerySql(conditionJson, true, "and")), values);

			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean deleteDevZoneForOneClickDev(JSONObject condition) throws Exception {
		try {
			String conditionJson = condition.toJSONString();
			jdbcTemplate.update(
					String.format(DELETE_DEVZONE_SQL, SqlGenerateUtils.getSimpleQuerySql(conditionJson, true, "and")),
					SqlGenerateUtils.getSimpleValues(conditionJson, true));
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map<String, Object>> queryDevZoneForOneClickDev(String devId) throws Exception {

		String sql = " SELECT a.devId,a.devZoneId,a.snModeId as snModelId,f.snModelName,a.atPos,a.wantDo,a.almType,a.snNum,a.snType,a.instDate,a.liveDate,"
				+ "a.x,a.y,a.fMemo," + "c.snTypeName,d.wantDoName,e.almTypeName FROM imm_devzone a"
				+ " LEFT JOIN imm_sntype c ON a.snType = c.snType  " + " LEFT JOIN imm_wantdo d ON a.wantDo = d.wantDo "
				+ " LEFT JOIN imm_almtype e ON a.almType = e.almType LEFT JOIN imm_snmodel f ON f.snModelId=a.snModeId  WHERE devId=?";

		try {
			List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, devId);

			Objects.setNull2EmptyString(result);

			return result;
		} catch (Exception e) {
			throw e;
		}

	}

	@Override
	public boolean deleteOwnerZoneByOwnerIdAndDevIds(String ownerId, List<String> devIds) throws Exception {

		String sql = "delete from imm_ownerzone where ownerId=? and devId in ('%s')";

		try {
			jdbcTemplate.update(String.format(sql, Objects.Joiner("','", devIds)), ownerId);
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	public boolean deleteOwnerZoneByDevIdAndDevZoneIds(String devId, String[] devZoneIds) throws Exception {

		String sql = "delete from imm_ownerzone where devId=? and devZoneId in ('%s')";

		try {
			jdbcTemplate.update(String.format(sql, Objects.Joiner("','", devZoneIds)), devId);
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map<String, Object>> getOwnerZoneByDevIdAndOwnerId(String devId, String ownerId) throws Exception {

		String sql = "select * from imm_ownerzone where devId=? and ownerId=?";

		try {
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql, devId, ownerId);

			if (Objects.isNotNull(list)) {
				Objects.setNull2EmptyString(list);
				return list;
			}
		} catch (Exception e) {
			throw e;
		}

		return new ArrayList<Map<String, Object>>();
	}

	@Override
	public List<String> getOwnerZoneNameByDevIdsAndOwnerId(List<String> devIds, String ownerId) throws Exception {

		String sql = "select ownerZoneName from imm_ownerzone where ownerId=? and devId in ('%s')";

		List<String> ownerZoneNames = new ArrayList<String>();

		try {
			List<Map<String, Object>> list = jdbcTemplate
					.queryForList(String.format(sql, Objects.Joiner("','", devIds)), ownerId);

			if (Objects.isNotNull(list)) {
				for (Map<String, Object> map : list) {
					ownerZoneNames.add(map.get("ownerZoneName").toString());
				}

			}
		} catch (Exception e) {
			throw e;
		}
		return ownerZoneNames;
	}

	@Override
	public boolean deleteOwnerevtrecordByDevZoneIdsAndOwnerId(List<String> devZoneIds, String ownerId)
			throws Exception {

		String sql = "delete from imm_ownerevtrecord where ownerId=? and ZoneCHFlag=0 and ZoneCHValue in ('%s')";

		try {
			jdbcTemplate.update(String.format(sql, Objects.Joiner("','", devZoneIds)), ownerId);

			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean deleteUserMonitorBatch(String ownerId, List<String> userMonitorId) throws Exception {
		String updateUserSQL = "DELETE FROM imm_ownermonitor WHERE ownerId=? and ownerMonitorId in ('%s')";
		try {
			return jdbcTemplate.update(String.format(updateUserSQL, Objects.Joiner("','", userMonitorId)), ownerId) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean deleteBatchDevZoneForOneClickDev(String devId, List<String> devZoneIds) throws Exception {
		try {
			String sql1 = " DELETE FROM imm_ownerzone WHERE devId=? and devZoneId in ('%s') ";
			jdbcTemplate.update(String.format(sql1, Objects.Joiner("','", devZoneIds)), devId);
			String sql = " DELETE FROM imm_devzone WHERE devId=? and devZoneId in ('%s') ";
			int info = jdbcTemplate.update(String.format(sql, Objects.Joiner("','", devZoneIds)), devId);

			return info > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	public boolean updateCamrasOwnerByDevIds(List<String> devIds, String ownerId) throws Exception {

		List<Map<String, Object>> cameras = jdbcTemplate.queryForList(String
				.format("select devId from imm_devinfo where relateNVR in ('%s')", Objects.Joiner("','", devIds)));

		List<String> cameraDevIds = new ArrayList<String>();

		if (Objects.isNull(cameras)) {
			return false;
		}

		for (Map<String, Object> map : cameras) {
			cameraDevIds.add(map.get("devId").toString());
		}

		jdbcTemplate.update(String.format("update imm_devinfo set ownerId=? where devId in ('%s')",
				Objects.Joiner("','", cameraDevIds)), ownerId);

		return true;

	}

	public String getOwnerIdByDevId(String devId) {

		String sql = "select ownerId from imm_devinfo where devId=?";

		List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, devId);

		if (Objects.isNotNull(result)) {
			return (String) result.get(0).get("ownerId");
		}
		return "";
	}

	@Override
	public boolean deleteOwnerMonitorByOwnerIdAndDevIds(String ownerId, List<String> devIds) throws Exception {

		String sql = "delete from imm_ownermonitor where ownerId=? and devId in ('%s')";

		try {
			jdbcTemplate.update(String.format(sql, Objects.Joiner("','", devIds)), ownerId);
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	public boolean setControlType2Null(String devId) throws Exception {

		String sql = "update imm_devinfo set controlType=? where devId=?";

		try {
			jdbcTemplate.update(sql, null, devId);
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	public boolean removeControlType(String devId, String controlType) throws Exception {

		String sql = "update imm_devinfo set controlType=? where devId=?";
		
		String getOriginSql = "select controlType from imm_devinfo where devId=?";
		
		if (Objects.isNullString(devId)) {
			return true;
		}

		try {
			List<Map<String, Object>> lists = jdbcTemplate.queryForList(getOriginSql, devId);

			if (Objects.isNull(lists)) {
				throw new Exception("设备编号不存在:" + devId);
			}

			String originControlType = Objects.isNull(lists.get(0).get("controlType")) ? null
					: lists.get(0).get("controlType").toString();

			String newControlType = null;
			if ("both".equals(originControlType)) {
				newControlType = "master".equals(controlType.trim()) ? "remote" : "master";
			}
			jdbcTemplate.update(sql, newControlType, devId);

			return true;
		} catch (Exception e) {
			throw e;
		}
	}


}
