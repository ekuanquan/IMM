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
import com.znyw.service.UserStateMonitorService;
import com.znyw.tool.ResultUtil;

@Controller
@RequestMapping("/UserStateMonitor")
public class UserStateMonitorCtrl {
	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	@Resource
	private UserStateMonitorService userStateMonitorService;

	/**
	 * 弹窗里请求用户行业列表
	 * 
	 * @param
	 */

	@RequestMapping("/getUserIndustry")
	@ResponseBody
	public JSONObject getUserIndustry(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		JSONObject josn = userStateMonitorService.getUserIndustryService();
		return josn;
	}

	/**
	 * 条件查询用户状态监听列表
	 * 
	 * @param 用户编号or用户名称or负责人电话
	 * @param 监控状态
	 * @param 查询的用户范围
	 * @param pageInfoPojo
	 *            分页对象
	 */

	@RequestMapping("/getUserStateList")
	@ResponseBody
	public JSONObject getUserStateList(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			String groupId = jsonParam.getString("groupId");
			String queryValue = jsonParam.getString("queryValue");
			String checkId = jsonParam.getString("checkId");
			String userId = jsonParam.getString("userId");
			JSONObject pageInfoPojo = jsonParam.getJSONObject("pageInfoPojo");
			String pageSize = pageInfoPojo.getString("pageSize");
			String currentPage = pageInfoPojo.getString("currentPage");
			JSONObject josn = userStateMonitorService
					.getUserStateListService(userId, groupId, queryValue,
							checkId, pageSize, currentPage);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	/**
	 * 弹窗里条件查询候选的用户监控状态列表
	 * 
	 * @param 用户编号or用户名称
	 * @param 行业
	 * @param 区域编号
	 * @param pageInfoPojo
	 *            分页对象
	 */

	@RequestMapping("/queryAddUserStateList")
	@ResponseBody
	public JSONObject queryAddUserStateList(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			JSONObject pageInfoPojo = jsonParam.getJSONObject("pageInfoPojo");
			String userValue = jsonParam.getString("userValue");
			String userId = jsonParam.getString("userId");
			String businessId = jsonParam.getString("businessId");
			String pageSize = pageInfoPojo.getString("pageSize");
			String currentPage = pageInfoPojo.getString("currentPage");
			JSONObject josn = userStateMonitorService
					.queryAddUserStateListService(userId, userValue,
							businessId, pageSize, currentPage);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	/**
	 * 添加用户分组
	 * 
	 * @param 分组编号
	 * @param 分组名称
	 * @param 用户编号列表
	 */

	@RequestMapping("/addGroup")
	@ResponseBody
	public JSONObject addGroup(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			String groupId = jsonParam.getString("groupId");
			String groupName = jsonParam.getString("groupName");
			String userId = jsonParam.getString("userId");
			JSONArray addUserList = jsonParam.getJSONArray("addUserList");
			JSONObject josn = userStateMonitorService.addGroupService(groupId,
					groupName, userId, addUserList);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	/**
	 * 查询用户分组
	 * 
	 * @param userId
	 */

	@RequestMapping("/getGroup")
	@ResponseBody
	public JSONObject getGroup(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			String userId = jsonParam.getString("userId");
			JSONObject josn = userStateMonitorService.getGroupService(userId);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	/**
	 * 查询该分组信息
	 * 
	 * @param groupId
	 */

	@RequestMapping("/queryGroupData")
	@ResponseBody
	public JSONObject queryGroupData(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			String groupId = jsonParam.getString("groupId");
			JSONObject josn = userStateMonitorService
					.queryGroupDataService(groupId);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	/**
	 * 修改分组信息
	 * 
	 * @param 分组编号
	 * @param 分组名称
	 * @param 用户编号列表
	 */

	@RequestMapping("/editGroup")
	@ResponseBody
	public JSONObject editGroup(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			String groupId = jsonParam.getString("groupId");
			String groupName = jsonParam.getString("groupName");
			JSONArray addUserList = jsonParam.getJSONArray("addUserList");
			JSONObject josn = userStateMonitorService.editGroupService(groupId,
					groupName, addUserList);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	/**
	 * 删除该分组信息
	 * 
	 * @param groupId
	 */

	@RequestMapping("/deleteGroup")
	@ResponseBody
	public JSONObject deleteGroup(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			String groupId = jsonParam.getString("groupId");
			JSONObject josn = userStateMonitorService
					.deleteGroupService(groupId);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	/**
	 * 查询该用户状态信息
	 * 
	 * @param groupId
	 */

	@RequestMapping("/getUserStateData")
	@ResponseBody
	public JSONObject getUserStateData(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			String userId = jsonParam.getString("userId");
			JSONObject josn = userStateMonitorService
					.getUserStateDataService(userId);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	/**
	 * 查询该用户旁路信息
	 * 
	 * @param
	 */

	@RequestMapping("/getByPassData")
	@ResponseBody
	public JSONObject getByPassData(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			String userId = jsonParam.getString("userId");
			JSONObject josn = userStateMonitorService
					.getByPassDataService(userId);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@RequestMapping("/addGroupAllUser")
	@ResponseBody
	public JSONObject addGroupAllUser(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			String userId = jsonParam.getString("userId");
			String businessId = jsonParam.getString("businessId");
			String userValue = jsonParam.getString("userValue");
			JSONObject josn = userStateMonitorService.addGroupAllUserService(
					userId, businessId, userValue);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	/**
	 * 通过设备的id获取设备和设备子系统的布撤防状态
	 * 
	 * @param request
	 * @param response
	 * @param json
	 * @return
	 */
	@RequestMapping("/getChildInfoByDevId")
	@ResponseBody
	public JSONObject getChildInfoByDevId(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			String devId = jsonParam.getString("devId");
			return userStateMonitorService.getChildInfoByDevId(devId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			JSONObject jso = new JSONObject();
			JSONObject result = new JSONObject();
			result.put("code", "201");
			result.put("message", "失败");
			jso.put("json", e.getMessage());
			jso.put("result", result);
			return jso;
		}

	}

	/**
	 * 条件查询用户状态监听列表,用于二级站
	 * 
	 * @param 用户编号or用户名称or负责人电话
	 * @param 监控状态
	 * @param 查询的用户范围
	 * @param pageInfoPojo
	 *            分页对象
	 */

	@SuppressWarnings("unchecked")
	@RequestMapping("/getUserStateListByWorkStation")
	@ResponseBody
	public JSONObject getUserStateListByWorkStation(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			String groupId = jsonParam.getString("groupId");
			String queryValue = jsonParam.getString("queryValue");
			String checkId = jsonParam.getString("checkId");
			List<String> userIds = (List<String>) JSON.parse(jsonParam
					.getJSONArray("userIds").toJSONString());
			JSONObject pageInfoPojo = jsonParam.getJSONObject("pageInfoPojo");
			String pageSize = pageInfoPojo.getString("pageSize");
			String currentPage = pageInfoPojo.getString("currentPage");
			JSONObject josn = userStateMonitorService
					.getUserStateListByWorkStationService(userIds, groupId, queryValue,
							checkId, pageSize, currentPage);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}
}
