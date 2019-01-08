package com.znyw.ctrl;

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

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.ResultPojo;
import com.znyw.service.DropDownService;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultJson;

@Controller()
@RequestMapping("/DropDown")
public class DropDownCtrl {
	private Logger LOGGER = LoggerFactory.getLogger(getClass());
	@Resource
	private DropDownService dropDownService;

	@RequestMapping("/getOwnerDropDown")
	// 下拉框
	@ResponseBody
	public ResponseEntity<String> getEquipmentData(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String dropDownName = json.getString("DropDownName");
			ResultPojo result = dropDownService.getOwnerDropDown(dropDownName);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
	}

	@RequestMapping("/getDevIdDrop")
	// 根据roleId获取设备编号
	@ResponseBody
	public ResponseEntity<String> getDevIdDrop(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String roleid = json.getString("roleId");
			ResultPojo result = dropDownService.getDevIdDropDown(roleid);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
	}

	@RequestMapping("/getOwnerDropDownRDA")
	@ResponseBody
	public JSONObject getOwnerDropDownRDA(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			String dropDownName = jsonParam.getString("DropDownName");
			ResultPojo result = dropDownService.getOwnerDropDown(dropDownName);
			JSONObject jsonStu = (JSONObject) JSONObject.toJSON(result);
			JSONObject resultStu = jsonStu.getJSONObject("returnVal");
			return resultStu;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

	@RequestMapping("/getAlarmDevIdDropByRoleId")
	// 根据ownerId获取相关联的 报警主机设备编号
	@ResponseBody
	public ResponseEntity<String> getAlarmDevIdDropByRoleId(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String ownerId = json.getString("ownerId");
			ResultPojo result = dropDownService
					.getAlarmDevIdDropByOwnerId(ownerId);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
	}

	@RequestMapping("/getNVRDevIdDropByOwnerId")
	// 根据roleId获取相关联的 NVR设备编号
	@ResponseBody
	public ResponseEntity<String> getNVRDevIdDropByOwnerId(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String roleid = json.getString("ownerId");
			ResultPojo result = dropDownService.getNVRDevIdDropByRoleId(roleid);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
	}

	@RequestMapping("/getMonitorByDevId")
	// 根据devId 获取相关联的 监控点id
	@ResponseBody
	public ResponseEntity<String> getMonitorByDevId(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String devId = json.getString("devId");
			ResultPojo result = dropDownService.getMonitorByDevId(devId);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
	}
}
