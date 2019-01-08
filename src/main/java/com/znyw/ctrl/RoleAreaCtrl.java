package com.znyw.ctrl;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.Pagepojo;
import com.znyw.service.RoleAreaService;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultUtil;

/**
 * 权限控制器
 * 
 * @author teclan
 * 
 *         email: tbj621@163.com
 *
 *         2017年11月17日
 */
@Controller
public class RoleAreaCtrl {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(RoleAreaCtrl.class);

	@Resource
	private RoleAreaService roleAreaService;

	/**
	 * 添加角色
	 * 
	 * @param jsonObejct
	 * 
	 *            {
	 * 
	 *            "roleId":"角色编号",
	 * 
	 *            "roleName":"权限名称",
	 * 
	 *            "roleType":"角色类型",
	 * 
	 *            "purview_areaIds_half":["半选权限区域ID_1","半选权限区域ID_2",...],
	 * 
	 *            "handle_areaIds_half":["半选处警区域ID_1","半选处警区域ID_2",...],
	 * 
	 *            "purview_areaIds":["权限区域ID_1","权限区域ID_2",...],
	 * 
	 *            "handle_areaIds":["处警区域ID_1","处警区域ID_2",...],
	 * 
	 *            "applicationIds":["应用ID_1","应用ID_2",...], // 参考表
	 *            imm_application
	 * 
	 *            "moduleIds":["模块ID_1","模块ID_2",...], // 参考表 imm_module
	 * 
	 *            "msg_push":"事件信息推送" // "all" || "handle_areas_only"
	 *            "fmemo":"备注"
	 * 
	 *            }
	 * 
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/roleArea/add")
	public JSONObject addRoleArea(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);

			JSONObject jsonObject = JSONObject.parseObject(stringParam);
			if (!jsonObject.containsKey("dataFrom")
					|| "".equals(jsonObject.get("dataFrom"))) {
				jsonObject.put("dataFrom", ConfigUtil.getPlatformId());
			}
			return roleAreaService.addRoleArea(jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "接口异常", e.getMessage());
		}
	}

	/**
	 * 更新角色信息，参数与添加角色参数一致
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/roleArea/update")
	public JSONObject updateRoleArea(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);
			JSONObject jsonObject = JSONObject.parseObject(stringParam);
			return roleAreaService.updateRoleArea(jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "接口异常", e.getMessage());
		}
	}

	/**
	 * 删除角色
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/roleArea/delete")
	public JSONObject deleteRoleArea(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);
			JSONObject jsonObject = JSONObject.parseObject(stringParam);
			return roleAreaService.deleteRoleArea(jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "接口异常", e.getMessage());
		}
	}

	/**
	 * 通过角色编号获取角色的详细信息，要求参数包括 roleId、roleName、roleType、roleTypeName、fMemo
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/roleArea/getRoleInfoByRoleId")
	public JSONObject getRoleInfoByRoleId(HttpServletRequest request,
			HttpServletResponse response) {

		try {
			String stringParam = HttpTool.readJSONString(request);
			JSONObject jsonObject = JSONObject.parseObject(stringParam);
			return roleAreaService.getRoleInfoByRoleId(jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "参数错误", e.getMessage());
		}
	}

	@ResponseBody
	@RequestMapping("/roleArea/getRoleInfoByUserId")
	public JSONObject getRoleInfoByUserId(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);
			JSONObject jsonObject = JSONObject.parseObject(stringParam);
			return roleAreaService.getRoleInfoByUserId(jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "参数错误", e.getMessage());
		}
	}
	
	@ResponseBody
	@RequestMapping("/roleArea/getRoleInfoByUserIdFromRDAcener")
	public JSONObject getRoleInfoByUserIdFromRDAcener(
			HttpServletRequest request, HttpServletResponse response,
			@ModelAttribute("json") String json) {

		try {
			JSONObject jsonObject = JSONObject.parseObject(json);
			return roleAreaService.getRoleInfoByUserId(jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "参数错误", e.getMessage());
		}
	}

	@ResponseBody
	@RequestMapping("/roleArea/listRoleInfo")
	public JSONObject listRoleInfo(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);
			JSONObject jsonObject = JSONObject.parseObject(stringParam);
			Pagepojo pagepojo = jsonObject
					.getObject("pagepojo", Pagepojo.class);
			JSONObject fuzzy = jsonObject.getJSONObject("fuzzy");
			return roleAreaService.listRoleInfo(fuzzy, pagepojo);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "接口异常", e.getMessage());
		}
	}

	@ResponseBody
	@RequestMapping("/roleArea/list")
	public JSONObject findRole(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);
			JSONObject jsonObject = JSONObject.parseObject(stringParam);
			Pagepojo pagepojo = jsonObject
					.getObject("pagepojo", Pagepojo.class);
			JSONObject fuzzy = jsonObject.getJSONObject("fuzzy");
			return roleAreaService.findRoleArea(fuzzy, pagepojo);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "参数错误", e.getMessage());
		}
	}

	/**
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/roleArea/findByKey")
	public JSONObject findByKey(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);
			JSONObject jsonObject = JSONObject.parseObject(stringParam);
			JSONObject result = roleAreaService.findByKey(jsonObject);
			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "参数错误", e.getMessage());
		}
	}

	@ResponseBody
	@RequestMapping("/roleArea/getUserIdsBydevId")
	public JSONObject getUserIdsBydevId(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject jsonObject = JSONObject.parseObject(json);
			return roleAreaService.getUserIdsBydevId(jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "错误", e.getMessage());
		}
	}

	@ResponseBody
	@RequestMapping("/roleArea/getAlreadyChooseHandleAreas")
	public JSONObject getAlreadyChooseHandleAreas(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);
			JSONObject jsonObject = JSONObject.parseObject(stringParam);
			return roleAreaService.getAlreadyChooseHandleAreas(jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	}

	@SuppressWarnings("unchecked")
	@ResponseBody
	@RequestMapping("/roleArea/getUserIdsByRoleIds")
	public JSONObject getUserIdsByRoleIds(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject jsonObject = JSONObject.parseObject(json);
			JSONArray array = jsonObject.getJSONArray("roleIds");
			List<String> roleIds = (List<String>) JSON.parse(array
					.toJSONString());
			return roleAreaService.getUserIdsByRoleIds(roleIds);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	}

}
