package com.systemcfg.dao.imp;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.systemcfg.dao.DevTypeDao;

@Repository
public class DevTypeDaoImp implements DevTypeDao {
	private static final Logger LOGGER = LoggerFactory.getLogger(DevTypeDaoImp.class);
	private static final String TABLE_NAME = "imm_devtype";

	private static final String QUERY_SQL = "select * from " + TABLE_NAME;

	@Resource
	private JdbcTemplate jdbcTemplate;
	
	@Override
	public List<Map<String, Object>> listDevType() {
		try {
			return jdbcTemplate.queryForList(QUERY_SQL);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
		}
		return null;
	}
}
