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
import com.znyw.service.impl.QueryDeviceService;
import com.znyw.tool.GetSysInfoUtil;
import com.znyw.tool.HttpTool;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultJson;
import com.znyw.tool.ResultUtil;

/**
 * 管联平台查询设备信息
 * 
 * @author ywhl
 *
 */
@Controller
@RequestMapping("/UpdateDdviceCtrl")
public class QueryDeviceCtrl {

	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	@Resource
	QueryDeviceService queryDeviceService;

	@RequestMapping("/queryNVRhave")
	@ResponseBody
	public JSONObject queryNVRhave(HttpServletRequest request,
			HttpServletResponse response) { // 查询NVR有线信息列表
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			JSONObject queryTond = json.getJSONObject("queryTond");
			String areaId = queryTond.getString("areaId");
			String queryId = queryTond.getString("queryId");
			String isowner = queryTond.getString("isowner");
			String platformId = queryTond.containsKey("platformId")?queryTond.getString("platformId"):"";
			JSONObject pageInfoPojo = json.getJSONObject("pageInfoPojo");
			String currentPage = pageInfoPojo.getString("currentPage");
			String pageSize = pageInfoPojo.getString("pageSize");
			String sort = pageInfoPojo.getString("sort").contains("DESC") ? " DESC "
					: " ASC ";
			if (areaId == null || areaId.equals("")) {
				return ResultJson.insertFaler();
			}
			String userId = GetSysInfoUtil.getUserId(request);
			return queryDeviceService.queryNVRheve(queryId, areaId, sort,
					pageSize, currentPage, isowner, userId,platformId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}

	}

	@RequestMapping("/queryNVRno")
	@ResponseBody
	public JSONObject queryNVRno(HttpServletRequest request,
			HttpServletResponse response) { // 查询NVR无线信息

		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);

			JSONObject queryTond = json.getJSONObject("queryTond");
			String areaId = queryTond.getString("areaId");
			String queryId = queryTond.getString("queryId");
			String isowner = queryTond.getString("isowner");
			String platformId = queryTond.containsKey("platformId")?queryTond.getString("platformId"):"";

			JSONObject pageInfoPojo = json.getJSONObject("pageInfoPojo");
			String currentPage = pageInfoPojo.getString("currentPage");
			String pageSize = pageInfoPojo.getString("pageSize");
			String sort = pageInfoPojo.getString("sort").contains("DESC") ? " DESC "
					: " ASC ";

			if (areaId == null || areaId.equals("")) {
				return ResultJson.insertFaler();
			}

			String userId = GetSysInfoUtil.getUserId(request);
			return queryDeviceService.queryNVRno(queryId, areaId, sort,
					pageSize, currentPage, isowner, userId,platformId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	/**
	 * 查询一键报警设备
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/queryOneClickDev")
	@ResponseBody
	public JSONObject queryOneClickDev(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr = HttpTool.readJSONString(request);

		try {
			JSONObject jsonObject = JSONObject.parseObject(jsonStr);
			String userId = jsonObject.getString("userId");
			if (Objects.isNullString(userId)) {
				userId = GetSysInfoUtil.getUserId(request);
			}
			return queryDeviceService.queryOneClickDev(userId, jsonObject);

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误", e.getMessage());
		}
	}

	/**
	 * 查询一键报警设备
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/queryOneClickDevFromRDA")
	@ResponseBody
	public JSONObject queryOneClickDevFromRDA(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {

		try {
			JSONObject jsonObject = JSONObject.parseObject(json);
			String userId = jsonObject.getString("userId");
			if (Objects.isNullString(userId)) {
				userId = GetSysInfoUtil.getUserId(request);
			}
			return queryDeviceService.queryOneClickDev(userId, jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误", e.getMessage());
		}
	}

	/**
	 * 按设备编号查询一键报警设备
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/queryOneClickDevByDevId")
	@ResponseBody
	public JSONObject queryOneClickDevByDevId(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr = HttpTool.readJSONString(request);
		try {
			JSONObject jsonObject = JSONObject.parseObject(jsonStr);
			return queryDeviceService.queryOneClickDevByDevId(jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误", e.getMessage());
		}
	}

	/**
	 * 按设备编号查询一键报警设备
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/queryOneClickDevByDevIdFromRDA")
	@ResponseBody
	public JSONObject queryOneClickDevByDevIdFromRDA(
			HttpServletRequest request, HttpServletResponse response,
			@ModelAttribute("json") String json) {

		try {
			JSONObject jsonObject = JSONObject.parseObject(json);
			return queryDeviceService.queryOneClickDevByDevId(jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误", e.getMessage());
		}
	}

	@RequestMapping("/queryRelatedCtrl")
	@ResponseBody
	public JSONObject queryRelatedCtrl(HttpServletRequest request,
			HttpServletResponse response) { // 获取相关信息
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String devTutkID = json.getString("devTutkID");
			String channelNum = json.getString("channelNum");
			String sysCode = json.getString("sysCode");

			if (devTutkID == null || devTutkID.equals("") || channelNum == null
					|| channelNum.equals("") || sysCode == null
					|| sysCode.equals("")) {
				return ResultJson.insertFaler();
			}
			JSONObject jsonresu = queryDeviceService.queryRelated(devTutkID,
					channelNum, sysCode);
			return jsonresu;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误", e.getMessage());
		}
	}

	/**
	 * 徐志豪组社会资源整合 查询关联该设备的所有用户编号
	 */
	@RequestMapping("/queryUserIdCtrl")
	@ResponseBody
	public JSONObject queryUserIdCtrl(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String devId = json.getString("devId");
			if (devId == null || devId.equals("")) {
				return ResultJson.papmisNull();
			}
			JSONObject jsonresu = queryDeviceService.queryUserIdServer(devId);
			return jsonresu;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误", e.getMessage());
		}

	}

	/**
	 * 徐志豪组社会资源整合 根据监控点编号查询所有用户编号
	 */
	@RequestMapping("/QueryUserIdOrderCameradiCtrl")
	@ResponseBody
	public JSONObject QueryUserIdOrderCameradiCtrl(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String devId = json.getString("devId");
			if (devId == null || devId.equals("")) {
				return ResultJson.papmisNull();
			}
			JSONObject jsonresu = queryDeviceService
					.QueryUserIdOrderCameradiServer(devId);
			return jsonresu;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误", e.getMessage());
		}

	}

	@RequestMapping("/queryEventclass")
	@ResponseBody
	public JSONObject queryEventclass(HttpServletRequest request,
			HttpServletResponse response) { // 查询事件归类列表

		JSONObject jsonresu = queryDeviceService.queryEventclassServer();
		return jsonresu;
	}

	@RequestMapping("/queryDevBasic")
	@ResponseBody
	public JSONObject queryDevBasic(HttpServletRequest request,
			HttpServletResponse response) { // 查询设备基本信息表

		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String devId = json.getString("devId");
			if (devId == null || devId.equals("")) {
				return ResultJson.papmisNull();
			}
			JSONObject jsonresu = queryDeviceService.queryDevBasicServer(devId);
			return jsonresu;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误", e.getMessage());
		}
	}

	@RequestMapping({ "/queryDevOrderbyUserclass" })
	@ResponseBody
	public JSONObject queryDevOrderbyUserclass(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String userId = json.getString("userId");
			if ((userId == null) || (userId.equals(""))) {
				return ResultJson.papmisNull();
			}
			JSONObject jsonresu = this.queryDeviceService
					.queryDevOrderbyUserclassServer(userId);
			return jsonresu;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误", e.getMessage());
		}
	}

}
