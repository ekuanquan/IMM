package com.systemcfg.dao.imp;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.systemcfg.dao.AssembleCfgDao;
import com.znyw.tool.Objects;
import com.znyw.tool.SqlGenerateUtils;

@Repository
public class AssembleCfgDaoImp implements AssembleCfgDao {
	private static final Logger LOGGER = LoggerFactory.getLogger(AssembleCfgDaoImp.class);

	@Resource
	private JdbcTemplate jdbcTemplate;

	private static List<String> COLUMNS = new ArrayList<String>();

	static {
		COLUMNS.add("id");
		COLUMNS.add("platform_id");
		COLUMNS.add("platform_name");
		COLUMNS.add("platform_host");
		COLUMNS.add("platform_type");
		COLUMNS.add("memo");
		COLUMNS.add("dataFrom");
	}

	@Override
	public boolean save(Map<String, Object> namesAndValues) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean add(Map<String, Object> namesAndValues) throws Exception {

		Objects.removeUnnecessaryColumns(COLUMNS, namesAndValues);

		String sql = " insert into imm_assemble_cfg %s";

		String columnsSql = SqlGenerateUtils.generateSqlForInsert(namesAndValues);
		Object[] params = SqlGenerateUtils.getInsertValues(namesAndValues);
		try {
			return jdbcTemplate.update(String.format(sql, columnsSql), params) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean update(Object id, Map<String, Object> namesAndValues) throws Exception {

		Objects.removeUnnecessaryColumns(COLUMNS, namesAndValues);

		String sql = "update imm_assemble_cfg set %s where id=%s";

		String updateSql = SqlGenerateUtils.generateSqlForUpdate(namesAndValues);
		Object[] params = SqlGenerateUtils.getNewValuesForUpdate(namesAndValues);

		try {
			return jdbcTemplate.update(String.format(sql, updateSql, id), params) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean delete(Object id) throws Exception {

		String sql = "delete from imm_assemble_cfg where id=?";
		try {
			jdbcTemplate.update(sql, id);
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map<String, Object>> list() throws Exception {

		String sql = "select id,id as gbId,platform_id,platform_name,platform_host,platform_type,memo from imm_assemble_cfg where platform_type='子平台' ";
		try {
			return jdbcTemplate.queryForList(sql);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map<String, Object>> getSubPlatform() throws Exception {

		String sql = "select * from imm_assemble_cfg where platform_type='子平台'";
		try {
			return jdbcTemplate.queryForList(sql);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map<String, Object>> main() throws Exception {
		String sql = "select * from imm_assemble_cfg where platform_type<>'子平台'";
		try {
			return jdbcTemplate.queryForList(sql);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map<String, Object>> findById(Object id) throws Exception {
		String sql = "select * from imm_assemble_cfg where platform_type='子平台' and id=?";
		try {
			return jdbcTemplate.queryForList(sql, id);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public int countByPlatformId(Object platformId) throws Exception {
		String sql = "select count(*) from imm_assemble_cfg where platform_id=?";
		try {			
			List<Map<String,Object>> lists=jdbcTemplate.queryForList(sql,platformId);
			return Objects.isNull(lists)?0:Integer.valueOf(lists.get(0).get("count(*)").toString());
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public String getLocalPlatformId() throws Exception {

		String sql = "select platform_id from imm_assemble_cfg where platform_type='本平台' ";
		try {
			List<Map<String, Object>> lists = jdbcTemplate.queryForList(sql);

			if (lists != null && !lists.isEmpty()) {
				return lists.get(0).get("platform_id").toString();
			}
			return "";
		} catch (Exception e) {
			throw e;
		}
	}
}
