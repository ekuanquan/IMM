package com.znyw.dao.impl;

/**
 * 系统码相关操作
 */
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.znyw.dao.SysCodeDao;
import com.znyw.pojo.SysCodePojo;
import com.znyw.tool.Objects;

@Repository("SysCodeDao")
public class SysCodeDaoImpl implements SysCodeDao {
	private static Logger logger = Logger.getLogger(SysCodeDaoImpl.class);

	@Resource
	JdbcTemplate jdbcTemplate;

	@Override
	public List<SysCodePojo> getSysCodeByCondition(String queryStr, int index,
			int size) {
		String sql = "SELECT sc.codeId,sc.codeTypeId, ct.codeType, sc.codeMemo, sc.er_Color, "
				+ "sc.er_Wave, sc.e_tail, sc.r_tail, sc.userZone, sc.deaLWay, sc.evtWay, "
				+ "ec.evtWatName AS evtWayName, sc.codeLevel "
				+ "FROM (SELECT * FROM `imm_syscode` WHERE codeId LIKE ? ORDER BY ? LIMIT ?,?) sc "
				+ " LEFT JOIN imm_codetype ct ON sc.codeTypeId=ct.codeTypeId "
				+ " LEFT JOIN imm_eventclass ec ON sc.evtWay=ec.evtWat";
		Object[] param = new Object[] { "%" + queryStr + "%", "codeId", index,
				size };
		try {
			List<SysCodePojo> list = jdbcTemplate.query(sql, param,
					new BeanPropertyRowMapper<SysCodePojo>(SysCodePojo.class));
			return list;

		} catch (EmptyResultDataAccessException e) {
			throw e;
		}
	}

	@Override
	public int countSysCodeByCondition(String queryStr) {
		String sql = "SELECT count(*) FROM `imm_syscode` WHERE codeId LIKE ?";
		Object[] param = new Object[] { queryStr + "%" };
		/*Number number = jdbcTemplate.queryForObject(sql, param, Integer.class);
		int count = (number != null ? number.intValue() : 0);
		return count;*/
		List<Map<String,Object>> lists=jdbcTemplate.queryForList(sql);
		return Objects.isNull(lists)?0:Integer.valueOf(lists.get(0).get("count(*)").toString());
	}

	@Override
	public SysCodePojo findSysCodeByCodeId(String codeId) {
		String sql = "SELECT sc.codeId,sc.codeTypeId, ct.codeType, sc.codeMemo, sc.er_Color, "
				+ "sc.er_Wave, sc.e_tail, sc.r_tail, sc.userZone, sc.deaLWay, sc.evtWay, "
				+ "ec.evtWatName AS evtWayName, sc.codeLevel "
				+ "FROM (SELECT * FROM `imm_syscode` WHERE codeId = ?) sc "
				+ " LEFT JOIN imm_codetype ct ON sc.codeTypeId=ct.codeTypeId "
				+ " LEFT JOIN imm_eventclass ec ON sc.evtWay=ec.evtWat";
		Object[] param = new Object[] { codeId };
		try {
			SysCodePojo pojo = jdbcTemplate.queryForObject(sql, param,
					new BeanPropertyRowMapper<SysCodePojo>(SysCodePojo.class));
			return pojo;
		} catch (EmptyResultDataAccessException e) {
			throw e;
		}
	}

	@Override
	public int updateSysCodeByCodeId(SysCodePojo pojo) {
		String sql = "UPDATE `imm_syscode` SET codeTypeId=?,codeMemo=?,e_tail=?,r_tail=?,userZone=?,evtWay=? WHERE codeId=?";
		Object[] param = new Object[] { pojo.getCodeTypeId(),
				pojo.getCodeMemo(), pojo.getE_tail(), pojo.getR_tail(),
				pojo.getUserZone(), pojo.getEvtWay(), pojo.getCodeId() };
		try {
			int row = jdbcTemplate.update(sql, param);
			return row;
		} catch (Exception e) {
			throw e;
		}
	}
}
