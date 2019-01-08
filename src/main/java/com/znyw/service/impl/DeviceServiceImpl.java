package com.znyw.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.AddDevice;
import com.znyw.dao.DeviceDao;
import com.znyw.dao.ZoneDao;
import com.znyw.pojo.AssociatedDevicePojo;
import com.znyw.pojo.ResultPojo;
import com.znyw.service.DeviceService;
import com.znyw.service.RoleAreaService;
import com.znyw.service.ValidateService;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultUtil;

@Service("DeviceService")
public class DeviceServiceImpl implements DeviceService {

	private Logger LOGGER = Logger.getLogger(getClass());

	@Resource
	private DeviceDao deviceDao;
	@Resource
	private RoleAreaService roleAreaService;
	@Resource
	private ValidateService validateService;
	@Resource
	private ZoneDao zoneDao;
	@Resource
	private AddDevice adddevice;

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public JSONObject getDeviceInfos(String accountNum) throws Exception {

		JSONObject userjosn = new JSONObject();
		JSONObject result = new JSONObject();
		try {
			List deviceList = new ArrayList<JSONObject>();

			List devList = adddevice.getOwnerCorrelateDevDao(accountNum);

			// List listObject = deviceDao.getDeviceInfos(accountNum);
			// for (int i = 0; i < listObject.size(); i++) {
			// deviceList.add(JSONObject.toJSON(listObject.get(i)));
			// }

			if (devList.size() > 0) {
				result.put("code", "200");
				result.put("message", "success");
				userjosn.put("EquipmentList", devList);
				userjosn.put("result", result);
			} else {
				result.put("code", "201");
				result.put("message", "success");
				userjosn.put("result", result);
				userjosn.put("EquipmentList", devList);
			}
			return userjosn;
		} catch (Exception e) {
			result.put("code", "201");
			result.put("message", "success");
			userjosn.put("result", result);
			userjosn.put("result", e.getMessage());
			userjosn.put("EquipmentList", new JSONArray());
			return userjosn;
		}
	}

	@Override
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public JSONObject getCphQueeyEquipmentData(JSONObject JSON) {

		try {
			JSONObject pageInfoPojoPara = JSON.getJSONObject("pageInfoPojo");
			String currentPage = pageInfoPojoPara.getString("currentPage");
			int pageSizeInt = pageInfoPojoPara.getIntValue("pageSize");
			String sort = pageInfoPojoPara.getString("sort");
			int currentPageInt = Integer.parseInt(currentPage);
			sort = sort.contains("ASC") ? " asc " : " desc ";

			JSONObject queryTond = JSON.getJSONObject("queryTond");
			String devModelId = queryTond.getString("devModelId");
			String devMaster = queryTond.getString("devMaster");
			String timeStart = queryTond.getString("timeStart");
			String timeEnt = queryTond.getString("timeEnt");

			JSONObject fuzzy = queryTond.getJSONObject("fuzzy");
			String fuzzyKey = fuzzy.getString("fuzzyKey");
			String fuzzyValue = fuzzy.getString("fuzzyValue");

			String userId = JSON.getString("userId");

			List<String> purviewAreaIds = new ArrayList<String>();

			try {
				purviewAreaIds = roleAreaService
						.getPurviewAreaIdsByUserId(userId);
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "权限查询失败",
						e.getMessage());
			}

			String areaId = String.format(" and a.areaId in ('%s') ",
					Objects.Joiner("','", purviewAreaIds));

			Map<String, Object> map = null;

			try {
				map = deviceDao.cphQueeyEquipmentData(pageSizeInt,
						currentPageInt, sort, devModelId, devMaster, areaId,
						timeStart, timeEnt, fuzzyKey, fuzzyValue);
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "权限查询失败",
						e.getMessage());
			}

			List list = (List) map.get("list");

			Integer totalNum = (Integer) map.get("totalNum");

			int totalPages = (int) Math.ceil((totalNum * 1.0 / pageSizeInt));

			JSONObject Userjosn = new JSONObject();
			JSONObject result = new JSONObject();
			JSONObject pageInfoPojo = new JSONObject();

			result.put("message", "成功");
			result.put("code", 0);
			pageInfoPojo.put("pageSize", pageSizeInt);
			pageInfoPojo.put("totalNum", totalNum);
			pageInfoPojo.put("currentPage", currentPage);
			pageInfoPojo.put("totalPage", totalPages);
			Userjosn.put("result", result);
			Userjosn.put("json", list);
			Userjosn.put("pageInfoPojo", pageInfoPojo);

			return Userjosn;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public JSONObject getDeviceZone(String devId) {
		List deviceList = new ArrayList<JSONObject>();

		List listObject = null;
		try {
			listObject = deviceDao.getDeviceZone(devId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}

		for (int i = 0; i < listObject.size(); i++) {
			deviceList.add(JSONObject.toJSON(listObject.get(i)));
		}

		JSONObject userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		if (deviceList.size() > 0) {
			result.put("code", "200");
			result.put("message", "success");
			userjosn.put("EquipmentList", deviceList);
			userjosn.put("result", result);
		} else {
			result.put("code", "201");
			result.put("message", "success");
			userjosn.put("result", result);
			userjosn.put("EquipmentList", deviceList);
		}
		return userjosn;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public ResultPojo getAssociatedDeviceByUserId(String userId) {
		ResultPojo returnVal = new ResultPojo();// 结果
		List jsonList = new ArrayList<JSONObject>();
		List<AssociatedDevicePojo> list;
		try {
			list = deviceDao.findAssociatedDeviceByUserId(userId);
			for (int i = 0; i < list.size(); i++) {
				jsonList.add(JSONObject.toJSON(list.get(i)));
			}
			returnVal.setResult("0", "查询成功");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			returnVal.setResult("1  查询失败", "查询失败", e.getMessage());
		}
		returnVal.setPojo("associatedDevicePojo", jsonList);
		return returnVal;
	}

	@Override
	public ResultPojo getMonitorInfoByDevId(String devId) {
		JSONObject monitorInfo = null;
		ResultPojo returnVal = new ResultPojo();// 结果
		try {
			monitorInfo = deviceDao.findMonitorInfoByDevId(devId);
			returnVal.setResult("0", "查询成功");
			returnVal.setPojo("monitorInfo", monitorInfo);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			returnVal.setResult("1", "查询失败", e.getMessage());
		}

		return returnVal;
	}

	@Override
	public ResultPojo addUserMonitorInfo(JSONObject jsonObject)
			throws Exception {
		ResultPojo result = new ResultPojo();
		if (Objects.hasNullValue(jsonObject)) {
			result.setResult("500", "参数错误");
			return result;
		}
		String ownerId = jsonObject.getString("ownerId");
		String devId = jsonObject.getString("devId");
		String devMonitorId = jsonObject.getString("devMonitorId");
		String ownerMonitorId = jsonObject.getString("ownerMonitorId");
		String dataFrom = jsonObject.getString("dataFrom");

		if (deviceDao.findUserMonitorRoleIdDevIdDevMonitorId(ownerId,
				jsonObject.getString("devId"),
				jsonObject.getString("devMonitorId"))) {
			result.setResult("500", "此用户监控点已存在");
			return result;
		}
		if (deviceDao.findUserMonitorByRoleIdUserMonitorId(
				jsonObject.getString("ownerId"),
				jsonObject.getString("ownerMonitorId"))) {
			result.setResult("500", "用户监控点编号冲突");
			return result;
		}
		boolean insertBool = false;

		try {
			insertBool = deviceDao.addOwnermonitor(ownerId, devId,
					devMonitorId, ownerMonitorId, dataFrom);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			throw e;
		}

		if (insertBool) {
			result.setResult("200", "添加成功");
		} else {
			result.setResult("500", "添加失败");
		}

		return result;
	}

	@Override
	public ResultPojo updateUserMonitorInfo(JSONObject jsonObject) {
		ResultPojo result = new ResultPojo();

		if (Objects.hasNullValue(jsonObject)) {
			result.setResult("500", "参数错误");
			return result;
		}

		String roleId = jsonObject.getString("ownerId");
		String devId = jsonObject.getString("devId");
		String devMonitorId = jsonObject.getString("devMonitorId");
		String userMonitorId = jsonObject.getString("ownerMonitorId");

		try {

			if (deviceDao.findUserMonitorRoleIdDevIdDevMonitorId(roleId, devId,
					devMonitorId)) {
				boolean insertBool = deviceDao.updateUserMonitor(roleId, devId,
						devMonitorId, userMonitorId);
				if (insertBool) {
					result.setResult("200", "修改成功");
				} else {
					result.setResult("500", "修改失败");
				}
			}
			else {
				if (deviceDao.findUserMonitorByRoleIdUserMonitorId(roleId, userMonitorId)) {
					boolean insertBool = deviceDao.updateUserMonitor(roleId, devId,
							devMonitorId, userMonitorId);
					if (insertBool) {
						result.setResult("200", "修改成功");
					} else {
						result.setResult("500", "修改失败");
					}
				}
				else {
					result.setResult("2", "此用户防区不存在");
				}
			}

			// deviceDao.updateUserMonitor(roleId, devId, devMonitorId,
			// userMonitorId);


		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result.setResult("500", "修改失败", e.getMessage());
		}
		return result;
	}

	@Override
	public ResultPojo delUserMonitorInfo(String roleId, String devId,
			String devMonitorId, String userMonitorId) {

		ResultPojo result = new ResultPojo();

		try {
			if (Objects.isNullString(roleId) || Objects.isNullString(devId)
					|| Objects.isNullString(devMonitorId)) {
				result.setResult("500", "参数错误");
				return result;
			}

			boolean isExist = deviceDao.findUserMonitorRoleIdDevIdDevMonitorId(
					roleId, devId, devMonitorId);
			if (!isExist) {
				result.setResult("500", "此用户监控点不存在");
				return result;
			}

			boolean insertBool = deviceDao.deleteUserMonitor(roleId, devId,
					devMonitorId);
			if (insertBool) {
				result.setResult("200", "删除成功");
			} else {
				result.setResult("500", "删除失败");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result.setResult("1", "删除失败", e.getMessage());
		}

		return result;
	}

	@Override
	public ResultPojo getDevinfoAbstractByOwnerIdFromDTPP(JSONObject jsonObject) {

		ResultPojo result = new ResultPojo();

		if (!jsonObject.containsKey("ownerId")) {
			result.setResult("500", "参数错误，缺少字段 ownerId");
		} else {
			try {
				List<Map<String, Object>> lists = deviceDao
						.getDevinfoAbstractByOwnerIdFromDTPP(jsonObject
								.getString("ownerId"));

				result.setResult("200", "查询成功");
				result.setPojo("devInfo", lists);
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				result.setResult("500", "查询失败", e.getMessage());
			}
		}
		return result;
	}

	@Override
	public String getDevIdByDevSn(String devSn) throws Exception {
		List<Map<String, Object>> lists = deviceDao.getDevIdByDevSn(devSn);

		if (lists != null && !lists.isEmpty()) {
			return (String) lists.get(0).get("devId");
		}
		return "";
	}

	@Override
	public boolean updateOneClickDevOnlineState(String devId, String sysCode)
			throws Exception {

		int devState = 2;
		switch (sysCode) {

		case "995":// 断开
			devState = 0;
			return deviceDao.updateOneClickDevOnlineState(devId, devState);
		case "996": // 连接
			devState = 1;
			return deviceDao.updateOneClickDevOnlineState(devId, devState);
		default:
			// DONOTHING
		}
		return true;
	}

	@Override
	public JSONObject modifyDevId(JSONObject jsonObject) {

		String oldDevId = jsonObject.getString("oldDevId");
		String newDevId = jsonObject.getString("newDevId");

		if (Objects.isNullString(oldDevId) || Objects.isNullString(newDevId)) {
			return ResultUtil.simpleResponse("500", "参数错误",
					"字段 oldUserId 或  newDevId 为空");
		}

		if (!validateService.hasRecordForModify("devId", oldDevId)) {
			return ResultUtil.simpleResponse("500", "要修改的编号不存在", "编号为 "
					+ oldDevId + " 的设备不存在");
		}

		if (Objects.equalString(oldDevId, newDevId)) {
			return ResultUtil.simpleResponse("403", "新旧编号一致");
		}

		ResultPojo resultPojo = null;
		try {
			resultPojo = validateService.isCanUse("devId", newDevId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "修改失败", e.getMessage());
		}

		if (jsonObject.containsKey("dataFrom")
				|| "0".equals(resultPojo.getCode())) {
			try {
				boolean updated = deviceDao.modifyDevId(oldDevId, newDevId);
				return updated ? ResultUtil.simpleResponse("200", "修改成功")
						: ResultUtil.simpleResponse("200", "修改失败");

			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				try {
					deviceDao.modifyDevId(newDevId, oldDevId);
				} catch (Exception e1) {
					// 回滚异常，不记日志，后续改成使用事务
				}
				LOGGER.info("回滚完成......");
				return ResultUtil
						.simpleResponse("500", "数据库错误", e.getMessage());
			}

		} else {
			return ResultUtil.simpleResponse(resultPojo.getCode(),
					resultPojo.getMessage());
		}
	}

	@Override
	public JSONObject getAlarmHostLocationInfo(JSONObject jsonObject) {

		String devId = jsonObject.getString("devId");

		if (Objects.isNullString(devId)) {
			return ResultUtil.simpleResponse("500", "确实字段（devId）");
		}

		JSONObject jsonResult = new JSONObject();
		Map<String, Object> map = null;
		try {
			map = deviceDao.getAlarmHostLocationInfo(devId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			jsonResult.put("detaid", e.getMessage());
			return jsonResult;
		}

		jsonResult.put("code", "200");
		jsonResult.put("message", "成功");
		jsonResult.put("result", map);
		return jsonResult;

	}

	@Override
	public JSONObject addDevZoneForOneClickDev(JSONObject jsonObejct) {

		JSONObject data = null;

		if (!jsonObejct.containsKey("data")) {
			return ResultUtil.simpleResponse("500", "添加失败", "缺少 data 字段");
		}

		try {
			data = jsonObejct.getJSONObject("data");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "添加失败",
					" data 字段不是有效的json对象");
		}

		try {

			Object snModelId = data.remove("snModelId");
			data.put("snModeId", snModelId);

			String ownerId = deviceDao.getOwnerIdByDevId(data
					.getString("devId"));
			// 如果该设备有机主，则自动关联到用户防区
			if (Objects.isNotNullString(ownerId)) {
				Map<String, Object> map = (Map<String, Object>) JSON.parse(data
						.toJSONString());
				map.put("ownerId", ownerId);
				map.put("ownerZoneName", getNextOwnerZoneId(ownerId));
				zoneDao.addOwnerZone(map);
			}

			boolean added = deviceDao.addDevZoneForOneClickDev(data);

			if (added) {
				return ResultUtil.simpleResponse("200", "添加成功");
			} else {
				return ResultUtil.simpleResponse("500", "添加失败");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
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

	@Override
	public JSONObject updateDevZoneForOneClickDev(JSONObject jsonObejct) {

		JSONObject data = null;
		JSONObject condition = null;
		if (!jsonObejct.containsKey("data")
				|| !jsonObejct.containsKey("condition")) {
			return ResultUtil.simpleResponse("500", "修改失败",
					"缺少 data 或 condition 字段");
		}

		try {
			data = jsonObejct.getJSONObject("data");
			condition = jsonObejct.getJSONObject("condition");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "修改失败",
					" data 或 condition 字段不是有效的json对象");
		}

		try {

			Object snModelId = data.remove("snModelId");
			data.put("snModeId", snModelId);

			boolean updated = deviceDao.updateDevZoneForOneClickDev(data,
					condition);

			if (updated) {
				return ResultUtil.simpleResponse("200", "修改成功");
			} else {
				return ResultUtil.simpleResponse("500", "修改失败");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "修改失败", e.getMessage());
		}
	}

	@Override
	public JSONObject deleteDevZoneForOneClickDev(JSONObject jsonObejct) {

		JSONObject condition = null;
		if (!jsonObejct.containsKey("condition")) {
			return ResultUtil.simpleResponse("500", "删除失败", "缺少  condition 字段");
		}

		try {
			condition = jsonObejct.getJSONObject("condition");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "删除失败",
					"condition 字段不是有效的json对象");
		}

		try {
			boolean deleted = deviceDao.deleteDevZoneForOneClickDev(condition);

			if (deleted) {
				return ResultUtil.simpleResponse("200", "删除成功");
			} else {
				return ResultUtil.simpleResponse("500", "删除失败");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "删除失败", e.getMessage());
		}
	}

	@Override
	public JSONObject queryDevZoneForOneClickDev(JSONObject jsonObejct) {

		JSONObject condition = null;
		if (!jsonObejct.containsKey("condition")) {
			return ResultUtil.simpleResponse("500", "查询失败", "缺少  condition 字段");
		}

		try {
			condition = jsonObejct.getJSONObject("condition");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败",
					"condition 字段不是有效的json对象");
		}

		String devId = condition.getString("devId");

		try {
			List<Map<String, Object>> result = deviceDao
					.queryDevZoneForOneClickDev(devId);

			JSONObject jsonResult = new JSONObject();
			jsonResult.put("code", "200");
			jsonResult.put("message", "查询成功");
			jsonResult.put("result", result);
			return jsonResult;

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}

	}

	@Override
	public ResultPojo delUserMonitorInfoBatch(String ownerId,
			List<String> userMonitorId) {
		ResultPojo result = new ResultPojo();
		try {
			if (Objects.isNullString(ownerId) || Objects.isNull(userMonitorId)
					|| userMonitorId.size() == 0) {
				result.setResult("500", "参数错误");
				return result;
			}

			/*
			 * boolean isExist =
			 * deviceDao.findUserMonitorRoleIdDevIdDevMonitorId(roleId, devId,
			 * devMonitorId); if (!isExist) { result.setResult("500",
			 * "此用户监控点不存在"); log.error("删除监控点,用户监控点不存在 ..."); return result; }
			 */

			boolean insertBool = deviceDao.deleteUserMonitorBatch(ownerId,
					userMonitorId);
			if (insertBool) {
				result.setResult("200", "删除成功");
			} else {
				result.setResult("500", "删除失败");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result.setResult("500", "删除失败", e.getMessage());
		}

		return result;
	}

	@Override
	public ResultPojo deleteBatchDevZoneForOneClickDev(String devId,
			List<String> devZoneIds) {
		ResultPojo result = new ResultPojo();
		try {
			if (Objects.isNullString(devId) || Objects.isNull(devZoneIds)
					|| devZoneIds.size() == 0) {
				result.setResult("500", "参数错误");
				return result;
			}

			boolean insertBool = deviceDao.deleteBatchDevZoneForOneClickDev(
					devId, devZoneIds);
			if (insertBool) {
				result.setResult("200", "删除成功");
			} else {
				result.setResult("500", "删除失败");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result.setResult("500", "删除失败");
		}

		return result;
	}
}
