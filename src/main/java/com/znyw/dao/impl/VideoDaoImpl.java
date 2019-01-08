package com.znyw.dao.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.znyw.dao.VideoDao;
import com.znyw.pojo.NVRVideoPojo;
import com.znyw.tool.Objects;
import com.znyw.tool.SetField;

@Repository("VideoDao")
public class VideoDaoImpl implements VideoDao {

	private Logger log = Logger.getLogger(getClass());

	@Resource
	private JdbcTemplate jdbcTemplate;

	@Override
	public List<NVRVideoPojo> findNVRVideoByUserId(String[] cameraIdArry)
			throws Exception {
		String sql = "SELECT imm_camera.devId 'cameraId',imm_camera.cameraName 'cameraName',imm_netnvrattr.devLoginName 'devLoginName', "
				+ "imm_netnvrattr.devLoginPwd 'devLoginPwd', imm_camera.devChannelId 'devChannelId', "
				+ "imm_netnvrattr.devTUTKID 'devTUTKID',imm_camera.videoServer, imm_camera.videoUrlSuf, "
				+ "imm_devinfo.manufacturer,imm_devinfo.devType,imm_wirenvrattr.devLoginName 'wireDevLoginName', "
				+ "imm_wirenvrattr.devLoginPwd 'wireDevLoginPwd',imm_wirenvrattr.devIp 'wireDevIp', "
				+ "imm_wirenvrattr.devPort 'wireDevPort',nvrDevinfo.devType 'nvrDevType' FROM imm_camera "
				+ "LEFT JOIN imm_devinfo ON imm_devinfo.devId = imm_camera.devId "
				+ "LEFT JOIN imm_netnvrattr ON imm_netnvrattr.devId = imm_devinfo.relateNVR "
				+ "LEFT JOIN imm_wirenvrattr ON imm_wirenvrattr.devId = imm_devinfo.relateNVR "
				+ "LEFT JOIN imm_devinfo nvrDevinfo ON nvrDevinfo.devId = imm_devinfo.relateNVR ";
		List<NVRVideoPojo> list = null;


		for (int i = 0; i < cameraIdArry.length; i++) {
			String cameraId = cameraIdArry[i];
			if (i == 0) {
				sql = sql + "WHERE imm_camera.devId = " + cameraId;
			} else {
				sql = sql + " OR imm_camera.devId = " + cameraId;
			}
		}
		if (cameraIdArry.length > 0) {
			try {
				list = jdbcTemplate.query(sql,
						new BeanPropertyRowMapper<NVRVideoPojo>(
								NVRVideoPojo.class));
			} catch (Exception e) {
				throw e;
			}
		}

		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}
		return list;
	}

	@Override
	public String getCameraIdList(String userId, String zoneCHValue,
			String zoneCHFlag) {
		String sql = "SELECT cameraIdList FROM imm_ownerevtrecord "
				+ "WHERE isVideo = '1' AND ownerId =? AND ZoneCHFlag =? AND ZoneCHValue =? ";

		try {
			List<Map<String, Object>> lists = jdbcTemplate.queryForList(sql,
					new Object[] { userId, zoneCHFlag, zoneCHValue });
			return Objects.isNull(lists) ? null : lists.get(0).get("cameraIdList").toString();

		} catch (Exception e) {
			throw e;
		}
	}
	
	public List<Map<String, Object>> getCameraByDevIds(List<String> devIds)
			throws Exception {

		String sql = "select * from imm_camera where relateNVR in ('%s')";
		try {
			return jdbcTemplate.queryForList(String.format(sql,
					Objects.Joiner("','", devIds)));
		} catch (Exception e) {
			throw e;
		}
	}
	public String getCurrentMaxOwnerMonitorId(String ownerId) throws Exception {
		String sql = "select max(ownerMonitorId) from imm_ownerMonitor where ownerId=?";
		try {
			List<Map<String, Object>> lists = jdbcTemplate.queryForList(sql,
					ownerId);

			String maxMonitorId = "0000";

			if (Objects.isNotNull(lists)
					&& Objects
							.isNotNull(lists.get(0).get("max(ownerMonitorId)"))) {

				maxMonitorId = lists.get(0).get("max(ownerMonitorId)").toString();
			}
			return maxMonitorId;
		} catch (Exception e) {
			throw e;
		}
	}
}
