package com.znyw.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.DeviceDao;
import com.znyw.dao.QueryDevice;
import com.znyw.dao.impl.UserDaoImp;
import com.znyw.service.AreaService;
import com.znyw.service.RoleAreaService;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultUtil;

/**
 * 查询设备信息
 * 
 * @author ywhl
 *
 */
@Service
public class QueryDeviceService {
	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	@Resource
	private QueryDevice querydevice;
	@Resource
	private AreaService areaService;
	@Resource
	private RoleAreaService roleAreaService;
	@Resource
	private UserDaoImp userDaoImp;
	@Resource
	private DeviceDao deviceDao;

	@SuppressWarnings("rawtypes")
	public JSONObject queryNVRheve(String queryId, String areaId, String sort,
			String pageSize, String currentPage, String isowner, String userId,String platformId) {

		int pageSizeInt = Integer.parseInt(pageSize);
		int currentPageInt = Integer.parseInt(currentPage);

		queryId = queryId == null || "".equals(queryId) ? " 1=1 "
				: String.format(
						" ( locate('%s',dev.devId)>0 OR locate('%s',dev.devName)>0 ) ",
						queryId, queryId);

		List<String> purviewAreaIds = new ArrayList<String>();
		try {
			purviewAreaIds = roleAreaService.getPurviewAreaIdsByUserId(userId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "权限查询失败", e.getMessage());
		}

		if (ConfigUtil.getRoot().equals(areaId)) {
			areaId = String.format(" and dev.areaId in ('%s') ",
					Objects.Joiner("','", purviewAreaIds));
		} else {
			areaId = String.format(" and dev.areaId='%s' and '%s' in ('%s') ",
					areaId, areaId, Objects.Joiner("','", purviewAreaIds));
		}

		int totalNum = querydevice.QueryNVRheveNatNum(queryId, areaId, isowner,platformId);
		int totalPages = (int) Math.ceil(totalNum * 1.0 / pageSizeInt);

		currentPageInt = currentPageInt > totalPages ? totalPages
				: currentPageInt;
		currentPageInt = currentPageInt <= 0 ? 1 : currentPageInt;

		List listNVR = null;
		try {
			listNVR = querydevice.QueryNVRheveNat(queryId, areaId, sort,
					pageSizeInt, currentPageInt, isowner,platformId); // 查询nvr有线基本信息以及属性表
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "权限查询失败", e.getMessage());
		}
		JSONObject nvrResult = new JSONObject();
		JSONObject result = new JSONObject();
		JSONObject pageInfoPojo = new JSONObject();

		result.put("message", "成功");
		result.put("code", 0);

		pageInfoPojo.put("totalNum", totalNum);
		pageInfoPojo.put("pageSize", pageSize);
		pageInfoPojo.put("currentPage", currentPageInt);
		pageInfoPojo.put("totalPage", totalPages);

		nvrResult.put("result", result);
		nvrResult.put("json", listNVR);
		nvrResult.put("pageInfoPojo", pageInfoPojo);

		return nvrResult;
	}

	@SuppressWarnings("rawtypes")
	public JSONObject queryNVRno(String queryId, String areaId, String sort,
			String pageSize, String currentPage, String isowner, String userId,String platformId) {

		int pageSizeInt = Integer.parseInt(pageSize);
		int currentPageInt = Integer.parseInt(currentPage);

		queryId = queryId == null || "".equals(queryId) ? " 1=1 "
				: String.format(
						" ( locate('%s',dev.devId)>0 or locate('%s',dev.devName)>0 ) ",
						queryId, queryId);

		List<String> purviewAreaIds = new ArrayList<String>();

		try {
			purviewAreaIds = roleAreaService.getPurviewAreaIdsByUserId(userId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "权限查询失败", e.getMessage());
		}

		if (ConfigUtil.getRoot().equals(areaId)) {
			areaId = String.format(" and dev.areaId in ('%s') ",
					Objects.Joiner("','", purviewAreaIds));
		} else {
			areaId = String.format(" and dev.areaId='%s' and '%s' in ('%s') ",
					areaId, areaId, Objects.Joiner("','", purviewAreaIds));
		}
		int totalNum = 0;
		try {
			totalNum = querydevice.QueryNVRhaveNatunoNum(queryId, areaId,
					isowner,platformId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "权限查询失败", e.getMessage());
		}
		int totalPages = (int) Math.ceil(totalNum * 1.0 / pageSizeInt);

		currentPageInt = currentPageInt > totalPages ? totalPages
				: currentPageInt;
		currentPageInt = currentPageInt <= 0 ? 1 : currentPageInt;

		List listNVR = null;
		try {
			listNVR = querydevice.QueryNVRhaveNatuno(queryId, areaId, sort,
					pageSizeInt, currentPageInt, isowner,platformId); // 查询nvr无线基本信息以及属性表
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "权限查询失败", e.getMessage());
		}

		JSONObject nvrResult = new JSONObject();
		JSONObject result = new JSONObject();
		JSONObject pageInfoPojo = new JSONObject();

		result.put("message", "成功");
		result.put("code", 0);
		pageInfoPojo.put("totalNum", totalNum);
		pageInfoPojo.put("pageSize", pageSize);
		pageInfoPojo.put("currentPage", currentPageInt);
		pageInfoPojo.put("totalPage", totalPages);
		nvrResult.put("result", result);
		nvrResult.put("json", listNVR);
		nvrResult.put("pageInfoPojo", pageInfoPojo);

		return nvrResult;
	}

	public JSONObject queryOneClickDevByDevId(JSONObject jsonObject) {

		String devId = jsonObject.getString("devId");

		Map<String, Object> map;
		try {
			map = deviceDao.queryOneClickDev(1, 1, "ASC", "all", "all", "",
					"all", "", "","", "_devId", devId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "权限查询失败", e.getMessage());
		}
		List<?> list = (List<?>) map.get("list");

		JSONObject userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		result.put("message", "成功");
		result.put("code", 0);
		userjosn.put("result", result);
		userjosn.put("json", list);

		return userjosn;
	}

	@SuppressWarnings("rawtypes")
	public JSONObject queryOneClickDev(String userId, JSONObject jsonObject) {

		JSONObject fuzzy = jsonObject.getJSONObject("fuzzy");
		String fuzzyKey = fuzzy.getString("fuzzyKey");
		String fuzzyValue = fuzzy.getString("fuzzyValue");

		if (fuzzyKey.equals("pnlHdTel") || fuzzyKey.equals("pnlTel")) {
			JSONObject mingzi = new JSONObject();
			JSONObject result = new JSONObject();
			JSONObject json = new JSONObject();
			JSONObject pageInfoPojo = new JSONObject();
			result.put("massage", "没有联网电话和无线卡号");
			result.put("code", "0");
			pageInfoPojo.put("totalNum", 0);
			pageInfoPojo.put("pageSize", 25);
			pageInfoPojo.put("currentPage", 1);
			pageInfoPojo.put("totalPage", 0);
			mingzi.put("result", result);
			mingzi.put("json", json);
			mingzi.put("pageInfoPojo", pageInfoPojo);
			return mingzi;
		}

		JSONObject pageInfoPojo = jsonObject.getJSONObject("pageInfoPojo");
		String currentPage = pageInfoPojo.getString("currentPage");
		String pageSize = pageInfoPojo.getString("pageSize");
		String sort = pageInfoPojo.getString("sort").contains("DESC") ? " DESC "
				: " ASC ";

		String areaId = jsonObject.containsKey("areaId") ? jsonObject
				.getString("areaId") : "all";
		String isowner = jsonObject.containsKey("isowner") ? jsonObject
				.getString("isowner") : "all";
		String devModelId = jsonObject.containsKey("devModelId") ? jsonObject
				.getString("devModelId") : "all";
		String timeStart = jsonObject.containsKey("timeStart") ? jsonObject
				.getString("timeStart") : "";
		String timeEnd = jsonObject.containsKey("timeEnt") ? jsonObject
				.getString("timeEnt") : "";
		String devState = jsonObject.containsKey("devState") ? jsonObject
				.getString("devState") : "all";

		String platformId = jsonObject.containsKey("platformId")?jsonObject.getString("platformId"):"";

		int pageSizeInt = Integer.parseInt(pageSize);
		int currentPageInt = Integer.parseInt(currentPage);

		List<String> purviewAreaIds = new ArrayList<String>();
		try {
			purviewAreaIds = roleAreaService.getPurviewAreaIdsByUserId(userId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "权限查询失败", e.getMessage());
		}
		if (ConfigUtil.getRoot().equals(areaId) || "all".equals(areaId)) {
			areaId = String.format(" and a.areaId in ('%s') ",
					Objects.Joiner("','", purviewAreaIds));
		} else {
			areaId = String.format(" and a.areaId='%s' and '%s' in ('%s') ",
					areaId, areaId, Objects.Joiner("','", purviewAreaIds));
		}

		Map<String, Object> map = null;
		try {
			map = deviceDao.queryOneClickDev(pageSizeInt, currentPageInt, sort,
					devModelId, isowner, areaId, devState, timeStart, timeEnd,platformId,
					fuzzyKey, fuzzyValue);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "权限查询失败", e.getMessage());
		}
		List<?> list = (List) map.get("list");

		Integer totalNum = (Integer) map.get("totalNum");

		int totalPages = (int) Math.ceil((totalNum * 1.0 / pageSizeInt));

		if (currentPageInt > totalPages) {// 如果查询当前页面大于总页面数，则返回最大页面的数据
			try {
				currentPageInt = totalPages==0?1:totalPages;
				map = deviceDao.queryOneClickDev(pageSizeInt, currentPageInt, sort,
						devModelId, isowner, areaId, devState, timeStart,
						timeEnd,platformId, fuzzyKey, fuzzyValue);
				list = (List) map.get("list");
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "权限查询失败",
						e.getMessage());
			}
		}

		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();

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
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public JSONObject queryRelated(String devTutkID, String channelNum,
			String sysCode) {

		List list = null;
		try {
			list = querydevice.Queryrelated(devTutkID, channelNum, sysCode);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}
		if (list.isEmpty()) {
			String codeId = "000";
			List list2 = querydevice
					.Queryrelated(devTutkID, channelNum, codeId);

			JSONObject RelatedResult = new JSONObject();
			JSONObject result = new JSONObject();

			result.put("message", "成功");
			result.put("code", 0);

			RelatedResult.put("result", result);

			if (list2.size() == 1) {
				Map<String, Object> map = (Map<String, Object>) list2.get(0);
				map.put("eventDesc", "接收到未定义的代码(" + sysCode + ")");
				RelatedResult.put("json", map);
			} else if (list2.size() == 0) {
				RelatedResult.put("json", null);
			}
			return RelatedResult;
		}
		JSONObject RelatedResult = new JSONObject();
		JSONObject result = new JSONObject();

		result.put("message", "成功");
		result.put("code", 0);

		RelatedResult.put("result", result);

		if (list.size() == 1) {
			RelatedResult.put("json", list.get(0));
		} else if (list.size() == 0) {
			RelatedResult.put("json", null);
		}
		return RelatedResult;
	}

	@SuppressWarnings("rawtypes")
	public JSONObject queryUserIdServer(String devId) {
		List list = null;
		try {
			list = querydevice.QueryUserId(devId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}

		JSONObject RelatedResult = new JSONObject();
		JSONObject result = new JSONObject();

		result.put("message", "成功");
		result.put("code", 0);

		RelatedResult.put("result", result);
		RelatedResult.put("json", list);

		return RelatedResult;
	}

	@SuppressWarnings("rawtypes")
	public JSONObject QueryUserIdOrderCameradiServer(String cameraId) {

		String devId = querydevice.QueryDevId(cameraId);
		if ("".equals(devId) || devId == null) {
			devId = cameraId;
		}

		List list = null;
		try {
			list = querydevice.QueryUserId(devId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}

		JSONObject RelatedResult = new JSONObject();
		JSONObject result = new JSONObject();

		result.put("message", "成功");
		result.put("code", 0);

		RelatedResult.put("result", result);
		RelatedResult.put("json", list);

		return RelatedResult;
	}

	public JSONObject queryEventclassServer() {

		List list = null;
		try {
			list = querydevice.QueryEventclass();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}

		JSONObject RelatedResult = new JSONObject();
		JSONObject result = new JSONObject();

		result.put("message", "成功");
		result.put("code", 0);

		RelatedResult.put("result", result);
		RelatedResult.put("json", list);

		return RelatedResult;
	}

	public JSONObject queryDevBasicServer(String devId) {

		List list = null;
		try {
			list = querydevice.queryDevBasicDao(devId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}

		JSONObject RelatedResult = new JSONObject();
		JSONObject result = new JSONObject();

		result.put("message", "成功");
		result.put("code", 0);

		RelatedResult.put("result", result);
		RelatedResult.put("json", list);
		return RelatedResult;
	}

	public JSONObject queryDevOrderbyUserclassServer(String userId) {
		List list = null;
		try {
			list = this.querydevice.queryDevOrderbyUser(userId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}

		JSONObject RelatedResult = new JSONObject();
		JSONObject result = new JSONObject();

		result.put("message", "成功");
		result.put("code", Integer.valueOf(0));

		RelatedResult.put("result", result);
		RelatedResult.put("json", list);

		return RelatedResult;
	}

}
