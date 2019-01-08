package com.znyw.ctrl;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.service.AreaService;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.GetSysInfoUtil;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultUtil;

@Controller
public class AreaCtrl {

	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	@Resource
	private AreaService areaService;

	@RequestMapping(value = "getRulaAreaRDA", produces = { "text/json;charset=UTF-8" })
	@ResponseBody
	public String getRulaAreaRDA(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr = HttpTool.readJSONString(request);
		String id = null;
		JSONArray jsonCorrelation = null;
		try {
			id = jsonStr.replace("id=", "");
			jsonCorrelation = areaService.getAreaByParentAreaId(id);
			return jsonCorrelation.toJSONString();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage())
					.toJSONString();
		}
	}

	/**
	 * 获取一个节点和其所有的父节点
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "getAreaListRDA", produces = { "text/json;charset=UTF-8" })
	@ResponseBody
	public String getAreaListRDA(HttpServletRequest request,
			HttpServletResponse response) {

		String jsonStr = HttpTool.readJSONString(request);
		JSONObject jsonParam = null;
		String id, userId = null;
		JSONArray jsonCorrelation = null;
		try {
			id = request.getParameter("id");
			jsonParam = JSONObject.parseObject(jsonStr);
			userId = jsonParam.getString("userId");
			if (id == null || id.equals("")) {
				jsonCorrelation = areaService.getAreaListByUserId(userId, null,
						false,"",true);
			} else {
				// jsonCorrelation = areaService.getAreaList(id);
			}
			return jsonCorrelation.toJSONString();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage())
					.toJSONString();
		}

	}

	@RequestMapping(value = "getRulaArea", produces = { "text/json;charset=UTF-8" })
	@ResponseBody
	public String getRulaArea(HttpServletRequest request,
			HttpServletResponse response) {
		String id = request.getParameter("id");
		String jsonStr = HttpTool.readJSONString(request);

		if (id == null) {
			id = jsonStr.replace("id=", "");
		}

		JSONArray jsonCorrelation = null;
		try {
			jsonCorrelation = areaService.getAreaByParentAreaId(id);
			return jsonCorrelation.toJSONString();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage())
					.toJSONString();
		}
	}

	/**
	 * 获取一个节点和其所有的父节点
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "getAreaList", produces = { "text/json;charset=UTF-8" })
	@ResponseBody
	public String getAreaList(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr = HttpTool.readJSONString(request);
		JSONArray jsonCorrelation = null;
		try {
			JSONObject jsonParam = JSONObject.parseObject(jsonStr);

			String userId = GetSysInfoUtil.getUserId(request);
			if (userId == null) { // 如果用户编号为空，说明是接处警系统调用接口，则需要接收接处警传过来的用户名
				userId = jsonParam.getString("userId");
			}
			boolean handleOnly = jsonParam.containsKey("handleOnly") ? jsonParam
					.getBooleanValue("handleOnly") : false;
			String roleId = jsonParam.getString("roleId");
			String platformId=jsonParam.containsKey("platformId") ? jsonParam.getString("platformId"):"";
			boolean needDataNode = jsonParam.containsKey("needDataNode") ? jsonParam
					.getBooleanValue("needDataNode") : true;

			jsonCorrelation = areaService.getAreaListByUserId(userId, roleId,
					handleOnly,platformId,needDataNode);

			return jsonCorrelation == null ? new JSONObject().toJSONString()
					: jsonCorrelation.toJSONString();

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage())
					.toJSONString();
		}

	}

	@RequestMapping(value = "saveArea")
	@ResponseBody
	public JSONObject saveArea(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr = HttpTool.readJSONString(request);
		JSONObject jsonParam = JSONObject.parseObject(jsonStr);
		JSONObject jsonCorrelation = null;
		try {
			if (!jsonParam.containsKey("dataFrom")
					|| "".equals(jsonParam.get("dataFrom"))) {
				jsonParam.put("dataFrom", ConfigUtil.getPlatformId());
			}
			jsonCorrelation = areaService.saveArea(jsonParam);
			return jsonCorrelation;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
		}

	}

	@RequestMapping(value = "deleteArea")
	@ResponseBody
	public JSONObject deleteArea(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr = HttpTool.readJSONString(request);
		JSONObject jsonParam = JSONObject.parseObject(jsonStr);
		JSONObject jsonCorrelation = null;
		try {
			jsonCorrelation = areaService.deleteArea(jsonParam.getString("id"));
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "删除失败", e.getMessage());
		}
		return jsonCorrelation;
	}

	@RequestMapping(value = "updateArea")
	@ResponseBody
	public JSONObject updateArea(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr = HttpTool.readJSONString(request);
		JSONObject jsonParam = JSONObject.parseObject(jsonStr);
		JSONObject jsonCorrelation = null;
		try {
			jsonCorrelation = areaService.updateArea(jsonParam);
			return jsonCorrelation;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "更新失败", e.getMessage());
		}
	}

	@RequestMapping(value = "getArea")
	@ResponseBody
	public JSONObject getArea(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr = HttpTool.readJSONString(request);
		JSONObject jsonParam = JSONObject.parseObject(jsonStr);
		JSONObject jsonCorrelation = null;
		try {
			jsonCorrelation = areaService
					.getAreaById(jsonParam.getString("id"));
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
		return jsonCorrelation;
	}

	@RequestMapping(value = "getRulaAreaAll", produces = { "text/json;charset=UTF-8" })
	@ResponseBody
	public String getRulaAreaAll(HttpServletRequest request,
			HttpServletResponse response) {
		String id = request.getParameter("id");
		String jsonStr = HttpTool.readJSONString(request);

		if (id == null) {
			id = jsonStr.replace("id=", "");
		}

		LOGGER.info("getRulaArea:{}", jsonStr);
		JSONArray jsonCorrelation = null;
		try {
			jsonCorrelation = areaService.getAreaAllById(id);

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage())
					.toJSONString();
		}
		return jsonCorrelation.toJSONString();
	}
}
