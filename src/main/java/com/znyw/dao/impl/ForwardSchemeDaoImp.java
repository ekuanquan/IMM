package com.znyw.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.znyw.dao.ForwardSchemeDao;
import com.znyw.pojo.ForwardSchemePojo;

@Repository
public class ForwardSchemeDaoImp implements ForwardSchemeDao {

	@Resource
	private JdbcTemplate jdbcTemplate;

	@Override
	public void addForwardScheme(ForwardSchemePojo pojo) {
		String sql = "insert into imm_alarm_forward (devId,stationNum) value (?,?)";
		try {
			jdbcTemplate.update(sql, pojo.getDevId(), pojo.getStationNum());
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public void deleteForwardScheme(String devId, String stationNum)
			throws Exception {
		String sql = "delete from imm_alarm_forward where devId=? and stationNum=?";
		try {
			jdbcTemplate.update(sql, devId, stationNum);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public void deleteFSByStationNum(String stationNum) throws Exception {
		String sql = "delete from imm_alarm_forward where stationNum=?";
		try {
			jdbcTemplate.update(sql, stationNum);
		} catch (Exception e) {
			throw e;
		}
	}

	public List<ForwardSchemePojo> getForwardSchemeList() throws Exception {
		String sql = "select * from imm_alarm_forward";

		try {
			return jdbcTemplate.query(sql, new RowMapper<ForwardSchemePojo>() {
				@Override
				public ForwardSchemePojo mapRow(ResultSet rs, int rowNum)
						throws SQLException {
					ForwardSchemePojo pojo = new ForwardSchemePojo();
					pojo.setStationNum(rs.getString("stationNum"));
					pojo.setDevId(rs.getString("devId"));
					return pojo;
				}
			});
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<ForwardSchemePojo> getForwardSchemeListById(String devId)
			throws Exception {
		String sql = "select * from imm_alarm_forward where devId=?";
		try {
			return jdbcTemplate.query(sql, new Object[] { devId },
					new RowMapper<ForwardSchemePojo>() {
						@Override
						public ForwardSchemePojo mapRow(ResultSet rs, int rowNum)
								throws SQLException {
							ForwardSchemePojo pojo = new ForwardSchemePojo();
							pojo.setStationNum(rs.getString("stationNum"));
							pojo.setDevId(rs.getString("devId"));
							return pojo;
						}
					});
		} catch (Exception e) {
			throw e;
		}
	}
}
