package com.znyw.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.IdInfoDao;
import com.znyw.pojo.IdInfoPojo;
import com.znyw.service.IdInfoService;
import com.znyw.tool.ResultUtil;

@Service
public class IdInfoServiceImpl implements IdInfoService {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(IdInfoServiceImpl.class);

	@Resource
	private IdInfoDao idInfoDao;

	@Override
	public JSONObject queryLatestId() throws Exception {
		List<IdInfoPojo> list = null;
		JSONArray array = null;
		try {
			list = idInfoDao.queryLatestId();
			array = new JSONArray();
			if (list != null && !list.isEmpty())
				array = (JSONArray) JSON.toJSON(list);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "获取失败", e.getMessage());
		}
		JSONObject jso = new JSONObject();
		JSONObject result = new JSONObject();
		result.put("message", "成功");
		result.put("code", 200);
		jso.put("result", result);
		jso.put("values", array);
		return jso;
	}

	@Override
	public JSONObject queryIdByLike(String value, String type) throws Exception {
		List<String> list = null;
		try {
			list = idInfoDao.queryIdByLike(value, type);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "获取失败！", e.getMessage());
		}
		JSONObject jso = new JSONObject();
		JSONObject result = new JSONObject();
		result.put("message", "成功");
		result.put("code", 200);
		jso.put("result", result);
		jso.put("values", list);
		return jso;
	}

}
