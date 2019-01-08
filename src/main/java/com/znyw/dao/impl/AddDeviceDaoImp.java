package com.znyw.dao.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.AddDevice;
import com.znyw.tool.ErrorAbnormal;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultJson;
import com.znyw.tool.SetField;

/**
 * 添加各种设备
 * 
 * @author ywhl
 *
 */

@Repository("AddDevice")
public class AddDeviceDaoImp implements AddDevice {
	private Logger log = LoggerFactory.getLogger(getClass());

	@Resource
	private JdbcTemplate jdbcTemplate;

	@Override
	public List getDevinfoDao(String devId) {
		String sql = "SELECT imm_area.areaName,imm_devmodel.devModelName,imm_devtype.devTypeName,imm_devinfo.* "
				+ "FROM imm_devmodel,imm_devinfo,imm_devtype,imm_area WHERE imm_devinfo.devType = "
				+ "imm_devtype.devType AND imm_devmodel.devModelId = imm_devinfo.devModelId AND imm_devinfo.areaId "
				+ "= imm_area.areaId AND imm_devinfo.devId = ?";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,
				new Object[] { devId });
		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}
		return list;
	}

	@Override
	public boolean ownerAddAlarmhostImp(JSONObject json, int deviceNum) {
		try {

			String sqldevinfo = " INSERT INTO imm_devinfo (devId,devName,pnlActID,areaId,devType,devModelId,instMan,devInstDate,devLng,devlat,pnlAddr,instUnit,fMemo,manufacturer,dataFrom,platformId)"
					+ " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
			jdbcTemplate.update(
					sqldevinfo,
					new Object[] { json.getString("devId"), "", "",
							json.getString("areaId"),
							json.getString("devType"),
							json.getString("devModelId"), "",
							json.getString("devInstDate"),
							json.getString("devLng"), json.getString("devlat"),
							"", "", "", json.getString("manufacturer"),
							json.getString("dataFrom"),
							json.getString("platformId") });

			String sqlalarmhostattr = " INSERT INTO imm_alarmhostattr (devId,telAddr,pnlTel,keyboardAddr,pnlPowerAddr,pnlHdTel,RegexPWD)"
					+ " VALUES (?,?,?,?,?,?,?) ";
			jdbcTemplate.update(sqlalarmhostattr,
					new Object[] { json.getString("devId"), "", "", "", "", "",
							"" });
			return true;
		} catch (Exception e) {
			throw e;
			// return false;
		}
	}

	@Override
	public int queryDeviceNum(String devId) {
		int devce = 0;
		try {
			String sql = " SELECT count(*) FROM imm_devinfo WHERE devId = ? ";
			/*
			 * Number number = jdbcTemplate.queryForObject(sql, new String[] {
			 * devId }, Integer.class); return devce = number != null ?
			 * number.intValue() : 0;
			 */

			List<Map<String, Object>> lists = jdbcTemplate.queryForList(sql,
					new Object[] { devId });
			return Objects.isNull(lists) ? 0 : Integer.valueOf(lists.get(0)
					.get("count(*)").toString());
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public int queryDevicePlayNum(String devModelId) {

		int deviceNum = 0;
		try {
			String getdevidNum = " select zoneNum from imm_devmodel where devModelId = ? ";
			/*
			 * Number number = jdbcTemplate.queryForObject(getdevidNum, new
			 * String[] { devModelId }, Integer.class);// 根据设备类型查询设备防区个数
			 * deviceNum = number != null ? number.intValue() : 0;
			 */

			List<Map<String, Object>> lists = jdbcTemplate.queryForList(
					getdevidNum, new Object[] { devModelId });
			deviceNum = Objects.isNull(lists) ? 0 : Integer.valueOf(lists
					.get(0).get("zoneNum").toString());
		} catch (Exception e) {
			throw e;
		}
		return deviceNum;
	}

	@Override
	public void addAlarmhostImp(JSONObject json, int deviceNum) {

		try {
			String sqldevinfo = " INSERT INTO imm_devinfo (devId,devName,pnlActID,areaId,devType,devModelId,instMan,devInstDate,devLng,devlat,pnlAddr,instUnit,fMemo,manufacturer,dataFrom,platformId)"
					+ " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
			jdbcTemplate.update(
					sqldevinfo,
					new Object[] { json.getString("devId"),
							json.getString("devName"),
							json.getString("pnlActID"),
							json.getString("areaId"),
							json.getString("devType"),
							json.getString("devModelId"),
							json.getString("instMan"),
							json.getString("devInstDate"),
							json.getString("devLng"), json.getString("devlat"),
							json.getString("pnlAddr"),
							json.getString("instUnit"),
							json.getString("fMemo"),
							json.getString("manufacturer"),
							json.getString("dataFrom"),
							json.getString("platformId") });

			String sqlalarmhostattr = " INSERT INTO imm_alarmhostattr (devId,telAddr,pnlTel,keyboardAddr,pnlPowerAddr,pnlHdTel,RegexPWD,dataFrom)"
					+ " VALUES (?,?,?,?,?,?,?,?) ";
			jdbcTemplate.update(
					sqlalarmhostattr,
					new Object[] { json.getString("devId"),
							json.getString("telAddr"),
							json.getString("pnlTel"),
							json.getString("keyboardAddr"),
							json.getString("pnlPowerAddr"),
							json.getString("pnlHdTel"),
							json.getString("RegexPWD"),
							json.getString("dataFrom") });

		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map<String, Object>> getDevModelService(String devType) { // 根据设备类型查询所有设备型号

		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		String getdevidNum = " select devModelId,devModelName,ChannelNum from imm_devmodel where "
				+ devType + " ORDER BY  devModelName ASC ";
		try {
			list = jdbcTemplate.queryForList(getdevidNum);
			return list;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public void addNVRhave(JSONObject json) { // 添加NVR有线

		try {
			// 国标ID 存至表预留字段 define5
			String sqldevinfo = " INSERT INTO imm_devinfo (devId,devName,define5,pnlActID,areaId,devType,devModelId,instMan,devInstDate,devLng,devlat,pnlAddr,instUnit,fMemo,manufacturer,dataFrom,platformId)"
					+ " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
			jdbcTemplate.update(
					sqldevinfo,
					new Object[] { json.getString("devId"),
							json.getString("devName"), json.getString("gbId"),
							json.getString("pnlActID"),
							json.getString("areaId"),
							json.getString("devType"),
							json.getString("devModelId"),
							json.getString("instMan"),
							json.getString("devInstDate"),
							json.getString("devLng"), json.getString("devlat"),
							json.getString("pnlAddr"),
							json.getString("instUnit"),
							json.getString("fMemo"),
							json.getString("manufacturer"),
							json.getString("dataFrom"),
							json.getString("platformId") });

			String sqlalarmhostattr = " INSERT INTO imm_wirenvrattr (devId,devLoginName,devLoginPwd,devIp,videoServer,devPort,dataFrom)"
					+ " VALUES (?,?,?,?,?,?,?) ";
			jdbcTemplate.update(
					sqlalarmhostattr,
					new Object[] { json.getString("devId"),
							json.getString("devLoginName"),
							json.getString("devLoginPwd"),
							json.getString("devIp"),
							json.getString("videoServer"),
							json.getString("devPort"),
							json.getString("dataFrom") });

		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public void addNVRhavEnature(int channNum, JSONObject json, String url,
			String time) { // 添加nvr有线摄像机

		try {
			long num = ErrorAbnormal.timeToTen() + channNum; // 利用时间戳产生摄像机编号
			int channId = channNum - 1; // 通道号从0开始

			String devMonitorId = null;
			if (channNum < 10) {
				devMonitorId = "000" + channNum;
			} else if (channNum < 100) {
				devMonitorId = "00" + channNum;
			} else if (channNum < 1000) {
				devMonitorId = "0" + channNum;
			} else if (channNum == 1000) {
				devMonitorId = "" + channNum;
			}

			String sqldevinfo = " INSERT INTO imm_devinfo (devId,devName,pnlActID,areaId,devType,devModelId,instMan,devInstDate,devLng,devlat,relateNVR,pnlAddr,instUnit,fMemo,manufacturer)"
					+ " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
			jdbcTemplate.update(
					sqldevinfo,
					new Object[] { num, json.getString("devName") + channId,
							json.getString("pnlActID"),
							json.getString("areaId"), 11,
							json.getString("devModelId"),
							json.getString("instMan"),
							json.getString("devInstDate"),
							json.getString("devLng"), json.getString("devlat"),
							json.getString("devId"), json.getString("pnlAddr"),
							json.getString("instUnit"),
							json.getString("fMemo"),
							json.getString("manufacturer") });

			String sqlalarmhostattr = " INSERT INTO imm_camera (devId,devChannelId,videoServer,cameraName,videoUrlSuf,devMonitorId,cameraType,atPos,instDate,almType,relateNVR) "
					+ " VALUES (?,?,?,?,?,?,?,?,?,?) ";
			jdbcTemplate.update(sqlalarmhostattr, new Object[] { num, channId,
					json.getString("videoServer"),
					json.getString("devName") + channId, url, devMonitorId, 11,
					"未知", time, "警情类型", json.getString("devId") });
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public void addNVRno(JSONObject json) { // 添加NVR无线
		try {
			// 国标ID 存至表预留字段 define5
			String sqldevinfo = " INSERT INTO imm_devinfo (devId,devName,define5,pnlActID,areaId,devType,devModelId,instMan,devInstDate,devLng,devlat,pnlAddr,instUnit,fMemo,manufacturer,dataFrom,platformId)"
					+ " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
			jdbcTemplate.update(
					sqldevinfo,
					new Object[] { json.getString("devId"),
							json.getString("devName"), json.getString("gbId"),
							json.getString("pnlActID"),
							json.getString("areaId"), 10,
							json.getString("devModelId"),
							json.getString("instMan"),
							json.getString("devInstDate"),
							json.getString("devLng"), json.getString("devlat"),
							json.getString("pnlAddr"),
							json.getString("instUnit"),
							json.getString("fMemo"),
							json.getString("manufacturer"),
							json.getString("dataFrom"),
							json.getString("platformId") });

			String sqlalarmhostattr = " INSERT INTO imm_netnvrattr (devId,devLoginName,devLoginPwd,devTUTKID,videoServer,dataFrom)"
					+ " VALUES (?,?,?,?,?,?) ";

			jdbcTemplate.update(
					sqlalarmhostattr,
					new Object[] { json.getString("devId"),
							json.getString("devLoginName"),
							json.getString("devLoginPwd"),
							json.getString("devTUTKID"),
							json.getString("videoServer"),
							json.getString("dataFrom") });

		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public void addNVRnoEnature(int channNum, JSONObject json, String url,
			String time) { // 添加nvr无线摄像机

		try {
			long num = ErrorAbnormal.timeToTen() + channNum; // 利用时间戳产生摄像机编号
			int chanId = channNum - 1; // 通道号从0开始

			String devMonitorId = null;
			if (channNum < 10) {
				devMonitorId = "000" + channNum;
			} else if (channNum < 100) {
				devMonitorId = "00" + channNum;
			} else if (channNum < 1000) {
				devMonitorId = "0" + channNum;
			} else if (channNum == 1000) {
				devMonitorId = "" + channNum;
			}

			String sqldevinfo = " INSERT INTO imm_devinfo (devId,devName,pnlActID,areaId,devType,devModelId,instMan,devInstDate,devLng,devlat,relateNVR,pnlAddr,instUnit,fMemo,manufacturer)"
					+ " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
			jdbcTemplate.update(
					sqldevinfo,
					new Object[] { num, json.getString("devName") + chanId,
							json.getString("pnlActID"),
							json.getString("areaId"), 12,
							json.getString("devModelId"),
							json.getString("instMan"),
							json.getString("devInstDate"),
							json.getString("devLng"), json.getString("devlat"),
							json.getString("devId"), json.getString("pnlAddr"),
							json.getString("instUnit"),
							json.getString("fMemo"),
							json.getString("manufacturer") });

			String sqlalarmhostattr = " INSERT INTO imm_camera (devId,devChannelId,videoServer,cameraName,videoUrlSuf,devMonitorId,cameraType,atPos,instDate,almType,relateNVR) "
					+ " VALUES (?,?,?,?,?,?,?,?,?,?) ";
			jdbcTemplate.update(sqlalarmhostattr, new Object[] { num, chanId,
					json.getString("videoServer"),
					json.getString("devName") + chanId, url, devMonitorId, 12,
					"未知", time, "警情类型", json.getString("devId") });
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public int queryZoneNum(String devId) { // 查询报警主机最大防区个数
		try {
			String sqldevinfo = " SELECT zoneNum FROM imm_devmodel WHERE devModelId = (SELECT devModelId FROM imm_devinfo WHERE devId = ?) ";
			/*
			 * Number number = jdbcTemplate.queryForObject(sqldevinfo, new
			 * String[] { devId }, Integer.class); int zoneNum = (number != null
			 * ? number.intValue() : 0);
			 */

			List<Map<String, Object>> lists = jdbcTemplate.queryForList(
					sqldevinfo, new Object[] { devId });
			int zoneNum = Objects.isNull(lists) ? 0 : Integer.valueOf(lists
					.get(0).get("zoneNum").toString());
			return zoneNum;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public int queryZoneNumOld(String devId) { // 查询报警主机现在已经添加的防区数
		try {
			String sqldevinfo = " SELECT COUNT(*) FROM imm_devzone WHERE devId=? ";
			/*
			 * Number number = jdbcTemplate.queryForObject(sqldevinfo, new
			 * String[] { devId }, Integer.class); int zoneNum = (number != null
			 * ? number.intValue() : 0);
			 */

			List<Map<String, Object>> lists = jdbcTemplate.queryForList(
					sqldevinfo, new Object[] { devId });
			int zoneNum = Objects.isNull(lists) ? 0 : Integer.valueOf(lists
					.get(0).get("count(*)").toString());
			return zoneNum;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public JSONObject addAlarmhostArea(JSONObject json) { // 添加报警主机防区

		json = Objects.setNull2EmptyString(json);

		// 探头数量 默认是 "0"
		String snNum = "0";
		// 探头型号，默认-1
		String snModelId = "-1";

		if (Objects.isNotNullString(json.getString("snNum"))) {
			if (Long.valueOf(json.getString("snNum")) > 2147483647) {
				log.error("探头数量数据超过最大值 2147483647,当前值:{}",
						json.getString("snNum"));
				return ResultJson.fail("探头数量数据超过最大值 2147483647");
			}
			snNum = json.getString("snNum");
		}

		if (Objects.isNotNullString(json.getString("snModelId"))) {
			snModelId = json.getString("snModelId");
		}

		String sqldevinfo = " INSERT INTO imm_devzone (devId,devZoneId,atPos,instDate,snModeId,snType,snNum,wantDo,almType,fMemo,dataFrom)"
				+ " VALUES (?,?,?,?,?,?,?,?,?,?,?) ";

		try {
			jdbcTemplate.update(
					sqldevinfo,
					new Object[] { json.getString("devId"),
							json.getString("devZoneId"),
							json.getString("atPos"),
							json.getString("instDate"), snModelId,
							json.getString("snType"), snNum,
							json.getString("wantDo"),
							json.getString("almType"), json.getString("fMemo"),
							json.getString("dataFrom") });

		} catch (Exception e) {
			throw e;
		}
		return ResultJson.fail("添加成功");
	}

	@Override
	public List<Map<String, Object>> queryAlalmhostcha(String devId) { // 查询所有摄像机通道号
		String sqldevinfo = "SELECT devChannelId FROM imm_camera a ,( SELECT devId FROM imm_devinfo WHERE relateNVR = ? ) b WHERE a.devId=b.devId";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sqldevinfo,
				new Object[] { devId });
		return list;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public List queryAlalmhosPlay(String devId) { // 查询所有报警主机防区编号
		String sqldevinfo = " SELECT devZoneId FROM imm_devzone WHERE devId = ? ";
		return jdbcTemplate.queryForList(sqldevinfo, new Object[] { devId });
	}

	@SuppressWarnings("rawtypes")
	@Override
	public List queryAlalmhosPlay(String devId, String devZoneId) {
		try {
			String sqldevinfo = " SELECT devZoneId FROM imm_devzone WHERE devId = ? and devZoneId = ?";
			return jdbcTemplate.queryForList(sqldevinfo, new Object[] { devId,
					devZoneId });
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public void updaAlarmhostArea(JSONObject json) { // 修改报警主机防区\

		// 探头数量 默认是 "0"
		String snNum = "0";
		// 探头型号，默认-1
		String snModelId = "-1";

		if (Objects.isNotNullString(json.getString("snNum"))) {
			snNum = json.getString("snNum");
		}

		if (Objects.isNotNullString(json.getString("snModelId"))) {
			snModelId = json.getString("snModelId");
		}

		String sqldevinfo = " UPDATE imm_devzone SET "
				+ " atPos=?,instDate=?,snModeId=?,snType=?,snNum=?,wantDo=?,almType=?,fMemo=?"
				+ " WHERE devId=? AND devZoneId =? ";

		try {
			jdbcTemplate.update(
					sqldevinfo,
					new Object[] { json.getString("atPos"),
							json.getString("instDate"), snModelId,
							json.getString("snType"), snNum,
							json.getString("wantDo"),
							json.getString("almType"), json.getString("fMemo"),
							json.getString("devId"),
							json.getString("devZoneId") });
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings("deprecation")
	@Override
	public int queryTUTKID(String devTUTKID) { // 查询TUTKID是否存在
		String sql = "select count(*) from imm_netnvrattr where devTUTKID = ? ";
		try {
			return jdbcTemplate.queryForInt(sql, new Object[] { devTUTKID });
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List getOwnerCorrelateDevDao(String ownerId) {

		String sql = "SELECT imm_area.areaName,imm_devmodel.devModelName,imm_devtype.devTypeName,mcs_customer_status.isActivation, "
				+ "imm_devinfo.* FROM imm_devmodel,imm_devinfo LEFT JOIN mcs_customer_status ON imm_devinfo.devId=mcs_customer_status.devId,imm_devtype,imm_area WHERE "
				+ "imm_devinfo.devType = imm_devtype.devType AND imm_devmodel.devModelId = imm_devinfo.devModelId "
				+ "AND imm_devinfo.areaId = imm_area.areaId AND imm_devinfo.ownerId = ? and imm_devinfo.devType not in ('11','12')";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,
				new Object[] { ownerId });
		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}
		return list;
	}

	@Override
	public Map<String, Object> findOneClikDevByDevSn(String devSn) {
		String sql = "select devId,devSn from imm_one_click_dev_attr where devSn=?";

		try {
			List<Map<String, Object>> result = jdbcTemplate.queryForList(sql,
					devSn);

			if (Objects.isNotNull(result)) {
				return result.get(0);
			}

		} catch (Exception e) {
			throw e;
		}
		return new HashMap<String, Object>();
	}

	@Override
	public boolean addOneClickDev(JSONObject jsonObject) {
		try {
			String insertDevinfoSql = "insert into imm_devinfo (devId,devName,pnlActID,areaId,devType,devModelId,devLng,devlat,pnlAddr,manufacturer,instMan,instUnit,devInstDate,fMemo,platformId,dataFrom) "
					+ "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

			String insertOneClickDevAttrSql = "insert into imm_one_click_dev_attr (devId,devSn,IP,PORT,tunnelId,playCode,loginName,loginPwd,communicateLine,communicateProtocol,dataFrom) "
					+ "values (?,?,?,?,?,?,?,?,?,?,?)";

			boolean insertDevinfo = jdbcTemplate.update(insertDevinfoSql,
					jsonObject.getString("devId"), jsonObject
							.getString("devName"), jsonObject
							.getString("pnlActID"), jsonObject
							.getString("areaId"), jsonObject
							.getString("devType"), jsonObject
							.getString("devModelId"), Objects
							.isNullString(jsonObject.getString("devLng")) ? 0
							: jsonObject.getString("devLng"), Objects
							.isNullString(jsonObject.getString("devlat")) ? 0
							: jsonObject.getString("devlat"), jsonObject
							.getString("pnlAddr"), jsonObject
							.getString("manufacturer"), jsonObject
							.getString("instMan"), jsonObject
							.getString("instUnit"), jsonObject
							.getString("devInstDate"), jsonObject
							.getString("fMemo"), jsonObject
							.getString("platformId"), jsonObject
							.getString("dataFrom")) > 0;

			boolean insertAttr = jdbcTemplate.update(insertOneClickDevAttrSql,
					jsonObject.getString("devId"), jsonObject
							.getString("devSn"), jsonObject.getString("IP"),
					jsonObject.getString("PORT"), jsonObject
							.getString("tunnelId"), jsonObject
							.getString("playCode"), jsonObject
							.getString("loginName"), jsonObject
							.getString("loginPwd"), Objects
							.isNullString(jsonObject
									.getString("communicateLine")) ? "-1"
							: jsonObject.getString("communicateLine"), Objects
							.isNullString(jsonObject
									.getString("communicateProtocol")) ? "-1"
							: jsonObject.getString("communicateProtocol"),
					jsonObject.getString("dataFrom")) > 0;

			return insertDevinfo && insertAttr;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean updateOneClickDev(JSONObject jsonObject) {
		String updateDevinfoSql = "update imm_devinfo set devName=?,pnlActID=?,areaId=?,devType=?,devModelId=?,devLng=?,devlat=?,pnlAddr=?,manufacturer=?,instMan=?,instUnit=?,devInstDate=?,fMemo=?,dataFrom=? where devId=? ";
		String updateOneClickDevAttrSql = "update imm_one_click_dev_attr set devSn=?,IP=?,PORT=?,tunnelId=?,playCode=?,loginName=?,loginPwd=?,communicateLine=?,communicateProtocol=?,dataFrom=? where devId=? ";

		try {
			boolean updateDevinfo = jdbcTemplate.update(updateDevinfoSql,
					jsonObject.getString("devName"),
					jsonObject.getString("pnlActID"),
					jsonObject.getString("areaId"),
					jsonObject.getString("devType"),
					jsonObject.getString("devModelId"),
					jsonObject.getString("devLng"),
					jsonObject.getString("devlat"),
					jsonObject.getString("pnlAddr"),
					jsonObject.getString("manufacturer"),
					jsonObject.getString("instMan"),
					jsonObject.getString("instUnit"),
					jsonObject.getString("devInstDate"),
					jsonObject.getString("fMemo"),
					jsonObject.getString("dataFrom"),
					jsonObject.getString("devId")) > 0;

			boolean updateAttr = jdbcTemplate.update(updateOneClickDevAttrSql,
					jsonObject.getString("devSn"), jsonObject.getString("IP"),
					jsonObject.getString("PORT"), jsonObject
							.getString("tunnelId"), jsonObject
							.getString("playCode"), jsonObject
							.getString("loginName"), jsonObject
							.getString("loginPwd"), Objects
							.isNullString(jsonObject
									.getString("communicateLine")) ? "-1"
							: jsonObject.getString("communicateLine"), Objects
							.isNullString(jsonObject
									.getString("communicateProtocol")) ? "-1"
							: jsonObject.getString("communicateProtocol"),
					jsonObject.getString("dataFrom"), jsonObject
							.getString("devId")) > 0;

			return updateDevinfo && updateAttr;

		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean deleteOneClickDev(String devId) {
		String deleteDevinfoSql = "delete from imm_devinfo where devId=?";
		String deleteAttrSql = "delete from imm_one_click_dev_attr where devId=?";
		try {

			boolean deleteDevinfo = jdbcTemplate
					.update(deleteDevinfoSql, devId) > 0;
			boolean deleteAttr = jdbcTemplate.update(deleteAttrSql, devId) > 0;

			return deleteDevinfo && deleteAttr;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public Map<String, Object> findNVRByGbId(String gbId) {
		String sql = "select devId,define5 as gbId from imm_devinfo where define5=? and devType in ('9','10')";
		try {
			List<Map<String, Object>> result = jdbcTemplate.queryForList(sql,
					gbId);

			if (Objects.isNotNull(result)) {
				return result.get(0);
			}
			return new HashMap<String, Object>();
		} catch (Exception e) {
			throw e;
		}

	}
}
