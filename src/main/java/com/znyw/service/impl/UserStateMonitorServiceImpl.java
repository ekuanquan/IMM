package com.znyw.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.UserStateMonitorDao;
import com.znyw.pojo.McsDevstatusPojo;
import com.znyw.service.UserStateMonitorService;
import com.znyw.tool.ResultUtil;

@Service("UserStateMonitorService")
public class UserStateMonitorServiceImpl implements UserStateMonitorService {
	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	@Resource
	private UserStateMonitorDao userStateMonitorDao;

	@SuppressWarnings("rawtypes")
	@Override
	public JSONObject getUserIndustryService() {
		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		try {
			List IndustryList = userStateMonitorDao.getUserIndustryDao();
			result.put("code", "200");
			result.put("message", "成功");
			Userjosn.put("json", IndustryList);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result.put("code", "201");
			result.put("message", "失败");
			result.put("detail", e.getMessage());
			Userjosn.put("json", null);
		}

		Userjosn.put("result", result);
		return Userjosn;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public JSONObject getUserStateListService(String userId, String groupId,
			String queryValue, String checkId, String pageSize,
			String currentPage) {
		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();
		JSONObject pageInfoPojo = new JSONObject();
		try {
			String areaId = userStateMonitorDao.getAreaId(userId);
			if (groupId.equals("allUser")) {
				groupId = "";
			}
			Map<String, Object> IndustryList = userStateMonitorDao
					.getUserStateListDao(areaId, groupId, queryValue, checkId,
							pageSize, currentPage);
			List list = (List) IndustryList.get("list");

			Integer totalNum = (Integer) IndustryList.get("totalNum");
			int pageSizeInt = Integer.parseInt(pageSize);

			int totalPage;
			if (totalNum % pageSizeInt == 0) {
				totalPage = totalNum / pageSizeInt;
			} else {
				totalPage = totalNum / pageSizeInt + 1;
			}

			result.put("code", "200");
			result.put("message", "成功");
			pageInfoPojo.put("pageSize", pageSizeInt);
			pageInfoPojo.put("totalNum", totalNum);
			pageInfoPojo.put("currentPage", currentPage);
			pageInfoPojo.put("totalPage", totalPage);
			Userjosn.put("pageInfoPojo", pageInfoPojo);
			Userjosn.put("json", list);

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result.put("code", "201");
			result.put("message", "失败");
			Userjosn.put("json", null);
		}
		Userjosn.put("result", result);
		return Userjosn;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public JSONObject queryAddUserStateListService(String userId,
			String userValue, String businessId, String pageSize,
			String currentPage) {
		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();
		JSONObject pageInfoPojo = new JSONObject();
		try {
			Map<String, Object> IndustryList = userStateMonitorDao
					.queryAddUserStateListDao(userId, userValue, businessId,
							pageSize, currentPage);
			List list = (List) IndustryList.get("list");

			Integer totalNum = (Integer) IndustryList.get("totalNum");
			int pageSizeInt = Integer.parseInt(pageSize);

			int totalPage;
			if (totalNum % pageSizeInt == 0) {
				totalPage = totalNum / pageSizeInt;
			} else {
				totalPage = totalNum / pageSizeInt + 1;
			}

			result.put("code", "200");
			result.put("message", "成功");
			pageInfoPojo.put("pageSize", pageSizeInt);
			pageInfoPojo.put("totalNum", totalNum);
			pageInfoPojo.put("currentPage", currentPage);
			pageInfoPojo.put("totalPage", totalPage);
			Userjosn.put("pageInfoPojo", pageInfoPojo);
			Userjosn.put("json", list);

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result.put("code", "201");
			result.put("message", "失败");
			result.put("detail", e.getMessage());
			Userjosn.put("json", null);
		}
		Userjosn.put("result", result);
		return Userjosn;
	}

	@Override
	public JSONObject addGroupService(String groupId, String groupName,
			String userId, JSONArray addUserList) {
		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();
		try {
			String areaId = userStateMonitorDao.getAreaId(userId);
			int groupNum = userStateMonitorDao.queryGroupNum(groupName);
			if (groupNum > 0) {
				result.put("code", "500");
				result.put("message", "用户分组名已存在！");
			} else {
				userStateMonitorDao.addGroupDao(groupId, groupName, areaId,
						addUserList);
				result.put("code", "200");
				result.put("message", "添加成功");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result.put("code", "201");
			result.put("message", "添加失败");
			result.put("detail", e.getMessage());
		}
		Userjosn.put("result", result);
		return Userjosn;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public JSONObject getGroupService(String userId) {
		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();
		String areaId = userStateMonitorDao.getAreaId(userId);
		try {
			List groupList = userStateMonitorDao.getGroupDao(areaId);
			result.put("code", "200");
			result.put("message", "成功");
			Userjosn.put("json", groupList);
		} catch (Exception e) {
			result.put("code", "201");
			result.put("message", "失败");
			result.put("detail", e.getMessage());
			Userjosn.put("json", null);
		}
		Userjosn.put("result", result);
		return Userjosn;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public JSONObject queryGroupDataService(String groupId) {
		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();
		try {
			List groupUserList = userStateMonitorDao.queryGroupDataDao(groupId);
			result.put("code", "200");
			result.put("message", "成功");
			Userjosn.put("json", groupUserList);

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result.put("code", "201");
			result.put("message", "失败");
			result.put("detail", e.getMessage());
			Userjosn.put("json", null);
		}
		Userjosn.put("result", result);
		return Userjosn;
	}

	@Override
	public JSONObject editGroupService(String groupId, String groupName,
			JSONArray addUserList) {
		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();
		try {
			int groupNum = userStateMonitorDao
					.queryGroupNum(groupName, groupId);
			if (groupNum > 0) {
				result.put("code", "500");
				result.put("message", "用户分组名已存在！");
			} else {
				userStateMonitorDao.editGroupDao(groupId, groupName,
						addUserList);
				result.put("code", "200");
				result.put("message", "添加成功");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result.put("code", "201");
			result.put("message", "添加失败");
			result.put("detail", e.getMessage());
		}
		Userjosn.put("result", result);
		return Userjosn;
	}

	@Override
	public JSONObject deleteGroupService(String groupId) {
		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();
		try {
			userStateMonitorDao.deleteGroupDao(groupId);
			result.put("code", "200");
			result.put("message", "成功");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result.put("code", "201");
			result.put("message", "失败");
			result.put("detail", e.getMessage());
		}
		Userjosn.put("result", result);
		return Userjosn;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public JSONObject getUserStateDataService(String userId) {
		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();
		try {
			List groupUserList = userStateMonitorDao
					.getUserStateDataDao(userId);
			result.put("code", "200");
			result.put("message", "成功");
			Userjosn.put("json", groupUserList);

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result.put("code", "201");
			result.put("message", "失败");
			result.put("detail", e.getMessage());
			Userjosn.put("json", null);
		}
		Userjosn.put("result", result);
		return Userjosn;
	}

	@Override
	public JSONObject getByPassDataService(String userId) {
		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		try {
			List IndustryList = userStateMonitorDao.getByPassDataDao(userId);
			result.put("code", "200");
			result.put("message", "成功");
			Userjosn.put("json", IndustryList);

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result.put("code", "201");
			result.put("message", "失败");
			result.put("detail", e.getMessage());
			Userjosn.put("json", null);
		}

		Userjosn.put("result", result);
		return Userjosn;
	}

	@Override
	public JSONObject addGroupAllUserService(String userId, String businessId,
			String userValue) {
		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		try {
			List IndustryList = userStateMonitorDao.addGroupAllUserDao(userId,
					businessId, userValue);
			result.put("code", "200");
			result.put("message", "成功");
			Userjosn.put("json", IndustryList);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result.put("code", "201");
			result.put("message", "失败");
			result.put("detail", e.getMessage());
			Userjosn.put("json", null);
		}

		Userjosn.put("result", result);
		return Userjosn;
	}

	@Override
	public JSONObject getChildInfoByDevId(String devId) throws Exception {
		JSONObject resultJso = new JSONObject();

		try {
			// 查询出设备的布撤防状态
			McsDevstatusPojo devStatus = userStateMonitorDao
					.queryDevStatus(devId);
			resultJso.put("devStatus", devStatus);
			// 查询出设备子系统的信息和布撤防状态
			List<McsDevstatusPojo> subSysList = userStateMonitorDao
					.queryDevSubSysStatus(devId);
			resultJso.put("subSysList", subSysList);
			JSONObject result = new JSONObject();
			result.put("code", "200");
			result.put("message", "成功");
			resultJso.put("result", result);
			return resultJso;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public JSONObject getUserStateListByWorkStationService(
			List<String> userIds, String groupId, String queryValue,
			String checkId, String pageSize, String currentPage) {
		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();
		JSONObject pageInfoPojo = new JSONObject();
		try {
			Map<String, Object> IndustryList = userStateMonitorDao
					.getUserStateListByWorkStationDao(userIds, groupId,
							queryValue, checkId, pageSize, currentPage);
			List list = (List) IndustryList.get("list");

			Integer totalNum = (Integer) IndustryList.get("totalNum");
			int pageSizeInt = Integer.parseInt(pageSize);

			int totalPage;
			if (totalNum % pageSizeInt == 0) {
				totalPage = totalNum / pageSizeInt;
			} else {
				totalPage = totalNum / pageSizeInt + 1;
			}

			result.put("code", "200");
			result.put("message", "成功");
			pageInfoPojo.put("pageSize", pageSizeInt);
			pageInfoPojo.put("totalNum", totalNum);
			pageInfoPojo.put("currentPage", currentPage);
			pageInfoPojo.put("totalPage", totalPage);
			Userjosn.put("pageInfoPojo", pageInfoPojo);
			Userjosn.put("json", list);

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result.put("code", "201");
			result.put("message", "失败");
			result.put("detail", e.getMessage());
			Userjosn.put("json", null);
		}
		Userjosn.put("result", result);
		return Userjosn;
	}

}
