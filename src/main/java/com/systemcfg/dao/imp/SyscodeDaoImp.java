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
import com.systemcfg.dao.SyscodeDao;
import com.znyw.pojo.Pagepojo;
import com.znyw.tool.Objects;
import com.znyw.tool.SqlGenerateUtils;

@Repository
public class SyscodeDaoImp implements SyscodeDao {

	private static final Logger LOGGER = LoggerFactory.getLogger(SyscodeDaoImp.class);
	private static final String TABLE_NAME = "imm_syscode";
	private static final String INSERT_SYSCODE_SQL = "insert into " + TABLE_NAME + " %s ";
	private static final String UPDATE_SYSCODE_SQL = "update " + TABLE_NAME + " set %s where codeId = '%s'";
	private static final String DELETE_SYSCODE_SQL = "delete from " + TABLE_NAME + " where codeId = '%s'";
	private static final String QUERY_SQL = "SELECT imm_eventclass.evtWatName,codetype.codeType,syscode.* FROM imm_syscode syscode "
			+ "LEFT JOIN imm_codetype codetype ON codetype.codeTypeId=syscode.codeTypeId "
			+ "LEFT JOIN imm_eventclass  ON imm_eventclass.evtWat=syscode.evtway "
			+ " where %s order by %s %s limit %d,%d";

	private static final String QUERY_FOR_TREE = "SELECT eventclass.evtWatName,codetype.codeType,syscode.codeId,syscode.codeMemo FROM imm_syscode syscode "
			+ "LEFT JOIN imm_codetype codetype ON codetype.codeTypeId=syscode.codeTypeId "
			+ "LEFT JOIN imm_eventclass eventclass ON imm_eventclass.evtWat=syscode.evtway " + " where %s";
	private static final String COUNT_SQL = "SELECT count(*) FROM imm_syscode syscode "
			+ "LEFT JOIN imm_codetype imm_codetype ON imm_codetype.codeTypeId=syscode.codeTypeId "
			+ "LEFT JOIN imm_eventclass  ON imm_eventclass.evtWat=syscode.evtway " + " where %s ";;

	@Resource
	private JdbcTemplate jdbcTemplate;

	private static List<String> COLUMNS = new ArrayList<String>();

	static {
		COLUMNS.add("codeId");
		COLUMNS.add("codeTypeId");
		COLUMNS.add("codeMemo");
		COLUMNS.add("er_Color");
		COLUMNS.add("er_Wave");
		COLUMNS.add("e_tail");
		COLUMNS.add("r_tail");
		COLUMNS.add("userZone");
		COLUMNS.add("deaLWay");
		COLUMNS.add("evtWay");
		COLUMNS.add("codeLevel");
	}

	@SuppressWarnings("deprecation")
	@Override
	public boolean hasRecord(Object syscodeId) throws Exception {
		try {
			return jdbcTemplate.queryForInt(String.format(COUNT_SQL, "codeId = ?"), syscodeId) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean addSyscode(Map<String, Object> namesAndValues) throws Exception {

		Objects.removeUnnecessaryColumns(COLUMNS, namesAndValues);

		try {
			return jdbcTemplate.update(
					String.format(INSERT_SYSCODE_SQL, SqlGenerateUtils.generateSqlForInsert(namesAndValues)),
					SqlGenerateUtils.getInsertValues(namesAndValues)) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean updateSyscode(Object syscodeId, Map<String, Object> namesAndValues) throws Exception {

		Objects.removeUnnecessaryColumns(COLUMNS, namesAndValues);

		try {
			return jdbcTemplate.update(
					String.format(UPDATE_SYSCODE_SQL, SqlGenerateUtils.generateSqlForUpdate(namesAndValues), syscodeId),
					SqlGenerateUtils.getNewValuesForUpdate(namesAndValues)) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean deleteSyscode(Object syscodeId) throws Exception {
		try {
			return jdbcTemplate.update(String.format(DELETE_SYSCODE_SQL, syscodeId)) > 0;
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

			return jdbcTemplate.queryForList(String.format(QUERY_SQL, querySql, "codeId", "ASC", 0, 1), values);
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

	@Override
	public List<Map<String, Object>> getAllEventClass() throws Exception {

		String sql = " select evtWat,evtWatName from imm_eventclass WHERE imm_eventclass.impotWat <>'-1'";

		try {
			return jdbcTemplate.queryForList(sql);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map<String, Object>> findSysCodeByEvenClassForTree(String evtcls) throws Exception {
		String sql = " SELECT eventclass.evtWatName,syscode.codeId,syscode.codeId as id,syscode.codeMemo,CONCAT(codeId,codeMemo) AS name  FROM imm_syscode syscode "
				+ "LEFT JOIN imm_eventclass eventclass ON eventclass.evtWat=syscode.evtway "
				+ "WHERE eventclass.impotWat <>'-1' AND syscode.evtWay=?";

		try {
			return jdbcTemplate.queryForList(sql, evtcls);
		} catch (Exception e) {
			throw e;
		}
	}
}
