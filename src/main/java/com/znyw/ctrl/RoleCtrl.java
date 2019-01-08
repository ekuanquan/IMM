package com.znyw.ctrl;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.znyw.service.RoleService;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultUtil;

@Controller
@RequestMapping("/role")
public class RoleCtrl {
	private static Logger LOGGER = LoggerFactory.getLogger(RoleCtrl.class);
	@Resource
	private RoleService roleService;

	@RequestMapping("/getRoleListByRD")
	// 雪亮万家获取转发类型列表
	@ResponseBody
	public JSONObject getRoleListByRD(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json)
			throws Exception { // 根据设备编号、防区编号、系统码获取相关信息
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			JSONObject josn = roleService.getRoleListByRDService(jsonParam);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@RequestMapping("/transmitList")
	// 雪亮万家获取转发类型列表
	@ResponseBody
	public JSONObject transmitList(HttpServletRequest request,
			HttpServletResponse response) throws Exception { // 根据设备编号、防区编号、系统码获取相关信息
		return roleService.transmitListService();
	}

	@RequestMapping("/transmitSetRole")
	// 雪亮万家设置角色的转发类型
	@ResponseBody
	public JSONObject transmitSetRole(HttpServletRequest request,
			HttpServletResponse response) throws Exception { // 根据设备编号、防区编号、系统码获取相关信息
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			JSONObject JSON = roleService.transmitSetRoleService(json);
			return JSON;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@RequestMapping("/transmitGetRole")
	// 雪亮万家获取角色的转发类型
	@ResponseBody
	public JSONObject transmitGetRole(HttpServletRequest request,
			HttpServletResponse response) throws Exception { // 根据设备编号、防区编号、系统码获取相关信息
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			JSONObject JSON = roleService.transmitGetRoleService(json);
			return JSON;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@RequestMapping("/transmitDeleteRole")
	// 雪亮万家删除角色的转发类型
	@ResponseBody
	public JSONObject transmitDeleteRole(HttpServletRequest request,
			HttpServletResponse response) throws Exception { // 根据设备编号、防区编号、系统码获取相关信息
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			JSONObject JSON = roleService.transmitDeletRoleService(json);
			return JSON;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@RequestMapping("/queryRole")
	// 根据角色类型、角色编号、角色名称，模糊查询角色列表
	@ResponseBody
	public JSONObject queryRole(HttpServletRequest request,
			HttpServletResponse response) throws Exception { // 根据设备编号、防区编号、系统码获取相关信息
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			JSONObject pageInfoPojo = json.getJSONObject("pageInfoPojo");
			String roleType = json.getString("roleType");
			boolean handleOnly = json.containsKey("handleOnly") ? json
					.getBooleanValue("handleOnly") : false;
			String strvalue = json.getString("value");
			String pageSize = pageInfoPojo.getString("pageSize");
			String currentPage = pageInfoPojo.getString("currentPage");
			String sort = pageInfoPojo.getString("sort");
			JSONObject JSON = roleService.queryRoleService(roleType,
					handleOnly, sort, pageSize, currentPage, strvalue);
			return JSON;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}
}
