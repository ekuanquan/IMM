package com.znyw.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.systemcfg.dao.AssembleCfgDao;
import com.znyw.dao.AreaDao;
import com.znyw.dao.RoleAreaDao;
import com.znyw.dao.UserInfoDao;
import com.znyw.dao.impl.UserDaoImp;
import com.znyw.pojo.Area;
import com.znyw.pojo.AreaPojo;
import com.znyw.service.AreaService;
import com.znyw.service.RoleAreaService;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultUtil;

@Repository("AreaService")
public class AreaServiceImp implements AreaService {

	private final Logger log = LoggerFactory.getLogger(this.getClass());

	@Resource
	private AreaDao areaDao;
	@Resource
	private UserInfoDao userInfoDao;
	@Resource
	private RoleAreaDao roleAreaDao;
	@Resource
	private UserDaoImp userDaoImp;
	@Resource
	private RoleAreaService roleAreaService;
	@Resource
	private AssembleCfgDao assembleCfgDao;

	@Override
	public JSONArray getAreaByParentAreaId(String parentAreaId)
			throws Exception {
		try {
			List<AreaPojo> arealist = areaDao
					.getAreaByParentAreaId(parentAreaId);
			JSONArray areaJsonArray = new JSONArray();
			for (AreaPojo area : arealist) {
				JSONObject jso = JSON.parseObject(area.toZtreeJsonString());
				areaJsonArray.add(jso);
			}
			return areaJsonArray;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public JSONArray getAreaList(String id) throws Exception {
		List<AreaPojo> parentAreaList = new ArrayList<AreaPojo>();
		String parentId = id;
		while (true) {
			AreaPojo area = areaDao.getAreaById(parentId);
			parentAreaList.add(area);
			parentId = area.getParentAreaId();
			// 找到“主目录”这一个最终根则跳出循环
			if (area.getParentAreaId() == null
					|| area.getParentAreaId().trim().equals(""))
				break;
		}

		JSONArray allArrary = new JSONArray();
		// 此节点的所有父节点
		for (AreaPojo area : parentAreaList) {
			JSONObject jso = JSON.parseObject(area.toZtreeJsonString());
			allArrary.add(jso);
		}
		// 此节点的所有子节点
		JSONArray rulaArray = getAreaByParentAreaId(id);
		allArrary.addAll(rulaArray);

		return allArrary;
	}

	public JSONArray getAreaListByUserId1(String userId) throws Exception {
		JSONObject userInfo = userDaoImp.getUser(userId);
		String id = (String) userInfo.get("areaId");

		JSONArray result = getAreaList(id);

		getAreaListByUserId1(userId);

		return result;
	}

	@Override
	public JSONArray getAreaListByUserId(String userId, String roleId,
			boolean handleOnly, String platformId,boolean needDataNode) throws Exception {

		// 如果不是本平台的角色，则返回其所在平台的全部区域
		if (Objects.isNotNullString(roleId) && !roleAreaDao.isLocalRole(roleId)) {
			return getAreaListByRoleId(roleId);
		}

		roleId = userInfoDao.getRoleIdByUserId(userId);
		JSONArray purviewAreaIds = new JSONArray();
		// 获取权限区域的数据节点
		List<Map<String, Object>> purviewAreas = roleAreaDao
				.getRoleAreasByRoleId(roleId, "1", "0",platformId);
		// 获取权限区域的非数据节点
		List<Map<String, Object>> purviewAreasNotDataNode = roleAreaDao
				.getRoleAreasByRoleId(roleId, "0", "0",platformId);

		if (purviewAreasNotDataNode != null
				&& !purviewAreasNotDataNode.isEmpty() && needDataNode) {
			purviewAreas.addAll(purviewAreasNotDataNode);
		}

		if (purviewAreas != null) {
			for (Map<String, Object> map : purviewAreas) {
				purviewAreaIds.add(map.get("areaId").toString());
			}
		}

		if (purviewAreaIds.size() == 0) {
			log.error("\n编号为 `{}` 的用户的角色权限为空 ...", userId);
			return new JSONArray();
		}

		purviewAreas = areaDao.getAreasWithAreaIdsArray(purviewAreaIds);

		//List<Map<String, Object>> deleted = new ArrayList<Map<String, Object>>();

		for (Map<String, Object> map : purviewAreas) {

			if (ConfigUtil.getRoot().equals(map.get("id").toString())) {
				map.put("open", true);
			}

			/*if (handleOnly
					&& !ConfigUtil.getPlatformId().equals(
							map.get("platformId").toString())) {
				deleted.add(map);
				continue;
			}*/

			for (Map<String, Object> m : purviewAreas) {
				if (m.get("pId").equals(map.get("id"))) {
					map.put("isParent", true);
					break;
				}
			}

			for (Map<String, Object> m : purviewAreasNotDataNode) {
				if (m.get("areaId").equals(map.get("id"))) {
					map.put("half", true);
					break;
				}
			}

			if (!map.containsKey("half")) {
				map.put("half", false);
			}

			if (!map.containsKey("isParent")) {
				map.put("isParent", false);
			}

		}

		/*if (deleted != null && !deleted.isEmpty()) {
			purviewAreas.removeAll(deleted);
		}*/

		JSONArray array = (JSONArray) JSONArray.toJSON(purviewAreas);

		return array;
	}

	@Override
	public JSONArray getAreaListByRoleId(String roleId) throws Exception {

		List<Map<String, Object>> roleInfo = roleAreaDao
				.getRoleInfoByRoleId(roleId);
		String areaId = "";
		if (roleInfo != null && !roleInfo.isEmpty()) {
			String platformId = roleInfo.get(0).get("platformId").toString();
			areaId = platformId;
		}

		Area area = new Area(areaId);

		List<Area> childs;
		try {
			childs = getChilds(area);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return new JSONArray();
		}

		if (Objects.isNotNull(childs)) {
			area.setChilds(childs);
		}

		Set<String> areaIds = area.getAreaIds();
		//areaIds.add(ConfigUtil.getRoot());

		List<Map<String, Object>> purviewAreas = areaDao
				.getAreasWithAreaIdsSet(areaIds);

		JSONArray array = (JSONArray) JSONArray.toJSON(purviewAreas);

		return array;
	}

	@Override
	public JSONObject saveArea(JSONObject jso) {
		JSONObject result = new JSONObject();
		try {
			AreaPojo area = JSON
					.parseObject(jso.toJSONString(), AreaPojo.class);

			int areaNum = areaDao.queryAreaIdNum(area.getAreaId());
			int areaNameNum = areaDao.queryAreaNameNum(area.getAreaName(),area.getParentAreaId());
			if (areaNum > 0) {
				result.put("code", 3);
				result.put("message", "区域编号已存在！");
				return result;
			} else if (areaNameNum > 0) {
				result.put("code", 2);
				result.put("message", "区域名称已存在！");
				return result;
			} else {

				if (Objects.isNullString(area.getPlatformId())) {
					area.setPlatformId(assembleCfgDao.getLocalPlatformId());
				}

				// Map<String, Object> exsistArea =
				// areaDao.findAreaByGbId(area.getGbId());
				//
				// if (Objects.isNotNullMapWithObject(exsistArea)) {
				// result.put("code", 1);
				// result.put("message", "国标ID已经存在");
				// return result;
				// }

				areaDao.saveArea(area);
				// 1.找出所添加新节点的直接父节点是权限区域或处置区域的角色权限信息。
				// 2.依次给 1 中所找出的角色权限中添加对新增区域的权限，各字段（除 areaId）的值与父节点相同。
				List<Map<String, Object>> purviews = roleAreaDao
						.getAllRoleAreaByAreaIdWithDataNode(
								area.getParentAreaId(), "0");
				List<Map<String, Object>> handles = roleAreaDao
						.getAllRoleAreaByAreaIdWithDataNode(
								area.getParentAreaId(), "1");
				if (purviews == null) {
					purviews = new ArrayList<Map<String, Object>>();
				}
				if (handles != null && !handles.isEmpty()) {
					purviews.addAll(handles);
				}

				for (Map<String, Object> map : purviews) {

					JSONObject roleArea = new JSONObject();
					roleArea.put("roleId", map.get("roleId").toString());
					roleArea.put("areaId", area.getAreaId());
					roleArea.put("is_data_node",
							(Boolean) map.get("is_data_node") ? 1 : 0); // 是数据节点,与父节点相同
					roleArea.put("is_handle_node",
							(Boolean) map.get("is_handle_node") ? 1 : 0); // 是否处置区域的节点,与父节点相同
					roleArea.put("real_time_handel",
							(Boolean) map.get("real_time_handel") ? 1 : 0); // 是否实时处置权限,与父节点相同
					roleArea.put("real_time_browse",
							(Boolean) map.get("real_time_browse") ? 1 : 0); // 是否实时浏览权限,与父节点相同
					roleArea.put("browse_handle_data_only", (Boolean) map
							.get("browse_handle_data_only") ? 1 : 0);// 是否仅看处置区域,与父节点相同

					roleAreaDao.addRoleArea(roleArea);
				}
			}
			result.put("code", 1);
			result.put("message", "区域添加成功");
		} catch (Exception e) {
			result.put("code", 0);
			result.put("message", e.getMessage());
		}
		return result;
	}

	@Override
	public JSONObject deleteArea(String id) throws Exception {

		Area area = new Area(id);

		List<Area> childs;
		try {
			childs = getChilds(area);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "删除失败", e.getMessage());
		}

		if (Objects.isNotNull(childs)) {
			area.setChilds(childs);
		}

		Set<String> areaIds = area.getAreaIds();
		boolean hasData = areaDao.hasDevsOrUsersInAreaIds(areaIds);

		JSONObject result = new JSONObject();

		if (hasData) {
			result.put("code", 403);
			result.put("message", "该区域（或子区域）下有设备或用户！");

		} else {
			try {
				for (String areaId : areaIds) {
					areaDao.deleteArea(areaId);
				}
				result.put("code", 1);
				result.put("message", "success");
			} catch (Exception e) {
				log.error(e.getMessage(), e);
				result.put("code", 500);
				result.put("message", e.getMessage());
			}
		}

		return result;

		// int NUM = areaDao.queryDevAndUserNum(id);
		// if (NUM > 0) {
		// result.put("code", 0);
		// result.put("message", "该区域（或子区域）下有设备或用户！");
		// return result;
		// }

		// try {
		// areaDao.deleteArea(id);
		// result.put("code", 1);
		// result.put("message", "success");
		// } catch (Exception e) {
		// log.error(e.getMessage(), e);
		// result.put("code", 0);
		// result.put("message", e.getMessage());
		// }
		// return result;
	}

	@Override
	public JSONObject updateArea(JSONObject jso) {

		JSONObject result = new JSONObject();
		try {
			AreaPojo area = JSON
					.parseObject(jso.toJSONString(), AreaPojo.class);
			int areaNameNum = areaDao.queryAreaNameNum(area.getAreaName(),area.getParentAreaId());
			if (areaNameNum > 0) {
				result.put("code", 2);
				result.put("message", "区域名称已存在！");
				return result;
			} else {

			
			if(!jso.getString("oldAreaName").equals(area.getAreaName())) {
				areaNameNum = areaDao.queryAreaNameNum(area.getAreaName(),area.getParentAreaId());
			}
			if (areaNameNum > 0) {
				result.put("code", 2);
				result.put("message", "区域名称已存在！");
				return result;
			} else {
				if (Objects.isNullString(area.getPlatformId())) {
					area.setPlatformId(assembleCfgDao.getLocalPlatformId());
				}
	
				// Map<String, Object> exsistArea =
				// areaDao.findAreaByGbId(area.getGbId());
				//
				// if (Objects.isNotNullMapWithObject(exsistArea)
				// && !area.getAreaId().equals(exsistArea.get("areaId").toString()))
				// {
				// result.put("code", 0);
				// result.put("message", "国标ID已经存在");
				// return result;
				// }
	
				areaDao.updateArea(area);
	
				// TODO
				// 1.找出被更新区域以及其下属的所有区域ID
				// 2.根据找到的区域ID，删除imm_rolearea表中的权限记录
				// 3.找出被更新节点的新父节点是数据节点的所有权限信息（包括权限区域和处置区域）
				// 4.将被更新节点区域和其下属区域插入到对应的角色权限中
				Area a = new Area(area.getAreaId());
	
				List<Area> childs = getChilds(a);
	
				if (childs != null && !childs.isEmpty()) {
					a.setChilds(childs);
				}
	
				Set<String> affectedAreaIds = a.getAreaIds();
	
				roleAreaDao.deleteRoleAreaByAreaIds(affectedAreaIds);
	
				List<Map<String, Object>> purviews = roleAreaDao
						.getAllRoleAreaByAreaIdWithDataNode(area.getParentAreaId(),
								"0");
				List<Map<String, Object>> handles = roleAreaDao
						.getAllRoleAreaByAreaIdWithDataNode(area.getParentAreaId(),
								"1");
	
				if (purviews == null) {
					purviews = new ArrayList<Map<String, Object>>();
				}
				if (handles != null && !handles.isEmpty()) {
					purviews.addAll(handles);
				}
	
				for (Map<String, Object> map : purviews) {
	
					for (String areaId : affectedAreaIds) {
						JSONObject roleArea = new JSONObject();
						roleArea.put("roleId", map.get("roleId").toString());
						roleArea.put("areaId", areaId);
						roleArea.put("is_data_node",
								(Boolean) map.get("is_data_node") ? 1 : 0); // 是数据节点,与父节点相同
						roleArea.put("is_handle_node",
								(Boolean) map.get("is_handle_node") ? 1 : 0); // 是否处置区域的节点,与父节点相同
						roleArea.put("real_time_handel",
								(Boolean) map.get("real_time_handel") ? 1 : 0); // 是否实时处置权限,与父节点相同
						roleArea.put("real_time_browse",
								(Boolean) map.get("real_time_browse") ? 1 : 0); // 是否实时浏览权限,与父节点相同
						roleArea.put("browse_handle_data_only", (Boolean) map
								.get("browse_handle_data_only") ? 1 : 0);// 是否仅看处置区域,与父节点相同
	
						roleAreaDao.addRoleArea(roleArea);
					}
				}
	
				result.put("code", 1);
				result.put("message", "success");
			}

			}

		} catch (Exception e) {
			log.error(e.getMessage(), e);
			result.put("code", 0);
			result.put("message", e.getMessage());
		}
		return result;
	}

	@Override
	public JSONObject getAreaById(String id) {
		JSONObject result = new JSONObject();
		try {
			AreaPojo area = areaDao.getAreaById(id);
			JSONObject areaJso = JSON.parseObject(area.toString());
			result.put("code", 1);
			result.put("message", "success");
			result.put("area", areaJso);
		} catch (Exception e) {
			result.put("code", 0);
			result.put("message", e.getMessage());
		}
		return result;
	}

	@Override
	public JSONArray getAreaAllById(String parentAreaId) throws Exception { // 获取此节点下的所有层数的节点

		List<AreaPojo> arealist = getAllAeraId(parentAreaId);

		JSONArray areaJsonArray = new JSONArray();
		for (AreaPojo area : arealist) {
			JSONObject jso = JSON.parseObject(area.toZtreeJsonString());
			areaJsonArray.add(jso);
		}

		return areaJsonArray;
	}

	public List<AreaPojo> getAllAeraId(String parentAreaId) throws Exception {
		List<AreaPojo> list = new ArrayList<AreaPojo>();
		List<AreaPojo> arealist = areaDao.getAreaByParentAreaId(parentAreaId);

		for (int g = 0; g < arealist.size(); g++) {
			list.add(arealist.get(g));
		}

		List<AreaPojo> arealistFro = arealist;
		while (true) {
			if (arealistFro.size() > 0) {
				List<List<AreaPojo>> arealist1 = new ArrayList<List<AreaPojo>>();
				for (int i = 0; i < arealistFro.size(); i++) {
					arealist1.add(areaDao.getAreaByParentAreaId(arealistFro
							.get(i).getAreaId()));
				}
				arealistFro = new ArrayList<AreaPojo>();
				for (int m = 0; m < arealist1.size(); m++) {
					List<AreaPojo> resultFor = arealist1.get(m);
					for (int k = 0; k < resultFor.size(); k++) {
						arealistFro.add(resultFor.get(k));
						list.add(resultFor.get(k));
					}
				}
			} else {
				break;
			}
		}

		return list;
	}

	public List<AreaPojo> getAllAeraId1(String parentAreaId) throws Exception {

		List<AreaPojo> arealist = areaDao.getAreaByParentAreaId(parentAreaId);

		List<AreaPojo> childs = getChildAreaList(arealist);

		arealist.addAll(childs);

		return arealist;
	}

	private List<AreaPojo> getChildAreaList(List<AreaPojo> parents)
			throws Exception {

		List<AreaPojo> arealist = new ArrayList<AreaPojo>();

		for (AreaPojo areaPojo : parents) {
			List<AreaPojo> childs = areaDao.getAreaByParentAreaId(areaPojo
					.getAreaId());
			arealist.addAll(childs);

			List<AreaPojo> result = getChildAreaList(childs);
			arealist.addAll(result);
		}
		return arealist;
	}

	@Override
	public List<Area> getAllAreas() throws Exception {

		List<Map<String, Object>> areaMaps = areaDao.getAllAreas();

		List<Area> areas = new ArrayList<Area>();

		for (Map<String, Object> map : areaMaps) {
			areas.add(new Area(map));
		}

		return areas;
	}

	@Override
	public List<Area> getChilds(Area area) throws Exception {

		List<Map<String, Object>> areaMaps = areaDao.getChilds(area);

		List<Area> areas = new ArrayList<Area>();

		for (Map<String, Object> map : areaMaps) {

			Area subChild = new Area(map);
			areas.add(subChild);
			List<Area> cs = getChilds(subChild);
			if (cs != null && !cs.isEmpty()) {
				areas.addAll(cs);
			}
		}

		return areas;
	}
}
