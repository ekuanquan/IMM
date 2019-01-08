package com.device.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.device.dao.IDeviceMonitorDao;
import com.device.pojo.DeviceInfoPojo;
import com.znyw.pojo.DeviceDataPojo;
import com.znyw.service.RoleAreaService;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.Objects;

@Repository
public class DeviceMonitorDaoImpl implements IDeviceMonitorDao {
	Logger logger = LoggerFactory.getLogger(getClass());
	@Resource
	private JdbcTemplate jdbcTemplate;
	@Resource
	private RoleAreaService roleAreaService;

	@Override
	public List<DeviceDataPojo> getDeviceListByUserId(String userId, String devName) throws Exception {

		devName = Objects.isNullString(devName) ? " " : "  and locate('" + devName + "',devName)>0 ";

		final List<DeviceDataPojo> list = new ArrayList<DeviceDataPojo>();

		// 当前用户权限范围
		List<String> purviewAreaIds;

		try {
			purviewAreaIds = roleAreaService.getPurviewAreaIdsByUserId(userId);
		} catch (Exception e) {
			throw e;
		}

		// 获取权限区域内的有线NVR和互联网NVR
		String getDevIdsByAreaIdsFirstSql = "select devId from imm_devinfo where devType in ('9','10') and areaId in ('"
				+ Objects.Joiner("','", purviewAreaIds) + "') ";

		List<Map<String, Object>> lists = null;
		try {
			lists = jdbcTemplate.queryForList(getDevIdsByAreaIdsFirstSql);
		} catch (Exception e) {
			throw e;
		}

		// 权限范围内无任何有线NVR或互联网NVR信息直接返回
		if (Objects.isNull(lists)) {
			return list;
		}

		List<String> devIdsByAreaIdsFirst = new ArrayList<String>();
		for (Map<String, Object> map : lists) {
			devIdsByAreaIdsFirst.add(map.get("devId").toString());
		}

		// 查出各个设备下的关联设备，例如监控点的摄像机设备
		String getDevIdsByRelateNVRSql = "select devId from imm_devinfo where relateNVR in ('"
				+ Objects.Joiner("','", devIdsByAreaIdsFirst) + "') ";

		try {
			lists = jdbcTemplate.queryForList(getDevIdsByRelateNVRSql);
		} catch (Exception e) {
			throw e;
		}

		List<String> devIdsByRelateNVR = new ArrayList<String>();
		for (Map<String, Object> map : lists) {
			devIdsByRelateNVR.add(map.get("devId").toString());
		}

		String getAllCameraSql = "SELECT dev.devId,dev.ownerId,dev.relateNVR,dev.devName,dev.areaId,dev.devType,dev.devLng,dev.devLat,dev.devState,devType.icon "
				+ " FROM imm_devinfo dev,imm_devtype devType WHERE dev.devType=devType.devType AND dev.devId in ('%s') "
				+ devName;

		String getAllNVRSql = "SELECT dev.devId,dev.ownerId,dev.relateNVR,dev.devName,dev.areaId,dev.devType,dev.devLng,dev.devLat,dev.devState,devType.icon "
				+ " FROM imm_devinfo dev,imm_devtype devType WHERE dev.devType=devType.devType AND dev.devId in ('%s') ";

		RowCallbackHandler rowCallbackHandler = new RowCallbackHandler() {
			@Override
			public void processRow(ResultSet rs) throws SQLException {
				String devId = rs.getString("devId");

				if (null != devId && !"".equals(devId)) {
					DeviceDataPojo deviceDataPojo = new DeviceDataPojo();
					deviceDataPojo.setDeviceId(devId);
					deviceDataPojo.setDeviceName(rs.getString("devName"));
					Integer devState = rs.getInt("devState");
					deviceDataPojo.setDeviceStatus(devState);
					if (0 == devState) {
						deviceDataPojo.setIconSkin(rs.getString("icon") + "_outline");
					} else if (1 == devState) {
						deviceDataPojo.setIconSkin(rs.getString("icon"));
					} else if (2 == devState) {
						deviceDataPojo.setIconSkin(rs.getString("icon") + "_default");
					}
					deviceDataPojo.setDeviceType(rs.getString("devType"));
					deviceDataPojo.setLat(rs.getDouble("devlat"));
					deviceDataPojo.setLng(rs.getDouble("devLng"));

					deviceDataPojo.setParentId(rs.getString("relateNVR"));
					deviceDataPojo.setOwnerId(rs.getString("ownerId"));

					deviceDataPojo.setIsParent(false);
					deviceDataPojo.setOpen(false);
					list.add(deviceDataPojo);
				}
			}
		};

		RowCallbackHandler nvrRowCallbackHandler = new RowCallbackHandler() {
			@Override
			public void processRow(ResultSet rs) throws SQLException {

				DeviceDataPojo deviceDataPojo = new DeviceDataPojo();

				String devId = rs.getString("devId");

				if (Objects.isNullString(devId)) {
					return;
				}

				deviceDataPojo.setDeviceId(devId);
				deviceDataPojo.setDeviceName(rs.getString("devName"));
				deviceDataPojo.setDeviceStatus(null);
				deviceDataPojo.setIconSkin("device_root");
				deviceDataPojo.setDeviceType("device_root");
				deviceDataPojo.setDeviceType(rs.getString("devType"));
				deviceDataPojo.setLat(rs.getDouble("devlat"));
				deviceDataPojo.setLng(rs.getDouble("devLng"));
				deviceDataPojo.setParentId(rs.getString("areaId"));
				deviceDataPojo.setOwnerId(rs.getString("ownerId"));

				deviceDataPojo.setIsParent(true);
				deviceDataPojo.setOpen(false);
				list.add(deviceDataPojo);
			}
		};
		try {

			jdbcTemplate.query(String.format(getAllNVRSql, Objects.Joiner("','", devIdsByAreaIdsFirst)),
					nvrRowCallbackHandler);

			jdbcTemplate.query(String.format(getAllCameraSql, Objects.Joiner("','", devIdsByRelateNVR)),
					rowCallbackHandler);

		} catch (Exception e) {
			throw e;
		}

		return list;

	}

	@Override
	public Set<DeviceDataPojo> getAreaList() throws Exception {
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT areaId,areaName,parentAreaId FROM imm_area");

		final Set<DeviceDataPojo> list = new HashSet<DeviceDataPojo>();
		RowCallbackHandler rowCallbackHandler = new RowCallbackHandler() {
			@Override
			public void processRow(ResultSet rs) throws SQLException {
				String areaId = rs.getString("areaId");
				if (null != areaId && !"".equals(areaId)) {
					DeviceDataPojo deviceDataPojo = new DeviceDataPojo();
					deviceDataPojo.setDeviceId(areaId);
					deviceDataPojo.setDeviceName(rs.getString("areaName"));
					deviceDataPojo.setDeviceStatus(null);
					deviceDataPojo.setIconSkin("device_root");
					deviceDataPojo.setDeviceType("device_root");
					deviceDataPojo.setLat(1.0);
					deviceDataPojo.setLng(1.0);
					if (areaId.equals(ConfigUtil.getRoot())) {
						deviceDataPojo.setParentId("0");
					} else {
						deviceDataPojo.setParentId(rs.getString("parentAreaId"));
					}
					deviceDataPojo.setIsParent(true);
					deviceDataPojo.setOpen(false);
					list.add(deviceDataPojo);
				}
			}
		};

		try {
			jdbcTemplate.query(sql.toString(), rowCallbackHandler);
		} catch (DataAccessException e) {
			throw e;
		}
		return list;
	}

	@Override
	public Set<DeviceDataPojo> getAreaListByAreaIDs(final List<String> areaIDs) throws Exception {
		final Set<DeviceDataPojo> list = new HashSet<DeviceDataPojo>();

		final Set<String> rootId = new HashSet<String>();

		while (areaIDs.size() > 0) {
			StringBuilder sql = new StringBuilder();
			StringBuilder stringBuilder = new StringBuilder();

			for (int i = 0; i < areaIDs.size(); i++) {
				stringBuilder.append("'" + areaIDs.get(i) + "',");
			}

			sql.append("SELECT areaId,areaName,parentAreaId FROM imm_area ");
			sql.append("WHERE areaId in (" + stringBuilder.substring(0, stringBuilder.length() - 1) + ")");
			areaIDs.removeAll(areaIDs);

			RowCallbackHandler rowCallbackHandler = new RowCallbackHandler() {
				@Override
				public void processRow(ResultSet rs) throws SQLException {
					DeviceDataPojo deviceDataPojo = new DeviceDataPojo();
					String areaId = rs.getString("areaId");

					deviceDataPojo.setDeviceId(areaId);
					deviceDataPojo.setDeviceName(rs.getString("areaName"));
					deviceDataPojo.setDeviceStatus(null);
					deviceDataPojo.setIconSkin("device_root");
					deviceDataPojo.setDeviceType("device_root");
					deviceDataPojo.setLat(1.0);
					deviceDataPojo.setLng(1.0);

					// 不要删除此代码，否则会出现多个相同目录
					if (rootId.contains(areaId)) {
						return;
					}

					rootId.add(areaId);
					if (areaId.equals(ConfigUtil.getRoot())) {
						deviceDataPojo.setParentId("0");
					} else {
						deviceDataPojo.setParentId(rs.getString("parentAreaId"));
						areaIDs.add(rs.getString("parentAreaId"));
					}
					deviceDataPojo.setIsParent(true);
					deviceDataPojo.setOpen(false);
					list.add(deviceDataPojo);
				}
			};

			try {
				jdbcTemplate.query(sql.toString(), rowCallbackHandler);
			} catch (DataAccessException e) {
				throw e;
			}
		}

		rootId.clear();

		return list;
	}

	@Override
	public DeviceInfoPojo getDeviceInfoById(String deviceId) throws Exception {
		StringBuilder sql = new StringBuilder();
		sql.append("select * from imm_devinfo where devId=?");
		Object[] params = { deviceId };

		RowMapper<DeviceInfoPojo> rowMapper = new RowMapper<DeviceInfoPojo>() {
			@Override
			public DeviceInfoPojo mapRow(ResultSet rs, int rowNum) throws SQLException {
				DeviceInfoPojo deviceInfopojo = new DeviceInfoPojo();
				deviceInfopojo.setDevId(rs.getString("devId"));
				deviceInfopojo.setDevName(rs.getString("devName"));
				deviceInfopojo.setPnlActID(rs.getString("pnlActID"));
				deviceInfopojo.setAreaId(rs.getString("areaId"));
				deviceInfopojo.setDevType(rs.getString("devType"));
				deviceInfopojo.setDevModelId(rs.getString("devModelId"));
				deviceInfopojo.setUserId(rs.getString("ownerId"));
				deviceInfopojo.setUserName(rs.getString("userName"));
				deviceInfopojo.setUserAddr(rs.getString("userAddr"));
				deviceInfopojo.setContact(rs.getString("contact"));
				deviceInfopojo.setcPhone(rs.getString("cPhone"));
				deviceInfopojo.setDevLng(rs.getDouble("devLng"));
				deviceInfopojo.setDevlat(rs.getDouble("devlat"));
				deviceInfopojo.setPnlAddr(rs.getString("pnlAddr"));
				deviceInfopojo.setInstMan(rs.getString("instMan"));
				deviceInfopojo.setDevInstDate(rs.getString("devInstDate"));
				deviceInfopojo.setInstUnit(rs.getString("instUnit"));
				deviceInfopojo.setDevState(rs.getInt("devState"));
				deviceInfopojo.setServerId(rs.getString("serverId"));
				deviceInfopojo.setMapId(rs.getString("mapId"));
				deviceInfopojo.setfMemo(rs.getString("fMemo"));
				deviceInfopojo.setUpdatetime(rs.getString("updatetime"));
				deviceInfopojo.setSyncTime(rs.getString("syncTime"));
				return deviceInfopojo;
			}
		};

		try {
			return jdbcTemplate.queryForObject(sql.toString(), params, rowMapper);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public String getUrlByDeviceId(String deviceId) throws Exception {
		StringBuilder sql = new StringBuilder();
		sql.append("select videoUrlSuf,videoServer from imm_camera where devId=?");
		Object[] params = { deviceId };

		RowMapper<String> rowMapper = new RowMapper<String>() {
			@Override
			public String mapRow(ResultSet rs, int rowNum) throws SQLException {
				StringBuffer stringBuffer = new StringBuffer();
				String header = "rtsp://";
				String videoServer = rs.getString("videoServer");
				String videoUrlSuf = rs.getString("videoUrlSuf");
				return stringBuffer.append(header).append(videoServer).append(videoUrlSuf).toString();
			}
		};
		String result;
		try {
			result = jdbcTemplate.queryForObject(sql.toString(), params, rowMapper);
		} catch (DataAccessException e) {
			throw e;
		}
		return result;
	}

	@Override
	public JSONObject getUrlListByDeviceIds(String deviceIds) throws Exception {
		StringBuilder sql = new StringBuilder();
		sql.append("select devId,videoUrlSuf,videoServer from imm_camera where devId in (" + deviceIds + ")");

		RowMapper<JSONObject> rowMapper = new RowMapper<JSONObject>() {
			@Override
			public JSONObject mapRow(ResultSet rs, int rowNum) throws SQLException {
				JSONObject jsonResult = new JSONObject();
				StringBuffer playUrl = new StringBuffer();
				String deviceId = rs.getString("devId");
				String header = "rtsp://";
				String videoServer = rs.getString("videoServer");
				String videoUrlSuf = rs.getString("videoUrlSuf");
				playUrl.append(header).append(videoServer).append(videoUrlSuf);
				jsonResult.put(deviceId, playUrl);
				return jsonResult;
			}
		};

		List<JSONObject> jsonObjects;

		try {
			jsonObjects = jdbcTemplate.query(sql.toString(), rowMapper);
		} catch (Exception e) {
			throw e;
		}

		JSONObject jsonResult = new JSONObject();
		for (int i = 0, len = jsonObjects.size(); i < len; i++) {
			JSONObject jsonObject = jsonObjects.get(i);
			LinkedHashMap<String, String> jsonMap = JSONObject.parseObject(jsonObject.toJSONString(),
					new TypeReference<LinkedHashMap<String, String>>() {
					});
			for (Map.Entry<String, String> map : jsonMap.entrySet()) {
				String deviceId = map.getKey();
				String playUrl = map.getValue();
				jsonResult.put(deviceId, playUrl);
			}
		}
		return jsonResult;
	}

	@Override
	public String getDeviceListByMaxAcc(String AccID, String conSerID, int[] serNum) {
		String msg = "";
		try {
			logger.info("getDeviceListByMaxAcc 分配设备给id={}， 目标{}", AccID, serNum[0]);

			List<String> firmCodes = new ArrayList<String>();
			firmCodes.add("HIK");
			firmCodes.add("HIK_DVR");
			firmCodes.add("HH");
			firmCodes.add("DH");
			firmCodes.add("TOP");
			firmCodes.add("KAER");
			firmCodes.add("CS_PLAT");
			firmCodes.add("INF");
			firmCodes.add("LC");
			firmCodes.add("KEDA_DVR");
			firmCodes.add("TDWY");
			firmCodes.add("MA");
			// assignDev 分配给的接入的messageId
			StringBuilder sql = new StringBuilder();
			sql.append("SELECT i_di.devId,i_di.manufacturer,i_cm.devChannelId,");
			sql.append("i_wna.devIp,i_wna.devLoginName,i_wna.devLoginPwd,i_wna.devPort ");
			sql.append("FROM imm_devinfo i_di ");
			sql.append("LEFT OUTER JOIN imm_camera i_cm ON i_cm.devId = i_di.devId ");
			sql.append("LEFT OUTER JOIN imm_wirenvrattr i_wna ON i_wna.devId = i_di.relateNVR ");
			sql.append("WHERE relateNVR IS NOT NULL AND devType=11 AND i_wna.devIp IS NOT NULL ");

			final JSONArray jsonArray = new JSONArray();
			RowCallbackHandler rowCallbackHandler = new RowCallbackHandler() {

				@Override
				public void processRow(ResultSet rs) throws SQLException {
					JSONObject devJson = new JSONObject();
					devJson.put("devId", rs.getString("devId"));
					devJson.put("devType", rs.getString("manufacturer"));
					devJson.put("devIp", rs.getString("devIp"));
					devJson.put("devPort", rs.getString("devPort"));
					devJson.put("devUser", rs.getString("devLoginName"));
					devJson.put("devPswd", rs.getString("devLoginPwd"));
					devJson.put("devChnnl", rs.getString("devChannelId"));
					devJson.put("devParentId", "1");
					jsonArray.add(devJson);
				}
			};
			jdbcTemplate.query(sql.toString(), rowCallbackHandler);

			for (Object devObj : jsonArray) {
				int ntype = -1;
				JSONObject jsonDev = (JSONObject) devObj;
				String firmCode = jsonDev.getString("devType");
				if (firmCode.equals("HIK") || firmCode.equals("HIK_DVR"))
					ntype = 10;
				else if (firmCode.equals("HH"))
					ntype = 20;
				else if (firmCode.equals("DH"))
					ntype = 30;
				else if (firmCode.equals("TOP"))
					ntype = 40;
				else if (firmCode.equals("KAER"))
					ntype = 60;
				else if (firmCode.equals("CS_PLAT"))
					ntype = 70;
				else if (firmCode.equals("INF"))
					ntype = 100;
				else if (firmCode.equals("LC"))
					ntype = 110;
				else if (firmCode.equals("KEDA_DVR"))
					ntype = 120;
				else if (firmCode.equals("TDWY"))
					ntype = 140;
				else if (firmCode.equals("MA"))
					ntype = 130;

				String ParentId = "1";
				if (firmCode.equals("118"))
					ParentId = jsonDev.getString("devIp");

				msg += String.format(
						"{\"devId\":\"%s\",\"devType\":\"%s\",\"devIp\":\"%s\",\"devPort\":\"%s\",\"devUser\":\"%s\",\"devPswd\":\"%s\","
								+ "\"devChnnl\":\"%s\",\"devParentId\":\"%s\"}",
						jsonDev.getString("devId"), ntype, jsonDev.getString("devIp"), jsonDev.getString("devPort"),
						jsonDev.getString("devUser"), jsonDev.getString("devPswd"), jsonDev.getString("devChnnl"),
						ParentId);

				serNum[1] = jsonArray.size();
				logger.info("getDeviceListByMaxAcc suc,实际分配条数={}.", serNum[1]);
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return null;
		}
		return msg;
	}
}
