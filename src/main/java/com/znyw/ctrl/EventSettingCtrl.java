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

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.service.EventSettingService;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultJson;

@Controller
@RequestMapping("/eventSetting")
public class EventSettingCtrl {
	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());
	@Resource
	EventSettingService eventSettingService;

	@RequestMapping("/getEventSettingList")
	// 根据用户id，返回用户事件配置列表
	@ResponseBody
	public JSONObject getEventSettingList(HttpServletRequest request,
			HttpServletResponse response) throws Exception { // 根据设备编号、防区编号、系统码获取相关信息
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String userId = json.getString("userId");
			String zoneCHFlag = json.getString("ZoneCHFlag");
			JSONObject josn = eventSettingService.getEventSettingListService(
					userId, zoneCHFlag);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

	@RequestMapping("/delEventSetting")
	// 根据事件配置编号删除事件配置
	@ResponseBody
	public JSONObject delEventSetting(HttpServletRequest request,
			HttpServletResponse response) throws Exception { // 根据设备编号、防区编号、系统码获取相关信息
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			JSONArray userEvtList = json.getJSONArray("UserEvtList");
			JSONObject josn = eventSettingService
					.delEventSettingService(userEvtList);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

	@RequestMapping("/editEventSetting")
	// 根据事件配置编号，
	@ResponseBody
	public JSONObject editEventSetting(HttpServletRequest request,
			HttpServletResponse response) throws Exception { // 根据设备编号、防区编号、系统码获取相关信息
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String userEvtId = json.getString("UserEvtId");
			String fMemo = json.getString("fMemo");
			String isVideo = json.getString("isVideo");
			JSONObject josn = eventSettingService.editEventSettingService(
					userEvtId, fMemo, isVideo);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

	@SuppressWarnings("rawtypes")
	@RequestMapping("/addEventSetting")
	// 添加事件配置
	@ResponseBody
	public JSONObject addEventSetting(HttpServletRequest request,
			HttpServletResponse response) throws Exception { // 根据设备编号、防区编号、系统码获取相关信息
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String userId = json.getString("ownerId");
			List addZoonIdList = json.getJSONArray("addZoonIdList");
			List addUserMonitorIdList = json
					.getJSONArray("addUserMonitorIdList");
			int isVideo = json.getIntValue("isVideo");
			if (!json.containsKey("dataFrom")
					|| "".equals(json.get("dataFrom"))) {
				json.put("dataFrom", ConfigUtil.getPlatformId());
			}

			JSONObject josn = eventSettingService.addEventSettingService(
					userId, isVideo, addZoonIdList, addUserMonitorIdList,
					json.getString("dataFrom"));
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

	@RequestMapping("/getUserMonitorIdByCameraId")
	// 根据摄像机id、机主id返回用户监控点编号
	@ResponseBody
	public JSONObject getUserMonitorIdByCameraId(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String devId = json.getString("devId");
			String userId = json.getString("ownerId");
			JSONObject josn = eventSettingService
					.getUserMonitorIdByCameraIdService(devId, userId);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

	@RequestMapping("/getUserMonitorIdByUserId")
	// 根据userId返回用户监控点编号
	@ResponseBody
	public JSONObject getUserMonitorIdByUserId(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String userId = json.getString("ownerId");
			JSONObject josn = eventSettingService
					.getUserMonitorIdByUserIdService(userId);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

	@RequestMapping("/getEvtCantList")
	// 根据事件配置编号返回联系人id列表
	@ResponseBody
	public JSONObject getEvtCantList(HttpServletRequest request,
			HttpServletResponse response) throws Exception { // 根据设备编号、防区编号、系统码获取相关信息
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String userEvtId = json.getString("UserEvtId");
			JSONObject josn = eventSettingService
					.getEvtCantListService(userEvtId);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

	@RequestMapping("/editEvtCantList")
	// 根据事件配置编号修改联系人id列表
	@ResponseBody
	public JSONObject editEvtCantList(HttpServletRequest request,
			HttpServletResponse response) throws Exception { // 根据设备编号、防区编号、系统码获取相关信息
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String userEvtId = json.getString("UserEvtId");
			String contList = json.getString("contList");
			JSONObject josn = eventSettingService.editEvtCantListService(
					userEvtId, contList);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

	@SuppressWarnings("rawtypes")
	@RequestMapping("/ListEditEvtCantList")
	// 根据事件配置编号列表修改联系人id列表
	@ResponseBody
	public JSONObject ListEditEvtCantList(HttpServletRequest request,
			HttpServletResponse response) throws Exception { // 根据设备编号、防区编号、系统码获取相关信息
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			List userEvtIdList = json.getJSONArray("UserEvtIdList");
			String contList = json.getString("contList");
			JSONObject josn = eventSettingService.listEditEvtCantListService(
					userEvtIdList, contList);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

	@RequestMapping("/checkSvaeLinkageSetting")
	// 选中后的联动设置保存，根据事件配置编号修改cameraId
	@ResponseBody
	public JSONObject checkSvaeLinkageSetting(HttpServletRequest request,
			HttpServletResponse response) throws Exception { // 根据设备编号、防区编号、系统码获取相关信息
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String userEvtId = json.getString("UserEvtId");
			String cameraId = json.getString("cameraId");
			JSONObject josn = eventSettingService
					.checkSvaeLinkageSettingService(userEvtId, cameraId);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

	@SuppressWarnings("rawtypes")
	@RequestMapping("/hookSvaeLinkageSetting")
	// 勾选后的联动设置保存，根据事件配置编号列表修改cameraId
	@ResponseBody
	public JSONObject hookSvaeLinkageSetting(HttpServletRequest request,
			HttpServletResponse response) throws Exception { // 根据设备编号、防区编号、系统码获取相关信息
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			List userEvtIdList = json.getJSONArray("UserEvtIdList");
			String cameraId = json.getString("cameraId");
			JSONObject josn = eventSettingService
					.hookSvaeLinkageSettingService(userEvtIdList, cameraId);
			return josn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

}
