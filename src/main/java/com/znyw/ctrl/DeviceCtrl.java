package com.znyw.ctrl;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.ResultPojo;
import com.znyw.service.DeviceService;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.GetSysInfoUtil;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultUtil;

@Controller
public class DeviceCtrl {

	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	@Resource
	private DeviceService deviceService;

	@RequestMapping("/getEquipmentData")
	// 根据用户编号获取设备信息
	@ResponseBody
	public JSONObject getEquipmentData(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		JSONObject getJson, jsonCorrelation = null;
		try {
			getJson = JSONObject.parseObject(json);
			jsonCorrelation = deviceService.getDeviceInfos(getJson
					.getString("userId"));
			return jsonCorrelation;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1001", "参数错误", e.getMessage());
		}
	}

	@RequestMapping("/getCphEquipmentData")
	// 综合查询----获取关联设备信息列表
	@ResponseBody
	public JSONObject getCphEquipmentData(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		JSONObject jsonParam = null;
		try {
			jsonParam = JSONObject.parseObject(json);
			if (!jsonParam.containsKey("userId")) {
				String userId = GetSysInfoUtil.getUserId(request);
				jsonParam.put("userId", userId);
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1001", "参数错误", e.getMessage());
		}
		return deviceService.getCphQueeyEquipmentData(jsonParam);
	}

	/******************
	 * 根据设备编号查询对应的设备防区 周亚磊
	 * 
	 * @param request
	 * @param response
	 * @param json
	 * @return
	 */
	@RequestMapping("/getDevZone")
	@ResponseBody
	public JSONObject getDevZone(HttpServletRequest request,
			HttpServletResponse response) {

		String jsonStr, devId = null;
		JSONObject json = null;
		try {
			jsonStr = HttpTool.readJSONString(request);
			json = JSONObject.parseObject(jsonStr);
			devId = json.getString("devId");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1001", "参数错误", e.getMessage());
		}
		return deviceService.getDeviceZone(devId);
	}

	@RequestMapping("/getAssociatedDeviceByUserId")
	// 根据用户id 查询关联设备信息
	@ResponseBody
	public ResponseEntity<String> getEquipmentData(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr, userId = null;
		JSONObject json, userPojo = null;
		ResultPojo result = null;
		try {
			jsonStr = HttpTool.readJSONString(request);
			json = JSONObject.parseObject(jsonStr);
			userPojo = json.getJSONObject("userPojo");
			userId = userPojo.getString("userId");
			result = deviceService.getAssociatedDeviceByUserId(userId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
		return result.GetResponseEntity();
	}

	@RequestMapping("/getMonitorInfoByDevId")
	// 根据用户id 查询关联用户监控点信息
	@ResponseBody
	public ResponseEntity<String> getMonitorInfoByDevId(
			HttpServletRequest request, HttpServletResponse response) {
		String jsonStr, devId = null;
		ResultPojo result = null;
		JSONObject json = null;
		try {
			jsonStr = HttpTool.readJSONString(request);
			json = JSONObject.parseObject(jsonStr);
			devId = json.getString("devId");
			result = deviceService.getMonitorInfoByDevId(devId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
		return result.GetResponseEntity();
	}

	/**
	 * 添加用户监控点
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/addUserMonitorInfo")
	@ResponseBody
	public ResponseEntity<String> addUserMonitorInfo(
			HttpServletRequest request, HttpServletResponse response) {
		ResultPojo result = new ResultPojo();
		String jsonStr = null;
		JSONObject json = null;
		try {
			jsonStr = HttpTool.readJSONString(request);
			json = JSONObject.parseObject(jsonStr);
			if (!json.containsKey("dataFrom")
					|| "".equals(json.get("dataFrom"))) {
				json.put("dataFrom", ConfigUtil.getPlatformId());
			}

			result = deviceService.addUserMonitorInfo(json);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result.setResult("500", "参数错误", e.getMessage());
			return result.GetResponseEntity();
		}

	}

	/**
	 * 更新用户监控点
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/updateUserMonitorInfo")
	@ResponseBody
	public ResponseEntity<String> updateUserMonitorInfo(
			HttpServletRequest request, HttpServletResponse response) {
		ResultPojo result = new ResultPojo();
		String jsonStr = null;
		JSONObject json = null;
		try {
			jsonStr = HttpTool.readJSONString(request);
			json = JSONObject.parseObject(jsonStr);
			result = deviceService.updateUserMonitorInfo(json);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result.setResult("500", "参数错误", e.getMessage());
			return result.GetResponseEntity();
		}
	}

	/**
	 * 删除用户监控点
	 * 
	 * @param request
	 * @param response
	 * @return
	 */

	@RequestMapping("/delUserMonitorInfo")
	@ResponseBody
	public ResponseEntity<String> delUserMonitorInfo(
			HttpServletRequest request, HttpServletResponse response) {
		ResultPojo result = new ResultPojo();

		String jsonStr, roleId, devId, devMonitorId, userMonitorId = null;
		JSONObject json, userMonitorjson = null;
		try {
			jsonStr = HttpTool.readJSONString(request);
			json = JSONObject.parseObject(jsonStr);
			userMonitorjson = json.getJSONObject("userMonitorPojo");
			roleId = userMonitorjson.getString("ownerId");
			devId = userMonitorjson.getString("devId");
			devMonitorId = userMonitorjson.getString("devMonitorId");
			userMonitorId = userMonitorjson.getString("ownerMonitorId");
			result = deviceService.delUserMonitorInfo(roleId, devId,
					devMonitorId, userMonitorId);
		} catch (Exception e) {
			result.setResult("500", "参数错误", e.getMessage());
			LOGGER.error(e.getMessage(), e);
		}
		return result.GetResponseEntity();
	}

	@RequestMapping("/getDevinfoAbstractByUserIdFromDTPP")
	@ResponseBody
	public ResponseEntity<String> getDevinfoAbstractByUserIdFromDTPP(
			HttpServletRequest request, HttpServletResponse response) {

		String json = HttpTool.readJSONString(request);
		ResultPojo result = new ResultPojo();
		try {
			JSONObject jsonObject = JSONObject.parseObject(json);

			if (jsonObject.containsKey("userId")) {
				jsonObject.put("ownerId", jsonObject.getString("userId"));
			}

			result = deviceService
					.getDevinfoAbstractByOwnerIdFromDTPP(jsonObject);
		} catch (Exception e) {
			result.setResult("500", "参数错误", e.getMessage());
			LOGGER.error(e.getMessage(), e);
		}
		return result.GetResponseEntity();
	}

	@RequestMapping("/getDevinfoAbstractByOwnerIdFromDTPP")
	@ResponseBody
	public ResponseEntity<String> getDevinfoFromDTPP(
			HttpServletRequest request, HttpServletResponse response) {

		String json = HttpTool.readJSONString(request);
		ResultPojo result = new ResultPojo();
		JSONObject jsonObject = null;
		try {
			jsonObject = JSONObject.parseObject(json);
			result = deviceService
					.getDevinfoAbstractByOwnerIdFromDTPP(jsonObject);
		} catch (Exception e) {
			result.setResult("500", "参数错误", e.getMessage());
			LOGGER.error(e.getMessage(), e);
		}
		return result.GetResponseEntity();
	}

	/**
	 * 修改设备编号
	 * 
	 * @param request
	 * 
	 *            {"oldDevId":"旧编号","newDevId":"新编号"}
	 * 
	 * @param response
	 * @return
	 */
	@RequestMapping("/modifyDevId")
	@ResponseBody
	public JSONObject modifyDevId(HttpServletRequest request,
			HttpServletResponse response) {

		String jsonStr = HttpTool.readJSONString(request);
		JSONObject json = null;
		try {
			json = JSONObject.parseObject(jsonStr);
			return deviceService.modifyDevId(json);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误", e.getMessage());
		}

	}

	/**
	 * 获取报警主机位置信息（经纬度）
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/getAlarmHostLocationInfo")
	@ResponseBody
	public JSONObject getAlarmHostLocationInfo(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {

		try {
			JSONObject jsonObject = JSONObject.parseObject(json);
			return deviceService.getAlarmHostLocationInfo(jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误", e.getMessage());
		}
	}

	/**
	 * 一键报警添加设备防区
	 * 
	 * @param request
	 * 
	 *            {
	 * 
	 *            "data":{ "almType":"", "atPost":"", "devId":"","devZoneId":"",
	 *            "fMemo":"", "instDate":"", "snModelId":"", "snNum":"",
	 *            "snType":"", "wantDo":"" }
	 * 
	 *            }
	 * @param response
	 * @return
	 */
	@RequestMapping("/addDevZoneForOneClickDev")
	@ResponseBody
	public JSONObject addDevZoneForOneClickDev(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String json = HttpTool.readJSONString(request);
			JSONObject jsonObject = JSONObject.parseObject(json);
			return deviceService.addDevZoneForOneClickDev(jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误", e.getMessage());
		}
	}

	/**
	 * 一键报警修改设备防区
	 * 
	 * @param request
	 * 
	 * 
	 *            {
	 * 
	 *            "data": { "almType":"", "atPost":"", "fMemo":"", "instDate":"",
	 *            "snModelId":"", "snNum":"", "snType":"", "wantDo":"" } ,
	 * 
	 *            "condition":{ "devId":"","devZoneId":""}
	 * 
	 *            }
	 * 
	 * @param response
	 * @return
	 */
	@RequestMapping("/updateDevZoneForOneClickDev")
	@ResponseBody
	public JSONObject updateDevZoneForOneClickDev(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String json = HttpTool.readJSONString(request);
			JSONObject jsonObject = JSONObject.parseObject(json);
			return deviceService.updateDevZoneForOneClickDev(jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误", e.getMessage());
		}
	}

	/**
	 * 一键报警删除设备防区
	 * 
	 * @param request
	 * 
	 *            {
	 * 
	 *            "condition":{ "devId":"","devZoneId":""}
	 * 
	 *            }
	 * 
	 * 
	 * @param response
	 * @return
	 */
	@RequestMapping("/deleteDevZoneForOneClickDev")
	@ResponseBody
	public JSONObject deleteDevZoneForOneClickDev(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String json = HttpTool.readJSONString(request);
			JSONObject jsonObject = JSONObject.parseObject(json);
			return deviceService.deleteDevZoneForOneClickDev(jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误", e.getMessage());
		}
	}

	/**
	 * 查询一键报警设备防区列表
	 * 
	 * @param request
	 * 
	 *            {
	 * 
	 *            "condition":{ "devId":""}
	 * 
	 *            }
	 * @param response
	 * @return
	 */
	@RequestMapping("/queryDevZoneForOneClickDev")
	@ResponseBody
	public JSONObject queryDevZoneForOneClickDev(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String json = HttpTool.readJSONString(request);
			JSONObject jsonObject = JSONObject.parseObject(json);
			return deviceService.queryDevZoneForOneClickDev(jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误", e.getMessage());
		}
	}

	/**
	 * 查询一键报警设备防区列表
	 * 
	 * @param request
	 * 
	 *            {
	 * 
	 *            "condition":{ "devId":""}
	 * 
	 *            }
	 * @param response
	 * @return
	 */
	@RequestMapping("/queryDevZoneForOneClickDevFromRDA")
	@ResponseBody
	public JSONObject queryDevZoneForOneClickDevFromRDA(
			HttpServletRequest request, HttpServletResponse response,
			@ModelAttribute("json") String json) {
		try {
			JSONObject jsonObject = JSONObject.parseObject(json);
			return deviceService.queryDevZoneForOneClickDev(jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误", e.getMessage());
		}
	}

	/**
	 * 批量删除用户监控点
	 * 
	 * @param request
	 * @param response
	 * @return
	 */

	@SuppressWarnings("unchecked")
	@RequestMapping("/delUserMonitorInfoBatch")
	@ResponseBody
	public ResponseEntity<String> delUserMonitorInfoBatch(
			HttpServletRequest request, HttpServletResponse response) {
		ResultPojo result = new ResultPojo();
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			// JSONObject userMonitorjson =
			// json.getJSONObject("userMonitorPojo");
			String ownerId = json.getString("ownerId");

			JSONArray ownerMonitorIdArray = json.getJSONArray("ownerMonitorId");
			List<String> userMonitorId = (List<String>) JSON
					.parse(ownerMonitorIdArray.toJSONString());
			// String userMonitorId =
			// userMonitorjson.getString("ownerMonitorId");
			result = deviceService.delUserMonitorInfoBatch(ownerId,
					userMonitorId);
		} catch (Exception e) {
			result.setResult("500", "参数错误", e.getMessage());
			LOGGER.error(e.getMessage(), e);
		}
		return result.GetResponseEntity();
	}

	/**
	 * 一键报警批量删除设备防区
	 * 
	 * @param request
	 * 
	 *            {
	 * 
	 *            "devId":"","devZoneIds":[],
	 * 
	 *            }
	 * 
	 * 
	 * @param response
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/deleteBatchDevZoneForOneClickDev")
	@ResponseBody
	public ResponseEntity<String> deleteBatchDevZoneForOneClickDev(
			HttpServletRequest request, HttpServletResponse response) {
		ResultPojo result = new ResultPojo();
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			// JSONObject userMonitorjson =
			// json.getJSONObject("userMonitorPojo");
			String devId = json.getString("devId");

			JSONArray devZoneIdsArray = json.getJSONArray("devZoneIds");
			List<String> devZoneIds = (List<String>) JSON.parse(devZoneIdsArray
					.toJSONString());
			// String userMonitorId =
			// userMonitorjson.getString("ownerMonitorId");
			result = deviceService.deleteBatchDevZoneForOneClickDev(devId,
					devZoneIds);
		} catch (Exception e) {
			result.setResult("500", "参数错误", e.getMessage());
			LOGGER.error(e.getMessage(), e);
		}
		return result.GetResponseEntity();
	}
}