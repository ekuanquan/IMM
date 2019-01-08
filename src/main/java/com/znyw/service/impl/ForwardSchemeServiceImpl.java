package com.znyw.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.ForwardSchemeDao;
import com.znyw.pojo.ForwardSchemePojo;
import com.znyw.service.ForwardSchemeService;
import com.znyw.tool.ResultUtil;

@Service
public class ForwardSchemeServiceImpl implements ForwardSchemeService {
	private static final Logger logger = LoggerFactory
			.getLogger(ImmSubSysOfServiceImpl.class);

	@Resource
	private ForwardSchemeDao forwardSchemeDao;

	@Override
	public JSONObject addForwardScheme(JSONObject parames) throws Exception {

		try {
			ForwardSchemePojo pojo = JSONObject.parseObject(
					parames.toJSONString(), ForwardSchemePojo.class);
			forwardSchemeDao.addForwardScheme(pojo);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
		}
		JSONObject jso = new JSONObject();
		JSONObject result = new JSONObject();
		result.put("code", 200);
		result.put("message", "成功");
		jso.put("result", result);
		return jso;
	}

	@Override
	public JSONObject deleteForwardScheme(String devId, String stationNum)
			throws Exception {

		try {
			forwardSchemeDao.deleteForwardScheme(devId, stationNum);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "删除失败", e.getMessage());
		}

		JSONObject jso = new JSONObject();
		JSONObject result = new JSONObject();
		result.put("code", 200);
		result.put("message", "成功");
		jso.put("result", result);
		return jso;
	}

	@Override
	public JSONObject getForwardSchemeList() throws Exception {

		List<ForwardSchemePojo> list = null;
		try {
			list = forwardSchemeDao.getForwardSchemeList();
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "获取失败", e.getMessage());
		}

		JSONObject jso = new JSONObject();
		JSONObject result = new JSONObject();
		result.put("code", 200);
		result.put("message", "成功");
		jso.put("result", result);
		jso.put("forwardSchemeList", list);
		return jso;
	}

	@Override
	public JSONObject getForwardSchemeListById(String devId) throws Exception {
		List<ForwardSchemePojo> list = null;
		try {
			list = forwardSchemeDao.getForwardSchemeListById(devId);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查找失败", e.getMessage());
		}
		JSONObject jso = new JSONObject();
		JSONObject result = new JSONObject();
		result.put("code", 200);
		result.put("message", "成功");
		jso.put("result", result);
		jso.put("forwardSchemeList", list);
		return jso;
	}

}
