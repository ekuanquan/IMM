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
import com.znyw.service.UserService;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultUtil;

/**
 * 机主管理相关的接口
 * 
 * @author dev
 *
 */
@Controller
public class OwnerManageCtrl {
	private static final Logger LOGGER = LoggerFactory.getLogger(OwnerManageCtrl.class);

	@Resource
	private UserService userService;

	@RequestMapping("owner/correlateDevices/add")
	@ResponseBody
	public JSONObject correlateDevicesAdd(HttpServletRequest request, HttpServletResponse response) {
		JSONObject json = null;
		try {
			json = JSONObject.parseObject(HttpTool.readJSONString(request));
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}

		return userService.correlateDevicesAdd(json);
	}

	@RequestMapping("owner/correlateDevices/delete")
	@ResponseBody
	public JSONObject correlateDevicesDelete(HttpServletRequest request, HttpServletResponse response) {
		JSONObject json = null;
		try {
			json = JSONObject.parseObject(HttpTool.readJSONString(request));
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}

		return userService.correlateDevicesDelete(json);
	}

	@RequestMapping("owner/updateRemoteDevice")
	@ResponseBody
	public JSONObject updateRemoteDevice(HttpServletRequest request, HttpServletResponse response) {

		JSONObject json = null;
		try {
			json = JSONObject.parseObject(HttpTool.readJSONString(request));
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}

		return userService.updateRemoteDevice(json);
	}

	@RequestMapping("owner/updateMasterDevice")
	@ResponseBody
	public JSONObject updateMasterDevice(HttpServletRequest request, HttpServletResponse response) {

		JSONObject json = null;
		try {
			json = JSONObject.parseObject(HttpTool.readJSONString(request));
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}

		return userService.updateMasterDevice(json);
	}

}
