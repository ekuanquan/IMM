package com.znyw.ctrl;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.znyw.service.WorkstationService;
import com.znyw.tool.HttpTool;

/**
 * 工作站表的对外接口
 * 
 * @author 007
 *
 */
@Controller()
@RequestMapping("/Workstation/")
public class WorkstationCtrl {
	private static final Logger logger = LoggerFactory
			.getLogger(ImmSubSysOfCtrl.class);
	@Resource
	private WorkstationService workstationService;

	/**
	 * 获取工作站列表
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("getWorkstationList")
	@ResponseBody
	public JSONObject getWorkstationList(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			return workstationService.getWorkstationList();
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
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
	 * 添加一个工作站
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("saveWorkstation")
	@ResponseBody
	public JSONObject saveWorkstation(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			return workstationService.saveWorkstation(json);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			JSONObject jso = new JSONObject();
			JSONObject result = new JSONObject();
			if (e.getMessage().contains("for key 'PRIMARY'")) {
				result.put("code", 500);
				result.put("message", "子系统编号已存在");
			} else {
				result.put("code", 201);
				result.put("message", "失败");
			}
			jso.put("result", result);
			jso.put("warn", e.getMessage());
			return jso;
		}
	}

	/**
	 * 更新一个工作站
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("updateWorkstation")
	@ResponseBody
	public JSONObject updateWorkstation(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			return workstationService.updateWorkstation(json);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
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
	 * 用户资料传送
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("userDataTrans")
	@ResponseBody
	public JSONObject userDataTrans(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			return workstationService.userDataTrans(json);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
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
	 * 删除一个工作站
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("deleteWorkstationById")
	@ResponseBody
	public JSONObject deleteWorkstationById(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String stationNum = json.getString("stationNum");
			return workstationService.deleteWorkstationById(stationNum);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
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
			String stationNum = json.getString("stationNum");
			return workstationService.getWorkstationById(stationNum);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
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
