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

import com.alibaba.fastjson.JSONObject;
import com.znyw.service.impl.AddDeviceService;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.GetSysInfoUtil;
import com.znyw.tool.HttpTool;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultJson;
import com.znyw.tool.ResultUtil;

/**
 * 管联平台添加设备信息
 * 
 * @author ywhl
 *
 */
@Controller
@RequestMapping("/addDevice")
public class AddDeviceCtrl {

	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	@Resource
	AddDeviceService adddeviceService;

	/**
	 * 获取机主关联设备
	 */
	@RequestMapping("/getOwnerCorrelateDevCtrl")
	@ResponseBody
	public JSONObject getOwnerCorrelateDevCtrl(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr = HttpTool.readJSONString(request);
		JSONObject json = null;
		String ownerId = null;
		try {
			json = JSONObject.parseObject(jsonStr);
			ownerId = json.getString("ownerId");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1001", "参数错误", e.getMessage());
		}
		return adddeviceService.getOwnerCorrelateDevService(ownerId);
	}

	/**
	 * 机主里添加报警主机信息
	 */
	@RequestMapping("/ownerAddAlarmhost")
	@ResponseBody
	public JSONObject ownerAddAlarmhost(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr = HttpTool.readJSONString(request);
		JSONObject json = null;
		try {
			json = JSONObject.parseObject(jsonStr);
			if (json.getString("devModelId") == null
					|| json.getString("devId") == null
					|| json.getString("areaId") == null
					|| json.getString("devType") == null
					|| json.getString("devLng") == null
					|| json.getString("devlat") == null
					|| json.getString("manufacturer") == null
					|| json.getString("manufacturer").equals("")
					|| json.getString("devModelId").equals("")
					|| json.getString("devId").equals("")
					|| json.getString("areaId").equals("")
					|| json.getString("devType").equals("")
					|| json.getString("devLng").equals("")
					|| json.getString("devlat").equals("")) {
				LOGGER.error("参数不全，可能缺失以下字段中的一个或多个：devModelId,devId,areaId,devType,devLng,devLat,manufacturer");
				return ResultJson.insertFaler();
			}
			String userName = GetSysInfoUtil.getUserName(request);
			String userId = GetSysInfoUtil.getUserId(request);

			if (!json.containsKey("dataFrom")
					|| "".equals(json.get("dataFrom"))) {
				json.put("dataFrom", ConfigUtil.getPlatformId());
			}

			return adddeviceService.ownerAddAlarmhostService(userName, userId,
					json);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}

	}

	/**
	 * 添加报警主机信息
	 */
	@RequestMapping("/addAlarmhost")
	@ResponseBody
	public JSONObject addAlarmhostCatr(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr = HttpTool.readJSONString(request);
		JSONObject json = null;
		try {
			json = JSONObject.parseObject(jsonStr);
			if (json.getString("devModelId") == null
					|| json.getString("devId") == null
					|| json.getString("areaId") == null
					|| json.getString("devName") == null
					|| json.getString("devType") == null
					|| json.getString("devLng") == null
					|| json.getString("devlat") == null
					|| json.getString("devModelId").equals("")
					|| json.getString("devId").equals("")
					|| json.getString("areaId").equals("")
					|| json.getString("devName").equals("")
					|| json.getString("devType").equals("")
					|| json.getString("devLng").equals("")
					|| json.getString("devlat").equals("")) {
				// || json.getString("pnlActID") == null
				LOGGER.error("参数不全，可能缺失以下字段中的一个或多个：devModelId,devId,areaId,devName,devType,devLng,devLat");
				return ResultJson.insertFaler();
			}
			String userName = GetSysInfoUtil.getUserName(request);
			String userId = GetSysInfoUtil.getUserId(request);
			if (userName == null) {
				userName = json.getString("userName");
			}
			if (userId == null) {
				userId = json.getString("userId");
			}
			if (!json.containsKey("dataFrom")
					|| "".equals(json.get("dataFrom"))) {
				json.put("dataFrom", ConfigUtil.getPlatformId());
			}

			return adddeviceService.addAlarmhostService(userName, userId, json);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}

	}

	/**
	 * 添加报警主机设备防区
	 */
	@RequestMapping("/addAlarmhostArea")
	@ResponseBody
	public JSONObject addAlarmhostAreaCatr(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr = HttpTool.readJSONString(request);
		JSONObject json = null;
		try {
			json = JSONObject.parseObject(jsonStr);
			if (Objects.isNull(json.getString("devId"))) {
				LOGGER.info("[添加报警主机设备防区] /addDevice/addAlarmhostArea.do  缺少必填字段:devId");
				return ResultJson.insertFaler();
			}
			if (!json.containsKey("dataFrom")
					|| "".equals(json.get("dataFrom"))) {
				json.put("dataFrom", ConfigUtil.getPlatformId());
			}
			return adddeviceService.addAlarmhostAreaService(json);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

	/**
	 * 更新报警主机设备防区
	 */
	@RequestMapping("/updateAlarmhostArea")
	@ResponseBody
	public JSONObject updateAlarmhostAreaCatr(HttpServletRequest request,
			HttpServletResponse response) {

		String jsonStr = HttpTool.readJSONString(request);
		JSONObject json = null;
		try {
			json = JSONObject.parseObject(jsonStr);
			if (Objects.isNull(json.getString("devId"))) {
				LOGGER.info("[更新报警主机设备防区] /addDevice/updateAlarmhostArea.do  缺少必填字段:devId");
				return ResultJson.insertFaler();
			}
			return adddeviceService.updateAlarmhostAreaService(json);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

	/**
	 * 根据设备类型获取所有设备型号
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping("/getDevModel")
	@ResponseBody
	public List getDevModelCtrl(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr = HttpTool.readJSONString(request);
		JSONObject json = null;
		try {
			json = JSONObject.parseObject(jsonStr);
			String devType = json.getString("devType");
			return adddeviceService.getDevModelService(devType);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.queryList(e.getMessage());
		}
	}

	/**
	 * 添加NVR有线
	 */
	@RequestMapping("/addNVRhave")
	@ResponseBody
	public JSONObject addNVRhave(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr = HttpTool.readJSONString(request);
		JSONObject json = null;
		try {
			json = JSONObject.parseObject(jsonStr);
			if (json.getString("devId") == null
					|| json.getString("devName") == null
					|| json.getString("areaId") == null
					|| json.getString("devType") == null
					|| json.getString("devModelId") == null
					|| json.getString("devLoginName") == null
					// || json.getString("devLoginPwd") == null
					|| json.getString("devIp") == null
					|| json.getString("devInstDate") == null
					|| json.getString("devLng") == null
					|| json.getString("devlat") == null
					|| json.getString("ChannelNum") == null
					|| json.getString("devPort") == null
					|| json.getString("devId").equals("")
					|| json.getString("devName").equals("")
					|| json.getString("areaId").equals("")
					|| json.getString("devType").equals("")
					|| json.getString("devModelId").equals("")
					|| json.getString("devLoginName").equals("")
					// || json.getString("devLoginPwd").equals("")
					|| json.getString("devIp").equals("")
					|| json.getString("devInstDate").equals("")
					|| json.getString("devLng").equals("")
					|| json.getString("devlat").equals("")
					|| json.getString("ChannelNum").equals("")
					|| json.getString("devPort").equals("")) {
				LOGGER.error("参数不全，缺失（或为空）以下某个字段或多个字段：{}",
						Objects.Joiner(",", Objects.getKeys(json)));
				return ResultJson.insertFaler();
			}
			String userName = GetSysInfoUtil.getUserName(request);
			String userId = GetSysInfoUtil.getUserId(request);
			if (userName == null) {
				userName = json.getString("userName");
			}
			if (userId == null) {
				userId = json.getString("userId");
			}
			if (!json.containsKey("dataFrom")
					|| "".equals(json.get("dataFrom"))) {
				json.put("dataFrom", ConfigUtil.getPlatformId());
			}
			return adddeviceService.addService(userName, userId, json);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

	/**
	 * 添加NVR无线
	 */
	@RequestMapping("/addNVRno")
	@ResponseBody
	public JSONObject addNVRno(HttpServletRequest request,
			HttpServletResponse response) {

		String jsonStr = HttpTool.readJSONString(request);
		JSONObject json = null;
		try {
			json = JSONObject.parseObject(jsonStr);
			if (json.getString("devId") == null
					|| json.getString("devName") == null
					|| json.getString("areaId") == null
					|| json.getString("devType") == null
					|| json.getString("devModelId") == null
					|| json.getString("devLoginName") == null
					// || json.getString("devLoginPwd") == null
					|| json.getString("devTUTKID") == null
					|| json.getString("devInstDate") == null
					|| json.getString("devLng") == null
					|| json.getString("devlat") == null
					|| json.getString("ChannelNum") == null
					|| json.getString("devId").equals("")
					|| json.getString("devName").equals("")
					|| json.getString("areaId").equals("")
					|| json.getString("devType").equals("")
					|| json.getString("devModelId").equals("")
					|| json.getString("devLoginName").equals("")
					// || json.getString("devLoginPwd").equals("")
					|| json.getString("devTUTKID").equals("")
					|| json.getString("devInstDate").equals("")
					|| json.getString("devLng").equals("")
					|| json.getString("devlat").equals("")
					|| json.getString("ChannelNum").equals("")) {
				LOGGER.error("参数不全，缺失（或为空）以下某个字段或多个字段：{}",
						Objects.Joiner(",", Objects.getKeys(json)));
				return ResultJson.insertFaler();
			}
			String userName = GetSysInfoUtil.getUserName(request);
			String userId = GetSysInfoUtil.getUserId(request);
			if (userName == null) {
				userName = json.getString("userName");
			}
			if (userId == null) {
				userId = json.getString("userId");
			}
			if (!json.containsKey("dataFrom")
					|| "".equals(json.get("dataFrom"))) {
				json.put("dataFrom", ConfigUtil.getPlatformId());
			}
			return adddeviceService.addNVRnoService(userName, userId, json);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultJson.serverErro(e.getMessage());
		}
	}

	/**
	 * 添加一键式报警器
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/addOneClickDev")
	@ResponseBody
	public JSONObject addOneClickDev(HttpServletRequest request,
			HttpServletResponse response) {

		String jsonStr = HttpTool.readJSONString(request);
		JSONObject json = null;
		try {
			json = JSONObject.parseObject(jsonStr);
			if (!json.containsKey("dataFrom")
					|| "".equals(json.get("dataFrom"))) {
				json.put("dataFrom", ConfigUtil.getPlatformId());
			}
			if (!json.containsKey("platformId")) {
				json.put("platformId", ConfigUtil.getPlatformId());
			}
			return adddeviceService.addOneClickDev(json);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	}

	/**
	 * 更新一键式报警器
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/updateOneClickDev")
	@ResponseBody
	public JSONObject updateOneClickDev(HttpServletRequest request,
			HttpServletResponse response) {

		String jsonStr = HttpTool.readJSONString(request);
		JSONObject json = null;
		try {
			json = JSONObject.parseObject(jsonStr);
			return adddeviceService.updateOneClickDev(json);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	}

	/**
	 * 删除一键式报警器
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("/deleteOneClickDev")
	@ResponseBody
	public JSONObject deleteOneClickDev(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr = HttpTool.readJSONString(request);
		JSONObject json = null;
		try {
			json = JSONObject.parseObject(jsonStr);
			return adddeviceService.deleteOneClickDev(json);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	}
}
