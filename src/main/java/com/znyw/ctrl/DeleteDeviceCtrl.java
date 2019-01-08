package com.znyw.ctrl;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.service.impl.DeleteDeviceService;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultUtil;

@Controller
@RequestMapping("/DeleteDeviceCtrl")
public class DeleteDeviceCtrl {
	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	@Resource
	DeleteDeviceService deletedeviceser;

	@RequestMapping("/deleteZone")
	@ResponseBody
	public JSONObject deleteZone(HttpServletRequest request,
			HttpServletResponse response) { // 删除防区
		String jsonStr = null;
		JSONObject json = null;
		try {
			jsonStr = HttpTool.readJSONString(request);
			json = JSONObject.parseObject(jsonStr);
			String devId = json.getString("devId");
			return deletedeviceser.deleteZoneService(devId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1001", "参数错误", e.getMessage());
		}
	}

	@RequestMapping("/deleteSpay")
	@ResponseBody
	public JSONObject deleteSpay(HttpServletRequest request,
			HttpServletResponse response) { // 删除防区
		String jsonStr = null;
		JSONObject json = null;
		try {
			jsonStr = HttpTool.readJSONString(request);
			json = JSONObject.parseObject(jsonStr);
			String devId = json.getString("spayId");
			String devZoneId = json.getString("devZoneId");
			return deletedeviceser.deleteSpayService(devId, devZoneId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1001", "参数错误", e.getMessage());
		}
	}

	@SuppressWarnings("unchecked")
	@RequestMapping("/deleteSpayBatch")
	@ResponseBody
	public JSONObject deleteSpayBatch(HttpServletRequest request,
			HttpServletResponse response) { // 删除防区
		String jsonStr = null;
		JSONObject json = null;
		try {
			jsonStr = HttpTool.readJSONString(request);
			json = JSONObject.parseObject(jsonStr);
			String devId = json.getString("devId");
			// String devZoneId = json.getString("devZoneId");

			JSONArray devZoneIdsArray = json.getJSONArray("devZoneIds");
			List<String> devZoneIds = (List<String>) JSON.parse(devZoneIdsArray
					.toJSONString());
			return deletedeviceser.deleteSpayBatchService(devId, devZoneIds);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1001", "参数错误", e.getMessage());
		}
	}

	@SuppressWarnings("unchecked")
	@RequestMapping("/deleteZoneBatch")
	@ResponseBody
	public JSONObject deleteZoneBatch(HttpServletRequest request,
			HttpServletResponse response) { // 删除防区
		String jsonStr = null;
		JSONObject json = null;
		try {
			jsonStr = HttpTool.readJSONString(request);
			json = JSONObject.parseObject(jsonStr);

			JSONArray devIdsArray = json.getJSONArray("devIds");
			List<String> devIds = (List<String>) JSON.parse(devIdsArray
					.toJSONString());
			return deletedeviceser.deleteZoneBatchService(devIds);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1001", "参数错误", e.getMessage());
		}
	}
}
