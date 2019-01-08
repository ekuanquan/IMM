package com.znyw.dao.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.znyw.dao.ValidateDao;
import com.znyw.tool.Objects;

@Repository("ValidateDao")
public class ValidateDaoImpl implements ValidateDao {

	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());
	@Resource
	private JdbcTemplate jdbcTemplate;

	@Override
	public boolean isUserIdCanUse(String userId) {
		String sql = "SELECT COUNT(userId) as num FROM imm_userinfo WHERE userId=?";

		try {
			/*Number number = jdbcTemplate.queryForObject(sql,
					new String[] { userId }, Integer.class);
			int count = (number != null ? number.intValue() : 0);*/

			List<Map<String,Object>> lists=jdbcTemplate.queryForList(sql,new String[] { userId });
			int count = Objects.isNull(lists)?0:Integer.valueOf(lists.get(0).get("num").toString());
			if (count > 0) {
				return false;
			} else {
				return true;
			}
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean isUserAccountCanUse(String userAccount) {
		String sql = "SELECT COUNT(userAccount) as num FROM imm_userinfo WHERE userAccount=?";

		try {
			/*Number number = jdbcTemplate.queryForObject(sql,
					new String[] { userAccount }, Integer.class);
			int count = (number != null ? number.intValue() : 0);*/

			List<Map<String,Object>> lists=jdbcTemplate.queryForList(sql,new String[] { userAccount });
			int count = Objects.isNull(lists)?0:Integer.valueOf(lists.get(0).get("num").toString());
			if (count > 0) {
				return false;
			} else {
				return true;
			}
		} catch (Exception e) {
			throw e;
		}
	}

	public boolean isDevIdCanUse(String devId) {
		String sql = "SELECT COUNT(devId) as num FROM imm_devinfo WHERE devId=?";

		try {
			/*Number number = jdbcTemplate.queryForObject(sql,
					new String[] { devId }, Integer.class);
			int count = (number != null ? number.intValue() : 0);*/

			List<Map<String,Object>> lists=jdbcTemplate.queryForList(sql,new String[] { devId });
			int count = Objects.isNull(lists)?0:Integer.valueOf(lists.get(0).get("num").toString());
			if (count > 0) {
				return false;
			} else {
				return true;
			}
		} catch (Exception e) {
			throw e;
		}
	}

}
