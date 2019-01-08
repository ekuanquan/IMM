package com.systemcfg.service.imp;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.systemcfg.dao.AssembleCfgDao;
import com.systemcfg.service.AssembleCfgService;
import com.znyw.dao.AreaDao;
import com.znyw.dao.RoleAreaDao;
import com.znyw.pojo.Area;
import com.znyw.pojo.AreaPojo;
import com.znyw.service.AreaService;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultUtil;

@Service
public class AssembleCfgServiceImp implements AssembleCfgService {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(AssembleCfgServiceImp.class);

	@Resource
	private AssembleCfgDao assembleCfgDao;
	@Resource
	private AreaDao areaDao;
	@Resource
	private RoleAreaDao roleAreaDao;
	@Resource
	private AreaService areaService;

	@Deprecated
	@Override
	public JSONObject save(Map<String, Object> namesAndValues) {

		return null;

	}

	@Override
	public JSONObject add(Map<String, Object> namesAndValues) {
		Object platformId = namesAndValues.get("platform_id");

		namesAndValues.put("platform_type", "子平台");

		try {
			if (assembleCfgDao.countByPlatformId(platformId) > 0) {
				return ResultUtil.simpleResponse("500", "平台ID重复");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
		}

		namesAndValues.put("id", Objects.isNullString(namesAndValues
				.get("gbId")) ? namesAndValues.get("platform_id")
				: namesAndValues.get("gbId"));

		AreaPojo area = new AreaPojo();
		area.setAreaId(namesAndValues.get("platform_id").toString());
		area.setAreaName(namesAndValues.get("platform_name").toString());
		area.setParentAreaId(ConfigUtil.getRoot());
		area.setfMemo("子平台节点");
		area.setAreaType(0);
		area.setPlatformId(namesAndValues.get("platform_id").toString());
		area.setGbId(namesAndValues.get("gbId").toString());

		boolean added;
		try {
			added = assembleCfgDao.add(namesAndValues);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
		}

		if (added) {
			try {
				areaDao.saveArea(area);
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
			}
			// 1.找出所添加新节点的直接父节点是权限区域或处置区域的角色权限信息。
			// 2.依次给 1 中所找出的角色权限中添加对新增区域的权限，各字段（除 areaId）的值与父节点相同。
			List<Map<String, Object>> purviews;
			try {
				purviews = roleAreaDao.getAllRoleAreaByAreaIdWithDataNode(
						area.getParentAreaId(), "0");
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
			}

			if (purviews == null) {
				purviews = new ArrayList<Map<String, Object>>();
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
				roleArea.put("browse_handle_data_only",
						(Boolean) map.get("browse_handle_data_only") ? 1 : 0);// 是否仅看处置区域,与父节点相同

				try {
					roleAreaDao.addRoleArea(roleArea);
				} catch (Exception e) {
					LOGGER.error(e.getMessage(), e);
					return ResultUtil.simpleResponse("500", "添加失败",
							e.getMessage());
				}
			}
			return ResultUtil.simpleResponse("200", "添加成功");
		} else {
			return ResultUtil.simpleResponse("500", "添加失败");
		}
	}

	@Override
	public JSONObject update(Map<String, Object> namesAndValues)
			throws Exception {

		Object id = namesAndValues.get("id");

		if (id == null) {
			return ResultUtil.simpleResponse("500", "参数错误", "id 为空");
		}
		try {
			List<Map<String, Object>> result = assembleCfgDao.findById(id);

			if (result == null || result.isEmpty()) {
				return ResultUtil.simpleResponse("500", "参数错误");
			}

			Object platformId = namesAndValues.get("platform_id");

			if (!result.get(0).get("platform_id").equals(platformId)
					&& assembleCfgDao.countByPlatformId(platformId) > 0) {
				return ResultUtil.simpleResponse("500", "平台ID重复");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "更新失败", e.getMessage());
		}

		namesAndValues.put("platform_type", "子平台");
		namesAndValues.put("id", namesAndValues.get("gbId").toString());

		// 前提是 platform_id 不改，否则修改区域数据受影响结果为0
		AreaPojo area = new AreaPojo();
		area.setAreaId(namesAndValues.get("platform_id").toString());
		area.setAreaName(namesAndValues.get("platform_name").toString());
		area.setParentAreaId(ConfigUtil.getRoot());
		area.setfMemo("子平台节点");
		area.setAreaType(0);
		area.setPlatformId(namesAndValues.get("platform_id").toString());
		area.setGbId(namesAndValues.get("gbId").toString());

		boolean updated;
		try {
			updated = assembleCfgDao.update(id, namesAndValues);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "更新失败", e.getMessage());
		}

		if (updated) {
			areaDao.updateArea(area);

			return ResultUtil.simpleResponse("200", "更新成功");
		} else {
			return ResultUtil.simpleResponse("500", "更新失败");
		}
	}

	@Override
	public JSONObject delete(List<String> ids) {

		if (ids == null) {
			return ResultUtil.simpleResponse("500", "参数错误", "未指定 id ");
		}

		try {
			for (String id : ids) {

				List<Map<String, Object>> lists;
				lists = assembleCfgDao.findById(id);

				if (lists != null && !lists.isEmpty()) {
					Area area = new Area(lists.get(0).get("platform_id")
							.toString());
					area.setChilds(areaService.getChilds(area));
					for (String areaId : area.getAreaIds()) {
						areaDao.deleteArea(areaId);
					}
					roleAreaDao.deleteByAreaIds(area.getAreaIds());
				}
				assembleCfgDao.delete(id);
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
		}
		return ResultUtil.simpleResponse("200", "删除成功");
	}

	@Override
	public JSONObject list() {

		List<Map<String, Object>> lists;
		try {
			lists = assembleCfgDao.list();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}

		JSONObject jsonResult = new JSONObject();
		jsonResult.put("code", "200");
		jsonResult.put("message", "查询成功");
		jsonResult.put("result", lists);

		return jsonResult;
	}

	@Override
	public JSONObject getSubPlatform() {

		List<Map<String, Object>> lists;
		try {
			lists = assembleCfgDao.getSubPlatform();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}

		JSONObject jsonResult = new JSONObject();
		jsonResult.put("code", "200");
		jsonResult.put("message", "查询成功");
		jsonResult.put("result", lists);

		return jsonResult;
	}

	@Override
	public JSONObject main() {
		List<Map<String, Object>> lists;
		try {
			lists = assembleCfgDao.main();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}

		JSONObject jsonResult = new JSONObject();
		jsonResult.put("code", "200");
		jsonResult.put("message", "查询成功");
		jsonResult.put("result", lists);

		return jsonResult;
	}

	@Override
	public JSONObject findById(Object id) {

		List<Map<String, Object>> lists;
		try {
			lists = assembleCfgDao.findById(id);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}

		JSONObject jsonResult = new JSONObject();
		jsonResult.put("code", "200");
		jsonResult.put("message", "查询成功");
		jsonResult.put("result", lists.isEmpty() ? lists : lists.get(0));

		return jsonResult;
	}

	@Override
	public JSONObject getLocalPlatformId() {

		String localPlatformId;
		try {
			localPlatformId = assembleCfgDao.getLocalPlatformId();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}

		JSONObject jsonResult = new JSONObject();
		jsonResult.put("code", "200");
		jsonResult.put("message", "查询成功");

		JSONObject object = new JSONObject();
		object.put("localPlatformId", localPlatformId);
		jsonResult.put("result", object);

		return jsonResult;

	}
}
