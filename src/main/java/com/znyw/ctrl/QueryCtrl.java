package com.znyw.ctrl;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.ResultPojo;
import com.znyw.service.QueryService;
import com.znyw.tool.GetSysInfoUtil;
import com.znyw.tool.HttpTool;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultUtil;

@Controller
@RequestMapping("/query")
public class QueryCtrl {

	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	@Resource
	QueryService queryService;

	// 一般客户列表查询
	@RequestMapping("/getCphUserData")
	@ResponseBody
	public JSONObject ctrlUserQuery(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr = HttpTool.readJSONString(request);
		try {
			JSONObject jsonParam = JSONObject.parseObject(jsonStr);
			String userId = GetSysInfoUtil.getUserId(request);
			jsonParam.put("userId", userId);
			JSONObject json = queryService.ctrlUserQuery(jsonParam);
			return json;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	// 操作员列表查询
	@RequestMapping("/getCphUserDataOperator")
	@ResponseBody
	public JSONObject OperatorQuery(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject jsonParam = JSONObject.parseObject(jsonStr);
			String userId = GetSysInfoUtil.getUserId(request);
			jsonParam.put("userId", userId);
			JSONObject json = queryService.operatorUserQuery(jsonParam);
			return json;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	// 机主用户列表查询
	@RequestMapping("/getCphUserDataRDA")
	@ResponseBody
	public JSONObject getCphUserDataRDA(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject jsonParam = JSONObject.parseObject(jsonStr);
			String userId = GetSysInfoUtil.getUserId(request);
			jsonParam.put("userId", userId);
			JSONObject json = queryService.userServiceQueryRDA(jsonParam);
			return json;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	// 报警主机列表查询
	@RequestMapping("/getCphEquipmentData")
	@ResponseBody
	public JSONObject getCphEquipmentData(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject jsonParam = JSONObject.parseObject(jsonStr);
			if (!jsonParam.containsKey("userId")) {
				String userId = GetSysInfoUtil.getUserId(request);
				jsonParam.put("userId", userId);
			}
			JSONObject json = queryService.getCphEquipmentData(jsonParam);
			return json;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	// NVR有线列表查询
	@RequestMapping("/RDANvrHave")
	@ResponseBody
	public JSONObject RDANvrHave(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject jsonParam = JSONObject.parseObject(jsonStr);
			String userId = GetSysInfoUtil.getUserId(request);
			jsonParam.put("userId", userId);
			JSONObject json = queryService.RDANvrHave(jsonParam);
			return json;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	// NVR互联网列表查询
	@RequestMapping("/RDANvrNo")
	@ResponseBody
	public JSONObject RDANvrNo(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject jsonParam = JSONObject.parseObject(jsonStr);
			if (!jsonParam.containsKey("userId")) {
				String userId = GetSysInfoUtil.getUserId(request);
				jsonParam.put("userId", userId);
			}
			JSONObject json = queryService.RDANvrNo(jsonParam);
			return json;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@RequestMapping("/getOwnerDropDownRDA")
	@ResponseBody
	public JSONObject getOwnerDropDownRDA(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject jsonParam = JSONObject.parseObject(jsonStr);
			String dropDownName = jsonParam.getString("DropDownName");
			ResultPojo result = queryService.getOwnerDropDownRDA(dropDownName);
			JSONObject jsonStu = (JSONObject) JSONObject.toJSON(result);
			JSONObject resultStu = jsonStu.getJSONObject("returnVal");
			return resultStu;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@RequestMapping("/getUserData")
	@ResponseBody
	public JSONObject ctrlUser(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr = HttpTool.readJSONString(request);
		JSONObject jsonParam = JSONObject.parseObject(jsonStr);
		String UserId = null;
		JSONObject result = null;

		try {
			UserId = jsonParam.getString("userId");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result = new JSONObject();
			result.put("code", "2");
			result.put("message", "参数错误");
			result.put("detail", e.getMessage());
			return result;
		}

		try {
			result = queryService.ctrlUser(UserId);
			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			JSONObject error = new JSONObject();
			JSONObject errorResult = new JSONObject();
			JSONObject errorUserInformation = new JSONObject();
			errorResult.put("message", "Error");
			errorResult.put("detail", e.getMessage());
			errorResult.put("code", "401");
			error.put("result", errorResult);
			result.put("detail", e.getMessage());
			error.put("userInformation", errorUserInformation);
			return error;
		}
	}

	@RequestMapping("/getRelevantContact")
	@ResponseBody
	public JSONObject ctrlRelat(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr = HttpTool.readJSONString(request); // 接处警获取相关联系人信息

		JSONObject jsonParam = JSONObject.parseObject(jsonStr);
		JSONObject jsonCorrelation = null;
		try {
			jsonCorrelation = queryService.userServiceRelat(jsonParam.get(
					"userId").toString());
			return jsonCorrelation;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			JSONObject error = new JSONObject();
			JSONObject errorResult = new JSONObject();
			JSONObject errorUserInformation = new JSONObject();
			errorResult.put("message", "Error");
			errorResult.put("code", "401");
			error.put("result", errorResult);
			error.put("detail", e.getMessage());
			error.put("relevantContact", errorUserInformation);
			return error;
		}
	}

	@RequestMapping("/getLatLng")
	@ResponseBody
	public JSONObject getLatLng(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject jsonParam = JSONObject.parseObject(jsonStr);
			JSONObject result = queryService.getLatLngSer(jsonParam);
			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@RequestMapping("/getMapPicByUserId")
	// 根据userId 获取防区图 接处警使用
	@ResponseBody
	public JSONObject getMapPicByUserId(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject jsonParam = JSONObject.parseObject(jsonStr);
			JSONObject userPojo = jsonParam.getJSONObject("userPojo");
			String userId = userPojo.getString("userId");
			JSONObject result = queryService.getMapPicByUserId(userId);
			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@RequestMapping("/getUserZoneByUserId")
	// 综合查询----获取关联设备信息 //只包含有 x y 的 用户防区
	@ResponseBody
	public JSONObject getUserZoneByUserId(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject jsonParam = JSONObject.parseObject(jsonStr);
			JSONObject userPojo = jsonParam.getJSONObject("userPojo");
			String userId = userPojo.getString("userId");
			JSONObject result = queryService.getUserZoneByUserId(userId);
			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@RequestMapping("/getNVRVideoUrl")
	// 综合查询----获取关联设备信息
	@ResponseBody
	public JSONObject getNVRVideoUrl(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject jsonParam = JSONObject.parseObject(jsonStr);
			String cameraIdList = jsonParam.getString("cameraIdList");
			JSONObject result = queryService.getNVRVideoUrl(cameraIdList);
			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@RequestMapping("/getCodeMemo")
	@ResponseBody
	public JSONObject getCodeMemo(HttpServletRequest request,
			HttpServletResponse response) {

		String jsonStr = HttpTool.readJSONString(request);
		JSONObject jsonParam = JSONObject.parseObject(jsonStr);
		String codeTypeId = null;
		JSONObject result = null;

		try {
			codeTypeId = jsonParam.getString("codeTypeId");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result = new JSONObject();
			result.put("code", "2");
			result.put("detail", e.getMessage());
			result.put("message", "参数错误");
			return result;
		}

		try {
			result = queryService.getCodeMemo(codeTypeId);
			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			JSONObject error = new JSONObject();
			JSONObject errorResult = new JSONObject();
			JSONObject errorUserInformation = new JSONObject();
			errorResult.put("message", "Error");
			errorResult.put("detail", e.getMessage());
			errorResult.put("code", "401");
			error.put("result", errorResult);
			error.put("userInformation", errorUserInformation);
			return error;
		}
	}

	@RequestMapping("eventQuery")
	@ResponseBody
	public ResponseEntity<String> eventQuery(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			String resultStr = queryService.eventQuery(jsonStr);
			return HttpTool.GetResponseEntity(resultStr);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			throw e;
		}
	}

	@RequestMapping("verifyQuery")
	@ResponseBody
	public ResponseEntity<String> verifyQuery(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			String resultStr = queryService.verifyQuery(jsonStr);
			return HttpTool.GetResponseEntity(resultStr);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			throw e;
		}
	}

	@RequestMapping("alertProcessingQuery")
	@ResponseBody
	public ResponseEntity<String> alertProcessingQuery(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			String resultStr = queryService.alertProcessingQuery(jsonStr);
			return HttpTool.GetResponseEntity(resultStr);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			throw e;
		}
	}

	@RequestMapping("maintenanceQuery")
	@ResponseBody
	public ResponseEntity<String> maintenanceQuery(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			String resultStr = queryService.maintenanceQuery(jsonStr);
			return HttpTool.GetResponseEntity(resultStr);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			throw e;
		}
	}

	@RequestMapping("findAreaById")
	@ResponseBody
	public ResponseEntity<String> findAreaById(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject jsonParam = JSONObject.parseObject(jsonStr);
			String areaId = jsonParam.getString("areaId");
			ResultPojo result = queryService.findAreaById(areaId);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			ResultPojo error = new ResultPojo();
			error.setResult("500", "参数异常", e.getMessage());
			return error.GetResponseEntity();
		}
	}

	@RequestMapping("findCenterById")
	@ResponseBody
	public ResponseEntity<String> findCenterById(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject jsonParam = JSONObject.parseObject(jsonStr);
			String centerId = jsonParam.getString("centerId");
			ResultPojo result = queryService.findCenterById(centerId);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			ResultPojo error = new ResultPojo();
			error.setResult("500", "参数异常", e.getMessage());
			return error.GetResponseEntity();
		}
	}

	@RequestMapping("getUserInfoByUserIdDTPP")
	@ResponseBody
	public ResponseEntity<String> getUserInfoByUserIdDTPP(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			JSONObject userPojo = json.getJSONObject("userPojo");
			String userId = userPojo.getString("userId");
			if (Objects.isNull(userId)) {
				return ResultPojo.LACK_OF_PARAMETER("1");
			}
			ResultPojo result = queryService.getUserInfoByUserIdDTPP(userId);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
	}

	// 处警、核警的预处理接口，以及最外层预处理接口
	@RequestMapping("alertPretreatment")
	@ResponseBody
	public ResponseEntity<String> alertPretreatment(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			String resultStr = queryService.alertPretreatment(jsonStr);
			return HttpTool.GetResponseEntity(resultStr);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
	}

	@RequestMapping("alarmStatus")
	@ResponseBody
	public ResponseEntity<String> alarmStatus(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			String resultStr = queryService.alarmStatus(jsonStr);
			return HttpTool.GetResponseEntity(resultStr);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
	}

	// 【日志服务器】通过被操作用户翻页查询日志列表
	@RequestMapping("QueryLogListByAuid")
	@ResponseBody
	public ResponseEntity<String> QueryLogListByAuid(
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			String resultStr = queryService.QueryLogListByAuid(jsonStr);
			return HttpTool.GetResponseEntity(resultStr);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
	}

	// 【日志服务器】通过被操作用户翻页查询日志列表
	@RequestMapping("QueryLogList")
	@ResponseBody
	public ResponseEntity<String> QueryLogList(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			String resultStr = queryService.QueryLogList(jsonStr);
			return HttpTool.GetResponseEntity(resultStr);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
	}

	@RequestMapping("/getInspectionFormById")
	// 查询巡检单信息 单个用户信息
	@ResponseBody
	public ResponseEntity<String> getInspectionFormByInspectionFormId(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			String resultStr = queryService.getInspectionFormById(jsonStr);
			return HttpTool.GetResponseEntity(resultStr);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
	}

	@RequestMapping("/getInspectionForms")
	// 查询巡检单信息 单个用户信息
	@ResponseBody
	public ResponseEntity<String> getInspectionForms(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			String resultStr = queryService.getInspectionForms(jsonStr);
			return HttpTool.GetResponseEntity(resultStr);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
	}

	@RequestMapping(value = "queryEventStatistics")
	// 事件归类统计查询
	@ResponseBody
	public ResponseEntity<String> queryEventStatistics(
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			String resultStr = queryService.queryEventStatistics(jsonStr);
			return HttpTool.GetResponseEntity(resultStr);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
	}

	@RequestMapping(value = "queryCodeTypeStatistics")
	// 事件类型统计查询
	@ResponseBody
	public ResponseEntity<String> queryCodeTypeStatistics(
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			String resultStr = queryService.queryCodeTypeStatistics(jsonStr);
			return HttpTool.GetResponseEntity(resultStr);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
	}

	@RequestMapping(value = "queryEventStatisticsByDay")
	// 事件归类统计查询
	@ResponseBody
	public ResponseEntity<String> queryEventStatisticsByDay(
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			String resultStr = queryService.queryEventStatisticsByDay(jsonStr);
			return HttpTool.GetResponseEntity(resultStr);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
	}

	@RequestMapping(value = "querySysCodeStatistics")
	// 查询系统码统计（事件描述统计）
	@ResponseBody
	public ResponseEntity<String> querySysCodeStatistics(
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			String resultStr = queryService.querySysCodeStatistics(jsonStr);
			return HttpTool.GetResponseEntity(resultStr);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
	}

	@RequestMapping("/getCodeTypeList")
	// 事件类型列表
	@ResponseBody
	public JSONObject getCodeTypeList(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject jsonParam = JSONObject.parseObject(jsonStr);
			JSONObject json = queryService.CtrlGetCodeTypeList(jsonParam);
			return json;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@RequestMapping("/getPictureListByDisposalAlarmNum")
	// 查询处警单图片
	@ResponseBody
	public ResponseEntity<String> getPictureListByDisposalAlarmNum(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			String resultStr = queryService
					.getPictureListByDisposalAlarmNumServer(jsonStr);
			return HttpTool.GetResponseEntity(resultStr);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
	}

}
