package com.znyw.ctrl;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.Pagepojo;
import com.znyw.pojo.ResultPojo;
import com.znyw.service.UserPlanEventService;
import com.znyw.tool.HttpTool;

@Controller
@RequestMapping("/userplanEvent")
public class UserPlanEventCtrl {
	private static Logger LOGGER = LoggerFactory
			.getLogger(UserPlanEventCtrl.class);

	@Resource
	private UserPlanEventService userPlanEventService;

	@RequestMapping("updateUserPlanEvent")
	@ResponseBody
	public ResponseEntity<String> updateUserPlanEvent(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			ResultPojo result = userPlanEventService.updateUserPlanEvent(json);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

	@RequestMapping("findUserPlanEventByUserId")
	@ResponseBody
	public ResponseEntity<String> findUserPlanEventByUserId(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String userId = json.getString("userId");
			ResultPojo result = userPlanEventService
					.findUserPlanEventByUserId(userId);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

	@RequestMapping("allValidUserPlanEventByPage")
	@ResponseBody
	public ResponseEntity<String> allValidUserPlanEventByPage(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String pageInfoPojo = json.getString("pageInfoPojo");
			Pagepojo pagePojo = JSONObject.parseObject(pageInfoPojo,
					Pagepojo.class);
			ResultPojo result = userPlanEventService
					.allValidUserPlanEventByPage(pagePojo);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

	@RequestMapping("updateLastNoRptCheckDateTime")
	@ResponseBody
	public ResponseEntity<String> updateLastNoRptCheckDateTime(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String userId = json.getString("userId");
			String lastNoRptCheckDateTime = json
					.getString("lastNoRptCheckDateTime");
			ResultPojo result = userPlanEventService
					.updateLastNoRptCheckDateTime(userId,
							lastNoRptCheckDateTime);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}
}
