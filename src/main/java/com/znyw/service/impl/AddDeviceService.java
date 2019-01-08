package com.znyw.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.device.AOP.LogAnnotation;
import com.systemcfg.dao.AssembleCfgDao;
import com.znyw.dao.AddDevice;
import com.znyw.dao.DeviceDao;
import com.znyw.dao.ZoneDao;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultJson;
import com.znyw.tool.ResultUtil;

/**
 * 添加设备信息
 * 
 * @author ywhl
 *
 */
@Service
public class AddDeviceService {
	private static final Logger LOGGER = LoggerFactory.getLogger(AddDeviceService.class);

	@Resource
	private AddDevice adddevice;
	@Resource
	private AssembleCfgDao assembleCfgDao;
	@Resource
	private ZoneDao zoneDao;
	@Resource
	private DeviceDao deviceDao;

	@SuppressWarnings("rawtypes")
	public JSONObject getOwnerCorrelateDevService(String ownerId) { // 查询机主关联设备
		JSONObject jsonObject = new JSONObject();
		JSONObject resulet = new JSONObject();
		try {
			List devList = adddevice.getOwnerCorrelateDevDao(ownerId);
			resulet.put("code", "200");
			resulet.put("message", "成功");
			jsonObject.put("result", resulet);
			jsonObject.put("json", devList);
			return jsonObject;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			resulet.put("code", "500");
			resulet.put("message", "失败");
			resulet.put("detail", e.getMessage());
			jsonObject.put("result", resulet);
			jsonObject.put("json", null);
			return jsonObject;
		}

	}

	@SuppressWarnings("rawtypes")
	@LogAnnotation(whitelog = "200")
	public JSONObject ownerAddAlarmhostService(String userName, String userId, JSONObject json) { // 添加报警主机

		try {
			int deviceNum = adddevice.queryDeviceNum(json.getString("devId"));
			if (deviceNum > 0) {
				LOGGER.error("数据库已经存在该设备编号！设备编号:{}", json.getString("devId"));
				return ResultJson.Resultimage();
			}
			int devicePlayNum = adddevice.queryDevicePlayNum(json.getString("devModelId"));

			// 如果前台没太传所属平台ID，则默认使用本平台ID
			if (!json.containsKey("platformId")) {
				json.put("platformId", ConfigUtil.getPlatformId());
			}

			boolean ret = adddevice.ownerAddAlarmhostImp(json, devicePlayNum);
			if (ret) {
				JSONObject message = new JSONObject();
				JSONObject errorResult = new JSONObject();
				errorResult.put("message", "添加成功！");
				errorResult.put("code", "200");
				message.put("result", errorResult);
				List devinfo = adddevice.getDevinfoDao(json.getString("devId"));
				message.put("json", devinfo);
				return message;
			} else {
				return ResultJson.insertFaler();
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1005", "添加失败", e.getMessage());
		}
	}

	@LogAnnotation(whitelog = "200")
	public JSONObject addAlarmhostService(String userName, String userId, JSONObject json) { // 添加报警主机
		try {
			int deviceNum = adddevice.queryDeviceNum(json.getString("devId"));
			if (deviceNum > 0) {
				LOGGER.error("数据库已经存在该设备编号！设备编号:{}", json.getString("devId"));
				return ResultJson.Resultimage();
			}
			int devicePlayNum = adddevice.queryDevicePlayNum(json.getString("devModelId"));

			// 如果前台没太传所属平台ID，则默认使用本平台ID
			if (!json.containsKey("platformId")) {
				json.put("platformId", ConfigUtil.getPlatformId());
			}

			adddevice.addAlarmhostImp(json, devicePlayNum);
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
			return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
		}
		return ResultJson.insertSuccess();
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public JSONObject addAlarmhostAreaService(JSONObject json) { // 添加报警主机防区信息
		try {
			adddevice.queryZoneNum(json.getString("devId"));
			List list = adddevice.queryAlalmhosPlay(json.getString("devId"), json.getString("devZoneId"));
			if (list.size() > 0) {
				LOGGER.info("防区 dev:{} devZoneId:{}已存在。添加失败。", json.getString("devId"), json.getString("devZoneId"));
				return ResultJson.addFail();
			}

			String ownerId = deviceDao.getOwnerIdByDevId(json.getString("devId"));
			// 如果该设备有机主，则自动关联到用户防区
			if (Objects.isNotNullString(ownerId)) {
				Map<String, Object> map = (Map<String, Object>) JSON.parse(json.toJSONString());
				map.put("ownerId", ownerId);
				map.put("ownerZoneName", getNextOwnerZoneId(ownerId));
				zoneDao.addOwnerZone(map);
			}

			return adddevice.addAlarmhostArea(json);
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
			return ResultUtil.simpleResponse("1005", "查询失败", e.getMessage());
		}

	}

	private String getNextOwnerZoneId(String ownerId) throws Exception {

		String maxZoneId = zoneDao.getMaxOwnerZoneId(ownerId);

		String ownerZoneId = String.valueOf(Integer.valueOf(maxZoneId) + 1);

		while (ownerZoneId.length() < 4) {
			ownerZoneId = "0" + ownerZoneId;
		}
		return ownerZoneId;
	}

	@SuppressWarnings({ "rawtypes" })
	public JSONObject updateAlarmhostAreaService(JSONObject json) { // 修改报警主机详细信息

		try {
			List list = adddevice.queryAlalmhosPlay(json.getString("devId"), json.getString("devZoneId"));

			if (list.size() > 0) {
				adddevice.updaAlarmhostArea(json);
				return ResultJson.updateSuccess();
			}
			LOGGER.error("未找到对应防区信息，防区编号:{}", json.getString("devZoneId"));
			return ResultJson.updateFail();
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
			return ResultUtil.simpleResponse("1005", "更新失败", e.getMessage());
		}

	}

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getDevModelService(String devType) { // 根据设备类型查询所有设备型号
		try {
			if (devType.equals("0")) {
				devType = "(devType= '1' OR devType= '10' OR devType= '9' or devType='15')";
			} else {
				devType = "devType=" + devType;
			}
			return adddevice.getDevModelService(devType);
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
			return ResultJson.queryList(e.getMessage());
		}
	}

	@LogAnnotation(whitelog = "200")
	public JSONObject addService(String userName, String userId, JSONObject json) { // 添加nvr有线

		try {
			int deviceNum = adddevice.queryDeviceNum(json.getString("devId"));
			if (deviceNum > 0) {
				LOGGER.error("数据库已经存在该设备编号！设备编号:", json.getString("devId"));
				return ResultJson.fail("数据库已经存在该设备编号！");
			}

			// 如果前台没太传所属平台ID，则默认使用本平台ID
			if (!json.containsKey("platformId")) {
				json.put("platformId", ConfigUtil.getPlatformId());
			}

			// Map<String, Object> map =
			// adddevice.findNVRByGbId(json.getString("gbId"));
			//
			// if (Objects.isNotNullMapWithObject(map)) {
			// return ResultUtil.simpleResponse("500", "国标ID重复");
			// }

			adddevice.addNVRhave(json);
			return ResultJson.insertNVRSuccess();
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
			return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
		}
	}

	@LogAnnotation(whitelog = "200")
	public JSONObject addNVRnoService(String userName, String userId, JSONObject json) { // 添加nvr无线
		try {
			int deviceNum = adddevice.queryDeviceNum(json.getString("devId"));
			if (deviceNum > 0) {
				LOGGER.error("数据库已经存在该设备编号！ {}", deviceNum);
				return ResultJson.Resultimage();
			}

			int numTUTK = adddevice.queryTUTKID(json.getString("devTUTKID"));
			if (numTUTK > 0) {
				LOGGER.error("P2P ID 已经存在！ {}", numTUTK);
				return ResultJson.aldeayTUTKID();
			}

			// 如果前台没太传所属平台ID，则默认使用本平台ID
			if (!json.containsKey("platformId")) {
				json.put("platformId", ConfigUtil.getPlatformId());
			}
			//
			// Map<String, Object> map =
			// adddevice.findNVRByGbId(json.getString("gbId"));
			//
			// if (Objects.isNotNullMapWithObject(map)) {
			// return ResultUtil.simpleResponse("500", "国标ID重复");
			// }

			adddevice.addNVRno(json);
			return ResultJson.insertNVRnoSuccess();
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
			return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
		}
	}

	public JSONObject addOneClickDev(JSONObject jsonObject) {
		try {
			if (Objects.isNullString(jsonObject.getString("devId"))
					|| Objects.isNullString(jsonObject.getString("areaId"))
					|| Objects.isNullString(jsonObject.getString("devSn"))
					|| Objects.isNullString(jsonObject.getString("loginName"))
			// || Objects.isNullString(jsonObject.getString("loginPwd"))
			) {
				return ResultUtil.simpleResponse("500", "缺少必要字段");
			}

			Map<String, Object> map = adddevice.findOneClikDevByDevSn(jsonObject.getString("devSn"));

			if (Objects.isNotNullMapWithObject(map)) {
				return ResultUtil.simpleResponse("500", "设备ID重复");
			}

			boolean added = adddevice.addOneClickDev(jsonObject);

			if (added) {
				return ResultUtil.simpleResponse("200", "添加成功");
			} else {
				return ResultUtil.simpleResponse("500", "添加失败");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
			return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
		}

	}

	public JSONObject updateOneClickDev(JSONObject jsonObject) {
		try {
			if (Objects.isNullString(jsonObject.getString("devId"))
					|| Objects.isNullString(jsonObject.getString("areaId"))
					|| Objects.isNullString(jsonObject.getString("devSn"))
					|| Objects.isNullString(jsonObject.getString("loginName"))
			// || Objects.isNullString(jsonObject.getString("loginPwd"))
			) {
				return ResultUtil.simpleResponse("500", "缺少必要字段");
			}

			if (!jsonObject.containsKey("dataFrom") || "".equals(jsonObject.get("dataFrom"))) {
				jsonObject.put("dataFrom", ConfigUtil.getPlatformId());
			}

			Map<String, Object> map = adddevice.findOneClikDevByDevSn(jsonObject.getString("devSn"));

			if (Objects.isNotNullMapWithObject(map)
					&& !jsonObject.getString("devId").equals(map.get("devId").toString())) {
				return ResultUtil.simpleResponse("500", "设备ID重复");
			}

			boolean updated = adddevice.updateOneClickDev(jsonObject);

			if (updated) {
				return ResultUtil.simpleResponse("200", "修改成功");
			} else {
				return ResultUtil.simpleResponse("500", "修改失败");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
			return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
		}

	}

	public JSONObject deleteOneClickDev(JSONObject jsonObject) {

		if (Objects.isNullString(jsonObject.getString("devId"))) {
			return ResultUtil.simpleResponse("500", "缺少必要字段");
		}

		try {
			boolean deleted = adddevice.deleteOneClickDev(jsonObject.getString("devId"));

			if (deleted) {
				return ResultUtil.simpleResponse("200", "删除成功");
			} else {
				return ResultUtil.simpleResponse("500", "删除失败");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
			return ResultUtil.simpleResponse("500", "刪除失败", e.getMessage());
		}

	}

	/**
	 * 获取厂商标识
	 * 
	 * @param manufacturer
	 * @return
	 */
	public String getManufacturerSymbol(String manufacturer) {

		switch (manufacturer) {
		case "HIK":
			return "HIK";

		case "DH":
			return "DH";

		case "其他":
			return "OTHER";
		case "OTHER":
			return "OTHER";

		default:
			LOGGER.error("未知的厂商名称 :{}", manufacturer);
			return "UNKNOWN";
		}
	}

}
