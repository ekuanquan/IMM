package com.znyw.dao.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.EventSettingDao;
import com.znyw.tool.Objects;
import com.znyw.tool.SetField;

@Repository("EventSettingDao")
public class EventSettingDaoImpl implements EventSettingDao {

	private static Logger logger = Logger.getLogger(EventSettingDaoImpl.class);
	@Resource
	JdbcTemplate jdbcTemplate;

	@Override
	public List<Map<String, Object>> getEventSettingListDao(String userId,
			String ZoneCHFlag) {

		String sql = "SELECT UserEvtId,ownerId,ZoneCHFlag,ZoneCHValue,UserEvt,isVideo,cameraIdList,fMemo,contList FROM imm_ownerevtrecord WHERE ownerId = ? ";

		if (Objects.isNotNullString(ZoneCHFlag)) {
			sql = sql + "and ZoneCHFlag = " + ZoneCHFlag + " ";
		}
		try {
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,
					new Object[] { userId });
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
	public boolean delEventSettingDao(JSONArray userEvtList) {
		String sql = "DELETE FROM imm_ownerevtrecord WHERE UserEvtId = ? ";
		try {
			for (Object userEvtId : userEvtList) {
				jdbcTemplate.update(sql, new Object[] { userEvtId });
			}
			return true;
		} catch (Exception e) {
			throw e;
		}

	}

	@Override
	@Transactional
	public boolean editEventSettingDao(String userEvtId, String fMemo,
			String isVideo) {
		try {
			String sql = "UPDATE imm_ownerevtrecord set fMemo = ?,isVideo = ? where UserEvtId= ? ";
			jdbcTemplate
					.update(sql, new Object[] { fMemo, isVideo, userEvtId });
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings("rawtypes")
	@Override
	@Transactional
	public boolean addEventSettingDao(String userId, int isVideo,
			List addZoonIdList, List addUserMonitorIdList, String dataFrom) {
		try {
			String addEventSetting = "INSERT INTO imm_ownerevtrecord (UserEvtId,ownerId,ZoneCHFlag,ZoneCHValue,isVideo,dataFrom) VALUES (?,?,?,?,?,?) ";
			for (int i = 0; i < addZoonIdList.size(); i++) {
				JSONObject json = (JSONObject) addZoonIdList.get(i);
				String userEvtId = json.getString("UserEvtId");
				int zoneCHFlag = 0;
				String ZoneCHValue = json.getString("roleZoneName");
				jdbcTemplate.update(addEventSetting, new Object[] { userEvtId,
						userId, zoneCHFlag, ZoneCHValue, isVideo, dataFrom });
			}
			String addEventSetting2 = "INSERT INTO imm_ownerevtrecord (UserEvtId,ownerId,ZoneCHFlag,ZoneCHValue,isVideo,dataFrom) VALUES (?,?,?,?,?,?) ";
			for (int i = 0; i < addUserMonitorIdList.size(); i++) {
				JSONObject json = (JSONObject) addUserMonitorIdList.get(i);
				String UserEvtId2 = json.getString("UserEvtId");
				int zoneCHFlag2 = 1;
				String zoneCHValue2 = json.getString("userMonitorId");
				jdbcTemplate.update(addEventSetting2, new Object[] {
						UserEvtId2, userId, zoneCHFlag2, zoneCHValue2, isVideo,
						dataFrom });
			}
			return true;
		} catch (Exception e) {
			throw e;
		}

	}

	@Override
	public List<Map<String, Object>> getUserMonitorIdByCameraIdDao(
			String devId, String userId) {
		String sqlbefor = "SELECT imm_camera.devId 'cameraId',imm_camera.instDate,imm_camera.fMemo, "
				+ " imm_camera.cameraName, imm_camera.atPos,imm_camera.devChannelId,imm_ownermonitor.*, "
				+ " imm_camera.cameraType,imm_cameraType.cameraTypeName,imm_camera.almType,imm_almtype.almTypeName, "
				+ " imm_wantdo.wantDoName,imm_camera.wantDo,imm_camera.cameraModeId,imm_cameramodel.cameraModelName "
				+ " FROM imm_ownermonitor,imm_camera LEFT JOIN imm_cameraType  ON imm_camera.cameraType = "
				+ " imm_cameraType.cameraType LEFT JOIN imm_almtype  ON imm_camera.almType=imm_almtype.almType "
				+ " LEFT JOIN imm_wantdo  ON imm_camera.wantDo=imm_wantdo.wantDo LEFT JOIN imm_cameramodel "
				+ " ON imm_cameramodel.cameraModelId = imm_camera.cameraModeId WHERE imm_ownermonitor.ownerId "
				+ " = ? AND imm_camera.devId= ? AND imm_ownermonitor.devMonitorId = imm_camera.devMonitorId AND "
				+ "imm_ownermonitor.devId = imm_camera.relateNVR  ";
		try {
			List<Map<String, Object>> list = jdbcTemplate.queryForList(
					sqlbefor, userId, devId);
			for (int i = 0; i < list.size(); i++) {
				SetField.reflect(list.get(i));
			}
			return list;
		} catch (Exception e) {
			throw e;
		}

	}

	@Override
	public List<Map<String, Object>> getEvtCantListDao(String userEvtId) {
		String sql = "SELECT contList FROM imm_ownerevtrecord WHERE UserEvtId = ? ";
		try {
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,
					new Object[] { userEvtId });
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
	public boolean editEvtCantListDao(String userEvtId, String contList) {
		String sql = "UPDATE imm_ownerevtrecord set contList = ? where UserEvtId= ? ";
		try {
			jdbcTemplate.update(sql, contList, userEvtId);
			return true;
		} catch (Exception e) {
			throw e;
		}

	}

	@SuppressWarnings("rawtypes")
	@Override
	public boolean ListEditEvtCantListDao(List userEvtIdList, String contList) {
		String sql = "UPDATE imm_ownerevtrecord set contList = ? where UserEvtId= ? ";
		try {
			for (int i = 0; i < userEvtIdList.size(); i++) {
				String UserEvtId = (String) userEvtIdList.get(i);
				jdbcTemplate.update(sql, new Object[] { contList, UserEvtId });
			}
			return true;
		} catch (Exception e) {
			throw e;
		}

	}

	@Override
	public List<Map<String, Object>> getUserMonitorIdByUserIdDao(String userId) {
		String sqlbefor = "SELECT imm_camera.devId 'cameraId',imm_camera.instDate,imm_camera.fMemo, "
				+ " imm_camera.cameraName, imm_camera.atPos,imm_camera.devChannelId,imm_ownermonitor.*, "
				+ " imm_camera.cameraType,imm_cameraType.cameraTypeName,imm_camera.almType,imm_almtype.almTypeName, "
				+ " imm_wantdo.wantDoName,imm_camera.wantDo,imm_camera.cameraModeId,imm_cameramodel.cameraModelName "
				+ " FROM imm_ownermonitor,imm_camera LEFT JOIN imm_cameraType  ON imm_camera.cameraType = "
				+ " imm_cameraType.cameraType LEFT JOIN imm_almtype  ON imm_camera.almType=imm_almtype.almType "
				+ " LEFT JOIN imm_wantdo  ON imm_camera.wantDo=imm_wantdo.wantDo LEFT JOIN imm_cameramodel "
				+ " ON imm_cameramodel.cameraModelId = imm_camera.cameraModeId WHERE imm_ownermonitor.ownerId "
				+ " = ? AND imm_ownermonitor.devMonitorId = imm_camera.devMonitorId AND imm_ownermonitor.devId = imm_camera.relateNVR  ";
		try {
			List<Map<String, Object>> listbefor = jdbcTemplate.queryForList(
					sqlbefor, userId);
			for (int i = 0; i < listbefor.size(); i++) {
				SetField.reflect(listbefor.get(i));
			}
			return listbefor;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean checkSvaeLinkageSettingDao(String userEvtId, String cameraId) {
		String sql = "UPDATE imm_ownerevtrecord set cameraIdList = ? where UserEvtId= ? ";
		try {
			jdbcTemplate.update(sql, cameraId, userEvtId);
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings("rawtypes")
	@Override
	public boolean hookSaveLinkageSettingDao(List UserEvtIdList, String cameraId) {
		String sql = "UPDATE imm_ownerevtrecord set cameraIdList = ? where UserEvtId= ? ";
		try {
			for (int i = 0; i < UserEvtIdList.size(); i++) {
				String UserEvtId = (String) UserEvtIdList.get(i);
				jdbcTemplate.update(sql, cameraId, UserEvtId);
			}
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

}
