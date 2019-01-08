package com.znyw.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.DeviceDao;
import com.znyw.dao.RoleDao;
import com.znyw.service.RoleService;
import com.znyw.tool.HttpClientTool;
import com.znyw.tool.ResultUtil;

@Service
public class RoleServiceImpl implements RoleService {
	private static Logger LOGGER = Logger.getLogger(RoleServiceImpl.class);
	@Resource
	private RoleDao roleDaoImpl;
	@Resource
	private DeviceDao deviceDaoImpl;

	@Override
	public JSONObject delRoleService(String roleId) {
		JSONObject roleJson = new JSONObject();
		JSONObject result = new JSONObject();
		JSONObject json = roleDaoImpl.delRoleDao(roleId);
		result.put("message", "成功");
		result.put("code", "200");
		roleJson.put("result", result);
		return roleJson;
	}

	@Override
	public JSONObject roleDevService(String roleId) { // 根据角色编号获取相关设备信息
		List deviceList = new ArrayList<JSONObject>();
		List listObject = roleDaoImpl.getRoleDev(roleId);
		for (int i = 0; i < listObject.size(); i++) {
			deviceList.add(JSONObject.toJSON(listObject.get(i)));
		}

		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		if (deviceList.size() > 0) {
			result.put("code", "200");
			result.put("message", "success");
			Userjosn.put("json", deviceList);
			Userjosn.put("result", result);
		} else {
			result.put("code", "201");
			result.put("message", "失败");
			Userjosn.put("result", result);
			Userjosn.put("json", deviceList);
		}
		return Userjosn;
	}

	@SuppressWarnings("unchecked")
	@Override
	public JSONObject getlRolePermissionService(String roleId) { // 根据角色编号获取相关权限信息
		List deviceList = new ArrayList<JSONObject>();
		List listObject = roleDaoImpl.getlRolePermissionDao(roleId);
		for (int i = 0; i < listObject.size(); i++) {
			deviceList.add(JSONObject.toJSON(listObject.get(i)));
		}

		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		if (deviceList.size() > 0) {
			result.put("code", "200");
			result.put("message", "success");
			Userjosn.put("json", deviceList);
			Userjosn.put("result", result);
		} else {
			result.put("code", "201");
			result.put("message", "失败");
			Userjosn.put("result", result);
			Userjosn.put("json", deviceList);
		}
		return Userjosn;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public JSONObject getAddDevNumService(JSONObject json) {
		String devType = json.getString("devType");
		String userType = json.getString("userType");
		List deviceList = new ArrayList<JSONObject>();
		List listObject = roleDaoImpl.getAddDevNum(devType, userType);
		for (int i = 0; i < listObject.size(); i++) {
			deviceList.add(JSONObject.toJSON(listObject.get(i)));
		}

		JSONObject Devjosn = new JSONObject();
		JSONObject result = new JSONObject();

		if (deviceList.size() > 0) {
			result.put("code", "200");
			result.put("message", "success");
			Devjosn.put("json", deviceList);
			Devjosn.put("result", result);
		} else {
			result.put("code", "201");
			result.put("message", "失败");
			Devjosn.put("result", result);
			Devjosn.put("json", deviceList);
		}
		return Devjosn;
	}

	@Override
	public JSONObject transmitListService() {
		try {
			JSONObject jsonObject = new JSONObject();
			String resultStr = HttpClientTool.get("api/transmit/list",
					jsonObject.toJSONString());
			return JSONObject.parseObject(resultStr);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}
	}

	@Override
	public JSONObject transmitSetRoleService(JSONObject json) {
		try {
			String resultStr = HttpClientTool.post("api/transmit/set/role",
					json.toJSONString());
			return JSONObject.parseObject(resultStr);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}
	}

	@Override
	public JSONObject transmitGetRoleService(JSONObject json) {

		try {
			String resultStr = HttpClientTool.post("api/transmit/get/role",
					json.toJSONString());
			return JSONObject.parseObject(resultStr);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}
	}

	@Override
	public JSONObject transmitDeletRoleService(JSONObject json) {

		try {
			String resultStr = HttpClientTool.post("api/transmit/delete/role",
					json.toJSONString());
			return JSONObject.parseObject(resultStr);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public JSONObject queryRoleService(String roleType, boolean handleOnly,
			String sort, String pageSize, String currentPage, String value) {
		// 根据角色类型查询。
		JSONObject roleJson = new JSONObject();
		JSONObject result = new JSONObject();
		JSONObject pageInfoPojo = new JSONObject();

		sort = sort.contains("DESC") ? " DESC " : " ASC ";

		Map<String, Object> map = null;
		try {
			map = (Map<String, Object>) roleDaoImpl.queryRoleDao(roleType,
					handleOnly, sort, pageSize, currentPage, value); // 角色类型，每页条数，当前页面
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}

		List list = (List) map.get("list");

		Integer totalNum = (Integer) map.get("totalNum");
		int pageSizeInt = Integer.parseInt(pageSize);

		int totalPage;
		if (totalNum % pageSizeInt == 0) {
			totalPage = totalNum / pageSizeInt;
		} else {
			totalPage = totalNum / pageSizeInt + 1;
		}

		result.put("message", "成功");
		result.put("code", 200);
		pageInfoPojo.put("pageSize", pageSizeInt);
		pageInfoPojo.put("totalNum", totalNum);
		pageInfoPojo.put("currentPage", currentPage);
		pageInfoPojo.put("totalPage", totalPage);
		roleJson.put("result", result);
		roleJson.put("json", list);
		roleJson.put("pageInfoPojo", pageInfoPojo);
		return roleJson;

	}

	@Override
	public JSONObject getRoleListByRDService(JSONObject jsonObject) {
		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		try {
			List List = roleDaoImpl.getRoleListByRDDao();
			result.put("code", "200");
			result.put("message", "成功");
			Userjosn.put("json", List);

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result.put("code", "201");
			result.put("message", "失败");
			Userjosn.put("json", null);
		}

		Userjosn.put("result", result);
		return Userjosn;
	}
}
