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
import com.systemcfg.dao.DevModelDao;
import com.znyw.pojo.Pagepojo;
import com.znyw.tool.Objects;
import com.znyw.tool.SqlGenerateUtils;

@Repository
public class DevModelDaoImp implements DevModelDao {
	private static final Logger LOGGER = LoggerFactory.getLogger(DevModelDaoImp.class);
	private static final String TABLE_NAME = "imm_devmodel";
	
	private static final String INSERT_DEVMODEL_SQL = "insert into " + TABLE_NAME + " %s ";
	private static final String UPDATE_DEVMODEL_SQL = "update " + TABLE_NAME + " set %s where devModelId = '%s'";
	private static final String DELETE_DEVMODEL_SQL = "delete from " + TABLE_NAME + " where devModelId = '%s'";
	private static final String QUERY_SQL = "select imm_devmodel.*,imm_devtype.devTypeName from imm_devmodel,imm_devtype where %s and imm_devmodel.devType=imm_devtype.devType order by %s %s limit %d,%d";
	private static final String COUNT_SQL = "select count(*) from imm_devmodel,imm_devtype where %s and imm_devmodel.devType=imm_devtype.devType";

	private static List<String> COLUMNS = new ArrayList<String>();

	static {
		COLUMNS.add("devModelId");
		COLUMNS.add("devModelName");
		COLUMNS.add("devType");
		COLUMNS.add("zoneNum");
		COLUMNS.add("prog_type");
		COLUMNS.add("ChannelNum");
		COLUMNS.add("ZoneNumEx");
		COLUMNS.add("CodeWayId_42");
		COLUMNS.add("CodeWayId_FSK");
		COLUMNS.add("CodeWayId_CID");
		COLUMNS.add("dataFrom");
	}

	@Resource
	private JdbcTemplate jdbcTemplate;


	@Override
	public boolean addDevModel(Map<String, Object> namesAndValues) throws Exception {
		
		Objects.removeUnnecessaryColumns(COLUMNS, namesAndValues);

		try {
			return jdbcTemplate.update(
					String.format(INSERT_DEVMODEL_SQL, SqlGenerateUtils.generateSqlForInsert(namesAndValues)),
					SqlGenerateUtils.getInsertValues(namesAndValues)) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean updateDevmodel(Object devModelId, Map<String, Object> namesAndValues) throws Exception {

		Objects.removeUnnecessaryColumns(COLUMNS, namesAndValues);

		try {
		return jdbcTemplate.update(
					String.format(UPDATE_DEVMODEL_SQL, SqlGenerateUtils.generateSqlForUpdate(namesAndValues),
							devModelId),
					SqlGenerateUtils.getNewValuesForUpdate(namesAndValues)) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean deleteDevModel(Object devModelId) throws Exception {

		try {
			String updateDev = "update imm_devinfo set devModelId='-1' where devModelId = '%s'";
			jdbcTemplate.update(String.format(updateDev, devModelId));
			return jdbcTemplate.update(
					String.format(DELETE_DEVMODEL_SQL, devModelId)) > 0;
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
				values = SqlGenerateUtils.getSimpleValues(json, false);
			}
			return jdbcTemplate.queryForList(String.format(QUERY_SQL, querySql, order, sort, offset, limit),
					values);
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

			return jdbcTemplate.queryForList(String.format(QUERY_SQL, querySql, "devModelId", "ASC", 0, 1), values);
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
				values = SqlGenerateUtils.getSimpleValues2(json, false);
			}
			return jdbcTemplate.queryForInt(String.format(COUNT_SQL, querySql), values);
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings("deprecation")
	@Override
	public boolean hasRecord(Object devModelId) throws Exception {
		try {
			return jdbcTemplate.queryForInt(String.format(COUNT_SQL, "devModelId = ?"), devModelId) > 0;
		} catch (Exception e) {
			throw e;
		}
	}
}
