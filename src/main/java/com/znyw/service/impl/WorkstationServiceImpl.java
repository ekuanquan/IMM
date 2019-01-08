package com.znyw.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.ForwardSchemeDao;
import com.znyw.dao.WorkstationDao;
import com.znyw.pojo.WorkstationPojo;
import com.znyw.service.WorkstationService;
import com.znyw.tool.HttpClientTool;
import com.znyw.tool.ResultUtil;

@Service
public class WorkstationServiceImpl implements WorkstationService {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(WorkstationServiceImpl.class);

	@Resource
	private WorkstationDao workstationDao;
	@Resource
	private ForwardSchemeDao forwardSchemeDao;

	@Override
	public JSONObject getWorkstationList() throws Exception {
		List<WorkstationPojo> list = null;
		try {
			list = workstationDao.getWorkstationList();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
		JSONObject jso = new JSONObject();
		JSONObject result = new JSONObject();
		result.put("code", 200);
		result.put("message", "成功");
		jso.put("result", result);
		jso.put("workstationList", list);
		return jso;
	}

	@Override
	public JSONObject saveWorkstation(JSONObject parames) throws Exception {
		WorkstationPojo pojo = JSONObject.parseObject(parames.toJSONString(),
				WorkstationPojo.class);
		try {
			
			return workstationDao.saveWorkstation(pojo);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}
		
	}

	@Override
	public JSONObject updateWorkstation(JSONObject parames) throws Exception {
		WorkstationPojo pojo = JSONObject.parseObject(parames.toJSONString(),
				WorkstationPojo.class);
		try {
			workstationDao.updateWorkstation(pojo);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}
		JSONObject jso = new JSONObject();
		JSONObject result = new JSONObject();
		result.put("code", 200);
		result.put("message", "成功");
		jso.put("result", result);
		return jso;
	}

	@Override
	public JSONObject deleteWorkstationById(String stationNum) throws Exception {
		try {
			workstationDao.deleteWorkstationById(stationNum);
			forwardSchemeDao.deleteFSByStationNum(stationNum);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}
		JSONObject jso = new JSONObject();
		JSONObject result = new JSONObject();
		result.put("code", 200);
		result.put("message", "成功");
		jso.put("result", result);
		return jso;
	}

	@Override
	public JSONObject getWorkstationById(String stationNum) throws Exception {
		WorkstationPojo pojo = null;
		try {
			pojo = workstationDao.getWorkstationById(stationNum);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}
		JSONObject jso = new JSONObject();
		JSONObject result = new JSONObject();
		result.put("code", 200);
		result.put("message", "成功");
		jso.put("result", result);
		jso.put("Workstation", pojo);
		return jso;

	}

	@Override
	public JSONObject userDataTrans(JSONObject jsonStr) throws Exception {
		String resultStr = "";
		try {
			resultStr = HttpClientTool.postTrans("abutment/sendUserInfo.do",
					jsonStr.toString());
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}
		JSONObject reply = null;
		if (resultStr == null || resultStr.length() == 0
				|| "".equals(resultStr)) {
			JSONObject result = new JSONObject();
			result.put("code", "404");
			result.put("message", "网络异常");
			reply = new JSONObject();
			reply.put("result", result);
		} else {
			reply = JSON.parseObject(resultStr);
		}
		return reply;
	}

}
