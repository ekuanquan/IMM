package com.device.ctrl;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.device.service.IAlarmService;
import com.mongodb.util.JSON;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultUtil;

@Controller
@RequestMapping("/")
public class AlarmCtrl {
	private final static Logger LOGGER = LoggerFactory
			.getLogger(AlarmCtrl.class);
	@Resource
	IAlarmService iAlarmService;

	/**
	 * 查询报警原因表
	 */
	@ResponseBody
	@RequestMapping("QueryAlarmCaseList")
	public JSONObject QueryAlarmCaseList(HttpServletRequest request,
			HttpServletResponse response) {
		return iAlarmService.queryAlarmCaseList();
	}

	/**
	 * 根据用户id查询处警预案列表
	 */
	@ResponseBody
	@RequestMapping("QueryDealwayListByUid")
	public JSONObject QueryDealwayListByUid(HttpServletRequest request,
			HttpServletResponse response) {
		String stringParam = HttpTool.readJSONString(request);
		JSONObject jsonParam = null;
		try {
			jsonParam = JSONObject.parseObject(stringParam);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1001", "参数错误", e.getMessage());
		}
		String userId = jsonParam.getString("userId");
		return iAlarmService.queryDealwayListByUid(userId);
	}

	/***
	 * 添加处警预案
	 * 
	 * @param request
	 * 
	 *            { "ownerId":"xx", "dealWayId":xx, "fdata":"xx", "fMemo":"xx"}
	 * @param response
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@ResponseBody
	@RequestMapping("dealway/add")
	public JSONObject addDealway(HttpServletRequest request,
			HttpServletResponse response) {
		String stringParam = HttpTool.readJSONString(request);

		Map<String, Object> namesAndValues;
		try {
			namesAndValues = (Map<String, Object>) JSON.parse(stringParam);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1001", "参数错误", e.getMessage());
		}

		namesAndValues.put("ownerId", namesAndValues.remove("ownerId"));
		// 数据同步处理
		namesAndValues.remove("userId");
		namesAndValues.remove("dataSyncType");

		namesAndValues.remove("userName");
		if (!namesAndValues.containsKey("dataFrom")
				|| "".equals(namesAndValues.get("dataFrom").toString())) {
			namesAndValues.put("dataFrom", ConfigUtil.getPlatformId());
		}
		JSONObject result = iAlarmService.addDealWay(namesAndValues);

		return result;

	}

	@SuppressWarnings("unchecked")
	@ResponseBody
	@RequestMapping("dealway/update")
	public JSONObject updateDealway(HttpServletRequest request,
			HttpServletResponse response) {

		String stringParam = HttpTool.readJSONString(request);
		Map<String, Object> namesAndValues;
		try {
			namesAndValues = (Map<String, Object>) JSON.parse(stringParam);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1001", "参数错误", e.getMessage());
		}
		namesAndValues.remove("dataSyncType");
		namesAndValues.remove("dataFrom");
		namesAndValues.remove("userId");
		namesAndValues.remove("userName");
		return iAlarmService.updateDealWay(namesAndValues);

	}

	@SuppressWarnings("unchecked")
	@ResponseBody
	@RequestMapping("dealway/del")
	public JSONObject deleteDealway(HttpServletRequest request,
			HttpServletResponse response) {
		String stringParam = HttpTool.readJSONString(request);

		Map<String, Object> namesAndValues;
		try {
			namesAndValues = (Map<String, Object>) JSON.parse(stringParam);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1001", "参数错误", e.getMessage());
		}

		return iAlarmService.deleteDealWayByUserIdAndDealWayId(namesAndValues
				.get("ownerId").toString(), JSONArray.parseArray(namesAndValues.get("dealWayId").toString()));
	}

}