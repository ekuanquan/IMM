package com.device.dao.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;

//import com.znyw.tool.IJdbcTemplate;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.device.dao.IQueryDevDao;
import com.systemcfg.dao.AssembleCfgDao;
import com.znyw.pojo.AlarmhostPojo;
import com.znyw.pojo.CameraInfo;
import com.znyw.pojo.ZoneInfo;
import com.znyw.tool.IJdbcTemplate;
import com.znyw.tool.Objects;
import com.znyw.tool.SetField;

@Repository
public class QueryDevDaoImpl implements IQueryDevDao {
	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Resource
	private IJdbcTemplate ijdbcTemplate;
	@Resource
	private AssembleCfgDao assembleCfgDao;

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public List<AlarmhostPojo> queAlarmhostList(String isowner, String areaId, String key, String queryId, String sort, String platformId, String outDevId,
			int index, int size) throws Exception {

		String strSQL = "";
		queryId = "".equals(queryId) ? " 1=1"
				: String.format(" ( locate('%s',a.devId)>0 or  locate('%s',a.devName)>0 )", queryId, queryId);
		String platSql = "".equals(platformId) ? "":" and a.platformId='" + platformId  + "'";
		String outDevIdSql="".equals(outDevId) ? "":" and a.devId <> '" + outDevId  + "'";

		// have 是查询所有设备，no 是查询无主设备
		if ("have".equals(isowner)) {
			strSQL = " SELECT a.devId,a.devState,a.devName,a.pnlActID,a.areaId,a.devType,a.devModelId,a.instMan,a.devInstDate,a.devLng,a.devlat,a.pnlAddr,a.instUnit,a.fMemo,a.platformId,f.platform_name as platformName,"
					+ " b.passCode,b.devIndex,b.telAddr,b.pnlTel,b.keyboardAddr,b.pnlPowerAddr,b.pnlHdTel,b.RegexPWD,c.areaName,d.devTypeName ,e.devModelName "
					+ " FROM imm_devinfo a, imm_alarmhostattr b, imm_area c, imm_devtype d, imm_devmodel e,imm_assemble_cfg f "
					+ " WHERE a.devType=1 " + areaId + platSql + outDevIdSql
					+ " AND a.devId = b.devId AND a.areaId = c.areaId AND a.devType = d.devType AND a.devModelId = e.devModelId AND "
					+ queryId + " and a.platformId=f.platform_id ORDER BY a.devId " + sort + " LIMIT " + index + ","
					+ size;
		} else {
			String localPlatformId = assembleCfgDao.getLocalPlatformId();
			strSQL = " SELECT a.devId,a.devState,a.devName,a.pnlActID,a.areaId,a.devType,a.devModelId,a.instMan,a.devInstDate,a.devLng,a.devlat,a.pnlAddr,a.instUnit,a.fMemo,a.platformId,f.platform_name as platformName,"
					+ " b.passCode,b.devIndex,b.telAddr,b.pnlTel,b.keyboardAddr,b.pnlPowerAddr,b.pnlHdTel,b.RegexPWD,c.areaName,d.devTypeName ,e.devModelName "
					+ " FROM imm_devinfo a, imm_alarmhostattr b, imm_area c, imm_devtype d, imm_devmodel e,imm_assemble_cfg f "
					+ " WHERE a.devType=1 " + areaId
					+ " AND a.devId = b.devId AND a.areaId = c.areaId AND a.devType = d.devType AND a.devModelId = e.devModelId AND (a.ownerId='' OR a.ownerId IS  NULL ) AND "
					+ queryId + "  and a.platformId=f.platform_id and a.platformId='" + localPlatformId
					+ "' ORDER BY a.devId " + sort + " LIMIT " + index + "," + size;
		}

		try {
			List<AlarmhostPojo> list = ijdbcTemplate.query(strSQL, new BeanPropertyRowMapper(AlarmhostPojo.class));
			return list;
		} catch (DataAccessException e) {
			throw e;
		}
	}

	@Override
	public int queAlarmhostListTotalNum(String areaId, String key, String queryId, String isowner, String platformId, String outDevId) throws Exception {

		String strSQL = "";

		queryId = "".equals(queryId) ? " 1=1"
				: String.format(" ( locate('%s',a.devId)>0 or  locate('%s',a.devName)>0 )", queryId, queryId);
		String platSql = "".equals(platformId) ? "":" and a.platformId='" + platformId  + "'";
		String outDevIdSql="".equals(outDevId) ? "":" and a.devId <> '" + outDevId  + "'";

		// have 是查询所有设备，否则查询无主设备，查询无主设备只能查询本平台的无主设备
		if ("have".equals(isowner)) {
			strSQL = " SELECT count(*) FROM imm_devinfo a, imm_alarmhostattr b, imm_area c, imm_devtype d, imm_devmodel e,imm_assemble_cfg f "
					+ " WHERE a.devType=1 " + areaId + platSql + outDevIdSql  
					+ " AND a.devId = b.devId AND a.areaId = c.areaId AND a.devType = d.devType AND a.devModelId = e.devModelId AND "
					+ queryId + " and a.platformId=f.platform_id ORDER BY a.devId ";
		} else {
			String localPlatformId = assembleCfgDao.getLocalPlatformId();
			strSQL = " SELECT count(*) FROM imm_devinfo a, imm_alarmhostattr b, imm_area c, imm_devtype d, imm_devmodel e,imm_assemble_cfg f "
					+ " WHERE a.devType=1 " + areaId
					+ " AND a.devId = b.devId AND a.areaId = c.areaId AND a.devType = d.devType AND a.devModelId = e.devModelId AND (a.ownerId='' OR a.ownerId IS  NULL ) AND "
					+ queryId + "  and a.platformId=f.platform_id and a.platformId='" + localPlatformId
					+ "' ORDER BY a.devId ";
		}

		try {
			//int num = ijdbcTemplate.queryForObject(strSQL, Integer.class);
			//return num;
			
			List<Map<String,Object>> lists=ijdbcTemplate.queryForList(strSQL);
			return Objects.isNull(lists)?0:Integer.valueOf(lists.get(0).get("count(*)").toString());
		} catch (DataAccessException e) {
			throw e;
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public JSONArray queryAlarmhostZoneList(String devId) throws Exception {

		String strSQL = " SELECT a.devId,a.devzoneId,a.snModeId as snModelId,f.snModelName,a.atPos,a.wantDo,a.almType,a.snNum,a.snType,a.instDate,a.liveDate,"
				+ "a.x,a.y,a.fMemo," + "c.snTypeName,d.wantDoName,e.almTypeName FROM imm_devzone a"
				+ " LEFT JOIN imm_sntype c ON a.snType = c.snType  " + " LEFT JOIN imm_wantdo d ON a.wantDo = d.wantDo "
				+ " LEFT JOIN imm_almtype e ON a.almType = e.almType LEFT JOIN imm_snmodel f ON f.snModelId=a.snModeId  WHERE devId='"
				+ devId + "'";

		try {
			List<ZoneInfo> total_list = ijdbcTemplate.query(strSQL, new BeanPropertyRowMapper(ZoneInfo.class));
			for (int i = 0; i < total_list.size(); i++) {
				SetField.reflect(total_list.get(i));
			}
			String jsonText = JSON.toJSONString(total_list, true);
			JSONArray jsonArr = JSON.parseArray(jsonText);
			return jsonArr;
		} catch (DataAccessException e) {
			throw e;
		}
	}

	@Override
	public JSONObject queryAlarmhostZoneInfo(String devId, String devZoneId) throws Exception {

		String strSQL = "SELECT b.snModelName,c.almTypeName,d.snTypeName,e.wantDoName,a.* FROM imm_devzone a "
				+ "LEFT JOIN imm_snmodel b ON a.snModeId =b.snModelId  "
				+ "LEFT JOIN imm_almtype c ON a.almType = c.almType " + "LEFT JOIN imm_sntype d ON a.snType = d.snType "
				+ "LEFT JOIN imm_wantdo e ON a.wantDo = e.wantDo  WHERE devId=? AND devZoneId=?";

		try {
			List<Map<String, Object>> total_list = ijdbcTemplate.queryForList(strSQL, devId, devZoneId);
			int num = total_list.size();
			if (num == 0) {
				return new JSONObject();
			} else if (num == 1) {
				String jsonText = JSON.toJSONString(total_list, true);
				JSONArray jsonArr = JSON.parseArray(jsonText);
				return jsonArr.getJSONObject(0);
			} else {
				return null;
			}
		} catch (DataAccessException e) {
			throw e;
		}
	}

	@Override
	public JSONObject queryDevInfo(String devId) throws Exception {

		String strSQL = " SELECT * FROM imm_devinfo WHERE devId=?";

		try {
			List<Map<String, Object>> total_list = ijdbcTemplate.queryForList(strSQL, devId);
			int num = total_list.size();
			if (num == 0) {
				return null;
			} else if (num == 1) {
				String jsonText = JSON.toJSONString(total_list, true);
				JSONArray jsonArr = JSON.parseArray(jsonText);
				return jsonArr.getJSONObject(0);
			} else {
				return null;
			}
		} catch (DataAccessException e) {
			throw e;
		}
	}

	@Override
	public AlarmhostPojo queryAlarmhostInfo(String devId) throws Exception {

		String strSQL = "SELECT a.ownerId,a.devId,a.devState,a.devName,a.pnlActID,a.areaId,a.devType,a.devModelId,a.instMan,a.devInstDate,a.devLng,a.devlat,a.pnlAddr,a.instUnit,a.fMemo,a.manufacturer,a.platformId,f.platform_name AS platformName,"
				+ "b.devIndex,b.telAddr,b.pnlTel,b.keyboardAddr,b.pnlPowerAddr,b.pnlHdTel,b.RegexPWD,c.areaName,d.devModelName "
				+ "FROM imm_devinfo a, imm_alarmhostattr b,imm_area c,imm_devmodel d ,imm_assemble_cfg f WHERE a.devId='"
				+ devId
				+ "' and a.platformId=f.platform_id AND a.devType=1 AND a.devId = b.devId AND c.areaId=a.areaId AND a.devModelId=d.devModelId";

		try {
			AlarmhostPojo info = ijdbcTemplate.queryForObject(strSQL, new BeanPropertyRowMapper<>(AlarmhostPojo.class));
			logger.info("queryAlarmhostInfo suc devId={},reIsNull={}", devId, info == null ? "Null" : "noNull");
			return info;
		} catch (DataAccessException e) {
			throw e;
		}
	}

	@Override
	public JSONObject queryWirenvrInfo(String devId) throws Exception {

		String strSQL = " SELECT a.ownerId,a.devId,a.devName,a.pnlActID,a.areaId,a.devType,a.devModelId,a.instMan,a.devInstDate,"
				+ "a.devLng,a.devlat,a.pnlAddr,a.instUnit,a.fMemo,a.relateNVR,a.manufacturer,a.define5 as gbId,"
				+ " b.devLoginName,b.devLoginPwd,b.devIp,b.videoServer,b.devPort,c.ChannelNum,d.areaName,e.devModelName,a.platformId,f.platform_name as platformName "
				+ " FROM imm_devinfo a, imm_wirenvrattr b, imm_devmodel c,imm_area d,imm_devmodel e,imm_assemble_cfg f"
				+ " WHERE a.devId=? AND a.devType=9 AND a.devId = b.devId AND a.devModelId = c.devModelId AND a.areaId = d.areaId AND a.devModelId=e.devModelId and a.platformId=f.platform_id ";

		try {
			List<Map<String, Object>> total_list = ijdbcTemplate.queryForList(strSQL, devId);
			int num = total_list.size();
			if (num == 0) {
				return new JSONObject();
			} else if (num == 1) {
				Objects.setNull2EmptyString(total_list);
				String jsonText = JSON.toJSONString(total_list, true);
				JSONArray jsonArr = JSON.parseArray(jsonText);
				return jsonArr.getJSONObject(0);
			} else {
				return null;
			}
		} catch (DataAccessException e) {
			throw e;
		}
	}

	@Override
	public JSONObject queryNetnvrInfo(String devId) throws Exception {

		String strSQL = "SELECT a.ownerId,a.devId,a.pnlAddr,a.devName,a.pnlActID,a.areaId,a.devType,a.devModelId,"
				+ "a.instMan,a.devInstDate,a.devLng,a.devlat,a.pnlAddr,a.instUnit,a.fMemo,a.relateNVR,a.manufacturer,a.define5 as gbId,"
				+ "b.devLoginName,b.devLoginPwd,b.devTUTKID,b.videoServer,c.ChannelNum,d.areaName,c.devModelName,a.platformId,f.platform_name as platformName "
				+ "FROM imm_devinfo a, imm_netnvrattr b, imm_devmodel c,imm_area d,imm_assemble_cfg f WHERE a.devId=? AND a.devType=10 AND a.devId = b.devId AND a.devModelId = c.devModelId AND a.areaId=d.areaId and a.platformId=f.platform_id  ";
		try {
			List<Map<String, Object>> total_list = ijdbcTemplate.queryForList(strSQL, devId);
			int num = total_list.size();
			if (num == 0) {
				return new JSONObject();
			} else if (num == 1) {
				Objects.setNull2EmptyString(total_list);
				String jsonText = JSON.toJSONString(total_list, true);
				JSONArray jsonArr = JSON.parseArray(jsonText);
				return jsonArr.getJSONObject(0);
			} else {
				return null;
			}
		} catch (DataAccessException e) {
			throw e;
		}
	}

	@Override
	public JSONArray queryCameraListByRelateNVR(String relateNVR) throws Exception {

		String strSQL = "SELECT a.* FROM imm_camera a LEFT JOIN imm_devinfo b ON a.devId=b.devId WHERE b.relateNVR=? AND (b.devType = 11 OR b.devType = 12 )";
		try {
			List<Map<String, Object>> total_list = ijdbcTemplate.queryForList(strSQL, relateNVR);
			String jsonText = JSON.toJSONString(total_list, true);
			JSONArray jsonArr = JSON.parseArray(jsonText);
			return jsonArr;
		} catch (DataAccessException e) {
			throw e;
		}
	}

	@Override
	public JSONArray queryDeviceId(String relateNVR, String channelNo) throws Exception {

		String strSQL = "SELECT camera.* FROM imm_camera camera, (SELECT devId FROM imm_devinfo dev WHERE relateNVR=?) dev WHERE camera.devId=dev.devId AND devChannelId =?";
		try {
			List<Map<String, Object>> total_list = ijdbcTemplate.queryForList(strSQL, relateNVR, channelNo);
			String jsonText = JSON.toJSONString(total_list, true);
			JSONArray jsonArr = JSON.parseArray(jsonText);
			return jsonArr;
		} catch (DataAccessException e) {
			throw e;
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public JSONObject queryCameraInfoByDevId(String devId, String flag) throws Exception {

		String strSQL = " SELECT devinfo.define5 as gbId,a.*,b.cameraModelName,c.cameraTypeName,d.wantDoName,imm_almtype.almTypeName FROM imm_camera a "
				+ " LEFT JOIN imm_cameramodel b ON a.cameraModeId=b.cameraModelId "
				+ " LEFT JOIN imm_cameraType c ON a.cameraType=c.cameraType"
				+ " LEFT JOIN imm_wantdo d ON a.wantDo=d.wantDo"
				+ " LEFT JOIN imm_almtype ON a.almType = imm_almtype.almType"
				+ " LEFT JOIN imm_devinfo devinfo ON a.devId=devinfo.devId  WHERE a.devId='" + devId + "'";

		try {
			List<CameraInfo> total_list = ijdbcTemplate.query(strSQL, new BeanPropertyRowMapper(CameraInfo.class));
			SetField.reflect(total_list.get(0));
			int num = total_list.size();
			if (num == 0) {
				if ("alowNull".equals(flag)) {
					return null;
				} else {
					return new JSONObject();
				}
			} else if (num == 1) {
				String jsonText = JSON.toJSONString(total_list, true);
				JSONArray jsonArr = JSON.parseArray(jsonText);
				return jsonArr.getJSONObject(0);
			} else {
				return null;
			}
		} catch (DataAccessException e) {
			throw e;
		}
	}

	@Override
	public JSONArray queryAlmtypeList() throws Exception {

		String strSQL = "SELECT * FROM imm_almtype ";
		try {
			List<Map<String, Object>> total_list = ijdbcTemplate.queryForList(strSQL);
			String jsonText = JSON.toJSONString(total_list, true);
			JSONArray jsonArr = JSON.parseArray(jsonText);
			return jsonArr;
		} catch (DataAccessException e) {
			throw e;
		}
	}

	@Override
	public JSONArray queryWanttoList() throws Exception {

		String strSQL = "SELECT * FROM imm_wantdo ";
		try {
			List<Map<String, Object>> total_list = ijdbcTemplate.queryForList(strSQL);
			String jsonText = JSON.toJSONString(total_list, true);
			JSONArray jsonArr = JSON.parseArray(jsonText);
			return jsonArr;
		} catch (DataAccessException e) {
			logger.error("queryWanttoList err e={}", e.toString());
			return null;
		}
	}

	@Override
	public JSONArray queryCameraModelList() throws Exception {

		String strSQL = "SELECT * FROM imm_cameramodel ";
		try {
			List<Map<String, Object>> total_list = ijdbcTemplate.queryForList(strSQL);
			String jsonText = JSON.toJSONString(total_list, true);
			JSONArray jsonArr = JSON.parseArray(jsonText);
			logger.info("queryCameraModelList suc totalNum={}", total_list.size());
			return jsonArr;
		} catch (DataAccessException e) {
			throw e;
		}
	}

	@Override
	public JSONArray queryCameraTypeList() throws Exception {
		String strSQL = "SELECT * FROM imm_cameratype ";
		try {
			List<Map<String, Object>> total_list = ijdbcTemplate.queryForList(strSQL);
			String jsonText = JSON.toJSONString(total_list, true);
			JSONArray jsonArr = JSON.parseArray(jsonText);
			return jsonArr;
		} catch (DataAccessException e) {
			throw e;
		}

	}

	@Override
	public JSONObject queryCameraTypeById(String cameraType) throws Exception {

		String strSQL = String.format("SELECT * FROM imm_cameratype where cameraType = %s", cameraType);
		try {
			List<Map<String, Object>> total_list = ijdbcTemplate.queryForList(strSQL);

			if (!total_list.isEmpty()) {
				String jsonText = JSON.toJSONString(total_list.get(0), true);
				JSONObject object = JSON.parseObject(jsonText);
				logger.info("queryCameraTypeById suc totalNum={}", total_list.size());
				return object;
			}

		} catch (DataAccessException e) {
			throw e;
		}
		return null;
	}

	@Override
	public JSONArray querySnmodelList() throws Exception {

		String strSQL = "SELECT * FROM imm_snmodel ";
		try {
			List<Map<String, Object>> total_list = ijdbcTemplate.queryForList(strSQL);
			String jsonText = JSON.toJSONString(total_list, true);
			JSONArray jsonArr = JSON.parseArray(jsonText);
			return jsonArr;
		} catch (DataAccessException e) {
			throw e;
		}
	}

	@Override
	public JSONArray querySntypeList() throws Exception {

		String strSQL = "SELECT * FROM imm_sntype ";
		try {
			List<Map<String, Object>> total_list = ijdbcTemplate.queryForList(strSQL);
			String jsonText = JSON.toJSONString(total_list, true);
			JSONArray jsonArr = JSON.parseArray(jsonText);
			logger.info("querySntypeList suc totalNum={}", total_list.size());
			return jsonArr;
		} catch (DataAccessException e) {
			throw e;
		}
	}

	@Override
	public String queSnmodelNameByDid(int snModelId) throws Exception {

		String strSQL = "SELECT snModelName FROM imm_snmodel WHERE snModelId = ?" ;
		try {
			/*String snModelName = ijdbcTemplate.queryForObject(strSQL, String.class);
			logger.info("queDmodelNameByDid suc,snModelId={}", snModelId);
			return snModelName;*/
			List<Map<String,Object>> lists=ijdbcTemplate.queryForList(strSQL, snModelId);
			return Objects.isNull(lists)?null:lists.get(0).get("snModelName").toString();
		} catch (DataAccessException e) {
			throw e;
		}
	}
}