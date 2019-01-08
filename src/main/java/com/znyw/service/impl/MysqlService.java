package com.znyw.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.SysCodeDao;
import com.znyw.dao.UserInfoDao;
import com.znyw.dao.impl.UserDaoImp;
import com.znyw.pojo.SysCodePojo;
import com.znyw.service.AreaService;
import com.znyw.service.RoleAreaService;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultUtil;

@Service
public class MysqlService {

	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	@Resource
	private UserDaoImp userDaoImp;
	@Resource
	private AreaService areaService;
	@Resource
	private SysCodeDao sysCodeDao;
	@Resource
	private RoleAreaService roleAreaService;
	@Resource
	private DeviceServiceImpl deviceService;
	@Resource
	private UserInfoDao userInfoDao;

	public JSONObject userService(String UserId) throws Exception {
		JSONObject json = null;
		try {
			json = userDaoImp.getUser(UserId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();

		if (json != null) {
			result.put("code", "200");
			result.put("message", "success");
			Userjosn.put("result", result);
			Userjosn.put("userInformation", json);
		} else {
			result.put("code", "201");
			result.put("message", "success");
			Userjosn.put("result", result);
			Userjosn.put("userInformation", null);
		}
		return Userjosn;
	}

	public JSONObject userzoneService(String UserId) throws Exception {

		List<Map<String, Object>> zonelist = null;
		try {
			zonelist = userDaoImp.getUserzoneByOwnerId(UserId, null);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询异常", e.getMessage());
		}
		JSONObject Userzonejson = new JSONObject();
		JSONObject result = new JSONObject();

		if (zonelist.size() != 0) {
			result.put("code", "200");
			result.put("message", "success");
			Userzonejson.put("result", result);
			Userzonejson.put("userZone", zonelist);
		} else {
			result.put("code", "201");
			result.put("message", "success");
			Userzonejson.put("result", result);
			Userzonejson.put("userZone", null);
		}

		return Userzonejson;
	}

	public JSONObject userServiceQuery(JSONObject jsonParam) throws Exception {

		JSONObject pageInfoP = jsonParam.getJSONObject("pageInfoPojo");
		String currentPage = pageInfoP.getString("currentPage");
		String pageSize = pageInfoP.getString("pageSize");
		String sort = pageInfoP.getString("sort");
		sort = sort.equals("userId|ASC") ? " asc " : " desc ";
		int pageSizeInt = Integer.parseInt(pageSize);
		int currentPageInt = Integer.parseInt(currentPage);

		JSONObject queryTond = jsonParam.getJSONObject("queryTond");
		String areaId = queryTond.getString("areaId");
		String businessId = queryTond.getString("businessId");
		String userServerType = queryTond.getString("userServerType");
		String nomRpt = queryTond.getString("nomRpt");

		String timeStart = queryTond.getString("timeStart");
		String timeEnt = queryTond.getString("timeEnt");

		JSONObject fuzzy = queryTond.getJSONObject("fuzzy");
		String fuzzyKey = fuzzy.getString("fuzzyKey");
		String fuzzyValue = fuzzy.getString("fuzzyValue");

		String userId = jsonParam.getString("userId");

		List<String> purviewAreaIds = new ArrayList<String>();
		try {
			purviewAreaIds = roleAreaService.getPurviewAreaIdsByUserId(userId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "权限查询失败", e.getMessage());
		}

		if ("all".equals(areaId)) {
			areaId = String.format(" area.areaId in ('%s') ",
					Objects.Joiner("','", purviewAreaIds));
		} else {
			areaId = String.format(" area.areaId='%s' and '%s' in ('%s') ",
					areaId, areaId, Objects.Joiner("','", purviewAreaIds));
		}

		Map<String, Object> map = null;
		try {
			map = userDaoImp.getCustomerInfo(sort, pageSizeInt, currentPageInt,
					areaId, businessId, userServerType, nomRpt, timeStart,
					timeEnt, fuzzyKey, fuzzyValue);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "权限查询失败", e.getMessage());
		}

		JSONObject Userjosn = createResponse(currentPage, pageSizeInt, map);

		return Userjosn;
	}

	public JSONObject operatorUserQuery(JSONObject jsonParam) throws Exception {

		JSONObject pageInfoP = jsonParam.getJSONObject("pageInfoPojo");
		String currentPage = pageInfoP.getString("currentPage");
		String pageSize = pageInfoP.getString("pageSize");
		String sort = pageInfoP.getString("sort");
		sort = sort.equals("userId|ASC") ? " asc " : " desc ";
		int pageSizeInt = Integer.parseInt(pageSize);
		int currentPageInt = Integer.parseInt(currentPage);

		JSONObject queryTond = jsonParam.getJSONObject("queryTond");
		String areaId = queryTond.getString("areaId");
		String acctType = queryTond.getString("acctType");

		String timeStart = queryTond.getString("timeStart");
		String timeEnt = queryTond.getString("timeEnt");

		JSONObject fuzzy = queryTond.getJSONObject("fuzzy");
		String fuzzyKey = fuzzy.getString("fuzzyKey");
		String fuzzyValue = fuzzy.getString("fuzzyValue");

		String userId = jsonParam.getString("userId");

		List<String> purviewAreaIds = new ArrayList<String>();
		try {
			purviewAreaIds = roleAreaService.getPurviewAreaIdsByUserId(userId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "权限查询失败", e.getMessage());
		}

		if ("all".equals(areaId)) {
			areaId = String.format(" area.areaId in ('%s') ",
					Objects.Joiner("','", purviewAreaIds));
		} else {
			areaId = String.format(" area.areaId='%s' and '%s' in ('%s') ",
					areaId, areaId, Objects.Joiner("','", purviewAreaIds));
		}

		Map<String, Object> map = null;
		try {
			map = userDaoImp.getOperatorsInfo(sort, pageSizeInt,
					currentPageInt, areaId, acctType, timeStart, timeEnt,
					fuzzyKey, fuzzyValue);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}

		JSONObject Userjosn = createResponse(currentPage, pageSizeInt, map);

		return Userjosn;
	}

	public JSONObject userServiceQueryRDA(JSONObject jsonParam)
			throws Exception {

		JSONObject pageInfoP = jsonParam.getJSONObject("pageInfoPojo");
		String currentPage = pageInfoP.getString("currentPage");
		String pageSize = pageInfoP.getString("pageSize");
		String sort = pageInfoP.getString("sort");
		if (sort.contains("fMemo")) {
			String sort1 = sort.contains("ASC,") ? " asc " : " desc ";
			String sortASC = sort.contains("ASC") ? " asc " : " desc ";
			sort = "a.fMemo " + sort1 + ", a.userId " + sortASC;
		} else if (sort.contains("define1")) {
			String sort1 = sort.contains("ASC,") ? " asc " : " desc ";
			String sortASC = sort.contains("ASC") ? " asc " : " desc ";
			sort = "b.define1 " + sort1 + ", a.userId" + sortASC;
		} else {
			String sort2 = sort.contains("ASC") ? " asc " : " desc ";
			sort = "a.userId" + sort2;
		}

		int pageSizeInt = Integer.parseInt(pageSize);
		int currentPageInt = Integer.parseInt(currentPage);

		JSONObject queryTond = jsonParam.getJSONObject("queryTond");
		String areaId = queryTond.getString("areaId");
		String businessId = queryTond.getString("businessId");
		String userServerType = queryTond.getString("userServerType");
		String nomRpt = queryTond.getString("nomRpt");

		String timeStart = queryTond.getString("timeStart");
		String timeEnt = queryTond.getString("timeEnt");

		JSONObject fuzzy = queryTond.getJSONObject("fuzzy");
		String fuzzyKey = fuzzy.getString("fuzzyKey");
		String fuzzyValue = fuzzy.getString("fuzzyValue");

		String userId = jsonParam.getString("userId");

		List<String> purviewAreaIds = new ArrayList<String>();
		try {
			purviewAreaIds = roleAreaService.getPurviewAreaIdsByUserId(userId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "权限查询失败", e.getMessage());
		}

		if ("all".equals(areaId)) {
			areaId = String.format(" a.areaId in ('%s') ",
					Objects.Joiner("','", purviewAreaIds));
		} else {
			areaId = String.format(" a.areaId='%s' and '%s' in ('%s') ",
					areaId, areaId, Objects.Joiner("','", purviewAreaIds));
		}

		Map<String, Object> map = null;
		try {
			map = userDaoImp.getOwnerInfo1(sort, pageSizeInt, currentPageInt,
					areaId, businessId, userServerType, nomRpt, timeStart,
					timeEnt, fuzzyKey, fuzzyValue, "1");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "权限查询失败", e.getMessage());
		}

		JSONObject Userjosn = createResponse(currentPage, pageSizeInt, map);

		return Userjosn;
	}

	@SuppressWarnings("rawtypes")
	private JSONObject createResponse(String currentPage, int pageSizeInt,
			Map<String, Object> map) {
		List list = (List) map.get("list");

		Integer totalNum = (Integer) map.get("totalNum");

		int totalPage;
		if (totalNum % pageSizeInt == 0) {
			totalPage = totalNum / pageSizeInt;
		} else {
			totalPage = totalNum / pageSizeInt + 1;
		}

		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();
		JSONObject pageInfoPojo = new JSONObject();

		result.put("message", "成功");
		result.put("code", 0);
		pageInfoPojo.put("pageSize", pageSizeInt);
		pageInfoPojo.put("totalNum", totalNum);
		pageInfoPojo.put("currentPage", currentPage);
		pageInfoPojo.put("totalPage", totalPage);
		Userjosn.put("result", result);
		Userjosn.put("json", list);
		Userjosn.put("pageInfoPojo", pageInfoPojo);

		return Userjosn;
	}

	public JSONObject userServiceRelat(String accountNum) throws Exception {
		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();
		List list = null;
		try {
			list = userDaoImp.getUserRelat(accountNum);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
		if (list.size() > 0) {
			result.put("code", "200");
			result.put("message", "success");
			Userjosn.put("relevantContact", list);
			Userjosn.put("result", result);
		} else {
			result.put("code", "201");
			result.put("message", "success");
			Userjosn.put("result", result);
			Userjosn.put("relevantContact", list);
		}
		return Userjosn;
	}

	@SuppressWarnings("rawtypes")
	public JSONObject deviceService(String accountNum, String pageSize,
			String currentPage) throws Exception {

		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();
		JSONObject pageInfoPojo = new JSONObject();

		Map<String, Object> map = null;

		try {
			map = userDaoImp.getDevice(accountNum, pageSize, currentPage); // 用户编号，每页条数，当前页面
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
		List list = (List) map.get("list");

		Integer totalNum = (Integer) map.get("totalNum");
		int pageSizeInt = Integer.parseInt(pageSize);
		// int totalPage = totalNum/pageSizeInt+1 ;

		int totalPage;
		if (totalNum % pageSizeInt == 0) {
			totalPage = totalNum / pageSizeInt;
		} else {
			totalPage = totalNum / pageSizeInt + 1;
		}

		result.put("message", "成功");
		result.put("code", 0);
		pageInfoPojo.put("pageSize", pageSizeInt);
		pageInfoPojo.put("totalNum", totalNum);
		pageInfoPojo.put("currentPage", currentPage);
		pageInfoPojo.put("totalPage", totalPage);
		Userjosn.put("result", result);
		Userjosn.put("json", list);
		Userjosn.put("pageInfoPojo", pageInfoPojo);

		return Userjosn;
	}

	public JSONObject relatinfServiceForOneClikDev(String devSn,
			String devZoneId, String sysCode) throws Exception {
		try {
			String devId = deviceService.getDevIdByDevSn(devSn);
			deviceService.updateOneClickDevOnlineState(devId, sysCode);
			return relatinfService(devId, devZoneId, sysCode);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询错误", e.getMessage());
		}
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public JSONObject relatinfService(String devId, String devZoneId,
			String sysCode) throws Exception { // 根据设备编号、防区编号、系统码获取相关信息
		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();
		String userName = "", serveEndTime = "", userAddr = "", areaId = "", devModelName = "", areaName = "", usrAlmType = "", atPos = "", snType = "", almType = "", wantDo = "", snTypeName = "", almTypeName = "", wantDoName = "", snModelName = "", roleZoneName = "";
		int devModelId = -1, snModeId = -1;
		boolean switchUser;
		String devType = "";
		// JSONObject json = userDaoImp.getRelatinfor(devId, devZoneId,
		// sysCode);
		List Devinfo = null;
		try {
			Devinfo = userDaoImp.getDevinfo(devId);
		} catch (Exception e) {
			return ResultUtil.simpleResponse("500", "查询失败", e.getMessage());
		}
		List Useinfo = null;
		String userId = null;
		if (Devinfo.isEmpty()) {
			result.put("code", "201");
			result.put("message", "query dev:" + devId + " is null");
			Userjosn.put("result", result);
			Userjosn.put("relevantContact", null);
			return Userjosn;
		}

		Map<String, Object> map = (Map<String, Object>) Devinfo.get(0);
		userId = (String) map.get("ownerId");
		devType = map.get("devType") + "";
		userName = ((String) map.get("userName") == null || ((String) map
				.get("userName")).equals("null")) ? "" : (String) map
				.get("userName");
		userAddr = ((String) map.get("userAddr") == null || ((String) map
				.get("userAddr")).equals("null")) ? "" : (String) map
				.get("userAddr");
		areaId = (String) map.get("areaId");
		devModelId = (int) map.get("devModelId");
		devModelName = (String) map.get("devModelName");
		areaName = (String) map.get("areaName");
		switchUser = (boolean) map.get("switchUser");
		serveEndTime = (String) map.get("serveEndTime");

		if (userId != null && !"".equals(userId)) {
			try {
				Useinfo = userDaoImp.getUseinfo(userId);
			} catch (Exception e) {
				return ResultUtil.simpleResponse("500", "查询异常", e.getMessage());
			}
		}

		List DevZoninfo, UseZoninfo = null;
		try {
			DevZoninfo = userDaoImp.getDevZoninfo(devId, devZoneId);
			UseZoninfo = userDaoImp.getUseZoninfo(devId, devZoneId);
		} catch (Exception e) {
			return ResultUtil.simpleResponse("500", "查询异常", e.getMessage());
		}
		Map<String, Object> mapUseinfo = null;
		Map<String, Object> mapDevZoninfo = null;
		Map<String, Object> mapUseZoninfo = null;
		if (Useinfo != null && !Useinfo.isEmpty()) {
			mapUseinfo = (Map<String, Object>) Useinfo.get(0);
			usrAlmType = (String) mapUseinfo.get("usrAlmType");
		}

		if (DevZoninfo != null && !DevZoninfo.isEmpty()) {
			mapDevZoninfo = (Map<String, Object>) DevZoninfo.get(0);
			atPos = (String) mapDevZoninfo.get("atPos");
			snType = (String) mapDevZoninfo.get("snType");
			almType = (String) mapDevZoninfo.get("almType");
			wantDo = (String) mapDevZoninfo.get("wantDo");
			snTypeName = (String) mapDevZoninfo.get("snTypeName");
			almTypeName = (String) mapDevZoninfo.get("almTypeName");
			wantDoName = (String) mapDevZoninfo.get("wantDoName");
			snModeId = (int) mapDevZoninfo.get("snModeId");
			snModelName = (String) mapDevZoninfo.get("snModelName");
		}
		if (UseZoninfo != null && !UseZoninfo.isEmpty()) {
			mapUseZoninfo = (Map<String, Object>) UseZoninfo.get(0);
			roleZoneName = (String) mapUseZoninfo.get("ownerZoneName");
		} else {
			roleZoneName = "0000";
		}

		SysCodePojo codePojo = null;
		try {
			codePojo = sysCodeDao.findSysCodeByCodeId(sysCode);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询异常", e.getMessage());
		}
		if (codePojo == null) {
			try {
				codePojo = sysCodeDao.findSysCodeByCodeId("000");
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "查询异常", e.getMessage());
			}
			String codeMemo = codePojo.getCodeMemo();
			codeMemo = codeMemo + "(" + sysCode + ")";
			codePojo.setCodeMemo(codeMemo);
		}

		JSONObject json = new JSONObject();// 返回的json数据
		json.put("devId", devId + "");
		json.put("devType", devType + "");
		json.put("userId", userId + "");
		json.put("userName", userName + "");
		json.put("userAddr", userAddr + "");
		json.put("areaId", areaId + "");
		json.put("devModelId", devModelId + "");
		json.put("devModelName", devModelName + "");
		json.put("areaName", areaName + "");
		json.put("usrAlmType", usrAlmType + "");
		json.put("atPos", atPos + "");
		json.put("snType", snType + "");
		json.put("almType", almType + "");
		json.put("wantDo", wantDo + "");
		json.put("snTypeName", snTypeName + "");
		json.put("almTypeName", almTypeName + "");
		json.put("wantDoName", wantDoName + "");
		json.put("snModeId", snModeId + "");
		json.put("snModelName", snModelName + "");
		json.put("accountZone", roleZoneName + "");
		json.put("isCallAbnor", "");
		json.put("callID", "");
		json.put("cameraName", "");
		json.put("userMonitorId", "");
		json.put("define1", "");
		json.put("cameraModelId", "");
		json.put("devZoneId", devZoneId + "");
		json.put("switchUser", switchUser + "");
		json.put("serveEndTime", serveEndTime + "");

		json.put("sysCode", codePojo.getCodeId() + "");
		json.put("eventDesc", codePojo.getCodeMemo() + "");
		json.put("codeTypeId", codePojo.getCodeTypeId() + "");
		json.put("evtWay", codePojo.getEvtWay() + "");
		json.put("codeType", codePojo.getCodeType() + "");

		json.put("er_Color", codePojo.getEr_Color() + "");
		json.put("er_Wave", codePojo.getEr_Wave() + "");
		json.put("e_tail", codePojo.getE_tail() + "");
		json.put("r_tail", codePojo.getR_tail() + "");
		json.put("userZone", codePojo.getUserZone() + "");
		json.put("deaLWay", codePojo.getDeaLWay() + "");
		json.put("evtWayName", codePojo.getEvtWayName() + "");
		json.put("codeLevel", codePojo.getCodeLevel() + "");

		if (json != null && !json.equals("")) {
			result.put("code", "200");
			result.put("message", "success");
			Userjosn.put("relevantContact", json);
			Userjosn.put("result", result);
		} else {
			result.put("code", "201");
			result.put("message", "devid:" + devId + " return json is null");
			Userjosn.put("result", result);
			Userjosn.put("relevantContact", json);
		}
		return Userjosn;
	}

	@SuppressWarnings("rawtypes")
	public JSONObject customerService(String areaId, String pageSize,
			String currentPage) throws Exception { // 根据客户所属区域编号查询客户信息。
		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();
		JSONObject pageInfoPojo = new JSONObject();

		Map<String, Object> map = null;
		try {
			map = userDaoImp.customerInfo(areaId, pageSize, currentPage);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询异常", e.getMessage());
		}

		List list = (List) map.get("list");

		Integer totalNum = (Integer) map.get("totalNum");
		int pageSizeInt = Integer.parseInt(pageSize);
		// int totalPage = totalNum/pageSizeInt+1 ;

		int totalPage;
		if (totalNum % pageSizeInt == 0) {
			totalPage = totalNum / pageSizeInt;
		} else {
			totalPage = totalNum / pageSizeInt + 1;
		}

		result.put("message", "成功");
		result.put("code", 0);
		pageInfoPojo.put("pageSize", pageSizeInt);
		pageInfoPojo.put("totalNum", totalNum);
		pageInfoPojo.put("currentPage", currentPage);
		pageInfoPojo.put("totalPage", totalPage);
		Userjosn.put("result", result);
		Userjosn.put("json", list);
		Userjosn.put("pageInfoPojo", pageInfoPojo);
		return Userjosn;
	}

	public JSONObject RDANvrHaveService(JSONObject jsonParam) throws Exception {
		JSONObject pageInfoPojoPara = jsonParam.getJSONObject("pageInfoPojo");

		String currentPage = pageInfoPojoPara.getString("currentPage");
		String pageSize = pageInfoPojoPara.getString("pageSize");
		String sort = pageInfoPojoPara.getString("sort");
		int pageSizeInt = Integer.parseInt(pageSize);
		int currentPageInt = Integer.parseInt(currentPage);

		sort = sort.equals("devId|ASC") ? " asc " : " desc ";

		JSONObject queryTond = jsonParam.getJSONObject("queryTond");
		String devModelId = queryTond.getString("devModelId");
		String devMaster = queryTond.getString("devMaster");
		String timeStart = queryTond.getString("timeStart");
		String timeEnt = queryTond.getString("timeEnt");

		String userId = jsonParam.getString("userId");

		List<String> purviewAreaIds = new ArrayList<String>();
		try {
			purviewAreaIds = roleAreaService.getPurviewAreaIdsByUserId(userId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "权限查询失败", e.getMessage());
		}

		String areaId = String.format(" and a.areaId in ('%s') ",
				Objects.Joiner("','", purviewAreaIds));

		JSONObject fuzzy = queryTond.getJSONObject("fuzzy");
		String fuzzyKey = fuzzy.getString("fuzzyKey");
		String fuzzyValue = fuzzy.getString("fuzzyValue");

		if (fuzzyKey.equals("pnlHdTel") || fuzzyKey.equals("pnlTel")) {// 2018年2月8日15:14:40当所选搜索对象为无线卡号或联网电话时返回空
			JSONObject mingzi = new JSONObject();
			JSONObject json = new JSONObject();
			JSONObject result = new JSONObject();
			JSONObject pageInfoPojo = new JSONObject();
			result.put("message", "没有联网电话和无线卡号");
			result.put("code", "0");
			pageInfoPojo.put("totalNum", 0);
			pageInfoPojo.put("pageSize", 25);
			pageInfoPojo.put("currentPage", 1);
			pageInfoPojo.put("totalPage", 1);
			mingzi.put("json", json);
			mingzi.put("result", result);
			mingzi.put("pageInfoPojo", pageInfoPojo);

			return mingzi;
		}
		Map<String, Object> map = null;
		try {
			map = userDaoImp.RDANvrHaveDao(pageSizeInt, currentPageInt, sort,
					devModelId, devMaster, areaId, timeStart, timeEnt,
					fuzzyKey, fuzzyValue);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询异常", e.getMessage());
		}

		JSONObject Userjosn = createResponse(currentPage, pageSizeInt, map);

		return Userjosn;
	}

	public JSONObject RDANvrNoService(JSONObject jsonParam) throws Exception {

		JSONObject pageInfoPojoPara = jsonParam.getJSONObject("pageInfoPojo");
		String currentPage = pageInfoPojoPara.getString("currentPage");
		String pageSize = pageInfoPojoPara.getString("pageSize");
		String sort = pageInfoPojoPara.getString("sort");
		int pageSizeInt = Integer.parseInt(pageSize);
		int currentPageInt = Integer.parseInt(currentPage);
		sort = sort.equals("devId|ASC") ? " asc " : " desc ";

		JSONObject queryTond = jsonParam.getJSONObject("queryTond");
		String devModelId = queryTond.getString("devModelId");
		String devMaster = queryTond.getString("devMaster");
		String timeStart = queryTond.getString("timeStart");
		String timeEnt = queryTond.getString("timeEnt");

		String userId = jsonParam.getString("userId");

		List<String> purviewAreaIds = new ArrayList<String>();
		try {
			purviewAreaIds = roleAreaService.getPurviewAreaIdsByUserId(userId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "权限查询失败", e.getMessage());
		}

		String areaId = String.format(" and  a.areaId in ('%s') ",
				Objects.Joiner("','", purviewAreaIds));

		JSONObject fuzzy = queryTond.getJSONObject("fuzzy");
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
		Map<String, Object> map = null;
		try {
			map = userDaoImp.RDANvrNoDao(pageSizeInt, currentPageInt, sort,
					devModelId, devMaster, areaId, timeStart, timeEnt,
					fuzzyKey, fuzzyValue);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询异常", e.getMessage());
		}

		JSONObject Userjosn = createResponse(currentPage, pageSizeInt, map);

		return Userjosn;
	}

	public JSONObject findCodeType() throws Exception {

		List<Map<String, Object>> zonelist = null;
		try {
			zonelist = userDaoImp.getCodeType();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询异常", e.getMessage());
		}
		JSONObject Userzonejson = new JSONObject();
		JSONObject result = new JSONObject();

		if (zonelist.size() != 0) {
			result.put("code", "200");
			result.put("message", "success");
			Userzonejson.put("result", result);
			Userzonejson.put("codeType", zonelist);
		} else {
			result.put("code", "201");
			result.put("message", "success");
			Userzonejson.put("result", result);
			Userzonejson.put("codeType", null);
		}
		return Userzonejson;
	}

	public JSONObject getCodeMemo(String codeTypeId) throws Exception {

		List<Map<String, Object>> zonelist = null;
		try {
			zonelist = userDaoImp.getCodeMemo(codeTypeId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询异常", e.getMessage());
		}
		JSONObject codeMemoJson = new JSONObject();
		JSONObject result = new JSONObject();

		if (zonelist.size() != 0) {
			result.put("code", "200");
			result.put("message", "success");
			codeMemoJson.put("result", result);
			codeMemoJson.put("codeMemo", zonelist);
		} else {
			result.put("code", "201");
			result.put("message", "success");
			codeMemoJson.put("result", result);
			codeMemoJson.put("codeMemo", null);
		}
		return codeMemoJson;
	}

	public JSONObject getEveType() throws Exception {

		List<Map<String, Object>> eveTypeList = null;
		try {
			eveTypeList = userDaoImp.getEveTypeImp();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询异常", e.getMessage());
		}
		JSONObject codeMemoJson = new JSONObject();
		JSONObject result = new JSONObject();

		if (eveTypeList.size() != 0) {
			result.put("code", "200");
			result.put("message", "success");
			codeMemoJson.put("result", result);
			codeMemoJson.put("EveTypeList", eveTypeList);
		} else {
			result.put("code", "201");
			result.put("message", "success");
			codeMemoJson.put("result", result);
			codeMemoJson.put("codeMemo", null);
		}
		return codeMemoJson;
	}

	public JSONObject getDescribe() throws Exception {

		List<Map<String, Object>> describeList = null;
		try {
			describeList = userDaoImp.getDescribeImp();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询异常", e.getMessage());
		}
		JSONObject codeMemoJson = new JSONObject();
		JSONObject result = new JSONObject();

		if (describeList.size() != 0) {
			result.put("code", "200");
			result.put("message", "success");
			codeMemoJson.put("result", result);
			codeMemoJson.put("EveTypeList", describeList);
		} else {
			result.put("code", "201");
			result.put("message", "success");
			codeMemoJson.put("result", result);
			codeMemoJson.put("codeMemo", null);
		}
		return codeMemoJson;
	}

	public JSONObject getLatLngSer(JSONObject jsonParam) throws Exception {

		String devId = jsonParam.getString("devId");
		List<Map<String, Object>> describeList = null;
		try {
			describeList = userDaoImp.getLatLngImp(devId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询异常", e.getMessage());
		}
		JSONObject codeMemoJson = new JSONObject();
		JSONObject result = new JSONObject();

		if (describeList.size() != 0) {
			result.put("code", "200");
			result.put("message", "success");
			codeMemoJson.put("result", result);
			codeMemoJson.put("LatLng", describeList.get(0));
		} else {
			result.put("code", "201");
			result.put("message", "success");
			codeMemoJson.put("result", result);
			codeMemoJson.put("codeMemo", null);
		}
		return codeMemoJson;
	}

	public JSONObject getCodeTypeListSer() throws Exception {

		List<Map<String, Object>> describeList = null;
		try {
			describeList = userDaoImp.getCodeTypeListImp();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "查询异常", e.getMessage());
		}
		JSONObject codeMemoJson = new JSONObject();
		JSONObject result = new JSONObject();

		if (describeList.size() != 0) {
			result.put("code", "200");
			result.put("message", "success");
			codeMemoJson.put("result", result);
			codeMemoJson.put("LatLong", describeList);
		} else {
			result.put("code", "201");
			result.put("message", "success");
			codeMemoJson.put("result", result);
			codeMemoJson.put("codeMemo", null);
		}
		return codeMemoJson;
	}

	public JSONObject getUserIdsByPhoneNo(JSONObject json) {

		try {
			String cPhone = json.getString("cPhone");

			List<String> devIds = userInfoDao.getUserIdsByPhoneNo(cPhone);

			return ResultUtil.simpleResponse("200", "查询成功", devIds);

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("200", "查询成功", e.getMessage());
		}
	}

}
