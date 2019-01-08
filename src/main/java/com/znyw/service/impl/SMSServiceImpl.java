package com.znyw.service.impl;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.SMSDao;
import com.znyw.service.SMSService;
import com.znyw.tool.HttpClientTool;
import com.znyw.tool.ResultUtil;

@Service
public class SMSServiceImpl implements SMSService {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(SMSServiceImpl.class);

	@Resource
	private SMSDao sMSDao;

	@Override
	public JSONObject sendSMS(String message, String phones) throws Exception {
		try {
			String url = "http://www.stongnet.com/sdkhttp/sendsms.aspx?reg=101100-WEB-HUAX-837114&pwd=GKLQLEFK&sourceadd=&phone=phones&content=message";
			String newUrl = url.replace("phones", phones).replace("message",
					message);
			String responese = HttpClientTool.post(newUrl);
			String[] resp = responese.split("&", -1);
			JSONObject jso = new JSONObject();
			for (String str : resp) {
				String[] resultMsg = str.split("=");
				if (resultMsg.length > 1) {
				jso.put(resultMsg[0], resultMsg[1]);
				} else {
					LOGGER.error("发送短信异常,响应：{}", str);
				}
			}
			return jso;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@Override
	public JSONObject sendSMSByDevId(String message, String devId)
			throws Exception {
		// 首先获取到设备机主电话
		String phone = null;
		try {
			phone = sMSDao.getPhoneByDevId(devId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
		return sendSMS(message, phone);
	}

}
