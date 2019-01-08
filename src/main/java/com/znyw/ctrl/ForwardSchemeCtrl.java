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
import com.znyw.service.ForwardSchemeService;
import com.znyw.tool.GetSysInfoUtil;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultUtil;

/**
 * 转发方案表的对外接口
 * 
 * @author 007
 *
 */
@Controller()
@RequestMapping("/ForwardScheme/")
public class ForwardSchemeCtrl {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(ImmSubSysOfCtrl.class);
	@Resource
	private ForwardSchemeService forwardSchemeService;

	/**
	 * 添加一个转发工作站方案
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("addForwardScheme")
	@ResponseBody
	public JSONObject addForwardScheme(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			return forwardSchemeService.addForwardScheme(json);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			JSONObject json = new JSONObject();
			JSONObject result = new JSONObject();
			result.put("code", 201);
			if (e.getMessage().contains("for key 'PRIMARY'")) {
				result.put("message", "子系统编号已存在");
			} else {
				result.put("message", "失败");
			}
			json.put("result", result);
			json.put("warn", e.getMessage());
			return json;
		}
	}

	/**
	 * 删除一个工作站转发方案
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("deleteForwardScheme")
	@ResponseBody
	public JSONObject deleteForwardScheme(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String devId = json.getString("devId");
			String stationNum = json.getString("stationNum");
			return forwardSchemeService.deleteForwardScheme(devId, stationNum);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			JSONObject jso = new JSONObject();
			JSONObject result = new JSONObject();
			result.put("code", 201);
			result.put("message", "失败");
			jso.put("result", result);
			jso.put("warn", e.getMessage());
			return jso;
		}
	}

	/**
	 * 获取转发方案列表
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("getForwardSchemeList")
	@ResponseBody
	public JSONObject getForwardSchemeList(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			return forwardSchemeService.getForwardSchemeList();
		} catch (Exception e) {
			LOGGER.warn(e.getMessage(), e);
			JSONObject jso = new JSONObject();
			JSONObject result = new JSONObject();
			result.put("code", 201);
			result.put("message", "失败");
			jso.put("result", result);
			jso.put("warn", e.getMessage());
			return jso;
		}
	}

	/**
	 * 查找一个工作站
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("getWorkstationById")
	@ResponseBody
	public JSONObject getWorkstationById(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String devId = json.getString("devId");
			return forwardSchemeService.getForwardSchemeListById(devId);
		} catch (Exception e) {
			LOGGER.error("getForwardSchemeListById warn:{},{}", e.getMessage(),
					e);
			JSONObject jso = new JSONObject();
			JSONObject result = new JSONObject();
			result.put("code", 201);
			result.put("message", "失败");
			jso.put("result", result);
			jso.put("warn", e.getMessage());
			return jso;
		}
	}
}
