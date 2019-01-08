package com.znyw.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Repository;

import com.znyw.dao.TaskSchedulerDao;
import com.znyw.pojo.BCFPlanPojo;
import com.znyw.tool.Objects;

@Repository
public class TaskSchedulerDaoImpl implements TaskSchedulerDao {

	private static final Logger logger = LoggerFactory
			.getLogger(TaskSchedulerDaoImpl.class);
	@Resource
	private JdbcTemplate jdbcTemplate;

	private static final String mergeSql = "REPLACE INTO imm_owner_dev_bcf_plan"
			+ "(ownerId,starDateTime,overDateTime,bFdevId,bFfMemo,cFdevId,cFfMemo"
			+ ",bFsymbol1,bFStartime1,bFOvertime1,bFLastCheckDate1,bFsymbol2,bFStartime2,bFOvertime2,bFLastCheckDate2"
			+ ",bFsymbol3,bFStartime3,bFOvertime3,bFLastCheckDate3,bFsymbol4,bFStartime4,bFOvertime4,bFLastCheckDate4"
			+ ",bFsymbol5,bFStartime5,bFOvertime5,bFLastCheckDate5,bFsymbol6,bFStartime6,bFOvertime6,bFLastCheckDate6"
			+ ",bFsymbol7,bFStartime7,bFOvertime7,bFLastCheckDate7,cFsymbol1,cFStartime1,cFOvertime1,cFLastCheckDate1"
			+ ",cFsymbol2,cFStartime2,cFOvertime2,cFLastCheckDate2,cFsymbol3,cFStartime3,cFOvertime3,cFLastCheckDate3"
			+ ",cFsymbol4,cFStartime4,cFOvertime4,cFLastCheckDate4,cFsymbol5,cFStartime5,cFOvertime5,cFLastCheckDate5"
			+ ",cFsymbol6,cFStartime6,cFOvertime6,cFLastCheckDate6,cFsymbol7,cFStartime7,cFOvertime7,cFLastCheckDate7) "
			+ "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

	@Override
	public List<String> queryNeedCheckedDev() throws Exception {
		// 首先通过当前时间获取当前为周几
		Calendar c = Calendar.getInstance();
		int week = c.get(Calendar.DAY_OF_WEEK) - 1;
		if (week == 0)
			week = 7;
		String sql = "SELECT bFdevId FROM imm_owner_dev_bcf_plan WHERE overDateTime>now() AND "
				+ "bFsymbol{weekday} = 1 AND  CONCAT(DATE_FORMAT(now(),'%Y-%m-%d'),' ',bFOvertime{weekday}) < now() "
				+ "AND (DATE_FORMAT(bFLastCheckDate{weekday},'%Y-%m-%d') IS NULL OR DATE_FORMAT(now(),'%Y-%m-%d') > DATE_FORMAT(bFLastCheckDate{weekday},'%Y-%m-%d')) ";
		String newSql = null;
		try {
			newSql = sql.replace("{weekday}", String.valueOf(week));
			return jdbcTemplate.queryForList(newSql, String.class);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public void updateTime(String devId) throws Exception {
		// 首先通过当前时间获取当前为周几
		Calendar c = Calendar.getInstance();
		int week = c.get(Calendar.DAY_OF_WEEK) - 1;
		if (week == 0)
			week = 7;
		String sql = "UPDATE imm_owner_dev_bcf_plan SET bFLastCheckDate{weekday} = now() WHERE bFdevId =?";
		String newSql = sql.replace("{weekday}", String.valueOf(week));
		logger.info("当前时间为星期[{}],更新的设备为[{}],执行的sql语句为: {}", week, devId, newSql);
		int i = jdbcTemplate.update(newSql, new Object[] { devId });
		logger.info("更新设备[{}]记录,条数为:[{}]", devId, i);
	}

	@Override
	public BCFPlanPojo queryTaskByOwnerId(String ownerId) throws Exception {
		String sql = "SELECT * FROM imm_owner_dev_bcf_plan WHERE ownerId =?";
		BCFPlanPojo bCFPlanPojo = null;
		try {
			bCFPlanPojo = jdbcTemplate.queryForObject(sql,
					new Object[] { ownerId }, new BeanPropertyRowMapper<>(
							BCFPlanPojo.class));
			return bCFPlanPojo;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public void mergeIntoMysql(BCFPlanPojo bCFPlanPojo) throws Exception {
		try {

			jdbcTemplate.update(
					mergeSql,
					new Object[] { bCFPlanPojo.getOwnerId(),
							bCFPlanPojo.getStarDateTime(),
							bCFPlanPojo.getOverDateTime(),
							bCFPlanPojo.getBFdevId(), bCFPlanPojo.getBFfMemo(),
							bCFPlanPojo.getCFdevId(), bCFPlanPojo.getCFfMemo(),
							bCFPlanPojo.getBFsymbol1(),
							bCFPlanPojo.getBFStartime1(),
							bCFPlanPojo.getBFOvertime1(),
							bCFPlanPojo.getBFLastCheckDate1(),
							bCFPlanPojo.getBFsymbol2(),
							bCFPlanPojo.getBFStartime2(),
							bCFPlanPojo.getBFOvertime2(),
							bCFPlanPojo.getBFLastCheckDate2(),
							bCFPlanPojo.getBFsymbol3(),
							bCFPlanPojo.getBFStartime3(),
							bCFPlanPojo.getBFOvertime3(),
							bCFPlanPojo.getBFLastCheckDate3(),
							bCFPlanPojo.getBFsymbol4(),
							bCFPlanPojo.getBFStartime4(),
							bCFPlanPojo.getBFOvertime4(),
							bCFPlanPojo.getBFLastCheckDate4(),
							bCFPlanPojo.getBFsymbol5(),
							bCFPlanPojo.getBFStartime5(),
							bCFPlanPojo.getBFOvertime5(),
							bCFPlanPojo.getBFLastCheckDate5(),
							bCFPlanPojo.getBFsymbol6(),
							bCFPlanPojo.getBFStartime6(),
							bCFPlanPojo.getBFOvertime6(),
							bCFPlanPojo.getBFLastCheckDate6(),
							bCFPlanPojo.getBFsymbol7(),
							bCFPlanPojo.getBFStartime7(),
							bCFPlanPojo.getBFOvertime7(),
							bCFPlanPojo.getBFLastCheckDate7(),
							bCFPlanPojo.getCFsymbol1(),
							bCFPlanPojo.getCFStartime1(),
							bCFPlanPojo.getCFOvertime1(),
							bCFPlanPojo.getCFLastCheckDate1(),
							bCFPlanPojo.getCFsymbol2(),
							bCFPlanPojo.getCFStartime2(),
							bCFPlanPojo.getCFOvertime2(),
							bCFPlanPojo.getCFLastCheckDate2(),
							bCFPlanPojo.getCFsymbol3(),
							bCFPlanPojo.getCFStartime3(),
							bCFPlanPojo.getCFOvertime3(),
							bCFPlanPojo.getCFLastCheckDate3(),
							bCFPlanPojo.getCFsymbol4(),
							bCFPlanPojo.getCFStartime4(),
							bCFPlanPojo.getCFOvertime4(),
							bCFPlanPojo.getCFLastCheckDate4(),
							bCFPlanPojo.getCFsymbol5(),
							bCFPlanPojo.getCFStartime5(),
							bCFPlanPojo.getCFOvertime5(),
							bCFPlanPojo.getCFLastCheckDate5(),
							bCFPlanPojo.getCFsymbol6(),
							bCFPlanPojo.getCFStartime6(),
							bCFPlanPojo.getCFOvertime6(),
							bCFPlanPojo.getCFLastCheckDate6(),
							bCFPlanPojo.getCFsymbol7(),
							bCFPlanPojo.getCFStartime7(),
							bCFPlanPojo.getCFOvertime7(),
							bCFPlanPojo.getCFLastCheckDate7() });
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public Integer getStatuesByDevId(String devId) throws Exception {
		String sql = "SELECT isBF FROM mcs_devstatus_view WHERE devId = ?";
		try {
			/*return jdbcTemplate.queryForObject(sql, new Object[] { devId },
					Integer.class);*/
			List<Map<String,Object>> lists=jdbcTemplate.queryForList(sql, new Object[] {devId});
			return Objects.isNull(lists)?0:Integer.valueOf(lists.get(0).get("isBF").toString());
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public Map<String, String> getBfTimeByDevId(String devId) throws Exception {
		// 首先通过当前时间获取当前为周几
		Calendar c = Calendar.getInstance();
		int week = c.get(Calendar.DAY_OF_WEEK) - 1;
		if (week == 0)
			week = 7;
		final String bFStartime = "bFStartime" + week;
		final String bFOvertime = "bFOvertime" + week;
		String sql = "SELECT bFStartime{weekday},bFOvertime{weekday} FROM  imm_owner_dev_bcf_plan WHERE bFdevId =?";
		String newSql = sql.replace("{weekday}", String.valueOf(week));
		try {
			return jdbcTemplate.query(newSql, new Object[] { devId },
					new ResultSetExtractor<Map<String, String>>() {
						@Override
						public Map<String, String> extractData(ResultSet rs)
								throws SQLException, DataAccessException {
							Map<String, String> map = new HashMap<String, String>();
							if (rs.next()) {
								map.put("bFStartime", rs.getString(bFStartime));
								map.put("bFOvertime", rs.getString(bFOvertime));
							}
							return map;
						}
					});
		} catch (Exception e) {
			throw e;
		}

	}

}
