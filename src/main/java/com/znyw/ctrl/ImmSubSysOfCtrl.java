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
import com.znyw.service.ImmSubSysOfService;
import com.znyw.tool.HttpClientTool;
import com.znyw.tool.HttpTool;
import com.znyw.tool.Objects;
import com.znyw.tool.PropertyConfigUtil;

/**
 * 设备子系统表的对外接口
 * 
 * @author Administrator
 *
 */
@Controller()
@RequestMapping("/immSubSysOf/")
public class ImmSubSysOfCtrl {
	private static final Logger logger = LoggerFactory
			.getLogger(ImmSubSysOfCtrl.class);
	@Resource
	private ImmSubSysOfService immSubSysOfService;

	private static PropertyConfigUtil propertyconfigUtil = PropertyConfigUtil
			.getInstance("properties/config.properties");

	private static String urlShiWu = propertyconfigUtil.getValue("urlShiWu");

	/**
	 * 根据设备id获取设备子系统列表
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("getSubSysListByDevId")
	@ResponseBody
	public JSONObject getSubSysListByDevId(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String devId = json.getString("devId");
			return immSubSysOfService.getSubSysListByDevId(devId);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			JSONObject jso = new JSONObject();
			JSONObject result = new JSONObject();
			result.put("code", 201);
			result.put("message", "查询失败");
			result.put("detail", e.getMessage());
			jso.put("result", result);
			return jso;
		}
	}

	/**
	 * 添加一个设备子系统
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("saveSubSys")
	@ResponseBody
	public JSONObject saveSubSys(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			return immSubSysOfService.saveSubSys(json);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			JSONObject jso = new JSONObject();
			JSONObject result = new JSONObject();
			result.put("code", 201);
			result.put("message", "添加失败");
			result.put("detail", e.getMessage());
			jso.put("result", result);
			return jso;
		}
	}

	/**
	 * 更新一个设备子系统
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("updateSubSys")
	@ResponseBody
	public JSONObject updateSubSys(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			return immSubSysOfService.updateSubSys(json);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			JSONObject jso = new JSONObject();
			JSONObject result = new JSONObject();
			result.put("code", 201);
			result.put("message", "更新失败");
			result.put("detail", e.getMessage());
			jso.put("result", result);
			return jso;
		}
	}

	/**
	 * 删除一个设备子系统
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("deleteSubSysById")
	@ResponseBody
	public JSONObject deleteSubSys(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String devId = json.getString("devId");
			// String subSysId = json.getString("subSysId");
			JSONArray subSysId = json.getJSONArray("subSysId");
			return immSubSysOfService.deleteSubSysByIds(devId, subSysId);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			JSONObject jso = new JSONObject();
			JSONObject result = new JSONObject();
			result.put("code", 201);
			result.put("message", "删除失败");
			result.put("detail", e.getMessage());
			jso.put("result", result);
			return jso;
		}
	}

	/**
	 * 查找一个设备子系统
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("getSubSysById")
	@ResponseBody
	public JSONObject getSubSysById(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String devId = json.getString("devId");
			String subSysId = json.getString("subSysId");
			return immSubSysOfService.getSubSysById(devId, subSysId);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			JSONObject jso = new JSONObject();
			JSONObject result = new JSONObject();
			result.put("code", 201);
			result.put("message", "查询失败");
			result.put("detail", e.getMessage());
			jso.put("result", result);
			return jso;
		}
	}

	/**
	 * 根据设备编号和子系统查询子系统布撤防状态
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("querySbuSysBCF")
	@ResponseBody
	public JSONObject querySbuSysBCF(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			String rspStr = HttpClientTool.SendToShiWu(urlShiWu,
					"QuerySbuSysBCF/QuerySbuSysBCF.do", jsonStr);
			if (Objects.isNull(rspStr)) {
				throw new Exception("请求事件服务错误，QuerySbuSysBCF/QuerySbuSysBCF.do");
			}
			JSONObject result = JSONObject.parseObject(rspStr);
			return result;
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			JSONObject jso = new JSONObject();
			JSONObject result = new JSONObject();
			result.put("code", 201);
			result.put("message", "查询子系统布撤防状态异常");
			result.put("detail", e.getMessage());
			jso.put("result", result);
			return jso;
		}
	}
}
