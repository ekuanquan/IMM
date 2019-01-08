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

import com.znyw.dao.DropDownDao;
import com.znyw.pojo.DropDownPojo;
import com.znyw.pojo.RoleZonePojo;
import com.znyw.tool.SetField;

@Repository("DropDownDao")
public class DropDownDaoImpl implements DropDownDao {

	private Logger log = Logger.getLogger(getClass());
	@Resource
	private JdbcTemplate jdbcTemplate;

	@Override
	public List<DropDownPojo> findBusinessInfo() {
		String sql = "SELECT businessId 'key',businessName 'value'  FROM imm_business";
		List<DropDownPojo> list = null;
		try {
			list = jdbcTemplate
					.query(sql, new BeanPropertyRowMapper<DropDownPojo>(
							DropDownPojo.class));
		} catch (Exception e) {
			throw e;
		}
		for (int i = 0; i < list.size(); i++) {
			SetField.reflect(list.get(i));
		}
		return list;
	}

	@Override
	public List<DropDownPojo> findUserServerType() {
		String sql = "SELECT userServerType 'key',userServerTypeName 'value'  FROM imm_userservertype";
		List<DropDownPojo> list = null;
		try {
			list = jdbcTemplate
					.query(sql, new BeanPropertyRowMapper<DropDownPojo>(
							DropDownPojo.class));
		} catch (Exception e) {
			throw e;
		}
		for (int i = 0; i < list.size(); i++) {
			try {
				SetField.reflect(list.get(i));
			} catch (Exception e) {
				throw e;
			}
		}
		return list;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public List<RoleZonePojo> findDevId(String roleId) {
		String sql = "SELECT distinct devId FROM imm_rolezone where roleId = ?";
		List<RoleZonePojo> list = null;
		try {
			list = jdbcTemplate.query(sql, new String[] { roleId },
					new BeanPropertyRowMapper(RoleZonePojo.class));
			return list;
		} catch (Exception e) {
			throw e;
		}
	}

	// 根据角色id 查询报警主机 设备id
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public List<RoleZonePojo> findAlarmDevId(String ownerId) throws Exception {
		List<RoleZonePojo> list = null;
		try {
			String sql = "SELECT devId from imm_devinfo where ownerId=? and devType in ('1','15') ";
			list = jdbcTemplate.query(sql, new String[] { ownerId },
					new BeanPropertyRowMapper(RoleZonePojo.class));
		} catch (Exception e) {
			throw e;
		}
		return list;
	}

	// 根据角色id 查询 NVR 设备id
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public List<RoleZonePojo> findNVRDevId(String roleId) throws Exception {
		List<RoleZonePojo> list = null;
		try {
			String sql = "SELECT DISTINCT imm_devinfo.devId FROM imm_devinfo WHERE imm_devinfo.ownerId = ? "
					+ " AND (imm_devinfo.devType ='9' OR imm_devinfo.devType ='10')";
			log.info("ownerId: " + roleId);
			list = jdbcTemplate.query(sql, new String[] { roleId },
					new BeanPropertyRowMapper(RoleZonePojo.class));
			return list;
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public List findMonitorByDevId(String devId) throws Exception {
		List list = null;
		try {
			String sql = "SELECT DISTINCT imm_devinfo.devId,imm_camera.devMonitorId "
					+ " FROM imm_devinfo LEFT JOIN imm_camera ON imm_devinfo.devId=imm_camera.devId"
					+ " WHERE imm_devinfo.relateNVR = ? ";
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

		} catch (Exception e) {
			throw e;
		}
		return list;
	}
}