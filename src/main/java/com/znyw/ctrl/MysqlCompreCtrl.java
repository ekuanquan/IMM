package com.znyw.ctrl;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.znyw.service.impl.MysqlService;
import com.znyw.tool.GetSysInfoUtil;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultUtil;

@Controller
public class MysqlCompreCtrl {

	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	@Resource
	MysqlService mysqlservice;

	/**
	 * 何龙 根据用户编号查询用户基本信息 后台访问接口
	 * 
	 * @param response
	 * @param json
	 * @return
	 */
	@RequestMapping("/getUserData")
	@ResponseBody
	public JSONObject ctrlUser(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {

		JSONObject jsonParam = JSONObject.parseObject(json);
		String UserId = null;
		JSONObject result = null;

		try {
			UserId = jsonParam.getString("userId");
		} catch (Exception e) {
			result = new JSONObject();
			result.put("code", "2");
			result.put("message", "参数错误");
			result.put("detail", e.getMessage());
			return result;
		}
		try {
			result = mysqlservice.userService(UserId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			JSONObject error = new JSONObject();
			JSONObject errorResult = new JSONObject();
			JSONObject errorUserInformation = new JSONObject();
			errorResult.put("message", "Error");
			errorResult.put("code", "401");
			error.put("result", errorResult);
			error.put("userInformation", errorUserInformation);
			error.put("detail", e.getMessage());
			return error;
		}

		return result;
	}

	@RequestMapping("/getUserZone")
	@ResponseBody
	public JSONObject getUserZone(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) { // 接处警用户防区信息查询
		JSONObject jsonParam = JSONObject.parseObject(json);
		String UserId = jsonParam.getString("userId");
		JSONObject result = null;
		try {
			result = mysqlservice.userzoneService(UserId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			JSONObject error = new JSONObject();
			JSONObject errorResult = new JSONObject();
			JSONObject errorUserInformation = new JSONObject();
			errorResult.put("message", "Error");
			errorResult.put("detail", e.getMessage());
			errorResult.put("code", "401");
			error.put("result", errorResult);
			error.put("userzone", errorUserInformation);
			return error;
		}
		return result;
	}

	/**
	 * 综合查询用户信息列表
	 */
	@RequestMapping("/getCphUserData")
	@ResponseBody
	public JSONObject ctrlUserQuery(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {

		JSONObject JOSN = null;
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			String userId = GetSysInfoUtil.getUserId(request);
			jsonParam.put("userId", userId);
			JOSN = mysqlservice.userServiceQuery(jsonParam);
			return JOSN;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	}

	/**
	 * 综合查询用户信息列表(写这个借口是因为查询用户信息的时候查出多条数据，该接口把设备信息去掉) 只查询机主信息
	 */
	@RequestMapping("/getCphUserDataRDA")
	@ResponseBody
	public JSONObject ctrlUserQueryRDA(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {

		try {
			JSONObject jsonParam = JSONObject.parseObject(json);

			if (!jsonParam.containsKey("userId")) {
				String userId = GetSysInfoUtil.getUserId(request);
				jsonParam.put("userId", userId);
			}
			JSONObject JOSN = mysqlservice.userServiceQueryRDA(jsonParam);
			return JOSN;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	}

	@RequestMapping("/getRelevantContact")
	@ResponseBody
	public JSONObject ctrlRelat(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) { // 接处警获取相关联系人信息

		JSONObject getJson = JSONObject.parseObject(json);
		JSONObject jsonCorrelation = null;
		try {
			jsonCorrelation = mysqlservice.userServiceRelat(getJson.get(
					"userId").toString());
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			JSONObject error = new JSONObject();
			JSONObject errorResult = new JSONObject();
			JSONObject errorUserInformation = new JSONObject();
			errorResult.put("message", "Error");
			errorResult.put("code", "401");
			errorResult.put("detail", e.getMessage());
			error.put("result", errorResult);
			error.put("relevantContact", errorUserInformation);
			return error;
		}
		return jsonCorrelation;
	}

	/**
	 * 联网报警单据查询时，需要支持负责人电话查询，由于单据中没有存储负责人电话， 所以只能先通过负责人电话查找到设备，然后再通过设备区定位单据信息
	 * 
	 * @param request
	 * @param response
	 * @param json
	 * @return
	 */
	@RequestMapping("/getUserIdsByPhoneNo")
	@ResponseBody
	public JSONObject getUserIdsByPhoneNo(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject jsonObject = JSONObject.parseObject(json);

			return mysqlservice.getUserIdsByPhoneNo(jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
	}

	@RequestMapping("/ctrlDevice")
	@ResponseBody
	public JSONObject ctrlDevice(HttpServletRequest request,
			HttpServletResponse response) throws Exception { // 根据树插件设备所属区域编号查询设备信息。

		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			JSONObject queryTond = json.getJSONObject("queryTond");
			String areaId = queryTond.getString("areaId");
			JSONObject pageInfoPojo = json.getJSONObject("pageInfoPojo");
			String pageSize = pageInfoPojo.getString("pageSize");
			String currentPage = pageInfoPojo.getString("currentPage");

			JSONObject JOSN = mysqlservice.deviceService(areaId, pageSize,
					currentPage);
			return JOSN;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}

	}

	@RequestMapping("/ctrlRelatinfForOneClickDev")
	@ResponseBody
	public JSONObject ctrlRelatinfForOneClickDev(HttpServletRequest request,
			HttpServletResponse response) throws Exception { // 根据设备SN、防区编号、系统码获取相关信息

		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String devSn = json.getString("devNum");
			String devZoneId = json.getString("devZoneId");
			String sysCode = json.getString("sysCode");
			JSONObject JOSN = mysqlservice.relatinfServiceForOneClikDev(devSn,
					devZoneId, sysCode);
			return JOSN;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}

	}

	@RequestMapping("/ctrlRelatinf")
	@ResponseBody
	public JSONObject ctrlRelatinf(HttpServletRequest request,
			HttpServletResponse response) { // 根据设备编号、防区编号、系统码获取相关信息
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String devId = json.getString("devId");
			String devZoneId = json.getString("devZoneId");
			String sysCode = json.getString("sysCode");

			JSONObject JOSN = mysqlservice.relatinfService(devId, devZoneId,
					sysCode);
			return JOSN;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}

	}

	@RequestMapping("/ctrlCustrom")
	@ResponseBody
	public JSONObject ctrlCustrom(HttpServletRequest request,
			HttpServletResponse response) throws Exception { // 根据客户所属区域编号查询客户信息。
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			JSONObject queryTond = json.getJSONObject("queryTond");
			String areaId = queryTond.getString("areaId");
			JSONObject pageInfoPojo = json.getJSONObject("pageInfoPojo");
			String pageSize = pageInfoPojo.getString("pageSize");
			String currentPage = pageInfoPojo.getString("currentPage");

			JSONObject JOSN = mysqlservice.customerService(areaId, pageSize,
					currentPage);
			return JOSN;
		} catch (Exception e) {
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	}

	@RequestMapping("/RDANvrHave")
	@ResponseBody
	public JSONObject RDANvrHave(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json)
			throws Exception { // 接处警NVR有线信息查询
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			if (!jsonParam.containsKey("userId")) {
				String userId = GetSysInfoUtil.getUserId(request);
				jsonParam.put("userId", userId);
			}
			JSONObject JOSN = mysqlservice.RDANvrHaveService(jsonParam);
			return JOSN;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	}

	@RequestMapping("/RDANvrNo")
	@ResponseBody
	public JSONObject RDANvrNo(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json)
			throws Exception { // 接处警NVR无线信息查询

		try {
			JSONObject jsonParam = JSONObject.parseObject(json);

			if (!jsonParam.containsKey("userId")) {
				String userId = GetSysInfoUtil.getUserId(request);
				jsonParam.put("userId", userId);
			}
			JSONObject JOSN = mysqlservice.RDANvrNoService(jsonParam);
			return JOSN;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	}

	// 获取相关事件弹窗中的事件类型

	@RequestMapping("/getCodeTypeId")
	@ResponseBody
	public JSONObject getCodeTypeId(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		JSONObject result = null;
		try {
			result = mysqlservice.findCodeType();
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
			error.put("userzone", errorUserInformation);
			return error;
		}
	}

	// 获取相关事件弹窗中的事件描述

	@RequestMapping("/getCodeMemo")
	@ResponseBody
	public JSONObject getCodeMemo(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {

		JSONObject jsonParam = JSONObject.parseObject(json);
		String codeTypeId = null;
		JSONObject result = null;

		try {
			codeTypeId = jsonParam.getString("codeTypeId");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result = new JSONObject();
			result.put("code", "2");
			result.put("message", "参数错误");
			result.put("detail", e.getMessage());
			return result;
		}

		try {
			result = mysqlservice.getCodeMemo(codeTypeId);
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
		return result;
	}

	/**
	 * 接处警查询事件类型
	 */
	@RequestMapping("/eveType")
	@ResponseBody
	public JSONObject eveType(HttpServletRequest request,
			HttpServletResponse response) {
		JSONObject result = null;
		try {
			result = mysqlservice.getEveType();
			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	}

	/**
	 * 接处警查询事件描述
	 */
	@RequestMapping("/eveDescribe")
	@ResponseBody
	public JSONObject eveDescribe(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			JSONObject result = null;
			result = mysqlservice.getDescribe();
			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	}

	/**
	 * 根据设备编号查询经纬度
	 */
	@RequestMapping("/getLatLng")
	@ResponseBody
	public JSONObject getLatLng(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			JSONObject result = mysqlservice.getLatLngSer(jsonParam);
			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	}

	/**
	 * 事件类型列表
	 */
	@RequestMapping("/getCodeTypeList")
	@ResponseBody
	public JSONObject getCodeTypeList(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			JSONObject result = mysqlservice.getCodeTypeListSer();
			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	}
}
