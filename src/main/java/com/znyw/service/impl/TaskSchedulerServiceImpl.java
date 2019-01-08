package com.znyw.service.impl;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.TaskSchedulerDao;
import com.znyw.pojo.BCFPlanPojo;
import com.znyw.service.TaskSchedulerService;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultJson;
import com.znyw.tool.ResultUtil;

@Service
public class TaskSchedulerServiceImpl implements TaskSchedulerService {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(TaskSchedulerServiceImpl.class);

	private static final DateFormat dfDate = new SimpleDateFormat("yyyy-MM-dd");
	private static final DateFormat df = new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss");
	@Resource
	private TaskSchedulerDao taskSchedulerDao;

	@Override
	public JSONObject queryNeedCheckedDev() throws Exception {
		try {
			List<String> devs = taskSchedulerDao.queryNeedCheckedDev();
			JSONObject jso = new JSONObject();
			JSONObject result = new JSONObject();
			result.put("message", "成功");
			result.put("code", 200);
			jso.put("result", result);
			jso.put("devs", devs);
			return jso;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@Override
	public JSONObject updateTime(String devId) throws Exception {
		try {
			taskSchedulerDao.updateTime(devId);
			return ResultJson.updateSuccess();
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public JSONObject queryTaskByOwnerId(String ownerId) throws Exception {
		JSONObject jso = new JSONObject();
		try {
			BCFPlanPojo bCFPlanPojo = taskSchedulerDao
					.queryTaskByOwnerId(ownerId);
			JSONObject result = new JSONObject();
			result.put("message", "成功");
			result.put("code", 200);
			jso.put("result", result);
			jso.put("bCFPlan", bCFPlanPojo);
			return jso;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@Override
	public JSONObject mergeIntoByOwnerId(JSONObject params) throws Exception {
		BCFPlanPojo bCFPlanPojo = JSONObject.parseObject(params.toJSONString(),
				BCFPlanPojo.class);
		taskSchedulerDao.mergeIntoMysql(bCFPlanPojo);
		return ResultJson.updateSuccess();
	}

	@Override
	public JSONObject getStatuesByDevId(String devId) throws Exception {
		Integer statues = taskSchedulerDao.getStatuesByDevId(devId);
		JSONObject jso = new JSONObject();
		JSONObject result = new JSONObject();
		result.put("message", "成功");
		result.put("code", 200);
		jso.put("result", result);
		jso.put("statues", statues);
		return jso;
	}

	@Override
	public JSONObject getBfStatusByDevId(String devId) throws Exception {
		Map<String, String> map = taskSchedulerDao.getBfTimeByDevId(devId);

		Integer status = 0;
		if (Objects.isNotNullMap(map)) {
			Date nowDate = new Date();
			// 组装今天的布防开始时间和结束时间
			String bFStartime = dfDate.format(nowDate) + " "
					+ map.get("bFStartime").trim();
			Date bFStime = df.parse(bFStartime);
			String bFOvertime = dfDate.format(nowDate) + " "
					+ map.get("bFOvertime").trim();
			Date bFOtime = df.parse(bFOvertime);
			// 今天的布防开始时间和结束时间分别跟当前时间比较

			// 当前时间小于布防开始时间则为提早布防(1)
			if (nowDate.getTime() < bFStime.getTime())
				status = 1;
			// 当前时间大于布防结束时间则为推迟布防(2)
			else if (nowDate.getTime() > bFOtime.getTime())
				status = 2;
			else
				status = 0;
		}

		JSONObject jso = new JSONObject();
		jso.put("code", 200);
		jso.put("statues", status);
		return jso;
	}

}
