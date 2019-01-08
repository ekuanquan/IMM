package com.znyw.dao.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.znyw.dao.UserPlanEventDao;
import com.znyw.pojo.UserPlanEventPojo;
import com.znyw.tool.Objects;

@Repository
public class UserPlanEventDaoImpl implements UserPlanEventDao {
	private static Logger logger = Logger.getLogger(UserPlanEventDaoImpl.class);

	@Resource
	JdbcTemplate jdbcTemplate;

	@Override
	public int updateUserPlanEvent(UserPlanEventPojo pojo) {
		// 如果是添加，就将lastNoRptCheckDateTime的值设置为空字符串，如果是更新，则不动它的信息
		String sql = "insert into imm_userplanevent(userId,starDateTime,overDateTime,noRptChecksymbol,noRptCheckHour,lastNoRptCheckDateTime,dataFrom)"
				+ " values(?,?,?,?,?,'',?)ON DUPLICATE KEY "
				+ " UPDATE userId=VALUES(userId),starDateTime=VALUES(starDateTime),overDateTime=VALUES(overDateTime),"
				+ "noRptChecksymbol=VALUES(noRptChecksymbol),noRptCheckHour=VALUES(noRptCheckHour)";
		Object[] param = new Object[] { pojo.getUserId(),
				pojo.getStarDateTime(), pojo.getOverDateTime(),
				pojo.getNoRptChecksymbol(), pojo.getNoRptCheckHour(),
				pojo.getDataFrom() };
		int row = 0;
		try {
			row = jdbcTemplate.update(sql, param);
		} catch (Exception e) {
			throw e;
		}
		return row;
	}

	@Override
	public int updateLastNoRptCheckDateTime(String userId,
			String lastNoRptCheckDateTime) {
		String sql = "UPDATE imm_userplanevent SET lastNoRptCheckDateTime=? WHERE userId=?";
		Object[] param = new Object[] { lastNoRptCheckDateTime, userId };
		int row = 0;
		try {
			row = jdbcTemplate.update(sql, param);
			return row;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public UserPlanEventPojo findUserPlanEventByUserId(String userId) {
		String sql = "SELECT * FROM imm_userplanevent WHERE userId=?";
		Object[] param = new Object[] { userId };
		try {
			UserPlanEventPojo pojo = jdbcTemplate.queryForObject(sql, param,
					new BeanPropertyRowMapper<UserPlanEventPojo>(
							UserPlanEventPojo.class));
			return pojo;

		} catch (EmptyResultDataAccessException e) {
			throw e;
		}
	}

	@Override
	public List<UserPlanEventPojo> queryUserPlanEventByTime(String time,
			int index, int size) {
		String sql = "SELECT * FROM imm_userplanevent WHERE starDateTime<? AND overDateTime>? AND noRptChecksymbol=1 LIMIT ?,?";
		Object[] param = new Object[] { time, time, index, size };

		try {
			List<UserPlanEventPojo> list = jdbcTemplate.query(sql, param,
					new BeanPropertyRowMapper<UserPlanEventPojo>(
							UserPlanEventPojo.class));
			return list;

		} catch (EmptyResultDataAccessException e) {
			throw e;
		}
	}

	@Override
	public int countUserPlanEventByTime(String time) {
		try {
			String sql = "SELECT count(*) as num FROM imm_userplanevent WHERE starDateTime<? AND overDateTime>? AND noRptChecksymbol=1";
			Object[] param = new Object[] { time, time };
			/*Number number = jdbcTemplate.queryForObject(sql, param,
					Integer.class);
			int count = (number != null ? number.intValue() : 0);
			return count;*/

			List<Map<String,Object>> lists=jdbcTemplate.queryForList(sql);
			return Objects.isNull(lists)?0:Integer.valueOf(lists.get(0).get("num").toString());
		} catch (Exception e) {
			throw e;
		}
	}
}
