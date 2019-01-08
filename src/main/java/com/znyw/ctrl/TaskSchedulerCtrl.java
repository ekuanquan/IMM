package com.znyw.ctrl;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.znyw.service.TaskSchedulerService;
import com.znyw.tool.HttpTool;

/**
 * 本类提供关于布撤防定时任务的对外接口
 * 
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/taskScheduler")
public class TaskSchedulerCtrl {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(TaskSchedulerCtrl.class);

	@Resource
	private TaskSchedulerService taskSchedulerService;

	/**
	 * 获得本次需要检查的设备
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/queryNeedCheckedDev")
	@ResponseBody
	public JSONObject queryNeedCheckedDev(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			return taskSchedulerService.queryNeedCheckedDev();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			JSONObject jso = new JSONObject();
			jso.put("code", "201");
			jso.put("reason", e.getMessage());
			return jso;
		}
	}

	/**
	 * 通过id更新此设备的更新时间
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/updateTime", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public JSONObject updateTime(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			JSONObject jsonParam = HttpTool.readJSONParam(request);
			String devId = jsonParam.getString("devId");
			return taskSchedulerService.updateTime(devId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			JSONObject jso = new JSONObject();
			jso.put("code", "201");
			jso.put("reason", e.getMessage());
			return jso;
		}
	}

	/**
	 * 通过用户id获取其布撤防任务信息
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/queryTaskByOwnerId", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public JSONObject queryTaskByOwnerId(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			JSONObject jsonParam = HttpTool.readJSONParam(request);
			String ownerId = jsonParam.getString("ownerId");
			return taskSchedulerService.queryTaskByOwnerId(ownerId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			JSONObject jso = new JSONObject();
			jso.put("code", "201");
			jso.put("reason", e.getMessage());
			return jso;
		}
	}

	/**
	 * 通过用户id更新或者插入该设备的任务信息
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/mergeIntoByOwnerId", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public JSONObject mergeIntoByOwnerId(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			JSONObject jsonParam = HttpTool.readJSONParam(request);
			return taskSchedulerService.mergeIntoByOwnerId(jsonParam);
		} catch (Exception e) {
			LOGGER.warn("mergeIntoByOwnerId error: {} ", e.getMessage(), e);
			JSONObject jso = new JSONObject();
			jso.put("code", "201");
			jso.put("reason", e.getMessage());
			return jso;
		}
	}

	/**
	 * 通过设备id获取此设备的布撤防状态
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/getStatuesByDevId", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public JSONObject getStatuesByDevId(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			JSONObject jsonParam = HttpTool.readJSONParam(request);
			String devId = jsonParam.getString("devId");
			return taskSchedulerService.getStatuesByDevId(devId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			JSONObject jso = new JSONObject();
			jso.put("code", "201");
			jso.put("reason", e.getMessage());
			return jso;
		}
	}

	/**
	 * 通过设备id检查此设备现在的布防是否"正常布防"(0),"提早布防"(1),"推迟布防"(2)
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/getBfStatusByDevId", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public JSONObject getBfStatusByDevId(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			JSONObject jsonParam = HttpTool.readJSONParam(request);
			String devId = jsonParam.getString("devId");
			return taskSchedulerService.getBfStatusByDevId(devId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			JSONObject jso = new JSONObject();
			jso.put("code", "201");
			jso.put("reason", e.getMessage());
			return jso;
		}
	}
}
