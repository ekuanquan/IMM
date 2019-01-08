package com.znyw.dao.impl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/**
 * 系统配置相关操作
 */
import com.znyw.dao.SystemConfigDao;
import com.znyw.pojo.SysConfigUnitPojo;

@Repository("SystemConfigDao")
public class SystemConfigDaoImpl implements SystemConfigDao {

	private static Logger logger = Logger.getLogger(SystemConfigDaoImpl.class);

	@Resource
	JdbcTemplate jdbcTemplate;

	@Override
	public List<SysConfigUnitPojo> getSystemConfig() {
		String sql = "SELECT * FROM imm_systemconfig";
		try {
			List<SysConfigUnitPojo> list = jdbcTemplate.query(sql,
					new BeanPropertyRowMapper<SysConfigUnitPojo>(
							SysConfigUnitPojo.class));
			return list;

		} catch (EmptyResultDataAccessException e) {
			throw e;
		}
	}

	@Override
	public List<String> getListFromSystemConfig(String dataName) {
		String sql = "SELECT * FROM imm_systemconfig where dataName=?";
		Object[] param = new Object[] { dataName };
		try {

			List<SysConfigUnitPojo> list = jdbcTemplate.query(sql, param,
					new BeanPropertyRowMapper<SysConfigUnitPojo>(
							SysConfigUnitPojo.class));
			if (list == null || list.isEmpty()) {
				return null;
			}
			Iterator<SysConfigUnitPojo> ite = list.iterator();
			List<String> values = new ArrayList<String>();
			while (ite.hasNext()) {
				SysConfigUnitPojo pojo = ite.next();
				String dataValue = pojo.getDataValue();
				values.add(dataValue);
			}
			return values;

		} catch (EmptyResultDataAccessException e) {
			logger.error(e.getMessage(), e);
			return null;
		}
	}

	@Override
	public int delSystemConfig(String dataName, String values) {
		String sql = "DELETE FROM imm_systemconfig WHERE dataName=? AND dataValue IN(%s)";
		sql = String.format(sql, values);
		Object[] param = new Object[] { dataName };
		try {
			int row = jdbcTemplate.update(sql, param);
			return row;

		} catch (EmptyResultDataAccessException e) {
			logger.info("delSystemConfig has error. param is (" + dataName
					+ "," + values + ")");
			return -1;
		}
	}

	@Override
	public int delAllSystemConfig(String dataName) {
		String sql = "DELETE FROM imm_systemconfig WHERE dataName=?";
		sql = String.format(sql);
		Object[] param = new Object[] { dataName };
		try {
			int row = jdbcTemplate.update(sql, param);
			return row;

		} catch (EmptyResultDataAccessException e) {
			logger.info("delAllSystemConfig has error. param is (" + dataName
					+ ")");
			logger.error(e.getMessage(), e);
			return -1;
		}
	}

	@Override
	public int addSystemConfig(String dataName, String value) {
		String sql = "INSERT INTO imm_systemconfig(dataName,dataValue) VALUES(?,?)";
		Object[] param = new Object[] { dataName, value };
		try {
			int row = jdbcTemplate.update(sql, param);
			return row;

		} catch (EmptyResultDataAccessException e) {
			logger.info("addSystemConfig has error. param is (" + dataName
					+ "," + value + ")");
			return -1;
		}
	}

	@Override
	public int updateSystemConfig(String dataName, String value) {
		String sql = "UPDATE imm_systemconfig SET dataValue=? WHERE dataName=?";
		Object[] param = new Object[] { value, dataName };
		try {
			int row = jdbcTemplate.update(sql, param);
			return row;

		} catch (EmptyResultDataAccessException e) {
			logger.info("updateSystemConfig has error. param is (" + dataName
					+ "," + value + ")");
			logger.error(e.getMessage(), e);
			return -1;
		}
	}

}
