package com.znyw.dao.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.znyw.dao.ZoneDao;
import com.znyw.pojo.MappicPojo;
import com.znyw.pojo.RoleZonePojo;
import com.znyw.pojo.UserZonePojo;
import com.znyw.pojo.ZonePojo;
import com.znyw.pojo.devZonePojo;
import com.znyw.tool.Objects;
import com.znyw.tool.SetField;

@Repository("ZoneDao")
public class ZoneDaoImpl implements ZoneDao {

	private Logger LOGGER = Logger.getLogger(getClass());

	@Resource
	private JdbcTemplate jdbcTemplate;

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public List<UserZonePojo> findUserZoneByUserId(String userId)
			throws Exception {
		String sql = "SELECT * FROM imm_userZone  WHERE userId=? AND x!=0 AND y!=0 ORDER BY roleZoneName";
		List<UserZonePojo> list = null;
		try {
			list = jdbcTemplate.query(sql, new String[] { userId },
					new BeanPropertyRowMapper(UserZonePojo.class));
			for (int i = 0; i < list.size(); i++) {
				SetField.reflect(list.get(i));
			}
			return list;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public MappicPojo findMapPicByUserId(String mapId) throws Exception {
		String sql = "SELECT * FROM imm_mappic WHERE mapId = ?";
		Object[] param = new Object[] { mapId };
		List<MappicPojo> list = null;
		try {
			list = jdbcTemplate.query(sql, param,
					new BeanPropertyRowMapper<MappicPojo>(MappicPojo.class));
		} catch (Exception e) {
			throw e;
		}
		if (list == null || list.isEmpty()) {
			return null;
		} else {
			return list.get(0);
		}
	}

	@Override
	public boolean insertContactInfo(ZonePojo zonePojo) {

		SetField.reflect(zonePojo);

		String insertContactSQL = "INSERT INTO imm_usercont(userId,contId,cName,contPwd) VALUES(?,?,?,?)";

		int resultInsertContact = jdbcTemplate.update(insertContactSQL,
				new Object[] { zonePojo.getUserId(),
						zonePojo.getRoleZoneName(), zonePojo.getDevId(),
						zonePojo.getDevZoneId() });

		if (resultInsertContact == 1) {
			return true;
		} else {
			return false;
		}
	}

	@Override
	public boolean updateContactInfo(ZonePojo zonePojo) {
		return false;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public List<devZonePojo> findDevZone(String devId) {
		String sql = "SELECT distinct devZoneId FROM imm_devzone where devId = ?";
		List<devZonePojo> list = null;
		try {
			list = jdbcTemplate.query(sql, new String[] { devId },
					new BeanPropertyRowMapper(devZonePojo.class));
			return list;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean insertRoleZoneInfo(RoleZonePojo roleZonePojo) {
		String insertContactSQL = "INSERT INTO imm_ownerzone(ownerId,devId,devZoneId,ownerZoneName,x,y,dataFrom) VALUES(?,?,?,?,?,?,?)";

		int resultInsertContact = jdbcTemplate.update(
				insertContactSQL,
				new Object[] { roleZonePojo.getOwnerId(),
						roleZonePojo.getDevId(), roleZonePojo.getDevZoneId(),
						roleZonePojo.getOwnerZoneName(), roleZonePojo.getX(),
						roleZonePojo.getY(), roleZonePojo.getDataFrom() });

		if (resultInsertContact == 1) {
			return true;
		} else {
			return false;
		}
	}

	@Override
	public boolean updateRoleZone(RoleZonePojo roleZonePojo) {

		String updateContactSQL = "UPDATE imm_ownerzone SET ownerId=?,devId=?,devZoneId=?,ownerZoneName=? WHERE ownerId=? AND ownerZoneName=?";

		int resultUpdateContact = jdbcTemplate.update(
				updateContactSQL,
				new Object[] { roleZonePojo.getOwnerId(),
						roleZonePojo.getDevId(), roleZonePojo.getDevZoneId(),
						roleZonePojo.getOwnerZoneName(),
						roleZonePojo.getOwnerId(),
						roleZonePojo.getOwnerZoneName() });

		if (resultUpdateContact == 1) {
			return true;
		} else {
			return false;
		}
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public UserZonePojo findUserZoneByRoleIdDevIdDevZoneId(String roleId,
			String devId, String DevZoneId) throws Exception {
		UserZonePojo userZonePojo = new UserZonePojo();
		try {
			String sql = "SELECT ownerZoneName,devId,devZoneId FROM imm_ownerzone WHERE ownerId = ? AND devId=? AND devZoneId=?";
			List<UserZonePojo> list = null;
			LOGGER.info("ownerId  devId DevZoneId:" + roleId + "  " + devId
					+ " " + DevZoneId);
			list = jdbcTemplate.query(sql, new String[] { roleId, devId,
					DevZoneId }, new BeanPropertyRowMapper(UserZonePojo.class));
			if (list.size() > 0) {
				userZonePojo = list.get(0);
				LOGGER.info("userZonePojo: " + userZonePojo.toString());
			} else {
				userZonePojo = null;
				LOGGER.info("userZonePojo: null ");
			}
			return userZonePojo;
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public UserZonePojo findUserZoneByRoleIdRoleZoneName(String roleId,
			String roleZoneName) throws Exception {
		UserZonePojo userZonePojo = new UserZonePojo();
		try {
			String sql = "SELECT ownerZoneName,devId,devZoneId FROM imm_ownerzone WHERE ownerId = ? AND ownerZoneName=? ";
			List<UserZonePojo> list = null;
			LOGGER.info("ownerId  roleZoneName :" + roleId + "  "
					+ roleZoneName);
			list = jdbcTemplate.query(sql,
					new String[] { roleId, roleZoneName },
					new BeanPropertyRowMapper(UserZonePojo.class));
			if (list.size() > 0) {
				userZonePojo = list.get(0);
				LOGGER.info("userZonePojo: " + userZonePojo.toString());
			} else {
				userZonePojo = null;
				LOGGER.info("userZonePojo: null ");
			}
			return userZonePojo;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean insertMappic(String mapId, String mapPath) throws Exception {
		String insertMappicSQL = "INSERT INTO imm_mappic(mapId,mapPath) VALUES(?,?)";
		int resultInsertMappic = 0;
		try {
			resultInsertMappic = jdbcTemplate.update(insertMappicSQL,
					new Object[] { mapId, mapPath });
		} catch (Exception e) {
			LOGGER.info("insertMappic Exception:" + e.toString());
			throw e;
		}
		if (resultInsertMappic == 1) {
			return true;
		} else {
			return false;
		}
	}

	@Override
	public boolean updateMappic(String mapId, String mapPath) throws Exception {
		String updateMappicSQL = "UPDATE imm_mappic SET mapPath=? WHERE mapId=?";
		int resultUpdateMappicSQL = 0;
		try {
			resultUpdateMappicSQL = jdbcTemplate.update(updateMappicSQL,
					new Object[] { mapPath, mapId });
		} catch (Exception e) {
			LOGGER.info("updateMappic Exception:" + e.toString());
			throw e;
		}
		if (resultUpdateMappicSQL == 1) {
			return true;
		} else {
			return false;
		}
	}

	@Override
	public String findMappicByMapId(String mapId) throws Exception {
		try {
			String sql = "SELECT mapPath FROM imm_mappic WHERE mapId = ?";
			List<String> mapPath = jdbcTemplate.queryForList(sql,
					new String[] { mapId }, String.class);
			if (mapPath.size() > 0) {
				return mapPath.get(0);
			} else {
				return "";
			}

		} catch (Exception e) {
			throw e;
		}

	}


	@Override
	public int updateZoneMapPosition(ArrayList<HashMap<String, String>> list)
			throws Exception {
		int count = 0;
		try {
			for (int i = 0; i < list.size(); i++) {
				String updateSql = "update imm_ownerzone set x=?,y=?,mapId=? where  ownerZoneName=? and ownerId=? and devZoneId=?";
				count += jdbcTemplate.update(updateSql, list.get(i).get("x"),
						list.get(i).get("y"), list.get(i).get("mapId"), list
								.get(i).get("ownerZoneName"),
						list.get(i).get("ownerId"), list.get(i)
								.get("devZoneId"));
			}
			return count;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public Map<String, Object> getOldFileWithMapName(String ownerId,
			String mapName) {

		String sql = "select mapPath,mapId from imm_mappic where ownerId = ? and mapName = ?";
		try {
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,
					ownerId, mapName);

			if (Objects.isNotNull(list)) {
				return list.get(0);
			}
			return null;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean updateMappic(String ownerId, String mapName, String mapId,
			String mapPath) {
		String sql = "update imm_mappic set mapPath=?,mapId=? where ownerId=? and mapName = ?";
		try {
			return jdbcTemplate.update(sql, mapPath, mapId, ownerId, mapName) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public MappicPojo findMapPic(String ownerId, String mapName, String mapPath) {
		String sql = "SELECT * FROM imm_mappic WHERE ownerId = ? and mapName=? and mapPath=?";
		Object[] param = new Object[] { ownerId, mapName, mapPath };
		try {
			List<MappicPojo> list = jdbcTemplate.query(sql, param,
					new BeanPropertyRowMapper<MappicPojo>(MappicPojo.class));
			if (list == null || list.isEmpty()) {
				return null;
			}
			return list.get(0);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return null;
		}
	}

	@Override
	public boolean insertMappic(String ownerId, String mapName, String mapId,
			String mapPath, String dataFrom) {
		String sql = "insert into imm_mappic (mapId,ownerId,mapName,mapPath,dataFrom) values (?,?,?,?,?)";
		try {
			return jdbcTemplate.update(sql, mapId, ownerId, mapName, mapPath,
					dataFrom) > 0;
		} catch (Exception e) {
			throw e;
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<MappicPojo> findMapPicByOwnerId(String ownerId) {
		String sql = "SELECT * FROM imm_mappic WHERE ownerId = ?";
		Object[] param = new Object[] { ownerId };
		try {
			List<MappicPojo> list = jdbcTemplate.query(sql, param,
					new BeanPropertyRowMapper<MappicPojo>(MappicPojo.class));
			Collections.sort(list);
			return list;
		} catch (Exception e) {
			throw e;
		}
	}

	public List<Map<String, Object>> getMapPicByOwnerIdFromDTPP(String ownerId) {
		String sql = "SELECT ownerId,mapName,mapPath,fMemo FROM imm_mappic WHERE ownerId = ?";
		try {
			return jdbcTemplate.queryForList(sql, ownerId);
		} catch (Exception e) {
			throw e;
		}
	}

	public boolean deleteMapPic(String mapId) {
		String sql = "delete from imm_mappic where mapId=?";
		try {
			return jdbcTemplate.update(sql, mapId) > 0;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return false;
		}
	}

	public boolean deleteOwnerZoneByMapId(String mapId) {
		String sql = "update imm_ownerzone  set mapId=null,x=0,y=0 where mapId=?";
		try {
			jdbcTemplate.update(sql, mapId);
			return true;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return false;
		}
	}

	public boolean updateMapIdForOwnerzoneByOldMapId(String newMapId,
			String oldMapId) {
		String sql = "update imm_ownerzone set mapId=?  where mapId=?";
		try {
			jdbcTemplate.update(sql, newMapId, oldMapId);
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	public List<Map<String, Object>> getDevZoneByDevIds(List<String> devIds)
			throws Exception {

		String sql = "select devId,devZoneId,snModeId as snModelId,x,y,dataFrom from imm_devzone where devId in ('%s')";
		try {
			return jdbcTemplate.queryForList(String.format(sql,
					Objects.Joiner("','", devIds)));
		} catch (Exception e) {
			throw e;
		}
	}

	public String getMaxOwnerZoneId(String ownerId) throws Exception {
		String sql = "select max(ownerZoneName) from imm_ownerzone where ownerId=?";
		try {
			List<Map<String, Object>> lists = jdbcTemplate.queryForList(sql,
					ownerId);

			String maxZoneId = "0000";

			if (Objects.isNotNull(lists)
					&& Objects
							.isNotNull(lists.get(0).get("max(ownerZoneName)"))) {

				maxZoneId = lists.get(0).get("max(ownerZoneName)").toString();
			}
			return maxZoneId;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public boolean addOwnerZone(Map<String, Object> namesAndValues)
			throws Exception {
		String sql = "INSERT INTO imm_ownerzone(ownerId,devId,devZoneId,ownerZoneName,x,y,dataFrom) VALUES(?,?,?,?,?,?,?)";

		try {
			return jdbcTemplate.update(
					sql,
					new Object[] { namesAndValues.get("ownerId"),
							namesAndValues.get("devId"),
							namesAndValues.get("devZoneId"),
							namesAndValues.get("ownerZoneName"),
							namesAndValues.get("x"), namesAndValues.get("y"),
							namesAndValues.get("dataFrom") }) > 0;
		} catch (Exception e) {
			throw e;
		}
	}
}