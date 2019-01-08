package com.znyw.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.znyw.pojo.MappicPojo;
import com.znyw.pojo.RoleZonePojo;
import com.znyw.pojo.UserZonePojo;
import com.znyw.pojo.ZonePojo;
import com.znyw.pojo.devZonePojo;

public interface ZoneDao {
	public List<UserZonePojo> findUserZoneByUserId(String userId) throws Exception;

	public MappicPojo findMapPicByUserId(String userId) throws Exception;

	public boolean insertContactInfo(ZonePojo zonePojo);

	public boolean updateContactInfo(ZonePojo zonePojo);

	public List<devZonePojo> findDevZone(String devId);

	public boolean insertRoleZoneInfo(RoleZonePojo roleZonePojo);

	public boolean updateRoleZone(RoleZonePojo roleZonePojo);

	public UserZonePojo findUserZoneByRoleIdDevIdDevZoneId(String roleId, String devId, String DevZoneId)
			throws Exception;

	public UserZonePojo findUserZoneByRoleIdRoleZoneName(String roleId, String roleZoneName) throws Exception;

	public boolean insertMappic(String mapId, String mapPath) throws Exception;

	public boolean updateMappic(String mapId, String mapPath) throws Exception;

	public String findMappicByMapId(String mapId) throws Exception;

	/**
	 * 指定 ownerId 是否存在指定名称图片
	 * 
	 * @param ownerId
	 * @param mapName
	 * @return
	 */
	public Map<String, Object> getOldFileWithMapName(String ownerId, String mapName);

	/**
	 * 通过 ownerId 和 mapName 更新 mapPath,mapId
	 */
	public boolean updateMappic(String ownerId, String mapName, String mapId, String mapPath);

	public MappicPojo findMapPic(String ownerId, String mapName, String mapPath);

	/**
	 * 插入图片
	 * 
	 * @param roleId
	 * @param mapName
	 * @param mapPath
	 * @return
	 */
	public boolean insertMappic(String ownerId, String mapName, String mapId, String mapPath, String dataFrom);

	public int updateZoneMapPosition(ArrayList<HashMap<String, String>> list) throws Exception;

	public List<MappicPojo> findMapPicByOwnerId(String ownerId);

	public List<Map<String, Object>> getMapPicByOwnerIdFromDTPP(String ownerId);

	public boolean deleteMapPic(String mapId);

	public boolean deleteOwnerZoneByMapId(String mapId);

	public boolean updateMapIdForOwnerzoneByOldMapId(String newMapId, String oldMapId);

	/**
	 * 根据设备编号列表获取防区信息
	 * 
	 * @param devIds
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getDevZoneByDevIds(List<String> devIds) throws Exception;

	/**
	 * 根据机主编号获取最大用户防区编号
	 * 
	 * @param ownerId
	 * @return
	 * @throws Exception
	 */
	public String getMaxOwnerZoneId(String ownerId) throws Exception;

	public boolean addOwnerZone(Map<String, Object> namesAndValues) throws Exception;
}
