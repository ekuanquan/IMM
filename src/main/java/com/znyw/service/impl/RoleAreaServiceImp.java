package com.znyw.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.util.JSON;
import com.systemcfg.dao.AssembleCfgDao;
import com.znyw.dao.DeviceDao;
import com.znyw.dao.RoleAreaDao;
import com.znyw.dao.UserInfoDao;
import com.znyw.pojo.Pagepojo;
import com.znyw.service.RoleAreaService;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultUtil;

@Service
public class RoleAreaServiceImp implements RoleAreaService {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(RoleAreaServiceImp.class);

	@Resource
	private RoleAreaDao roleAreaDao;
	@Resource
	private DeviceDao deviceDao;
	@Resource
	private UserInfoDao userInfoDao;
	@Resource
	private AssembleCfgDao assembleCfgDao;

	public List<Map<String, Object>> findRoleInfo(JSONObject fuzzy,
			Pagepojo pagepojo) throws Exception {
		String fuzzyKey = fuzzy.getString("key");
		String fuzzyValue = fuzzy.getString("value");

		JSONObject jsonObject = new JSONObject();

		if (Objects.isNullString(fuzzyValue)) {
			jsonObject = null;
		} else {
			for (String key : fuzzyKey.split(",")) {
				jsonObject.put(key, fuzzyValue);
			}
		}

		int total = roleAreaDao.countRoleArea(jsonObject);
		int pages = (int) Math.ceil(total * 1.0 / pagepojo.getPageSize());

		List<Map<String, Object>> list = roleAreaDao.findRoleArea(jsonObject,
				pagepojo);

		pagepojo.setTotalNum(total);
		pagepojo.setTotalPage(pages);

		JSONObject result = new JSONObject();
		result.put("code", 200);
		result.put("message", "查询成功");

		JSONObject response = new JSONObject();// 结果
		response.put("roleArea", list);
		response.put("pageInfoPojo", pagepojo);
		response.put("result", result);

		return null;
	}

	@Override
	public JSONObject findRoleArea(JSONObject fuzzy, Pagepojo pagepojo)
			throws Exception {
		String fuzzyKey = fuzzy.getString("key");
		String fuzzyValue = fuzzy.getString("value");

		JSONObject jsonObject = new JSONObject();

		if (Objects.isNullString(fuzzyValue)) {
			jsonObject = null;
		} else {
			for (String key : fuzzyKey.split(",")) {
				jsonObject.put(key, fuzzyValue);
			}
		}

		int total = roleAreaDao.countRoleArea(jsonObject);
		int pages = (int) Math.ceil(total * 1.0 / pagepojo.getPageSize());

		List<Map<String, Object>> list = roleAreaDao.findRoleArea(jsonObject,
				pagepojo);

		if (list == null) {
			return ResultUtil.simpleResponse(500, "");
		}

		pagepojo.setTotalNum(total);
		pagepojo.setTotalPage(pages);

		JSONObject result = new JSONObject();
		result.put("code", 200);
		result.put("message", "查询成功");

		JSONObject response = new JSONObject();// 结果
		response.put("roleArea", list);
		response.put("pageInfoPojo", pagepojo);
		response.put("result", result);

		return response;
	}

	@Override
	public JSONObject findByKey(JSONObject jsonObject) throws Exception {

		String devId = jsonObject.getString("devId");
		String syscode = jsonObject.getString("syscode") == null ? "%" : "%"
				+ jsonObject.getString("syscode") + "%";

		JSONObject result = new JSONObject();
		JSONObject response = new JSONObject();

		if (devId != null) {
			String areaId;
			try {
				areaId = deviceDao.getAreaIdByDevId(devId);
				jsonObject.clear();
				jsonObject.put("areaId", areaId == null ? "" : areaId);
				jsonObject.put("is_data_node", "1");
			} catch (Exception e) {
				result.put("code", 200);
				result.put("message", "查询失败");
				result.put("detail", e.getMessage());
				return response;
			}
		}

		JSONObject oject = new JSONObject();
		for (String key : jsonObject.keySet()) {
			oject.put("a." + key, jsonObject.getString(key));
		}

		List<Map<String, Object>> list = roleAreaDao.findByKey(oject, syscode);

		if (list == null) {
			return ResultUtil.simpleResponse(500, "");
		}

		List<Map<String, Object>> deleted = new ArrayList<Map<String, Object>>();

		for (Map<String, Object> map : list) {
			if ((boolean) map.get("browse_handle_data_only")
					&& !(boolean) map.get("is_handle_node")) {
				deleted.add(map);
			}
		}

		if (deleted != null && !deleted.isEmpty()) {
			list.removeAll(deleted);
		}

		result.put("code", 200);
		result.put("message", "查询成功");
		response.put("roleArea", list);
		response.put("result", result);
		return response;
	}

	@SuppressWarnings("unchecked")
	@Override
	public JSONObject addRoleArea(JSONObject jsonObejct) throws Exception {

		String roleId = jsonObejct.getString("roleId");
		String roleName = jsonObejct.getString("roleName");
		int roleType = jsonObejct.getIntValue("roleType");
		String platformId = jsonObejct.containsKey("platformId") ? jsonObejct
				.getString("platformId") : ConfigUtil.getPlatformId();

		// 权限区域的辅助节点
		JSONArray purviewAreaIdsHalf = jsonObejct
				.containsKey("purview_areaIds_half")
				&& !"".equals(jsonObejct.get("purview_areaIds_half").toString()) ? jsonObejct
				.getJSONArray("purview_areaIds_half") : new JSONArray();
		// 处置区域的辅助节点
		JSONArray handleAreaIdsHalf = jsonObejct
				.containsKey("handle_areaIds_half")
				&& !"".equals(jsonObejct.get("handle_areaIds_half").toString()) ? jsonObejct
				.getJSONArray("handle_areaIds_half") : new JSONArray();
		// 权限区域
		JSONArray purviewAreaIds = jsonObejct.containsKey("purview_areaIds")
				&& !"".equals(jsonObejct.get("purview_areaIds").toString()) ? jsonObejct
				.getJSONArray("purview_areaIds") : new JSONArray();
		// 处警区域
		JSONArray handleAreaIds = jsonObejct.containsKey("handle_areaIds")
				&& !"".equals(jsonObejct.get("handle_areaIds").toString()) ? jsonObejct
				.getJSONArray("handle_areaIds") : new JSONArray();
		// 应用ID
		JSONArray applicationIds = jsonObejct.containsKey("applicationIds")
				&& !"".equals(jsonObejct.get("applicationIds").toString()) ? jsonObejct
				.getJSONArray("applicationIds") : new JSONArray();
		// 模块ID
		JSONArray moduleIds = jsonObejct.containsKey("moduleIds")
				&& !"".equals(jsonObejct.get("moduleIds").toString()) ? jsonObejct
				.getJSONArray("moduleIds") : new JSONArray();
		JSONArray syscodes = jsonObejct.containsKey("syscodes")
				&& !"".equals(jsonObejct.get("syscodes").toString()) ? jsonObejct
				.getJSONArray("syscodes") : new JSONArray();

		String msgPush = jsonObejct.getString("msg_push");
		String fMemo = jsonObejct.getString("fMemo");

		List<String> purviewAreaIdsHalfList = (List<String>) JSON
				.parse(purviewAreaIdsHalf.toJSONString());
		List<String> handleAreaIdsHalfList = (List<String>) JSON
				.parse(handleAreaIdsHalf.toJSONString());
		List<String> purviewAreaIdsList = (List<String>) JSON
				.parse(purviewAreaIds.toJSONString());
		List<String> handleAreaIdsList = (List<String>) JSON
				.parse(handleAreaIds.toJSONString());
		List<String> applicationIdsList = (List<String>) JSON
				.parse(applicationIds.toJSONString());
		List<String> moduleIdsList = (List<String>) JSON.parse(moduleIds
				.toJSONString());
		List<String> syscodesList = (List<String>) JSON.parse(syscodes
				.toJSONString());

		int browseHandleDataOlny = "all".equals(msgPush.trim()) ? 0 : 1;

		boolean added = false;
		boolean allGood = true;

		// 添加至 imm_roleinfo
		JSONObject roleInfo = new JSONObject();
		roleInfo.put("roleId", roleId);
		roleInfo.put("roleName", roleName);
		roleInfo.put("roleType", roleType);
		roleInfo.put("fMemo", fMemo);
		roleInfo.put("default_accept_syscodes",
				Objects.Joiner(",", syscodesList));
		roleInfo.put("dataFrom", jsonObejct.getString("dataFrom"));
		roleInfo.put("platformId", platformId);

		JSONObject o = new JSONObject();
		o.put("roleId", roleId);

		if (roleAreaDao.countRoleInfo(o) > 0) {
			return ResultUtil.simpleResponse("500", "角色已经存在");
		}

		added = roleAreaDao.addRoleinfo(roleInfo);
		if (!added) {
			return ResultUtil.simpleResponse("500", "添加失败");
		}

		// 添加辅助节点至 imm_rolearea
		for (String areaId : purviewAreaIdsHalfList) {
			JSONObject roleArea = new JSONObject();
			roleArea.put("roleId", roleId);
			roleArea.put("areaId", areaId);
			roleArea.put("is_data_node", 0); // 是否数据节点
			roleArea.put("is_handle_node", 0); // 是否处置区域的节点
			roleArea.put("real_time_handel", 0); // 是否实时处置权限
			roleArea.put("real_time_browse", 0); // 是否实时浏览权限
			roleArea.put("browse_handle_data_only", browseHandleDataOlny);
			roleArea.put("dataFrom", jsonObejct.getString("dataFrom"));

			try {
				added = roleAreaDao.addRoleArea(roleArea);
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
			}

			if (!added) {
				return ResultUtil.simpleResponse("500", "参数错误");
			}
		}
		for (String areaId : handleAreaIdsHalfList) {
			JSONObject roleArea = new JSONObject();
			roleArea.put("roleId", roleId);
			roleArea.put("areaId", areaId);
			roleArea.put("is_data_node", 0); // 是否数据节点
			roleArea.put("is_handle_node", 1); // 是否处置区域的节点
			roleArea.put("real_time_handel", 0); // 是否实时处置权限
			roleArea.put("real_time_browse", 0); // 是否实时浏览权限
			roleArea.put("browse_handle_data_only", browseHandleDataOlny);
			roleArea.put("dataFrom", jsonObejct.getString("dataFrom"));

			try {
				added = roleAreaDao.addRoleArea(roleArea);
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
			}

			if (!added) {
				return ResultUtil.simpleResponse("500", "添加失败");
			}
		}

		// 添加 处置区域信息 至 imm_rolearea
		for (String areaId : handleAreaIdsList) {
			JSONObject roleArea = new JSONObject();
			roleArea.put("roleId", roleId);
			roleArea.put("areaId", areaId);
			roleArea.put("is_data_node", 1); // 是否数据节点
			roleArea.put("is_handle_node", 1); // 是否处置区域的节点
			roleArea.put("real_time_handel", 1); // 是否实时处置权限
			roleArea.put("real_time_browse", 1); // 是否实时浏览权限
			roleArea.put("browse_handle_data_only", browseHandleDataOlny);
			roleArea.put("dataFrom", jsonObejct.getString("dataFrom"));

			if (!roleAreaDao.hasRecord(areaId, 1)) {
				try {
					added = roleAreaDao.addRoleArea(roleArea);
				} catch (Exception e) {
					LOGGER.error(e.getMessage(), e);
					return ResultUtil.simpleResponse("500", "添加失败",
							e.getMessage());
				}
				if (!added) {
					return ResultUtil.simpleResponse("500", "添加失败");
				}
			} else {
				allGood = false;
			}
		}

		for (String areaId : purviewAreaIdsList) {
			JSONObject roleArea = new JSONObject();
			roleArea.put("roleId", roleId);
			roleArea.put("areaId", areaId);
			roleArea.put("is_data_node", 1); // 是否数据节点
			roleArea.put("is_handle_node", 0); // 是否处置区域的节点
			roleArea.put("real_time_handel", 1); // 是否实时处置权限
			roleArea.put("real_time_browse", 1); // 是否实时浏览权限
			roleArea.put("browse_handle_data_only", browseHandleDataOlny);
			roleArea.put("dataFrom", jsonObejct.getString("dataFrom"));
			try {
				added = roleAreaDao.addRoleArea(roleArea);
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
			}

			if (!added) {
				return ResultUtil.simpleResponse("500", "添加失败");
			}
		}

		// 添加应用权限
		for (String applicationId : applicationIdsList) {
			JSONObject roleApp = new JSONObject();
			roleApp.put("roleId", roleId);
			roleApp.put("applicationId", applicationId);
			roleApp.put("dataFrom", jsonObejct.getString("dataFrom"));

			added = roleAreaDao.addRoleApp(roleApp);

			if (!added) {
				return ResultUtil.simpleResponse("500", "添加失败");
			}

		}

		// 添加模块权限至 imm_module
		for (String moduleId : moduleIdsList) {
			JSONObject roleModule = new JSONObject();
			roleModule.put("roleId", roleId);
			roleModule.put("moduleId", moduleId);
			roleModule.put("dataFrom", jsonObejct.getString("dataFrom"));
			added = roleAreaDao.addRoleModule(roleModule);

			if (!added) {
				return ResultUtil.simpleResponse("500", "添加失败");
			}
		}

		return allGood ? ResultUtil.simpleResponse("200", "添加成功") : ResultUtil
				.simpleResponse("200", "添加成功,有处置区域已被其他角色设置");
	}

	@SuppressWarnings("unchecked")
	@Override
	public JSONObject updateRoleArea(JSONObject jsonObejct) throws Exception {

		String roleId = jsonObejct.getString("roleId");
		String roleName = jsonObejct.getString("roleName");
		int roleType = jsonObejct.getIntValue("roleType");
		String platformId = jsonObejct.containsKey("platformId") ? jsonObejct
				.getString("platformId") : ConfigUtil.getPlatformId();

		// 权限区域的辅助节点
		JSONArray purviewAreaIdsHalf = jsonObejct
				.containsKey("purview_areaIds_half")
				&& !"".equals(jsonObejct.get("purview_areaIds_half").toString()) ? jsonObejct
				.getJSONArray("purview_areaIds_half") : new JSONArray();
		// 处置区域的辅助节点
		JSONArray handleAreaIdsHalf = jsonObejct
				.containsKey("handle_areaIds_half")
				&& !"".equals(jsonObejct.get("handle_areaIds_half").toString()) ? jsonObejct
				.getJSONArray("handle_areaIds_half") : new JSONArray();
		// 权限区域
		JSONArray purviewAreaIds = jsonObejct.containsKey("purview_areaIds")
				&& !"".equals(jsonObejct.get("purview_areaIds").toString()) ? jsonObejct
				.getJSONArray("purview_areaIds") : new JSONArray();
		// 处警区域
		JSONArray handleAreaIds = jsonObejct.containsKey("handle_areaIds")
				&& !"".equals(jsonObejct.get("handle_areaIds").toString()) ? jsonObejct
				.getJSONArray("handle_areaIds") : new JSONArray();
		// 应用ID
		JSONArray applicationIds = jsonObejct.containsKey("applicationIds")
				&& !"".equals(jsonObejct.get("applicationIds").toString()) ? jsonObejct
				.getJSONArray("applicationIds") : new JSONArray();
		// 模块ID
		JSONArray moduleIds = jsonObejct.containsKey("moduleIds")
				&& !"".equals(jsonObejct.get("moduleIds").toString()) ? jsonObejct
				.getJSONArray("moduleIds") : new JSONArray();

		JSONArray syscodes = jsonObejct.containsKey("syscodes")
				&& !"".equals(jsonObejct.get("syscodes").toString()) ? jsonObejct
				.getJSONArray("syscodes") : new JSONArray();

		String msgPush = jsonObejct.getString("msg_push");
		String fMemo = jsonObejct.getString("fMemo");

		List<String> purviewAreaIdsHalfList = (List<String>) JSON
				.parse(purviewAreaIdsHalf.toJSONString());
		List<String> handleAreaIdsHalfList = (List<String>) JSON
				.parse(handleAreaIdsHalf.toJSONString());
		List<String> purviewAreaIdsList = (List<String>) JSON
				.parse(purviewAreaIds.toJSONString());
		List<String> handleAreaIdsList = (List<String>) JSON
				.parse(handleAreaIds.toJSONString());
		List<String> applicationIdsList = (List<String>) JSON
				.parse(applicationIds.toJSONString());
		List<String> moduleIdsList = (List<String>) JSON.parse(moduleIds
				.toJSONString());
		List<String> syscodesList = (List<String>) JSON.parse(syscodes
				.toJSONString());

		int browseHandleDataOlny = "all".equals(msgPush.trim()) ? 0 : 1;

		boolean updated = false;

		// 更新 imm_roleinfo
		JSONObject roleInfo = new JSONObject();
		roleInfo.put("roleName", roleName == null ? "" : roleName);
		roleInfo.put("roleType", roleType);
		roleInfo.put("fMemo", fMemo == null ? "" : fMemo);
		roleInfo.put("default_accept_syscodes",
				Objects.Joiner(",", syscodesList));
		roleInfo.put("platformId", platformId);

		updated = roleAreaDao.updateRoleinfo(roleInfo, roleId);
		if (!updated) {
			return ResultUtil.simpleResponse("500", "修改失败");
		}

		// TODO
		// 更新角色区域，先删除久的所有区域，再重新添加，正确的做法是应该每个区域都去具体修改
		// 此处做法有风险
		roleAreaDao.deleteRoleAreaByRoleId(roleId);

		// 添加辅助节点至 imm_rolearea
		for (String areaId : purviewAreaIdsHalfList) {
			JSONObject roleArea = new JSONObject();
			roleArea.put("roleId", roleId);
			roleArea.put("areaId", areaId);
			roleArea.put("is_data_node", 0); // 是否数据节点
			roleArea.put("is_handle_node", 0); // 是否处置区域的节点
			roleArea.put("real_time_handel", 0); // 是否实时处置权限
			roleArea.put("real_time_browse", 0); // 是否实时浏览权限
			roleArea.put("browse_handle_data_only", browseHandleDataOlny);

			try {
				updated = roleAreaDao.addRoleArea(roleArea);
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "修改失败", e.getMessage());
			}

			if (!updated) {
				return ResultUtil.simpleResponse("500", "修改失败");
			}
		}
		for (String areaId : handleAreaIdsHalfList) {
			JSONObject roleArea = new JSONObject();
			roleArea.put("roleId", roleId);
			roleArea.put("areaId", areaId);
			roleArea.put("is_data_node", 0); // 是否数据节点
			roleArea.put("is_handle_node", 1); // 是否处置区域的节点
			roleArea.put("real_time_handel", 0); // 是否实时处置权限
			roleArea.put("real_time_browse", 0); // 是否实时浏览权限
			roleArea.put("browse_handle_data_only", browseHandleDataOlny);

			try {
				updated = roleAreaDao.addRoleArea(roleArea);
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "修改失败", e.getMessage());
			}

			if (!updated) {
				return ResultUtil.simpleResponse("500", "修改失败");
			}
		}

		// 添加 处置区域信息 至 imm_rolearea
		for (String areaId : handleAreaIdsList) {
			JSONObject roleArea = new JSONObject();
			roleArea.put("roleId", roleId);
			roleArea.put("areaId", areaId);
			roleArea.put("is_data_node", 1); // 是否数据节点
			roleArea.put("is_handle_node", 1); // 是否处置区域的节点
			roleArea.put("real_time_handel", 1); // 是否实时处置权限
			roleArea.put("real_time_browse", 1); // 是否实时浏览权限
			roleArea.put("browse_handle_data_only", browseHandleDataOlny);

			try {
				updated = roleAreaDao.addRoleArea(roleArea);
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "修改失败", e.getMessage());
			}

			if (!updated) {
				return ResultUtil.simpleResponse("500", "修改失败");
			}
		}
		// 添加 权限区域信息（不包括已经添加的处置区域） 至 imm_rolearea
		for (String areaId : purviewAreaIdsList) {
			JSONObject roleArea = new JSONObject();
			roleArea.put("roleId", roleId);
			roleArea.put("areaId", areaId);
			roleArea.put("is_data_node", 1); // 是否数据节点
			roleArea.put("is_handle_node", 0); // 是否处置区域的节点
			roleArea.put("real_time_handel", 1); // 是否实时处置权限
			roleArea.put("real_time_browse", 1); // 是否实时浏览权限
			roleArea.put("browse_handle_data_only", browseHandleDataOlny);
			try {
				updated = roleAreaDao.addRoleArea(roleArea);
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "修改失败", e.getMessage());
			}

			if (!updated) {
				return ResultUtil.simpleResponse("500", "修改失败");
			}
		}

		roleAreaDao.deleteRoleAppByRoleId(roleId);
		// 添加应用权限
		for (String applicationId : applicationIdsList) {
			JSONObject roleApp = new JSONObject();
			roleApp.put("roleId", roleId);
			roleApp.put("applicationId", applicationId);

			updated = roleAreaDao.addRoleApp(roleApp);

			if (!updated) {
				return ResultUtil.simpleResponse("500", "修改失败");
			}

		}

		roleAreaDao.deleteRoleModuleByRoleId(roleId);
		// 添加模块权限至 imm_module
		for (String moduleId : moduleIdsList) {
			JSONObject roleModule = new JSONObject();
			roleModule.put("roleId", roleId);
			roleModule.put("moduleId", moduleId);
			updated = roleAreaDao.addRoleModule(roleModule);

			if (!updated) {
				return ResultUtil.simpleResponse("500", "修改失败");
			}
		}

		return ResultUtil.simpleResponse("200", "修改成功");
	}

	@Override
	public JSONObject deleteRoleArea(JSONObject jsonObejct) throws Exception {

		String roleId = jsonObejct.getString("roleId");
		try {
			roleAreaDao.deleteRoleInfo(roleId);

			roleAreaDao.deleteRoleAreaByRoleId(roleId);

			roleAreaDao.deleteRoleAppByRoleId(roleId);

			roleAreaDao.deleteRoleModuleByRoleId(roleId);

			roleAreaDao.setRoleId2NullForUserinfo(roleId);

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}

		return ResultUtil.simpleResponse("200", "删除成功");
	}

	@Override
	public JSONObject listRoleInfo(JSONObject fuzzy, Pagepojo pagepojo)
			throws Exception {

		String fuzzyKey = fuzzy.getString("key");
		String fuzzyValue = fuzzy.getString("value");
		JSONObject jsonObject = new JSONObject();
		if (Objects.isNullString(fuzzyValue)) {
			jsonObject = null;
		} else {
			for (String key : fuzzyKey.split(",")) {
				jsonObject.put(key, fuzzyValue);
			}
		}

		int total = 0;
		try {
			total = roleAreaDao.countRoleInfo(jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}
		int pages = (int) Math.ceil(total * 1.0 / pagepojo.getPageSize());

		List<Map<String, Object>> list = roleAreaDao.findRoleInfo(jsonObject,
				pagepojo);

		if (list == null) {
			return ResultUtil.simpleResponse(500, "");
		}

		JSONObject result = new JSONObject();
		result.put("code", 200);
		result.put("message", "查询成功");

		JSONObject response = new JSONObject();

		pagepojo.setTotalNum(total);
		pagepojo.setTotalPage(pages);
		response.put("roleinfo", list);
		response.put("pageInfoPojo", pagepojo);
		response.put("result", result);

		return response;
	}

	@SuppressWarnings("unused")
	@Override
	public JSONObject getRoleInfoByRoleId(JSONObject jsonObject)
			throws Exception {
		String roleId = jsonObject.getString("roleId");

		JSONObject response = new JSONObject();
		JSONArray purviewAreaIdsHalf = new JSONArray();
		JSONArray purviewAreaNamesHalf = new JSONArray();
		JSONArray handleAreaIdsHalf = new JSONArray();
		JSONArray handleAreaNamesHalf = new JSONArray();
		JSONArray purviewAreaIds = new JSONArray();
		JSONArray purviewAreaNames = new JSONArray();
		JSONArray handleAreaIds = new JSONArray();
		JSONArray handleAreaNames = new JSONArray();
		String msgPush = "all";
		List<Map<String, Object>> roleInfo = null;
		try {
			roleInfo = roleAreaDao.getRoleInfoByRoleId(roleId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}
		if (roleInfo != null && !roleInfo.isEmpty()) {
			for (Map<String, Object> map : roleInfo) {
				response.put("roleId", map.get("roleId").toString());
				response.put("roleType", map.get("roleType").toString());
				response.put("roleName", map.get("roleName") == null ? "" : map
						.get("roleName").toString());
				response.put("platformId", map.get("platformId").toString());
				response.put(
						"platformName",
						map.get("platformName") == null ? "" : map.get(
								"platformName").toString());
				response.put("fMemo",
						map.get("fMemo") == null ? "" : map.get("fMemo")
								.toString());
				response.put(
						"default_accept_syscodes",
						map.get("default_accept_syscodes") == null ? new String[] {}
								: map.get("default_accept_syscodes").toString()
										.split(","));
			}
		}

		// 获取权限区域的非数据节点
		List<Map<String, Object>> purviewAreasHalf = roleAreaDao
				.getRoleAreasByRoleId(roleId, "0", "0","");
		if (purviewAreasHalf != null && !purviewAreasHalf.isEmpty()) {
			for (Map<String, Object> map : purviewAreasHalf) {

				if (map.get("areaId") == null || map.get("areaName") == null) {
					LOGGER.info("{} 区域ID或区域名为空 {}", roleId, map.toString());
					continue;
				}
				purviewAreaIdsHalf.add(map.get("areaId").toString());
				purviewAreaNamesHalf.add(map.get("areaName").toString());
			}
		}
		// 获取处置区域的非数据节点
		List<Map<String, Object>> handleAreasHalf = roleAreaDao
				.getRoleAreasByRoleId(roleId, "0", "1","");
		if (handleAreasHalf != null && !handleAreasHalf.isEmpty()) {
			for (Map<String, Object> map : handleAreasHalf) {
				if (map.get("areaId") == null || map.get("areaName") == null) {
					LOGGER.info("{} 区域ID或区域名为空 {}", roleId, map.toString());
					continue;
				}
				handleAreaIdsHalf.add(map.get("areaId").toString());
				handleAreaNamesHalf.add(map.get("areaName").toString());
			}
		}

		// 获取权限区域的数据节点
		List<Map<String, Object>> purviewAreas = roleAreaDao
				.getRoleAreasByRoleId(roleId, "1", "0","");
		if (purviewAreas != null && !purviewAreas.isEmpty()) {
			for (Map<String, Object> map : purviewAreas) {
				if (map.get("areaId") == null || map.get("areaName") == null) {
					LOGGER.info("{} 区域ID或区域名为空 {}", roleId, map.toString());
					continue;
				}
				purviewAreaIds.add(map.get("areaId").toString());
				purviewAreaNames.add(map.get("areaName").toString());
			}
		}

		// 获取权限区域的数据节点
		List<Map<String, Object>> handleAreas = roleAreaDao
				.getRoleAreasByRoleId(roleId, "1", "1","");
		if (handleAreas != null && !handleAreas.isEmpty()) {
			for (Map<String, Object> map : handleAreas) {

				if (map.get("areaId") == null || map.get("areaName") == null) {
					LOGGER.info("{} 区域ID或区域名为空 {}", roleId, map.toString());
					continue;
				}
				handleAreaIds.add(map.get("areaId").toString());
				handleAreaNames.add(map.get("areaName").toString());

				if (map.get("browse_handle_data_only") == null) {
					msgPush = "all";
				} else {
					msgPush = (boolean) map.get("browse_handle_data_only") ? "handle_areas_only"
							: "all";
				}

			}
		}

		List<String> applicationIds = roleAreaDao
				.getApplicationIdByRoleId(roleId);
		List<String> moduleIds = roleAreaDao.getModuleIdByRoleId(roleId);

		response.put("purview_areaIds_half", purviewAreaIdsHalf);
		response.put("purview_areaNames_half", purviewAreaNamesHalf);
		response.put("handle_areaIds_half", handleAreaIdsHalf);
		response.put("handle_areaNames_half", handleAreaNamesHalf);
		response.put("purview_areaIds", purviewAreaIds);
		response.put("purview_areaNames", purviewAreaNames);
		response.put("handle_areaIds", handleAreaIds);
		response.put("handle_areaNames", handleAreaNames);
		response.put("applicationIds", applicationIds);
		response.put("moduleIds", moduleIds);
		response.put("msg_push", msgPush);

		return response;

	}

	@Override
	public JSONObject getRoleInfoByUserId(JSONObject jsonObject)
			throws Exception {
		String roleId, userId = null;
		try {
			userId = jsonObject.getString("userId");
			roleId = userInfoDao.getRoleIdByUserId(userId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}
		JSONObject object = new JSONObject();
		object.put("roleId", roleId);
		return getRoleInfoByRoleId(object);
	}

	@Override
	public List<String> getPurviewAreaIdsByUserId(String userId)
			throws Exception {
		try {
			String roleId = userInfoDao.getRoleIdByUserId(userId);
			return getPurviewAreaIdsByRoleId(roleId);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public List<String> getPurviewAreaIdsByRoleId(String roleId)
			throws Exception {
		return roleAreaDao.getPurviewAreaIdsByRoleId(roleId);
	}

	@Override
	public List<String> getUserAccountsByRoleId(String roleId) throws Exception {
		return roleAreaDao.getUserAccountsByRoleId(roleId);
	}

	@Override
	public JSONObject getUserIdsBydevId(JSONObject jsonObject) throws Exception {

		String devId = jsonObject.getString("devId");
		String areaId = deviceDao.getAreaIdByDevId(devId);
		if (areaId == null) {
			JSONObject response = new JSONObject();
			response.put("userIds", new ArrayList<Map<String, Object>>());
			return response;
		}

		List<Map<String, Object>> only = roleAreaDao.getRoleIdsByAreaId(areaId,
				"1", "1", "1");
		List<Map<String, Object>> all = roleAreaDao.getRoleIdsByAreaId(areaId,
				"1", "0", "0");

		if (only == null) {
			only = new ArrayList<Map<String, Object>>();
		}

		if (all != null && !all.isEmpty()) {
			only.addAll(all);
		}

		if (only.isEmpty()) {
			JSONObject response = new JSONObject();
			response.put("userIds", new ArrayList<Map<String, Object>>());
			return response;
		}

		List<String> roleIds = new ArrayList<String>();
		for (Map<String, Object> map : only) {
			roleIds.add(map.get("roleId").toString());
		}

		if (roleIds.isEmpty()) {
			JSONObject response = new JSONObject();
			response.put("userIds", new ArrayList<Map<String, Object>>());
			return response;
		}

		List<String> userIds = userInfoDao.getUserIdsByRoleIds(roleIds);
		JSONObject response = new JSONObject();
		response.put("userIds", userIds);

		return response;

	}

	@Override
	public JSONObject getAlreadyChooseHandleAreas(JSONObject jsonObject)
			throws Exception {
		JSONObject response = new JSONObject();

		String roleId = jsonObject.getString("roleId");

		List<String> alreadyChooseHandleAreas = new ArrayList<String>();

		List<Map<String, Object>> result = roleAreaDao
				.getAlreadyChooseHandleAreas(roleId);

		if (result != null && !result.isEmpty()) {
			for (Map<String, Object> map : result) {
				alreadyChooseHandleAreas.add(map.get("areaId").toString());
			}
		}

		JSONArray array = (JSONArray) JSONArray
				.toJSON(alreadyChooseHandleAreas);

		response.put("areaIds", array);
		return response;
	}

	public JSONObject getUserIdsByRoleIds(List<String> roleIds)
			throws Exception {
		JSONObject response = new JSONObject();

		if (roleIds == null || roleIds.isEmpty()) {
			response.put("userIds", new ArrayList<String>());
			return response;
		}
		List<String> userIds = userInfoDao.getUserIdsByRoleIds(roleIds);
		response.put("userIds", userIds);
		return response;
	}
}
