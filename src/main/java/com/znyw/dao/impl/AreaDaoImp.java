package com.znyw.dao.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONArray;
import com.znyw.dao.AreaDao;
import com.znyw.pojo.Area;
import com.znyw.pojo.AreaPojo;
import com.znyw.tool.Objects;

@Repository("AreaDao")
public class AreaDaoImp implements AreaDao {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(AreaDaoImp.class);

	private static String subSql = "SELECT T1.*, "
			+ "IF(T2.c is null,0,1) AS isParent "
			+ "FROM "
			+ "(SELECT * FROM imm_area WHERE parentAreaId = ? ) T1 "
			+ "LEFT JOIN "
			+ "(SELECT COUNT(*) AS c,parentAreaId FROM imm_area GROUP BY parentAreaId) T2 ON T1.areaId=T2.parentAreaId ";

	@Resource
	private JdbcTemplate jdbcTemplate;

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public List<AreaPojo> getAreaByParentAreaId(String parentAreaId)
			throws Exception {
		try {
			return jdbcTemplate.query(subSql, new Object[] { parentAreaId },
					new BeanPropertyRowMapper(AreaPojo.class));
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<AreaPojo> getAreaByParentAreaId1(String parentAreaId)
			throws Exception {

		String sql = "select * from imm_area where parentAreaId = ? ";
		return jdbcTemplate.query(sql, new Object[] { parentAreaId },
				new BeanPropertyRowMapper(AreaPojo.class));
	}

	@SuppressWarnings({ "unchecked", "rawtypes", "unused" })
	@Override
	public AreaPojo getAreaById(String id) throws Exception {

		if (id == null) {
			return new AreaPojo();
		}

		String sql = "SELECT a.areaId,a.areaName,a.parentAreaId,a.parents as gbId,a.platformId,a.fMemo,b.platform_name AS platformName "
				+ "FROM imm_area a,imm_assemble_cfg b WHERE a.platformId=b.platform_id AND a.areaId=? ";
		List list = jdbcTemplate.query(sql, new Object[] { id },
				new BeanPropertyRowMapper(AreaPojo.class));
		AreaPojo areaPojo = (AreaPojo) list.get(0);

		if (Objects.isNullString(areaPojo.getParentAreaId())) {
			areaPojo.setParentAreaName("");
		} else {

			String getParentSql = "select areaName from imm_area where areaId=?";

			List parentList = jdbcTemplate.query(sql,
					new Object[] { areaPojo.getParentAreaId() },
					new BeanPropertyRowMapper(AreaPojo.class));

			if (Objects.isNotNull(parentList)) {
				AreaPojo parent = (AreaPojo) parentList.get(0);
				areaPojo.setParentAreaName(parent.getAreaName());
			}
		}
		return areaPojo;
	}

	@Override
	public String getAreaNameById(String areaId) throws Exception {
		String sql = "SELECT areaName FROM imm_area WHERE areaId=?";
		Object[] param = new Object[] { areaId };
		try {
			/*String areaName = jdbcTemplate.queryForObject(sql, param,
					String.class);
			return areaName;*/
			List<Map<String,Object>> lists=jdbcTemplate.queryForList(sql, param);
			return Objects.isNull(lists)?null:lists.get(0).get("areaName").toString();
		} catch (EmptyResultDataAccessException e) {
			throw e;
		}
	}

	@Override
	public Integer saveArea(AreaPojo area) throws Exception {
		String sql = "INSERT INTO imm_area (areaId,areaName,parentAreaId,fMemo,areaType,parents,dataFrom,platformId) VALUE (?,?,?,?,?,?,?,?) ";
		try {
			int i = jdbcTemplate.update(
					sql,
					new Object[] { area.getAreaId(), area.getAreaName(),
							area.getParentAreaId(), area.getfMemo(),
							area.getAreaType(), area.getGbId(),
							area.getDataFrom(), area.getPlatformId() });
			return i;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public Integer deleteArea(String id) throws Exception {
		String sql = "DELETE FROM imm_area WHERE areaId = ?";
		return jdbcTemplate.update(sql, new Object[] { id });
	}

	@Override
	public Integer updateArea(AreaPojo area) throws Exception {
		String sql = "UPDATE imm_area SET areaName= ?,parentAreaId = ?,fMemo = ?,areaType = ?,parents = ?,platformId=? WHERE areaId = ?";
		int i = jdbcTemplate.update(sql, new Object[] { area.getAreaName(),
				area.getParentAreaId(), area.getfMemo(), area.getAreaType(),
				area.getGbId(), area.getPlatformId(), area.getAreaId() });
		return i;
	}

	@Override
	public int queryDevAndUserNum(String id) throws Exception {
		String sqlDev = "SELECT COUNT(areaid) FROM imm_devinfo WHERE areaid = ?";
		String sqlUser = "SELECT COUNT(areaid) FROM imm_userinfo WHERE areaid = ?";
		Object[] param = new Object[] { id };

		List<Map<String,Object>> lists1=jdbcTemplate.queryForList(sqlDev, param);
		int DevNum = (Objects.isNull(lists1)?0:Integer.valueOf(lists1.get(0).get("count(areaid)").toString()));
		/*Number number2 = jdbcTemplate.queryForObject(sqlUser, param,
				Integer.class);*/
		List<Map<String,Object>> lists2=jdbcTemplate.queryForList(sqlUser, param);
		int UserNum = (Objects.isNull(lists2)?0:Integer.valueOf(lists2.get(0).get("count(areaid)").toString()));
		return (DevNum + UserNum);
	}

	@Override
	public boolean hasDevsOrUsersInAreaIds(Set<String> areaIds)
			throws Exception {

		String sqlDev = "SELECT COUNT(areaId) FROM imm_devinfo WHERE areaId in ('%s')";
		String sqlUser = "SELECT COUNT(areaId) FROM imm_userinfo WHERE areaId in ('%s')";

		/*Number devNumber = jdbcTemplate.queryForObject(
				String.format(sqlDev, Objects.Joiner("','", areaIds)),
				Integer.class);
		int devNum = (devNumber != null ? devNumber.intValue() : 0);*/
		List<Map<String,Object>> lists=jdbcTemplate.queryForList(String.format(sqlDev, Objects.Joiner("','", areaIds)));
		int devNum = (Objects.isNull(lists) ? 0 : Integer.valueOf(lists.get(0).get("COUNT(areaId)").toString()));
		if (devNum > 0) {
			return true;
		}
		/*Number userNumber = jdbcTemplate.queryForObject(
				String.format(sqlUser, Objects.Joiner("','", areaIds)),
				Integer.class);
		int userNum = (userNumber != null ? userNumber.intValue() : 0);*/

		List<Map<String, Object>> listsuserNum = jdbcTemplate
				.queryForList(String.format(sqlUser, Objects.Joiner("','", areaIds)));
		int userNum = (Objects.isNull(listsuserNum) ? 0
				: Integer.valueOf(listsuserNum.get(0).get("COUNT(areaId)").toString()));
		return userNum > 0;
	}

	@Override
	public int queryAreaIdNum(String id) throws Exception {
		String sqlDev = "SELECT COUNT(*) FROM imm_area WHERE areaId=? ";
		Object[] param = new Object[] { id };
		/*Number number = jdbcTemplate.queryForObject(sqlDev, param,
				Integer.class);
		int DevNum = (number != null ? number.intValue() : 0);*/

		List<Map<String,Object>> lists=jdbcTemplate.queryForList(sqlDev,param);
		int DevNum = (Objects.isNull(lists)?0:Integer.valueOf(lists.get(0).get("count(*)").toString()));
		return DevNum;
	}

	@Override
	public int queryAreaNameNum(String id,String parentAreaId) throws Exception  {
		String sqlDev = "SELECT COUNT(*) FROM imm_area WHERE areaName=? and parentAreaId=? ";
		Object[] param = new Object[] { id,parentAreaId };
		/*Number number = jdbcTemplate.queryForObject(sqlDev, param,
				Integer.class);
		int DevNum = (number != null ? number.intValue() : 0);*/

		List<Map<String,Object>> lists=jdbcTemplate.queryForList(sqlDev,param);
		int DevNum = (Objects.isNull(lists)?0:Integer.valueOf(lists.get(0).get("count(*)").toString()));
		return DevNum;
	}

	@Override
	public List<Map<String, Object>> getAllAreas() throws Exception {

		List<Map<String, Object>> areasMap = jdbcTemplate
				.queryForList("select areaId,areaName,fMemo from imm_area where areaId <> ''");

		return areasMap;
	}

	@Override
	public List<Map<String, Object>> getChilds(Area area) throws Exception {
		try {
			List<Map<String, Object>> areasMap = jdbcTemplate
					.queryForList(
							"select a.areaId,a.areaName,a.fMemo,a.platformId,b.platform_name as platformName from imm_area a,imm_assemble_cfg b where parentAreaId = ?",
							area.getAreaId());
			return areasMap;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map<String, Object>> getAreasWithAreaIdsArray(JSONArray array)
			throws Exception {

		String sql = "select a.areaId as id,a.areaName as name,a.parentAreaId as pId,a.platformId,b.platform_name as platformName from imm_area a,imm_assemble_cfg b where a.platformId=b.platform_id and %s ";
		try {
			return jdbcTemplate.queryForList(String.format(sql,
					Objects.JoinerForSql("or", "a.areaId", array)));
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<Map<String, Object>> getAreasWithAreaIdsSet(Set<String> areaIds)
			throws Exception {

		String sql = "select a.areaId as id,a.areaName as name,a.parentAreaId as pId,a.platformId,b.platform_name as platformName from imm_area a,imm_assemble_cfg b where a.platformId=b.platform_id and %s ";
		try {
			return jdbcTemplate.queryForList(String.format(sql,
					Objects.JoinerForSql("or", "a.areaId", areaIds)));
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public Map<String, Object> findAreaByGbId(String gbId) throws Exception {
		String sql = "select areaId,parents as gbId from imm_area where parents=?";

		try {
			List<Map<String, Object>> result = jdbcTemplate.queryForList(sql,
					gbId);

			if (Objects.isNotNull(result)) {
				return result.get(0);
			}
			return new HashMap<String, Object>();
		} catch (Exception e) {
			throw e;
		}
	}
}
