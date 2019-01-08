package com.znyw.dao.impl;

import java.util.List;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.znyw.dao.DeleteDevice;
import com.znyw.tool.Objects;

@Repository("DeleteDevice")
public class DeleteDeviceDaoImp implements DeleteDevice {

	private Logger log = Logger.getLogger(getClass());

	@Resource
	JdbcTemplate jdbcTemplate;

	@Override
	public int DeleteZone(String devId) throws Exception {

		try {
			String sql = " DELETE FROM imm_devinfo WHERE devId=? ";
			int info = jdbcTemplate.update(sql, devId);
			String sqlCammer = " DELETE FROM imm_camera WHERE devId=? ";
			int cammer = jdbcTemplate.update(sqlCammer, devId);

			return info + cammer;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public int DeleteSpay(String devId, String devZoneId) throws Exception {
		try {
			String sql = " DELETE FROM imm_devzone WHERE devId=? and devZoneId=? ";
			int info = jdbcTemplate.update(sql,
					new Object[] { devId, devZoneId });
			return info;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public int DeleteBatchSpay(String devId, List<String> devZoneIds)
			throws Exception {
		try {
			String sql1 = " DELETE FROM imm_ownerzone WHERE devId=? and devZoneId in ('%s') ";
			int info1 = jdbcTemplate.update(
					String.format(sql1, Objects.Joiner("','", devZoneIds)),
					devId);
			String sql = " DELETE FROM imm_devzone WHERE devId=? and devZoneId in ('%s') ";
			int info = jdbcTemplate.update(
					String.format(sql, Objects.Joiner("','", devZoneIds)),
					devId);
			return info;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public int DeleteZoneBatch(List<String> devIds) throws Exception {

		try {
			String updateUserSQL = "DELETE o FROM imm_ownermonitor o LEFT JOIN imm_camera c ON o.devId=c.relateNVR AND o.devMonitorId=c.devMonitorId WHERE c.devId in ('%s')";
			int infoUser = jdbcTemplate.update(String.format(updateUserSQL,
					Objects.Joiner("','", devIds)));

			String sql = " DELETE FROM imm_devinfo WHERE devId in ('%s') ";
			int info = jdbcTemplate.update(String.format(sql,
					Objects.Joiner("','", devIds)));

			String sqlCammer = " DELETE FROM imm_camera WHERE devId in ('%s') ";
			int cammer = jdbcTemplate.update(String.format(sqlCammer,
					Objects.Joiner("','", devIds)));

			return info + cammer;
		} catch (Exception e) {
			throw e;
		}
	}
}
