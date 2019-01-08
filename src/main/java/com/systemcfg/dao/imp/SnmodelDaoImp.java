package com.systemcfg.dao.imp;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONObject;
import com.systemcfg.dao.SnmodelDao;
import com.znyw.pojo.Pagepojo;
import com.znyw.tool.Objects;
import com.znyw.tool.SqlGenerateUtils;

@Repository
public class SnmodelDaoImp implements SnmodelDao {

	private static final Logger LOGGER = LoggerFactory.getLogger(DevModelDaoImp.class);
	private static final String TABLE_NAME = "imm_snmodel";

	private static final String INSERT_SNMODEL_SQL = "insert into " + TABLE_NAME + " %s ";
	private static final String UPDATE_SNMODEL_SQL = "update " + TABLE_NAME + " set %s where snModelId = '%s'";
	private static final String DELETE_SNMODEL_SQL = "delete from " + TABLE_NAME + " where snModelId = '%s'";
	private static final String QUERY_SQL = "select imm_snmodel.*,imm_wantdo.wantDoName,imm_almtype.almTypeName,imm_sntype.snTypeName from imm_snmodel,imm_wantdo,imm_almtype,imm_sntype where %s and imm_snmodel.wantDo=imm_wantdo.wantDo and  imm_snmodel.almType=imm_almtype.almType and imm_sntype.snType=imm_snmodel.snKind order by %s %s limit %d,%d";
	private static final String COUNT_SQL = "select count(*) from imm_snmodel,imm_wantdo,imm_almtype,imm_sntype  where %s  and imm_snmodel.wantDo=imm_wantdo.wantDo and  imm_snmodel.almType=imm_almtype.almType and imm_sntype.snType=imm_snmodel.snKind";
	@Resource
	private JdbcTemplate jdbcTemplate;
	
	private static List<String> COLUMNS = new ArrayList<String>();

	static {
		COLUMNS.add("snModelId");
		COLUMNS.add("snModelName");
		COLUMNS.add("snMemo");
		COLUMNS.add("snKind");
		COLUMNS.add("buyPrice");
		COLUMNS.add("servicePrice");
		COLUMNS.add("wantDo");
		COLUMNS.add("almType");
	}


	@SuppressWarnings("deprecation")
	@Override
	public boolean hasRecord(Object snModelId) throws Exception {
		try {
			return jdbcTemplate.queryForInt(String.format(COUNT_SQL, "snModelId = ?"), snModelId) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean addDevModel(Map<String, Object> namesAndValues) throws Exception {

		Objects.removeUnnecessaryColumns(COLUMNS, namesAndValues);

		try {
			return jdbcTemplate.update(
					String.format(INSERT_SNMODEL_SQL, SqlGenerateUtils.generateSqlForInsert(namesAndValues)),
					SqlGenerateUtils.getInsertValues(namesAndValues)) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean updateDevmodel(Object snModelId, Map<String, Object> namesAndValues) throws Exception {

		Objects.removeUnnecessaryColumns(COLUMNS, namesAndValues);

		try {
			return jdbcTemplate.update(String.format(UPDATE_SNMODEL_SQL,
					SqlGenerateUtils.generateSqlForUpdate(namesAndValues), snModelId),
					SqlGenerateUtils.getNewValuesForUpdate(namesAndValues)) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean deleteDevModel(Object snModelId) throws Exception {
		try {
			return jdbcTemplate.update(String.format(DELETE_SNMODEL_SQL, snModelId)) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map<String, Object>> find(JSONObject jsonObject, Pagepojo pagepojo) throws Exception {
		try {

			String order = pagepojo.getOrderBy().split("\\|")[0];
			String sort = pagepojo.getOrderBy().split("\\|")[1];
			int offset = (pagepojo.getCurrentPage() - 1) * pagepojo.getPageSize();
			int limit = pagepojo.getPageSize();

			String querySql = " 1 = ? ";
			Object[] values = new Object[] { 1 };
			if (jsonObject != null) {
				String json = jsonObject.toJSONString();
				querySql = SqlGenerateUtils.getSimpleQuerySql(json);
				values = SqlGenerateUtils.getSimpleValues2(json, false);
			}
			System.err.println(String.format(QUERY_SQL, querySql, order, sort, offset, limit));
			return jdbcTemplate.queryForList(String.format(QUERY_SQL, querySql, order, sort, offset, limit), values);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map<String, Object>> findByKey(JSONObject jsonObject) throws Exception {
		try {

			String querySql = " 1 = ? ";
			Object[] values = new Object[] { 1 };
			if (jsonObject != null) {
				String json = jsonObject.toJSONString();
				querySql = SqlGenerateUtils.getSimpleQuerySql(json);
				values = SqlGenerateUtils.getSimpleValues(json, true);
			}

			return jdbcTemplate.queryForList(String.format(QUERY_SQL, querySql, "snModelId", "ASC", 0, 1), values);
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings("deprecation")
	@Override
	public int count(JSONObject jsonObject) throws Exception {
		try {
			String querySql = " 1 = ? ";
			Object[] values = new Object[] { 1 };
			if (jsonObject != null) {
				String json = jsonObject.toJSONString();
				querySql = SqlGenerateUtils.getSimpleQuerySql(json);
				values = SqlGenerateUtils.getSimpleValues(json, false);
			}
			return jdbcTemplate.queryForInt(String.format(COUNT_SQL, querySql), values);
		} catch (Exception e) {
			throw e;
		}
	}

}
