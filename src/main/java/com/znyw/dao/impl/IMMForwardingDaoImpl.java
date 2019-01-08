package com.znyw.dao.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.IMMForwardingDao;
import com.znyw.pojo.UserEvtRecordPojo;
import com.znyw.tool.Objects;
import com.znyw.tool.SetField;

@Repository("IMMForwardingDao")
public class IMMForwardingDaoImpl implements IMMForwardingDao {

	@Resource
	JdbcTemplate jdbcTemplate;

	@Override
	public JSONObject getEvtSettingDao(String userId, String ZoneCHFlag,
			String ZoneCHValue) {
		String sql = "SELECT isVideo,cameraIdList,contList FROM imm_ownerevtrecord "
				+ "WHERE ownerId =? AND ZoneCHFlag =? AND ZoneCHValue =? ";

		try {
			List<UserEvtRecordPojo> list = jdbcTemplate.query(sql,
					new Object[] { userId, ZoneCHFlag, ZoneCHValue },
					new BeanPropertyRowMapper<UserEvtRecordPojo>(
							UserEvtRecordPojo.class));
			for (int i = 0; i < list.size(); i++) {
				SetField.reflect(list.get(i));
			}
			if (list.size() > 0) {
				UserEvtRecordPojo strjson = list.get(0);
				JSONObject json = (JSONObject) JSONObject.toJSON(strjson);
				return json;
			}
			return null;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public Map<String, Object> getUrlDao(String cameraId) throws Exception {
		String sql = "SELECT cameraName,videoServer,videoUrlSuf FROM imm_camera WHERE devId = ?";
		try {
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,
					new Object[] { cameraId });

			if (Objects.isNotNull(list)) {
				return list.get(0);
			}
			throw new Exception(
					"查询结果为空,SELECT cameraName,videoServer,videoUrlSuf FROM imm_camera WHERE devId =? ,para :"
							+ cameraId);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public String getTimeLengthDao() {
		String sqlString = "SELECT dataValue FROM imm_systemconfig WHERE dataName = 'recordShootLen'";
		try {
			/*String time = jdbcTemplate.queryForObject(sqlString, String.class);
			return time;*/
			List<Map<String,Object>> lists=jdbcTemplate.queryForList(sqlString);
			return Objects.isNull(lists)?null:lists.get(0).get("dataValue").toString();
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map<String, Object>> getIsRecordShootDao() {
		String sql = "SELECT dataValue FROM imm_systemconfig WHERE dataName = 'isRecordShoot' ";
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
	public List<Map<String, Object>> getLinkageDao() {
		String sql = "SELECT dataValue FROM imm_systemconfig WHERE dataName = 'linkage'";
		List<Map<String, Object>> list = null;
		try {
			list = jdbcTemplate.queryForList(sql);
			for (int i = 0; i < list.size(); i++) {
				SetField.reflect(list.get(i));
			}
			return list;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public String getMobileDao(String userId, String contId) {
		String sqlString = "SELECT cphone1 FROM imm_usercont WHERE userId = ? AND contId = ? ";
		try {
			/*String mobile = jdbcTemplate.queryForObject(sqlString,
					new String[] { userId, contId }, String.class);
			return mobile;*/
			List<Map<String,Object>> lists=jdbcTemplate.queryForList(sqlString, new Object[] {userId, contId });
			return Objects.isNull(lists)?null:lists.get(0).get("cphone1").toString();
		} catch (Exception e) {
			throw e;
		}
	}

}
