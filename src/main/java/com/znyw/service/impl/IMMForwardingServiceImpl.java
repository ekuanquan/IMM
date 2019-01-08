package com.znyw.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.IMMForwardingDao;
import com.znyw.service.IMMForwardingService;
import com.znyw.tool.ResultUtil;

@Service("IMMForwardingService")
public class IMMForwardingServiceImpl implements IMMForwardingService {
	private static final Logger LOGGER = org.slf4j.LoggerFactory
			.getLogger(IMMForwardingServiceImpl.class);

	@Resource
	IMMForwardingDao iMMForwardingDao;

	@Override
	public JSONObject getEvtSettingService(String userId, String ZoneCHFlag,
			String ZoneCHValue) {
		JSONObject userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		JSONObject evtSetting = null;
		try {
			evtSetting = iMMForwardingDao.getEvtSettingDao(userId, ZoneCHFlag,
					ZoneCHValue);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}

		if (evtSetting == null) {
			result.put("code", "201");
			result.put("message", "失败");
			userjosn.put("json", null);
		} else {
			result.put("code", "200");
			result.put("message", "成功");
			userjosn.put("json", evtSetting);
		}
		userjosn.put("result", result);
		return userjosn;
	}

	@Override
	public JSONObject getUrlService(String cameraId) {
		JSONObject userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		Map<String, Object> url = null;

		try {
			url = iMMForwardingDao.getUrlDao(cameraId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
		if (url == null) {
			result.put("code", "201");
			result.put("message", "失败");
			userjosn.put("json", null);
		} else {
			result.put("code", "200");
			result.put("message", "成功");
			userjosn.put("json", url);
		}
		userjosn.put("result", result);
		return userjosn;
	}

	@Override
	public JSONObject getTimeLengthService() {
		JSONObject userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		String time = null;

		try {
			time = iMMForwardingDao.getTimeLengthDao();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "失败", e.getMessage());
		}
		if (time == null) {
			result.put("code", "201");
			result.put("message", "失败");
			userjosn.put("json", null);
			userjosn.put("result", result);
		} else {
			result.put("code", "200");
			result.put("message", "成功");
			userjosn.put("json", time);
			userjosn.put("result", result);
		}
		return userjosn;
	}

	@Override
	public JSONObject getIsRecordShootService() {
		JSONObject userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		List<Map<String, Object>> list = null;

		try {
			list = iMMForwardingDao.getIsRecordShootDao();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "失败", e.getMessage());
		}
		if (list == null) {
			result.put("code", "201");
			result.put("message", "失败");
			userjosn.put("json", null);
		} else {
			result.put("code", "200");
			result.put("message", "成功");
			userjosn.put("json", list);
		}
		userjosn.put("result", result);
		return userjosn;
	}

	@Override
	public JSONObject getLinkageService() {
		JSONObject userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		List<Map<String, Object>> list = null;
		try {
			list = iMMForwardingDao.getLinkageDao();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "失败", e.getMessage());
		}
		if (list == null) {
			result.put("code", "201");
			result.put("message", "失败");
			userjosn.put("json", null);
		} else {
			result.put("code", "200");
			result.put("message", "成功");
			userjosn.put("json", list);
		}
		userjosn.put("result", result);
		return userjosn;

	}

	@Override
	public JSONObject getMobileService(String userId, String contId) {
		JSONObject userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		String time = null;
		try {
			time = iMMForwardingDao.getMobileDao(userId, contId);
		} catch (Exception e) {
			return ResultUtil.simpleResponse("500", "失败", e.getMessage());
		}
		if (time == null) {
			result.put("code", "201");
			result.put("message", "失败");
			userjosn.put("json", null);
		} else {
			result.put("code", "200");
			result.put("message", "成功");
			userjosn.put("json", time);
		}
		userjosn.put("result", result);
		return userjosn;
	}

}
