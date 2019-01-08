package com.znyw.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.EventSettingDao;
import com.znyw.service.EventSettingService;
import com.znyw.tool.ResultUtil;

@Service("EventSettingService")
public class EventSettingServiceImpl implements EventSettingService {
	private static Logger LOGGER = Logger.getLogger(RoleServiceImpl.class);
	@Resource
	EventSettingDao eventSettingDao;

	@Override
	public JSONObject getEventSettingListService(String userId,
			String zoneCHFlag) {
		JSONObject userjosn = new JSONObject();
		JSONObject result = new JSONObject();
		List<Map<String, Object>> industryList = new ArrayList<Map<String, Object>>();

		try {
			industryList = eventSettingDao.getEventSettingListDao(userId,
					zoneCHFlag);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1005", "查询失败", e.getMessage());
		}

		if (industryList == null) {
			result.put("code", "201");
			result.put("message", "失败");
		} else {
			result.put("code", "200");
			result.put("message", "成功");
		}
		userjosn.put("result", result);
		userjosn.put("json", industryList);

		return userjosn;
	}

	@Override
	public JSONObject delEventSettingService(JSONArray userEvtList) {
		JSONObject userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		boolean deleted = false;
		try {
			deleted = eventSettingDao.delEventSettingDao(userEvtList);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1005", "查询失败", e.getMessage());
		}

		if (deleted) {
			result.put("code", "200");
			result.put("message", "成功");
		} else {
			result.put("code", "201");
			result.put("message", "失败");
		}
		userjosn.put("result", result);
		return userjosn;
	}

	@Override
	public JSONObject editEventSettingService(String UserEvtId, String fMemo,
			String isVideo) {
		JSONObject userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		boolean edited = false;
		try {
			edited = eventSettingDao.editEventSettingDao(UserEvtId, fMemo,
					isVideo);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1005", "查询失败", e.getMessage());
		}

		if (edited) {
			result.put("code", "200");
			result.put("message", "成功");
		} else {
			result.put("code", "201");
			result.put("message", "失败");
		}
		userjosn.put("result", result);
		return userjosn;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public JSONObject addEventSettingService(String userId, int isVideo,
			List addZoonIdList, List addUserMonitorIdList, String dataFrom) {
		JSONObject userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		boolean added = false;
		try {
			added = eventSettingDao.addEventSettingDao(userId, isVideo,
					addZoonIdList, addUserMonitorIdList, dataFrom);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1005", "查询失败", e.getMessage());
		}
		if (added) {
			result.put("code", "200");
			result.put("message", "成功");
		} else {
			result.put("code", "201");
			result.put("message", "失败");
		}
		userjosn.put("result", result);
		return userjosn;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public JSONObject getUserMonitorIdByCameraIdService(String devId,
			String userId) {
		JSONObject userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		List industryList = null;

		try {
			industryList = eventSettingDao.getUserMonitorIdByCameraIdDao(devId,
					userId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}

		if (industryList == null) {
			result.put("code", "201");
			result.put("message", "失败");
			userjosn.put("json", null);
		} else {
			result.put("code", "200");
			result.put("message", "成功");
			userjosn.put("json", industryList);
		}
		userjosn.put("result", result);
		return userjosn;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public JSONObject getEvtCantListService(String UserEvtId) {
		JSONObject userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		List industryList = null;

		try {
			industryList = eventSettingDao.getEvtCantListDao(UserEvtId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}

		if (industryList == null) {
			result.put("code", "201");
			result.put("message", "失败");
			userjosn.put("json", null);
		} else {
			result.put("code", "200");
			result.put("message", "成功");
			userjosn.put("json", industryList);
		}
		userjosn.put("result", result);
		return userjosn;
	}

	@Override
	public JSONObject editEvtCantListService(String userEvtId, String contList) {
		JSONObject userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		boolean edited = false;

		try {
			edited = eventSettingDao.editEvtCantListDao(userEvtId, contList);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
		if (edited) {
			result.put("code", "200");
			result.put("message", "成功");
		} else {
			result.put("code", "201");
			result.put("message", "失败");
		}
		userjosn.put("result", result);
		return userjosn;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public JSONObject listEditEvtCantListService(List userEvtIdList,
			String contList) {
		JSONObject userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		boolean edited = false;

		try {
			edited = eventSettingDao.ListEditEvtCantListDao(userEvtIdList,
					contList);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}

		if (edited) {
			result.put("code", "200");
			result.put("message", "成功");
		} else {
			result.put("code", "201");
			result.put("message", "失败");
		}
		userjosn.put("result", result);
		return userjosn;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public JSONObject getUserMonitorIdByUserIdService(String userId) {
		JSONObject userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		List industryList = null;
		try {
			industryList = eventSettingDao.getUserMonitorIdByUserIdDao(userId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
		if (industryList == null) {
			result.put("code", "201");
			result.put("message", "失败");
			userjosn.put("json", null);
		} else {
			result.put("code", "200");
			result.put("message", "成功");
			userjosn.put("json", industryList);
		}
		userjosn.put("result", result);
		return userjosn;
	}

	@Override
	public JSONObject checkSvaeLinkageSettingService(String UserEvtId,
			String cameraId) {
		JSONObject userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		boolean checked = false;

		try {
			checked = eventSettingDao.checkSvaeLinkageSettingDao(UserEvtId,
					cameraId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "修改失败", e.getMessage());
		}

		if (checked) {
			result.put("code", "200");
			result.put("message", "成功");
		} else {
			result.put("code", "201");
			result.put("message", "失败");
		}
		userjosn.put("result", result);
		return userjosn;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public JSONObject hookSvaeLinkageSettingService(List UserEvtIdList,
			String cameraId) {
		JSONObject userjosn = new JSONObject();
		JSONObject result = new JSONObject();
		boolean hooked = false;
		try {
			hooked = eventSettingDao.hookSaveLinkageSettingDao(UserEvtIdList, cameraId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "修改失败", e.getMessage());
		}

		if (hooked) {
			result.put("code", "200");
			result.put("message", "成功");
		} else {
			result.put("code", "201");
			result.put("message", "失败");
		}
		userjosn.put("result", result);
		return userjosn;
	}

}
