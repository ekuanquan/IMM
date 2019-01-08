package com.znyw.dao.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.systemcfg.dao.AssembleCfgDao;
import com.znyw.dao.QueryDevice;
import com.znyw.pojo.DeviceInfo;
import com.znyw.pojo.Eventclass;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.Objects;
import com.znyw.tool.SetField;

/**
 * 查询设备信息
 * 
 * @author ywhl
 *
 */

@Repository("QueryDevice")
public class QueryDeviceDaoImp implements QueryDevice {

	private Logger log = Logger.getLogger(getClass());

	@Resource
	private JdbcTemplate jdbcTemplate;
	@Resource
	private AssembleCfgDao assembleCfgDao;

	@SuppressWarnings("deprecation")
	@Override
	public int QueryNVRhaveNatunoNum(String queryId, String areaId,
			String isowner, String platformId) { // 查询nvr无线以及无线属性表总条数

		if ("have".equals(isowner)) {
			isowner = "";
		} else {
			String localPlatformId = null;

			try {
				localPlatformId = assembleCfgDao.getLocalPlatformId();
			} catch (Exception e) {
				e.printStackTrace();
			}
			isowner = "AND (dev.ownerId='' OR dev.ownerId IS NULL) and dev.platformId= '"
					+ localPlatformId + "'";
		}
		platformId = platformId.equals("") ? " " : " and dev.platformId='"
				+ platformId + "' ";

		String sql = " SELECT COUNT(*)  FROM "
				+ " imm_devinfo dev,imm_area,imm_devtype,imm_devmodel,imm_netnvrattr net,imm_assemble_cfg  "
				+ " WHERE dev.areaId=imm_area.areaId "
				+ isowner
				+ " AND dev.devType=10 AND imm_devtype.devType=dev.devType"
				+ " AND dev.devModelId=imm_devmodel.devModelId AND net.devId=dev.devId and dev.platformId=imm_assemble_cfg.platform_id "
				+ areaId + platformId + " " + " AND " + queryId;
		try {
			return jdbcTemplate.queryForInt(sql);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List QueryNVRhaveNatuno(String queryId, String areaId, String sort,
			int pageSize, int currentPage, String isowner, String platformId) { // 查询nvr无线以及无线属性表
		List<Map<String, Object>> listDevinfo = null;

		if ("have".equals(isowner)) {
			isowner = "";
		} else {
			String localPlatformId = ConfigUtil.getPlatformId();
			isowner = "AND (dev.ownerId='' OR dev.ownerId IS NULL) and dev.platformId= '"
					+ localPlatformId + "'";
		}

		platformId = platformId.equals("") ? " " : " and dev.platformId='"
				+ platformId + "' ";

		String sql = " select dev.devId,dev.devName,dev.define5 as gbId,dev.pnlActID,dev.areaId,dev.devType,dev.devModelId,dev.devInstDate,dev.devLng,dev.devlat,dev.pnlAddr,"
				+ " dev.instMan,dev.instUnit,dev.fMemo,dev.devState,"
				+ " imm_area.areaName,imm_devtype.devTypeName,imm_devmodel.devModelName,imm_devmodel.ChannelNum,"
				+ " net.devLoginName,net.devLoginPwd,net.devTUTKID,net.videoServer,dev.platformId,imm_assemble_cfg.platform_name as platformName "
				+ " from imm_devinfo dev,imm_area,imm_devtype,imm_devmodel,imm_netnvrattr net,imm_assemble_cfg "
				+ " where dev.areaId=imm_area.areaId "
				+ isowner
				+ "and dev.devType=10 and imm_devtype.devType=dev.devType "
				+ " and dev.devModelId=imm_devmodel.devModelId and dev.platformId=imm_assemble_cfg.platform_id "
				+ " and net.devId=dev.devId "
				+ areaId
				+ platformId
				+ " AND "
				+ queryId
				+ "  order by dev.devId "
				+ sort
				+ " limit "
				+ (currentPage - 1) * pageSize + "," + pageSize + "";
		try {
			listDevinfo = jdbcTemplate.queryForList(sql);
			return listDevinfo;
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings("deprecation")
	@Override
	public int QueryNVRheveNatNum(String queryId, String areaId,
			String isowner, String platformId) { // 查询nvr有线以及有线属性表总数

		// have 查询所有，否则查有主设备
		if ("have".equals(isowner)) {
			isowner = "";
		} else {
			String localPlatformId = ConfigUtil.getPlatformId();
			isowner = "AND (dev.ownerId='' OR dev.ownerId IS NULL) and dev.platformId= '"
					+ localPlatformId + "'";
		}

		platformId = platformId.equals("") ? " " : " and dev.platformId='"
				+ platformId + "' ";

		String sql = " SELECT COUNT(*) "
				+ " FROM imm_devinfo dev,imm_wirenvrattr wir,imm_area,imm_devmodel,imm_assemble_cfg"
				+ " WHERE dev.devType='9' "
				+ areaId
				+ " "
				+ platformId
				+ " "
				+ isowner
				+ " AND dev.devId=wir.devId AND imm_area.areaId=dev.areaId "
				+ " AND "
				+ queryId
				+ " AND imm_devmodel.devModelId=dev.devModelId and dev.platformId=imm_assemble_cfg.platform_id ";
		System.out.println(sql);
		try {
			return jdbcTemplate.queryForInt(sql);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
		return 0;
	}

	@Override
	public List QueryNVRheveNat(String queryId, String areaId, String sort,
			int pageSize, int currentPage, String isowner, String platformId) { // 查询nvr有线以及有线属性表

		List<Map<String, Object>> listDevinfo = null;

		// have 查询所有，否则查有主设备
		if ("have".equals(isowner)) {
			isowner = "";
		} else {
			String localPlatformId = ConfigUtil.getPlatformId();
			isowner = "AND (dev.ownerId='' OR dev.ownerId IS NULL) and dev.platformId= '"
					+ localPlatformId + "'";
		}
		platformId = platformId.equals("") ? " " : " and dev.platformId='"
				+ platformId + "' ";

		String sql = "	SELECT dev.devId,dev.devState,dev.serverId,dev.devName,dev.define5 as gbId,dev.pnlActID,dev.areaId,dev.devType,dev.devModelId,dev.instMan,dev.devInstDate,dev.devLng,dev.devlat,dev.relateNVR,dev.pnlAddr,dev.instUnit,dev.fMemo,dev.platformId,imm_assemble_cfg.platform_name as platformName,"
				+ "	wir.devLoginName,wir.devLoginPwd,wir.devIp,wir.videoServer,wir.devPort,imm_area.areaName,imm_devmodel.devModelName,imm_devmodel.ChannelNum,imm_devtype.devTypeName "
				+ "	FROM imm_devinfo dev,imm_wirenvrattr wir,imm_area,imm_devmodel,imm_devtype,imm_assemble_cfg"
				+ "	WHERE dev.devType='9' "
				+ areaId
				+ platformId
				+ " AND imm_devtype.devType=dev.devtype AND dev.devId=wir.devId AND imm_area.areaId=dev.areaId AND imm_devmodel.devModelId=dev.devModelId and dev.platformId=imm_assemble_cfg.platform_id "
				+ " "
				+ isowner
				+ " AND "
				+ queryId
				+ " order by dev.devId "
				+ sort
				+ " LIMIT "
				+ (currentPage - 1)
				* pageSize
				+ ","
				+ pageSize + " ";
		try {
			listDevinfo = jdbcTemplate.queryForList(sql);
			return listDevinfo;
		} catch (Exception e) {
			throw e;
		}
	}

	public List QueryNVRhaveNatuno(String devId) { // 查询nvr无线属性表
		List<Map<String, Object>> listDevinfo = null;
		String sql = " SELECT * FROM imm_netnvrattr WHERE devId = ?";
		listDevinfo = jdbcTemplate.queryForList(sql, devId);
		return listDevinfo;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public List Queryrelated(String devTutkID, String channelNum, String sysCode) { // 获取相关信息
		List<Map<String, Object>> listDevinfo = null;

		String sql = "SELECT b.ownerId,b.devId,c.userName,d.userAddr,e.devModelId,e.devModelName,f.areaId, "
				+ "f.areaName,d.usrAlmType,imm_camera.cameraName,g.ownerMonitorId,imm_camera.atPos, "
				+ "imm_camera.devMonitorId cameraModelId,imm_camera.almType,imm_almtype.almTypeName, "
				+ "imm_camera.wantDo,imm_wantdo.wantDoName,h.codeId,h.codeTypeId,i.codeType,h.evtWay, "
				+ "h.codeMemo eventDesc FROM imm_camera "
				+ "LEFT JOIN imm_netnvrattr ON imm_camera.relateNVR = imm_netnvrattr.devId "
				+ "LEFT JOIN imm_devinfo b ON b.devId = imm_camera.relateNVR "
				+ "LEFT JOIN imm_userinfo c ON b.ownerId= c.userId "
				+ "LEFT JOIN imm_customerattr d ON b.ownerId= d.userId "
				+ "LEFT JOIN imm_devmodel e ON e.devModelId= b.devModelId "
				+ "LEFT JOIN imm_almtype ON imm_camera.almType = imm_almtype.almType "
				+ "LEFT JOIN imm_wantdo ON imm_camera.wantDo = imm_wantdo.wantDo "
				+ "LEFT JOIN imm_area f ON f.areaId = b.areaId "
				+ "LEFT JOIN imm_ownermonitor g ON c.userId = g.ownerId AND b.devId = g.devId "
				+ "AND imm_camera.devMonitorId = g.devMonitorId,imm_sysCode h "
				+ "LEFT JOIN imm_codetype i ON h.codeTypeId=i.codeTypeId "
				+ " WHERE imm_netnvrattr.devTUTKID = '"
				+ devTutkID
				+ "' AND imm_camera.devChannelId = '"
				+ channelNum
				+ "' AND h.codeId = '" + sysCode + "'";

		try {
			listDevinfo = jdbcTemplate.queryForList(sql);
		} catch (Exception e) {
			throw e;
		}
		List list = SetField.removeNull(listDevinfo);

		return list;
	}

	@Override
	public List QueryUserId(String devId) {
		List<Map<String, Object>> listDevinfo = null;

		String sql = " SELECT userId FROM imm_userinfo WHERE roleId IN (SELECT roleId FROM imm_roledev WHERE devId = ?) ";
		try {
			listDevinfo = jdbcTemplate.queryForList(sql, devId);
			return listDevinfo;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public String QueryDevId(String cameraId) {
		// String devId = null;
		String sql = " SELECT relateNVR FROM imm_devinfo WHERE devId=? ";
		/*
		 * devId = jdbcTemplate.queryForObject(sql, new Object[] { cameraId },
		 * String.class); return devId;
		 */
		List<Map<String, Object>> lists = jdbcTemplate.queryForList(sql,
				new Object[] { cameraId });
		return Objects.isNull(lists) ? null : lists.get(0).get("relateNVR")
				.toString();
	}

	@Override
	public List QueryEventclass() {
		String sql = " SELECT * FROM imm_eventclass ";
		RowMapper<Eventclass> rowMapper = new BeanPropertyRowMapper<Eventclass>(
				Eventclass.class);
		List<Eventclass> list = null;
		try {
			list = jdbcTemplate.query(sql, rowMapper);
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

	@Override
	public List queryDevBasicDao(String devId) {
		String sql = " SELECT * FROM imm_devinfo WHERE devid=? ";
		// jdbcTemplate.queryForList(sql,new Object[]{devId});
		List<Map<String, Object>> list = null;
		try {
			list = jdbcTemplate.queryForList(sql, devId);
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

	@SuppressWarnings({ "unchecked", "rawtypes", "null" })
	@Override
	public List<RowMapper> queryDevOrderbyUser(String userId) {
		String sql = " SELECT * FROM imm_devinfo WHERE devType='1' AND ownerId = ? ";
		RowMapper rowMapper = new BeanPropertyRowMapper(DeviceInfo.class);

		List<RowMapper> list = null;
		try {
			list = jdbcTemplate.query(sql, new Object[] { userId }, rowMapper);
		} catch (Exception e) {
			throw e;
		}

		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}
		return list;
	}

}
