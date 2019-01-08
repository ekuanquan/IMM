package com.znyw.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONArray;
import com.znyw.dao.ImmSubSysOfDao;
import com.znyw.pojo.ImmSubSysOfPojo;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.Objects;

@Repository
public class ImmSubSysOfDaoImpl implements ImmSubSysOfDao {

	private static final Logger logger = Logger
			.getLogger(ImmSubSysOfDaoImpl.class);

	@Resource
	private JdbcTemplate jdbcTemplate;

	@Override
	public List<ImmSubSysOfPojo> getSubSysListByDevId(String devId)
			throws Exception {
		String sql = "select * from imm_sub_sys_of_alarm_host where devId = ?";

		try {
			return jdbcTemplate.query(sql, new Object[] { devId },
					new RowMapper<ImmSubSysOfPojo>() {
						@Override
						public ImmSubSysOfPojo mapRow(ResultSet rs, int rowNum)
								throws SQLException {
							ImmSubSysOfPojo pojo = new ImmSubSysOfPojo();
							pojo.setDevId(rs.getString("devId"));
							pojo.setSubSysId(rs.getString("subSysId"));
							pojo.setSubRange(rs.getString("subRange"));
							pojo.setfMemo(rs.getString("fMemo"));
							pojo.setBf(rs.getInt("bf"));
							pojo.setDataFrom(ConfigUtil.getPlatformId());
							return pojo;
						}
					});
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public void saveSubSys(ImmSubSysOfPojo pojo) throws Exception {
		String sql = "insert into imm_sub_sys_of_alarm_host (devId,subSysId,subRange,fMemo,dataFrom,bf) values (?,?,?,?,?,?)";
		try {
			jdbcTemplate.update(
					sql,
					new Object[] { pojo.getDevId(), pojo.getSubSysId(),
							pojo.getSubRange(), pojo.getfMemo(),
							ConfigUtil.getPlatformId(), pojo.getBf() });
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public void updateSubSys(ImmSubSysOfPojo pojo) throws Exception {
		String sql = "update imm_sub_sys_of_alarm_host set subRange=?,fMemo=?,dataFrom=? where devId=? and subSysId=?";

		try {
			jdbcTemplate.update(
					sql,
					new Object[] { pojo.getSubRange(), pojo.getfMemo(),
							ConfigUtil.getPlatformId(), pojo.getDevId(),
							pojo.getSubSysId() });
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean deleteSubSysByIds(String devId, JSONArray subSysIds)
			throws Exception {
		String sql = "delete from imm_sub_sys_of_alarm_host where devId=? and subSysId in ('%s')";
		return jdbcTemplate.update(
				String.format(sql, Objects.Joiner("','", subSysIds)), devId) > 0;
	}

	@Override
	public ImmSubSysOfPojo getSubSysById(String devId, String subSysId)
			throws Exception {
		String sql = "select * from imm_sub_sys_of_alarm_host where devId=? and subSysId=?";
		try {
			return jdbcTemplate.queryForObject(sql, new Object[] { devId,
					subSysId }, new BeanPropertyRowMapper<>(
					ImmSubSysOfPojo.class));
		} catch (Exception e) {
			return null;
		}
	}

	@Override
	public void deleteSubSys(String devId, String subSysId) throws Exception {
		JSONArray array = new JSONArray();
		array.add(subSysId);
		deleteSubSysByIds(devId, array);

	}

}
