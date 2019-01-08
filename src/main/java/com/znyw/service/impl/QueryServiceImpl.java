package com.znyw.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.AreaDao;
import com.znyw.dao.UserInfoDao;
import com.znyw.dao.impl.UserDaoImp;
import com.znyw.pojo.OwnerPojo;
import com.znyw.pojo.ResultPojo;
import com.znyw.service.DeviceService;
import com.znyw.service.DropDownService;
import com.znyw.service.QueryService;
import com.znyw.service.VideoService;
import com.znyw.service.ZoneService;
import com.znyw.tool.HttpClientTool;
import com.znyw.tool.Objects;
import com.znyw.tool.PropertyConfigUtil;
import com.znyw.tool.ResultUtil;

@Service
public class QueryServiceImpl implements QueryService {
	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	private PropertyConfigUtil propertyconfigUtil = PropertyConfigUtil
			.getInstance("properties/config.properties");

	@Resource
	MysqlService mysqlservice;
	@Resource
	private DeviceService deviceService;
	@Resource
	private DropDownService dropDownService;
	@Resource
	private AreaDao areaDao;
	@Resource
	private UserDaoImp userDaoImp;
	@Resource
	private UserInfoDao userInfoDao;
	@Resource
	private ZoneService zoneService;
	@Resource
	private VideoService videoService;

	@Override
	public JSONObject ctrlUserQuery(JSONObject param) {
		JSONObject json = null;
		try {
			json = mysqlservice.userServiceQuery(param);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return json;
	}

	@Override
	public JSONObject operatorUserQuery(JSONObject param) {
		JSONObject json = null;
		try {
			json = mysqlservice.operatorUserQuery(param);
			return json;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}
	}

	@Override
	public JSONObject userServiceQueryRDA(JSONObject param) {
		JSONObject json = null;
		try {
			json = mysqlservice.userServiceQueryRDA(param);
			return json;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}
	}

	@Override
	public JSONObject getCphEquipmentData(JSONObject param) {
		JSONObject json = null;
		try {
			json = deviceService.getCphQueeyEquipmentData(param);
			return json;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@Override
	public JSONObject RDANvrHave(JSONObject param) {
		JSONObject json = null;
		try {
			json = mysqlservice.RDANvrHaveService(param);
			return json;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@Override
	public JSONObject RDANvrNo(JSONObject param) {
		JSONObject json = null;
		try {
			json = mysqlservice.RDANvrNoService(param);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
		return json;
	}

	@Override
	public ResultPojo getOwnerDropDownRDA(String dropDownName) {
		ResultPojo result = new ResultPojo();
		try {
			dropDownService.getOwnerDropDown(dropDownName);
			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result.setResult("500", "参数异常", e.getMessage());
			return result;
		}
	}

	@Override
	public JSONObject ctrlUser(String userId) {
		JSONObject json = null;
		try {
			json = mysqlservice.userService(userId);
			return json;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}
	}

	@Override
	public JSONObject userServiceRelat(String accountNum) {
		JSONObject json = null;
		try {
			json = mysqlservice.userServiceRelat(accountNum);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}
		return json;
	}

	@Override
	public JSONObject getLatLngSer(JSONObject param) {
		JSONObject json = null;
		try {
			json = mysqlservice.getLatLngSer(param);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
		return json;
	}

	@Override
	public JSONObject getMapPicByUserId(String userId) {
		JSONObject json = null;
		try {
			json = zoneService.getMapPicByUserId(userId);
			return json;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@Override
	public JSONObject getUserZoneByUserId(String userId) {
		JSONObject json = null;
		try {
			json = zoneService.getUserZoneByUserId(userId);
			return json;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@Override
	public JSONObject getCodeMemo(String codeTypeId) {
		JSONObject json = null;
		try {
			json = mysqlservice.getCodeMemo(codeTypeId);
			return json;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@Override
	public JSONObject getNVRVideoUrl(String cameraIdList) {
		JSONObject json = null;
		try {
			json = videoService.getNVRVideoUrl(cameraIdList);
			return json;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@Override
	public String eventQuery(String paramStr) {

		// 判断是否有联络电话，如果有联络电话测去数据库筛选用户
		JSONObject json = JSONObject.parseObject(paramStr);
		String cphone = json.getString("cphone");
		String all = json.getString("all");
		json.put("userIds", null);
		if ((cphone != null && !"".equals(cphone))
				|| (all != null && !"".equals(all))) {
			try {
				cphone = cphone != null && !"".equals(cphone) ? cphone : all;
				List<String> userIds = userDaoImp.getUserIdIdByCphone(cphone);
				json.put("userIds", userIds);
			} catch (Exception e) {
				JSONObject rsresult = new JSONObject();
				rsresult.put("code", "-1");
				rsresult.put("message", "联络电话查询用户列表异常!");
				JSONObject rsjson = new JSONObject();
				rsjson.put("result", rsresult);
				return rsjson.toJSONString();
			}
		}

		String urlShiWu = propertyconfigUtil.getValue("urlShiWu");
		String rspStr = HttpClientTool.SendToShiWu(urlShiWu,
				"Integrated/eventQuery.do", json.toJSONString());
		if (rspStr == null || "".equals(rspStr)) {
			LOGGER.error("Integrated/eventQuery.do 返回为空");
			JSONObject rsresult = new JSONObject();
			rsresult.put("code", "-1");
			rsresult.put("message", "network error!");
			JSONObject rsjson = new JSONObject();
			rsjson.put("result", rsresult);
			rspStr = rsjson.toJSONString();
		}
		return rspStr;
	}

	@Override
	public String verifyQuery(String paramStr) {
		String urlShiWu = propertyconfigUtil.getValue("urlShiWu");

		JSONObject origin = JSONObject.parseObject(paramStr);

		String cPhone = null;
		if (origin.containsKey("all")
				&& Objects.isNotNullString(origin.getString("all"))) {
			cPhone = origin.getString("all");
		} else if (origin.containsKey("cMobile")
				&& Objects.isNotNullString(origin.getString("cMobile"))) {
			cPhone = origin.getString("cMobile");
		}

		if (Objects.isNotNullString(cPhone)) {
			try {
				List<String> userIds = userInfoDao.getUserIdsByPhoneNo(cPhone);
				origin.put("userIds", userIds);

			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
			}
		}
		String rspStr = HttpClientTool.SendToShiWu(urlShiWu,
				"Integrated/verifyQuery.do", origin.toJSONString());
		if (rspStr == null || "".equals(rspStr)) {
			LOGGER.error("Integrated/verifyQuery.do 返回为空");
			JSONObject rsresult = new JSONObject();
			rsresult.put("code", "-1");
			rsresult.put("message", "network error!");
			JSONObject rsjson = new JSONObject();
			rsjson.put("result", rsresult);
			rspStr = rsjson.toJSONString();
		}
		return rspStr;
	}

	@Override
	public String alertProcessingQuery(String paramStr) {
		String urlShiWu = propertyconfigUtil.getValue("urlShiWu");

		JSONObject origin = JSONObject.parseObject(paramStr);

		String cPhone = null;
		if (origin.containsKey("all")
				&& Objects.isNotNullString(origin.getString("all"))) {
			cPhone = origin.getString("all");
		} else if (origin.containsKey("cMobile")
				&& Objects.isNotNullString(origin.getString("cMobile"))) {
			cPhone = origin.getString("cMobile");
		}

		if (Objects.isNotNullString(cPhone)) {
			try {
				List<String> userIds = userInfoDao.getUserIdsByPhoneNo(cPhone);
				origin.put("userIds", userIds);

			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
			}
		}

		String rspStr = HttpClientTool.SendToShiWu(urlShiWu,
				"Integrated/alertProcessingQuery.do", origin.toJSONString());
		if (rspStr == null || "".equals(rspStr)) {
			LOGGER.error("Integrated/alertProcessingQuery.do 返回为空");
			JSONObject rsresult = new JSONObject();
			rsresult.put("code", "-1");
			rsresult.put("message", "network error!");
			JSONObject rsjson = new JSONObject();
			rsjson.put("result", rsresult);
			rspStr = rsjson.toJSONString();
		}
		return rspStr;
	}

	@Override
	public String maintenanceQuery(String paramStr) {
		String urlShiWu = propertyconfigUtil.getValue("urlShiWu");

		JSONObject origin = JSONObject.parseObject(paramStr);

		String cPhone = null;
		if (origin.containsKey("all")
				&& Objects.isNotNullString(origin.getString("all"))) {
			cPhone = origin.getString("all");
		} else if (origin.containsKey("cMobile")
				&& Objects.isNotNullString(origin.getString("cMobile"))) {
			cPhone = origin.getString("cMobile");
		}

		if (Objects.isNotNullString(cPhone)) {
			try {
				List<String> userIds = userInfoDao.getUserIdsByPhoneNo(cPhone);
				origin.put("userIds", userIds);

			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
			}
		}

		String rspStr = HttpClientTool.SendToShiWu(urlShiWu,
				"Integrated/maintenanceQuery.do", origin.toJSONString());
		LOGGER.info("访事务服务器  Integrated/maintenanceQuery.do 结果: {}", rspStr);
		if (rspStr == null || "".equals(rspStr)) {
			LOGGER.error("Integrated/maintenanceQuery.do 返回为空");
			JSONObject rsresult = new JSONObject();
			rsresult.put("code", "-1");
			rsresult.put("message", "network error!");
			JSONObject rsjson = new JSONObject();
			rsjson.put("result", rsresult);
			rspStr = rsjson.toJSONString();
		}
		return rspStr;
	}

	@Override
	public ResultPojo findAreaById(String areaId) {
		ResultPojo result = new ResultPojo();
		String areaName;
		try {
			areaName = areaDao.getAreaNameById(areaId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			ResultPojo error = new ResultPojo();
			error.setResult("500", "异常", e.getMessage());
			return error;
		}
		JSONObject area = new JSONObject();
		result.setResult("200", "成功");
		if (areaName != null) {
			area.put("areaId", areaId);
			area.put("areaName", areaName);
		}
		result.setPojo("area", area);
		return result;
	}

	@Override
	public ResultPojo findCenterById(String centerId) {
		ResultPojo result = new ResultPojo();
		String centerName = null;
		try {
			centerName = userInfoDao.findCenterById(centerId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			ResultPojo error = new ResultPojo();
			error.setResult("500", "异常", e.getMessage());
			return error;
		}
		JSONObject center = new JSONObject();
		result.setResult("200", "成功");

		if (centerName != null) {
			center.put("centerId", centerId);
			center.put("centerName", centerName);
		}
		result.setPojo("center", center);
		return result;
	}

	@Override
	public String alertPretreatment(String paramStr) {
		String urlShiWu = propertyconfigUtil.getValue("urlShiWu");
		String rspStr = HttpClientTool.SendToShiWu(urlShiWu,
				"AlertManage/alertPretreatment.do", paramStr);
		LOGGER.info("访事务服务器 AlertManage/alertPretreatment.do结果: {}", rspStr);
		if (rspStr == null || "".equals(rspStr)) {
			LOGGER.error("AlertManage/alertPretreatment.do 返回为空");
			JSONObject rsresult = new JSONObject();
			rsresult.put("code", "-1");
			rsresult.put("message", "network error!");
			JSONObject rsjson = new JSONObject();
			rsjson.put("result", rsresult);
			rspStr = rsjson.toJSONString();
		}
		return rspStr;
	}

	@Override
	public ResultPojo getUserInfoByUserIdDTPP(String userId) {
		ResultPojo returnVal = new ResultPojo();// 结果
		Map<String, Object> map = null;
		try {
			map = userDaoImp.getOwnerInfo("ASC", 1, 1, " 1=1 ", "all", "all",
					"all", "", "", "_userId", userId, "1");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			ResultPojo error = new ResultPojo();
			error.setResult("500", "参数异常", e.getMessage());
			return error;
		}
		List<?> list = (List<?>) map.get("list");
		returnVal.setResult("0", "查询成功");
		returnVal.setPojo("ownerPojo",
				list.isEmpty() ? new OwnerPojo() : list.get(0));

		return returnVal;

	}

	@Override
	public String alarmStatus(String paramStr) {
		String urlShiWu = propertyconfigUtil.getValue("urlShiWu");
		String rspStr = HttpClientTool.SendToShiWu(urlShiWu,
				"AlertManage/alarmStatus.do", paramStr);
		LOGGER.info("访事务服务器 AlertManage/alarmStatus.do结果: {}", rspStr);
		if (rspStr == null || "".equals(rspStr)) {
			LOGGER.error("AlertManage/alarmStatus.do 返回为空");
			JSONObject rsresult = new JSONObject();
			rsresult.put("code", "-1");
			rsresult.put("message", "network error!");
			JSONObject rsjson = new JSONObject();
			rsjson.put("result", rsresult);
			rspStr = rsjson.toJSONString();
		}
		return rspStr;
	}

	@Override
	public String QueryLogListByAuid(String paramStr) {
		String urlLog = propertyconfigUtil.getValue("urlLog");
		String rspStr = HttpClientTool.post(urlLog, "QueryLogListByAuid.do",
				paramStr);
		LOGGER.info("访日志服务器  QueryLogListByAuid.do结果: {}", rspStr);
		if (rspStr == null || "".equals(rspStr)) {
			LOGGER.error(" QueryLogListByAuid.do 返回为空");
			JSONObject rsresult = new JSONObject();
			rsresult.put("code", "-1");
			rsresult.put("message", "network error!");
			JSONObject rsjson = new JSONObject();
			rsjson.put("result", rsresult);
			rspStr = rsjson.toJSONString();
		}
		return rspStr;
	}

	@Override
	public String QueryLogList(String paramStr) {
		String urlLog = propertyconfigUtil.getValue("urlLog");
		String rspStr = HttpClientTool
				.post(urlLog, "QueryLogList.do", paramStr);
		LOGGER.info("访日志服务器  QueryLogList.do结果: {}", rspStr);
		if (rspStr == null || "".equals(rspStr)) {
			LOGGER.error(" QueryLogList.do 返回为空");
			JSONObject rsresult = new JSONObject();
			rsresult.put("code", "-1");
			rsresult.put("message", "network error!");
			JSONObject rsjson = new JSONObject();
			rsjson.put("result", rsresult);
			rspStr = rsjson.toJSONString();
		}
		return rspStr;
	}

	@Override
	public String getInspectionFormById(String paramStr) {
		String urlRDAcenter = propertyconfigUtil.getValue("urlRDAcenter");
		String rspStr = HttpClientTool.post(urlRDAcenter,
				"inspection/getInspectionFormById.do", paramStr);
		LOGGER.info("访联网报警 inspection/getInspectionFormById.do结果: {}", rspStr);
		if (rspStr == null || "".equals(rspStr)) {
			LOGGER.error("inspection/getInspectionFormById.do 返回为空");
			JSONObject rsresult = new JSONObject();
			rsresult.put("code", "-1");
			rsresult.put("message", "network error!");
			JSONObject rsjson = new JSONObject();
			rsjson.put("result", rsresult);
			rspStr = rsjson.toJSONString();
		}
		return rspStr;
	}

	@Override
	public String getInspectionForms(String paramStr) {

		JSONObject json = JSONObject.parseObject(paramStr);// 获取联络电话去mysql数据库查询用户编号列表
		JSONObject queryPojo = json.getJSONObject("queryPojo");
		String queryOperation = queryPojo.getString("queryOperation");
		String queryContent = queryPojo.getString("queryContent");
		if (("all".equals(queryOperation) || "cMobile".equals(queryOperation))
				&& queryContent != null && !"".equals(queryContent.trim())) {
			try {
				List<String> userIds = userDaoImp
						.getUserIdIdByCphone(queryContent);
				json.put("userIds", userIds);
			} catch (Exception e) {
				JSONObject rsresult = new JSONObject();
				rsresult.put("code", "-1");
				rsresult.put("message", "联络电话查询用户列表异常!");
				JSONObject rsjson = new JSONObject();
				rsjson.put("result", rsresult);
				return rsjson.toJSONString();
			}
		}

		String urlRDAcenter = propertyconfigUtil.getValue("urlRDAcenter");
		String rspStr = HttpClientTool.post(urlRDAcenter,
				"inspection/getInspectionForms.do", json.toJSONString());
		LOGGER.info("访联网报警 inspection/getInspectionForms.do结果: {}", rspStr);
		if (rspStr == null || "".equals(rspStr)) {
			LOGGER.error("inspection/getInspectionForms.do 返回为空");
			JSONObject rsresult = new JSONObject();
			rsresult.put("code", "-1");
			rsresult.put("message", "network error!");
			JSONObject rsjson = new JSONObject();
			rsjson.put("result", rsresult);
			rspStr = rsjson.toJSONString();
		}
		return rspStr;
	}

	@Override
	public String queryEventStatistics(String paramStr) {
		String urlEventStatistics = propertyconfigUtil
				.getValue("urlEventStatistics");
		String rspStr = HttpClientTool.post(urlEventStatistics,
				"EventStatistics/queryEventStatistics.do", paramStr);
		LOGGER.info(" EventStatistics/queryEventStatistics.do结果: {}", rspStr);
		if (rspStr == null || "".equals(rspStr)) {
			LOGGER.error("inspection/getInspectionForms.do 返回为空");
			JSONObject rsresult = new JSONObject();
			rsresult.put("code", "-1");
			rsresult.put("message", "network error!");
			JSONObject rsjson = new JSONObject();
			rsjson.put("result", rsresult);
			rspStr = rsjson.toJSONString();
		}
		return rspStr;
	}

	@Override
	public String queryCodeTypeStatistics(String paramStr) {
		String urlEventStatistics = propertyconfigUtil
				.getValue("urlEventStatistics");
		String rspStr = HttpClientTool.post(urlEventStatistics,
				"EventStatistics/queryCodeTypeStatistics.do", paramStr);
		LOGGER.info("EventStatistics/queryCodeTypeStatistics.do: {}", rspStr);
		if (rspStr == null || "".equals(rspStr)) {
			LOGGER.error("EventStatistics/queryCodeTypeStatistics.do 返回为空");
			JSONObject rsresult = new JSONObject();
			rsresult.put("code", "-1");
			rsresult.put("message", "network error!");
			JSONObject rsjson = new JSONObject();
			rsjson.put("result", rsresult);
			rspStr = rsjson.toJSONString();
		}
		return rspStr;
	}

	/*
	 * @Override public String getCodeMemoRDA(String paramStr) { String
	 * urlEventStatistics = propertyconfigUtil.getValue("urlEventStatistics");
	 * LOGGER.info("【getCodeMemoRDA】  jsonStr={}", paramStr); String rspStr =
	 * HttpClientTool.post(urlEventStatistics,"getCodeMemo.do", paramStr);
	 * LOGGER.info("getCodeMemo.do: " + rspStr); if(rspStr==null ||
	 * "".equals(rspStr)){ LOGGER.error("getCodeTypeId.do 返回为空"); JSONObject
	 * rsresult = new JSONObject(); rsresult.put("code", "-1");
	 * rsresult.put("message", "network error!"); JSONObject rsjson = new
	 * JSONObject(); rsjson.put("result", rsresult); rspStr =
	 * rsjson.toJSONString(); } return rspStr; }
	 */

	@Override
	public String queryEventStatisticsByDay(String paramStr) {
		String urlEventStatistics = propertyconfigUtil
				.getValue("urlEventStatistics");
		String rspStr = HttpClientTool.post(urlEventStatistics,
				"EventStatistics/queryEventStatisticsByDay.do", paramStr);
		LOGGER.info("EventStatistics/queryEventStatisticsByDay.do: {}", rspStr);
		if (rspStr == null || "".equals(rspStr)) {
			LOGGER.error("queryEventStatisticsByDay.do 返回为空");
			JSONObject rsresult = new JSONObject();
			rsresult.put("code", "-1");
			rsresult.put("message", "network error!");
			JSONObject rsjson = new JSONObject();
			rsjson.put("result", rsresult);
			rspStr = rsjson.toJSONString();
		}
		return rspStr;
	}

	@Override
	public String querySysCodeStatistics(String paramStr) {
		String urlEventStatistics = propertyconfigUtil
				.getValue("urlEventStatistics");
		String rspStr = HttpClientTool.post(urlEventStatistics,
				"EventStatistics/querySysCodeStatistics.do", paramStr);
		LOGGER.info("EventStatistics/querySysCodeStatistics.do: {}", rspStr);
		if (rspStr == null || "".equals(rspStr)) {
			LOGGER.error("querySysCodeStatistics.do 返回为空");
			JSONObject rsresult = new JSONObject();
			rsresult.put("code", "-1");
			rsresult.put("message", "network error!");
			JSONObject rsjson = new JSONObject();
			rsjson.put("result", rsresult);
			rspStr = rsjson.toJSONString();
		}
		return rspStr;
	}

	@Override
	public JSONObject CtrlGetCodeTypeList(JSONObject param) {
		JSONObject json = null;
		try {
			json = mysqlservice.getCodeTypeListSer();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
		return json;
	}

	@Override
	public String getPictureListByDisposalAlarmNumServer(String paramStr) { // RDAcenter/getPictureListByDisposalAlarmNum.do
		String urlRDAcenter = propertyconfigUtil.getValue("urlRDAcenter");
		String rspStr = HttpClientTool.post(urlRDAcenter,
				"getPictureListByDisposalAlarmNum.do", paramStr);
		LOGGER.info("访联网报警 RDAcenter/getPictureListByDisposalAlarmNum.do结果: "
				+ rspStr);
		if (rspStr == null || "".equals(rspStr)) {
			LOGGER.error("RDAcenter/getPictureListByDisposalAlarmNum.do 返回为空");
			JSONObject rsresult = new JSONObject();
			rsresult.put("code", "-1");
			rsresult.put("message", "network error!");
			JSONObject rsjson = new JSONObject();
			rsjson.put("result", rsresult);
			rspStr = rsjson.toJSONString();
		}
		return rspStr;
	}
}
