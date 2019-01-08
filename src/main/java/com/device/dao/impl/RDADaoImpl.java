package com.device.dao.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.device.dao.IRDADao;
import com.znyw.pojo.Relatinfor;
import com.znyw.tool.IJdbcTemplate;
import com.znyw.tool.SetField;

@Repository
public class RDADaoImpl implements IRDADao {

	private final Logger log = LoggerFactory.getLogger(this.getClass());

	@Resource
	IJdbcTemplate ijdbcTemplate;

	@Override
	public JSONObject getDevUserInfoByUidRzoneCid(String userId, String roleZoneName, String codeId) throws Exception {

		String strSQL = "";
		if (roleZoneName != null) {
			strSQL = " SELECT a.userId AS accountNum,a.userName AS accountName,b.userAddr AS accountAddr, "
					+ "b.usrAlmType AS usrAlmType,a.areaId AS areaId, c.codeId AS sysCode,c.codeMemo AS eventDesc, "
					+ "c.codeTypeId AS codeTypeId,c.evtWay AS evtWay,d.devId AS devId,d.devType AS devType,d.devZoneId AS devZoneId, "
					+ "d.atPos AS zoneAtPos,d.snType AS snType,imm_sntype.snTypeName,d.almType AS almType, "
					+ "imm_almtype.almTypeName,d.wantDo AS wantDo,imm_wantdo.wantDoName, l.snModelName AS snModelName, "
					+ "e.areaName AS areaName, f.devModelName AS devModelName, g.ownerZoneName AS accountZone, "
					+ "i.codeType AS codeType,j.cameraName,j.atPos,j.devMonitorId AS cameraModelId,k.ownerMonitorId "
					+ "FROM imm_userinfo a,imm_customerattr b,imm_syscode c, imm_devzone d "
					+ "LEFT JOIN imm_sntype ON imm_sntype.snType = d.snType "
					+ "LEFT JOIN imm_wantdo ON imm_wantdo.wantDo = d.wantDo "
					+ "LEFT JOIN imm_almtype on imm_almtype.almType = d.almType "
					+ "LEFT JOIN imm_snmodel l ON d.snModeId=l.snModelId,imm_area e,imm_devmodel f, "
					+ "imm_ownerzone g,imm_devinfo h LEFT JOIN imm_camera j ON h.devId=j.devId "
					+ "LEFT JOIN imm_ownermonitor k ON h.devId=k.devId,imm_codetype i "
					+ "WHERE a.userId=b.userId AND g.ownerId=a.userId AND d.devId=g.devId AND d.devZoneId=g.devZoneId "
					+ "AND e.areaId=a.areaId AND h.devId=g.devId AND f.devModelId=h.devModelId AND c.codeTypeId=i.codeTypeId "
					+ " AND a.userId='" + userId + "' AND c.codeId='" + codeId + "' AND g.ownerZoneName='"
					+ roleZoneName + "'";
		} else {
			strSQL = "SELECT a.userId as accountNum,a.userName as accountName,b.userAddr as accountAddr,a.areaId as areaId, "
					+ "c.codeId as sysCode,c.codeMemo as eventDesc,c.codeTypeId as codeTypeId,c.evtWay as evtWay, "
					+ "e.areaName as areaName, " + "i.codeType as codeType "
					+ "FROM imm_userinfo a,imm_customerattr b,imm_syscode c,imm_area e,imm_codetype i "
					+ "WHERE a.userId=b.userId AND e.areaId=a.areaId AND c.codeTypeId=i.codeTypeId " + "AND a.userId='"
					+ userId + "' AND c.codeId='" + codeId + "'";
		}

		try {
			Relatinfor info = ijdbcTemplate.queryForObject(strSQL, new BeanPropertyRowMapper<>(Relatinfor.class));
			if (info == null) {
				return null;
			}
			SetField.reflect(info);
			JSONObject Associatedjson = (JSONObject) JSONObject.toJSON(info);
			return Associatedjson;
		} catch (DataAccessException e) {
			throw e;
		}
	}

	@Override
	public JSONArray getCameraListByUid(String ownerId) throws Exception {
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
			List<Map<String, Object>> listbefor = ijdbcTemplate.queryForList(sqlbefor, new Object[] { ownerId });
			for (int i = 0; i < listbefor.size(); i++) {
				SetField.reflect(listbefor.get(i));
			}
			String jsonText = JSON.toJSONString(listbefor, true);
			JSONArray jsonArr = JSON.parseArray(jsonText);
			return jsonArr;
		} catch (Exception e) {
			throw e;
		}
	}
}
