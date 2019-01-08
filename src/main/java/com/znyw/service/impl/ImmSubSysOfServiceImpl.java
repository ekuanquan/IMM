package com.znyw.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.ImmSubSysOfDao;
import com.znyw.pojo.ImmSubSysOfPojo;
import com.znyw.service.ImmSubSysOfService;

@Service
public class ImmSubSysOfServiceImpl implements ImmSubSysOfService {

	private static final Logger logger = LoggerFactory
			.getLogger(ImmSubSysOfServiceImpl.class);

	@Resource
	private ImmSubSysOfDao immSubSysOfDao;

	@Override
	public JSONObject getSubSysListByDevId(String devId) {

		JSONObject jso = new JSONObject();
		JSONObject result = new JSONObject();
		try {
			List<ImmSubSysOfPojo> list = immSubSysOfDao
					.getSubSysListByDevId(devId);
			result.put("code", 200);
			result.put("message", "成功");
			jso.put("result", result);
			jso.put("subSysList", list);
			return jso;
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			result.put("code", 201);
			result.put("message", "查询失败");
			result.put("detail", e.getMessage());
			jso.put("result", result);
			return jso;
		}
	}

	@Override
	public JSONObject saveSubSys(JSONObject parames) {

		JSONObject jso = new JSONObject();
		JSONObject result = new JSONObject();
		try {
			ImmSubSysOfPojo pojo = JSONObject.parseObject(
					parames.toJSONString(), ImmSubSysOfPojo.class);
			pojo.setBf(Integer.parseInt(parames.getString("bcf")));
			immSubSysOfDao.saveSubSys(pojo);
			logger.info("添加子系统   devId ={} ,SubSysId ={} ,BCF ={}",
					pojo.getDevId(), pojo.getSubSysId(), pojo.getBf());
			result.put("code", 200);
			result.put("message", "成功");
			jso.put("result", result);
			return jso;
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			result.put("code", 201);
			result.put("message",
					e.getMessage().contains("Duplicate entry") ? "子系统重复"
							: "添加失败");
			result.put("detail", e.getMessage());
			jso.put("result", result);
			return jso;
		}
	}

	@Override
	public JSONObject updateSubSys(JSONObject parames) {
		JSONObject jso = new JSONObject();
		JSONObject result = new JSONObject();
		try {
			ImmSubSysOfPojo pojo = JSONObject.parseObject(
					parames.toJSONString(), ImmSubSysOfPojo.class);
			immSubSysOfDao.updateSubSys(pojo);
			result.put("code", 200);
			result.put("message", "成功");
			jso.put("result", result);
			return jso;
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			result.put("code", 201);
			result.put("message", "更新失败");
			result.put("detail", e.getMessage());
			jso.put("result", result);
			return jso;
		}
	}

	@Override
	public JSONObject deleteSubSysByIds(String devId, JSONArray subSysId) {

		JSONObject jso = new JSONObject();
		JSONObject result = new JSONObject();
		try {
			boolean bl = immSubSysOfDao.deleteSubSysByIds(devId, subSysId);
			if (bl) {
				result.put("code", 200);
				result.put("message", "成功");
				jso.put("result", result);
			} else {
				result.put("code", 201);
				result.put("message", "失败");
				jso.put("result", result);
			}

			return jso;
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			result.put("code", 201);
			result.put("message", "删除失败");
			result.put("detail", e.getMessage());
			jso.put("result", result);
			return jso;
		}
	}

	@Override
	public JSONObject getSubSysById(String devId, String subSysId) {

		JSONObject jso = new JSONObject();
		JSONObject result = new JSONObject();

		try {
			ImmSubSysOfPojo pojo = immSubSysOfDao
					.getSubSysById(devId, subSysId);
			result.put("code", 200);
			result.put("message", "成功");
			jso.put("subSys", pojo);
			jso.put("result", result);
			return jso;
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			result.put("code", 201);
			result.put("message", "查询失败");
			result.put("detail", e.getMessage());
			jso.put("result", result);
			return jso;
		}

	}

	@Override
	public JSONObject deleteSubSys(String devId, String subSysId) {
		JSONArray array = new JSONArray();
		array.add(subSysId);
		return deleteSubSysByIds(devId, array);
	}

}
