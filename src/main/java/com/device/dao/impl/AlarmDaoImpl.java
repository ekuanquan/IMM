package com.device.dao.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.device.dao.IAlarmDao;
import com.znyw.tool.Objects;
import com.znyw.tool.SqlGenerateUtils;

@Repository
public class AlarmDaoImpl implements IAlarmDao {
	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	private static final String IMM_DEALWAY_TABLE_NAME = "imm_dealway";
	private static final String SELECT_COUNT_BY_USERID_AND_DEALWAYID_TEMPLATE = "select count(*) from "
			+ IMM_DEALWAY_TABLE_NAME + " where ownerId = '%s' and dealWayId = %s";
	private static final String SELECT_COUNT_BY_DEALWAYID_TEMPLATE = "select count(*) from " + IMM_DEALWAY_TABLE_NAME
			+ " where dealWayId = %s";
	private static final String INSERT_SQL_TEMPLATE = "insert into " + IMM_DEALWAY_TABLE_NAME + " %s ";
	private static final String SELECT_FIRST_BY_USERID_AND_DEALWAYID_TEMPLATE = "select * from "
			+ IMM_DEALWAY_TABLE_NAME + " where ownerId = '%s' and dealWayId = %s limit 0,1";
	private static final String DELETE_BY_USERID_AND_DEALWAYID_TEMPLATE = "delete from " + IMM_DEALWAY_TABLE_NAME
			+ " where ownerId = '%s' and dealWayId = %s";
	
	private static final String DELETE_BY_USERID_AND_DEALWAYID_TEMPLATE_S = "delete from " + IMM_DEALWAY_TABLE_NAME
			+ " where ownerId = '%s' and dealWayId IN ('%s')";
	
	private static final String UPDATE_BY_USERID_AND_DEALWAYID_TEMPLATE = "update " + IMM_DEALWAY_TABLE_NAME
			+ " set %s where ownerId = '%s' and dealWayId = %s";

	@Resource
	JdbcTemplate jdbcTemplate;

	@Override
	public JSONArray queryAlarmCaseList() throws Exception {

		String strSQL = "SELECT * FROM imm_alarmcause ";
		try {
			List<Map<String, Object>> total_list = jdbcTemplate.queryForList(strSQL);
			String jsonText = JSON.toJSONString(total_list, true);
			JSONArray jsonArr = JSON.parseArray(jsonText);
			logger.info("queryAlarmCaseList suc totalNum={}", total_list.size());
			return jsonArr;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public JSONArray queryDealwayListByUid(String ownerId) throws Exception {
		String sql = "SELECT * FROM imm_dealway WHERE ownerId = ? ORDER BY dealWayId";
		try {
			List<Map<String, Object>> total_list = jdbcTemplate.queryForList(sql, ownerId);
			String jsonText = JSON.toJSONString(total_list, true);
			JSONArray jsonArr = JSON.parseArray(jsonText);
			return jsonArr;
		} catch (DataAccessException e) {
			throw e;
		}
	}

	@SuppressWarnings("deprecation")
	@Override
	public boolean hasDealway(String userId, int dealWayId) {
		return jdbcTemplate
				.queryForInt(String.format(SELECT_COUNT_BY_USERID_AND_DEALWAYID_TEMPLATE, userId, dealWayId)) > 0;
	}

	@SuppressWarnings("deprecation")
	@Override
	public boolean hasDealWayWithDealWayId(int dealWayId) {
		return jdbcTemplate.queryForInt(String.format(SELECT_COUNT_BY_DEALWAYID_TEMPLATE, dealWayId)) > 0;
	}

	@Override
	public JSONObject addDealWay(Map<String, Object> namesAndValues) throws Exception {

		try {
			int inserted = jdbcTemplate.update(
					String.format(INSERT_SQL_TEMPLATE, SqlGenerateUtils.generateSqlForInsert(namesAndValues)),
					SqlGenerateUtils.getInsertValues(namesAndValues));

			if (inserted < 1) {
				logger.error("添加失败 ... 表{}:{}", IMM_DEALWAY_TABLE_NAME, namesAndValues);
				return null;
			}
			return findByUserIdAndDealWayId(namesAndValues.get("ownerId").toString(),
					Integer.valueOf(namesAndValues.get("dealWayId").toString()));
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public JSONObject updateDealWayByUserIdAndDealWayId(String ownerId, int dealWayId,
			Map<String, Object> namesAndValues) throws Exception {
		try {
			jdbcTemplate.update(
					String.format(UPDATE_BY_USERID_AND_DEALWAYID_TEMPLATE,
							SqlGenerateUtils.generateSqlForUpdate(namesAndValues), ownerId, dealWayId),
					SqlGenerateUtils.getNewValuesForUpdate(namesAndValues));

			if (namesAndValues.containsKey("dealWayId")) {
				dealWayId = Integer.valueOf(namesAndValues.get("dealWayId").toString());
			}

			return findByUserIdAndDealWayId(ownerId, dealWayId);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public JSONObject updateDealWay(Map<String, Object> namesAndValues) throws Exception {

		String ownerId = (String) namesAndValues.remove("ownerId");
		int dealWayId = Integer.valueOf(namesAndValues.remove("oldDealWayId").toString());

		// 将 newDealWayId 换成 dealWayId
		namesAndValues.put("dealWayId", namesAndValues.remove("newDealWayId"));

		try {
			return updateDealWayByUserIdAndDealWayId(ownerId, dealWayId, namesAndValues);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public int deleteDealWayByUserIdAndDealWayId(String ownerId, int dealWayId) throws Exception {
		try {
		return jdbcTemplate.update(String.format(DELETE_BY_USERID_AND_DEALWAYID_TEMPLATE, ownerId, dealWayId));
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public int deleteDealWayByUserIdAndDealWayId(String ownerId, JSONArray dealWayIds) throws Exception {
		try {
		return jdbcTemplate.update(String.format(DELETE_BY_USERID_AND_DEALWAYID_TEMPLATE_S, ownerId, Objects.Joiner("','",dealWayIds)));
		} catch (Exception e) {
			throw e;
		}
	}

	private JSONObject findByUserIdAndDealWayId(String ownerId, int dealWayId) throws Exception {
		try {
			List<Map<String, Object>> list = jdbcTemplate
					.queryForList(String.format(SELECT_FIRST_BY_USERID_AND_DEALWAYID_TEMPLATE, ownerId, dealWayId));

			String jsonText = JSON.toJSONString(list.get(0), true);
			return JSON.parseObject(jsonText);
		} catch (Exception e) {
			throw e;
		}
	}

}