package com.znyw.dao.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.znyw.dao.SMSDao;
import com.znyw.tool.Objects;

@Repository
public class SMSDaoImpl implements SMSDao {
	private static final Logger logger = LoggerFactory
			.getLogger(SMSDaoImpl.class);
	@Resource
	private JdbcTemplate jdbcTemplate;

	@Override
	public String getPhoneByDevId(String devId) throws Exception {
		String sql = "SELECT cu.cMobile cMobile FROM imm_customerattr cu,imm_devinfo dev WHERE devId=? AND dev.ownerId = cu.userId";
		String phone = null;
		try {
			/*phone = jdbcTemplate.queryForObject(sql, new Object[] { devId },
					String.class);*/

			List<Map<String,Object>> lists=jdbcTemplate.queryForList(sql, new Object[] {devId});
			phone = Objects.isNull(lists)?null:lists.get(0).get("cMobile").toString();
		} catch (Exception e) {
			if (e instanceof EmptyResultDataAccessException)
				throw new Exception("设备[" + devId + "]未找到相应用户电话.");
			else
				throw e;
		}
		return phone;
	}

}
