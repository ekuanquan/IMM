package com.znyw.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.znyw.dao.IdInfoDao;
import com.znyw.pojo.IdInfoPojo;
import com.znyw.tool.Objects;

@Repository
public class IdInfoDaoImpl implements IdInfoDao {
	@Resource
	private JdbcTemplate jdbcTemplate;

	@Override
	public List<IdInfoPojo> queryLatestId() throws Exception {
		String queryLatestIdSql = "SELECT * FROM identifier_info WHERE userUsed = 0 ORDER BY id LIMIT 4";
		try {
			return jdbcTemplate.query(queryLatestIdSql,
					new RowMapper<IdInfoPojo>() {
						@Override
						public IdInfoPojo mapRow(ResultSet rs, int rowNum)
								throws SQLException {
							IdInfoPojo idInfoPojo = new IdInfoPojo();
							idInfoPojo.setId(rs.getString("id"));
							return idInfoPojo;
						}
					});
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean checkUsed(String id) {

		String sql = "SELECT COUNT(*) FROM identifier_info WHERE id=? ";
		Integer i = null;
		try {
			/*i = jdbcTemplate.queryForObject(sql, new Object[] { id },
					Integer.class);*/

			List<Map<String,Object>> lists=jdbcTemplate.queryForList(sql, new Object[] {id});
			i = Objects.isNull(lists)?0:Integer.valueOf(lists.get(0).get("count(*)").toString());
		} catch (Exception e) {
			throw e;
		}
		if (i != null && i > 0) {
			return true;
		} else {
			return false;
		}

	}

	@Override
	public List<String> queryIdByLike(String value, String type)
			throws Exception {
		String sql = "SELECT id FROM identifier_info WHERE #type = 0 AND id LIKE ?  ORDER BY id";
		String newSql = sql.replace("#type", type);
		try {
			return jdbcTemplate.query(newSql, new Object[] { value + "%" },
					new RowMapper<String>() {
						@Override
						public String mapRow(ResultSet rs, int rowNum)
								throws SQLException {
							return rs.getString("id");
						}
					});
		} catch (Exception e) {
			throw e;
		}
	}

}
