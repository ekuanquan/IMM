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
import com.znyw.service.SMSService;
import com.znyw.tool.HttpTool;

/**
 * 本类提供手机短信的对外接口
 * 
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/SMS")
public class SMSCtrl {
	private static final Logger logger = LoggerFactory.getLogger(SMSCtrl.class);
	@Resource
	private SMSService smsService;

	/**
	 * 发送短信
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/sendSMS", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public JSONObject sendSMS(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			JSONObject jsonParam = HttpTool.readJSONParam(request);
			String phones = jsonParam.getString("phones");
			String message = jsonParam.getString("message");
			return smsService.sendSMS(message, phones);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			JSONObject jso = new JSONObject();
			jso.put("code", "201");
			jso.put("reason", e.getMessage());
			return jso;
		}
	}

	/**
	 * 通过设备id给机主发送消息
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/sendSMSByDevId", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public JSONObject sendSMSByDevId(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			JSONObject jsonParam = HttpTool.readJSONParam(request);
			String devId = jsonParam.getString("devId");
			String message = jsonParam.getString("message");
			return smsService.sendSMSByDevId(message, devId);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			JSONObject jso = new JSONObject();
			jso.put("code", "201");
			jso.put("reason", e.getMessage());
			return jso;
		}
	}
}
