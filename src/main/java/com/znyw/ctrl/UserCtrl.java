package com.znyw.ctrl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.UserInfoDao;
import com.znyw.pojo.ContactPojo;
import com.znyw.pojo.OperatorPojo;
import com.znyw.pojo.OwnerPojo;
import com.znyw.pojo.ResultPojo;
import com.znyw.service.UserService;
import com.znyw.service.impl.DeleteDeviceService;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.GetSysInfoUtil;
import com.znyw.tool.HttpClientTool;
import com.znyw.tool.HttpTool;
import com.znyw.tool.Objects;
import com.znyw.tool.PropertyConfigUtil;
import com.znyw.tool.ResultUtil;

@Controller
public class UserCtrl {

	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());
	private PropertyConfigUtil propertyconfigUtil = PropertyConfigUtil
			.getInstance("properties/config.properties");
	@Resource
	private UserService userService;
	@Resource
	DeleteDeviceService deletedeviceser;

	@Resource
	private UserInfoDao userInfoDao;

	/**
	 * 获取名下的控制设备，主设备和远程控制设备
	 * 
	 * @return
	 */
	@RequestMapping("/getControlDevsByUserId")
	@ResponseBody
	public JSONObject getControlDevsByUserId(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String ownerId = json.getString("ownerId");
			return userService.getControlDevsByUserId(ownerId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误", e.getMessage());
		}
	}

	@RequestMapping("/getUserInfoByUserId")
	// 根据userId 获取修改主机客户的 信息
	@ResponseBody
	public ResponseEntity<String> getEquipmentData(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			JSONObject userPojo = json.getJSONObject("userPojo");
			String userId = userPojo.getString("userId");
			if (Objects.isNull(userId)) {
				return ResultPojo.LACK_OF_PARAMETER("1");
			}
			ResultPojo result = userService.getUserInfoByUserId(userId);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

	@RequestMapping("/getContactByUserId")
	// 根据userId 查询联系人信息
	@ResponseBody
	public ResponseEntity<String> getContactByUserId(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			JSONObject userPojo = json.getJSONObject("userPojo");
			String userId = userPojo.getString("userId");
			if (Objects.isNull(userId)) {
				return ResultPojo.LACK_OF_PARAMETER("1");
			}
			ResultPojo result = userService.getContactByUserId(userId);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

	@RequestMapping("/alterContactInfo")
	// 添加、修改 联系人
	@ResponseBody
	public ResponseEntity<String> alterContactInfo(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			if (!json.containsKey("dataFrom")
					|| "".equals(json.get("dataFrom"))) {
				json.put("dataFrom", ConfigUtil.getPlatformId());
			}
			String contactJson = json.getString("contactPojo");
			ContactPojo contactPojo = JSONObject.parseObject(contactJson,
					ContactPojo.class);

			ResultPojo result = null;
			String operation = json.getString("operation");
			if (operation.equals("add")) {
				contactPojo.setDataFrom(json.getString("dataFrom"));
				result = userService.addContactInfo(contactPojo);
			} else if (operation.equals("alter")) {
				result = userService.updateContactInfo(contactPojo);
			} else {
				return ResultPojo.PRECONDITION_FAILED("1", "operation");
			}
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

	@RequestMapping("/alterOwnerUserInfo")
	// 添加、修改 机主信息
	@ResponseBody
	public ResponseEntity<String> alterOwnerUserInfo(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			if (!json.containsKey("dataFrom")
					|| "".equals(json.get("dataFrom"))) {
				json.put("dataFrom", ConfigUtil.getPlatformId());
			}
			String ownerPojojson = json.getString("ownerPojo");
			OwnerPojo ownerPojo = JSONObject.parseObject(ownerPojojson,
					OwnerPojo.class);
			String userName = GetSysInfoUtil.getUserName(request);
			String userId = GetSysInfoUtil.getUserId(request);
			if (userName == null) {
				userName = json.getString("userName");
			}
			if (userId == null) {
				userId = json.getString("userId");
			}
			ResultPojo result = null;
			String operation = json.getString("operation");

			if (operation.equals("add")) {
				ownerPojo.setDataFrom(json.getString("dataFrom"));
				result = userService.addUserInfo(userName, userId, ownerPojo);
			} else if (operation.equals("alter")) {
				result = userService
						.updateUserInfo(userName, userId, ownerPojo);
			} else {
				return ResultPojo.PRECONDITION_FAILED("1", "operation");
			}

			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}

	}

	@RequestMapping("/getRoleByUserId")
	// 根据userId 查询角色信息
	@ResponseBody
	public ResponseEntity<String> getRoleByUserId(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			JSONObject userPojo = json.getJSONObject("userPojo");
			String userId = userPojo.getString("userId");
			if (Objects.isNull(userId)) {
				return ResultPojo.LACK_OF_PARAMETER("1");
			}
			ResultPojo result = userService.getRoleByUserId(userId);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
	}

	@RequestMapping("/getGeneralUserInfoByUserId")
	// 根据userId 获取修改普通客户的 信息
	@ResponseBody
	public ResponseEntity<String> getGeneralUserInfoByUserId(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);

			JSONObject userPojo = json.getJSONObject("userPojo");
			String userId = userPojo.getString("userId");
			if (Objects.isNull(userId)) {
				return ResultPojo.LACK_OF_PARAMETER("1");
			}
			ResultPojo result = userService.getGeneralUserInfoByUserId(userId);
			return result.GetResponseEntity();

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
	}

	@RequestMapping("/alterGeneralUserInfo")
	// 添加、修改 普通用户信息
	@ResponseBody
	public ResponseEntity<String> alterGeneralUserInfo(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			if (!json.containsKey("dataFrom")
					|| "".equals(json.get("dataFrom"))) {
				json.put("dataFrom", ConfigUtil.getPlatformId());
			}

			String ownerPojojson = json.getString("ownerPojo");
			OwnerPojo ownerPojo = JSONObject.parseObject(ownerPojojson,
					OwnerPojo.class);

			ResultPojo result = null;
			String userName = GetSysInfoUtil.getUserName(request);
			String userId = GetSysInfoUtil.getUserId(request);
			if (userName == null) {
				userName = json.getString("userName");
			}
			if (userId == null) {
				userId = json.getString("userId");
			}
			String operation = json.getString("operation");

			if (Objects.isNull(userId) || "".equals(userId)) {
				return ResultPojo.LACK_OF_PARAMETER("1");
			}

			if (operation.equals("add")) {
				ownerPojo.setDataFrom(json.getString("dataFrom"));
				result = userService.addGeneralUserInfo(userName, userId,
						ownerPojo);
			} else if (operation.equals("alter")) {
				result = userService.updateGeneralUserInfo(userName, userId,
						ownerPojo);
			} else {
				return ResultPojo.PRECONDITION_FAILED("1", "operation");
			}
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
	}

	@RequestMapping("/getOperatorInfoByUserId")
	// 根据userId 获取操作员的 信息
	@ResponseBody
	public ResponseEntity<String> getOperatorInfoByUserId(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);

			JSONObject userPojo = json.getJSONObject("userPojo");
			String userId = userPojo.getString("userId");
			if (Objects.isNull(userId)) {
				return ResultPojo.LACK_OF_PARAMETER("1");
			}
			ResultPojo result = userService.getOperatorInfoByUserId(userId);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}
	}

	@RequestMapping("/alterOperatorUserInfo")
	// 添加、修改 操作员信息
	@ResponseBody
	public ResponseEntity<String> alterOperatorUserInfo(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			if (!json.containsKey("dataFrom")
					|| "".equals(json.get("dataFrom"))) {
				json.put("dataFrom", ConfigUtil.getPlatformId());
			}

			String operatorJson = json.getString("operatorPojo");
			OperatorPojo operatorPojo = JSONObject.parseObject(operatorJson,
					OperatorPojo.class);

			ResultPojo result = null;
			String userName = GetSysInfoUtil.getUserName(request);
			String userId = GetSysInfoUtil.getUserId(request);
			if (userName == null) {
				userName = json.getString("userName");
			}
			if (userId == null) {
				userId = json.getString("userId");
			}
			String operation = json.getString("operation");
			if (Objects.isNull(userId)) {
				return ResultPojo.LACK_OF_PARAMETER("1");
			}

			if (operation.equals("add")) {
				operatorPojo.setDataFrom(json.getString("dataFrom"));
				result = userService.addOperatorUserInfo(userName, userId,
						operatorPojo);
			} else if (operation.equals("alter")) {
				result = userService.updateOperatorUserInfo(userName, userId,
						operatorPojo);
			} else {
				return ResultPojo.PRECONDITION_FAILED("1", "operation");
			}
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("1", e.getMessage());
		}

	}

	@RequestMapping("/getOperatorsInfoByAreaId")
	// 根据区域id 查询操作员信息
	@ResponseBody
	public ResponseEntity<String> getOperatorsInfoByAreaId(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);

			JSONObject queryTond = json.getJSONObject("queryTond");
			String areaId = queryTond.getString("areaId");
			String userId_name = queryTond.getString("userId_name");
			JSONObject pageInfoPojo = json.getJSONObject("pageInfoPojo");
			String pageSize = (pageInfoPojo.getString("pageSize") == null) ? "0"
					: pageInfoPojo.getString("pageSize");
			String currentPage = pageInfoPojo.getString("currentPage");
			String orderBy = pageInfoPojo.getString("orderBy");
			ResultPojo result = null;

			String userId = GetSysInfoUtil.getUserId(request);
			result = userService.getOperatorsInfoByAreaId(areaId, userId_name,
					pageSize, currentPage, orderBy, userId);

			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

	@RequestMapping("/getCustomerInfoByAreaId")
	// 根据区域 id 查询一般客户信息
	@ResponseBody
	public ResponseEntity<String> getCustomerInfoByAreaId(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);

			JSONObject json = JSONObject.parseObject(jsonStr);
			JSONObject queryTond = json.getJSONObject("queryTond");
			String areaId = queryTond.getString("areaId");
			String userId_name = queryTond.getString("userId_name");
			JSONObject pageInfoPojo = json.getJSONObject("pageInfoPojo");
			String pageSize = pageInfoPojo.getString("pageSize");
			String currentPage = pageInfoPojo.getString("currentPage");
			String orderBy = pageInfoPojo.getString("orderBy");

			ResultPojo result = null;

			String userId = GetSysInfoUtil.getUserId(request);
			result = userService.getCustomerInfoByAreaId(areaId, userId_name,
					pageSize, currentPage, orderBy, userId);

			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

	@RequestMapping("/getOwnerInfoByAreaId")
	// 根据区域 id 查询机主信息
	@ResponseBody
	public ResponseEntity<String> getOwnerInfoByAreaId(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);

			JSONObject json = JSONObject.parseObject(jsonStr);
			JSONObject queryTond = json.getJSONObject("queryTond");
			String areaId = queryTond.getString("areaId");
			String userId_name = queryTond.getString("userId_name");
			JSONObject pageInfoPojo = json.getJSONObject("pageInfoPojo");
			String pageSize = pageInfoPojo.getString("pageSize");
			String currentPage = pageInfoPojo.getString("currentPage");
			String orderBy = pageInfoPojo.getString("orderBy");

			ResultPojo result = null;
			String userId = GetSysInfoUtil.getUserId(request);

			result = userService.getOwnerInfoByAreaId(areaId, userId_name,
					pageSize, currentPage, orderBy, userId);

			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

	@RequestMapping("/deleteContact")
	// 删除 用户联系人
	@ResponseBody
	public JSONObject deleteContact(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String userId = json.getString("userId");
			// String contId = json.getString("contId");
			JSONArray contId = json.getJSONArray("contId");
			return deletedeviceser.deleteContact(userId, contId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@RequestMapping("/deleteUserZone")
	// 删除用户防区
	@ResponseBody
	public JSONObject deleteUserZone(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String ownerId = json.getString("ownerId");
			String ownerZoneName = json.getString("ownerZoneName");
			return deletedeviceser.deleteUserZone(ownerId, ownerZoneName);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@RequestMapping("/deleteGeneralUser")
	// 删除一般用户
	@ResponseBody
	public ResponseEntity<String> deleteGeneralUser(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			JSONObject userPojo = json.getJSONObject("userPojo");
			String userId = userPojo.getString("userId");
			String tuserName = GetSysInfoUtil.getUserName(request);
			String tuserId = GetSysInfoUtil.getUserId(request);
			if (tuserName == null) {
				tuserName = json.getString("userName");
			}
			if (tuserId == null) {
				tuserId = json.getString("userId");
			}
			ResultPojo result = userService.delGeneralUserInfo(tuserName,
					tuserId, userId);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

	@RequestMapping("/deleteOwnerUser")
	// 删除机主用户
	@ResponseBody
	public ResponseEntity<String> deleteOwnerUser(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			JSONObject userPojo = json.getJSONObject("userPojo");
			String userId = userPojo.getString("userId");
			String tuserName = GetSysInfoUtil.getUserName(request);
			String tuserId = GetSysInfoUtil.getUserId(request);
			if (tuserName == null) {
				tuserName = json.getString("userName");
			}
			if (tuserId == null) {
				tuserId = json.getString("userId");
			}
			ResultPojo result = userService.delOwnerUserInfo(tuserName,
					tuserId, userId);
			String urlRDAcenter = propertyconfigUtil.getValue("urlRDAcenter");
			 JSONObject object = new JSONObject();
			 
			 ArrayList<String>  strArray = new ArrayList<String> ();	
			 strArray.add(userId);
			 object.put("userIds", strArray);
			 object.put("roleId", "");
			String rspStr = HttpClientTool.post(urlRDAcenter,
					"inspection/delInspectionUsers.do", object.toString());
			 object.put("reason", "机主被删除");
			//删除故障用户
			String rspStr1 = HttpClientTool.post(urlRDAcenter,
					"delbreakdownUsers.do", object.toString());
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

	@RequestMapping("/deleteOperatorUser")
	// 删除操作员
	@ResponseBody
	public ResponseEntity<String> deleteOperatorUser(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			JSONObject userPojo = json.getJSONObject("userPojo");
			String userId = userPojo.getString("userId");
			String tuserName = GetSysInfoUtil.getUserName(request);
			String tuserId = GetSysInfoUtil.getUserId(request);
			if (tuserName == null) {
				tuserName = json.getString("userName");
			}
			if (tuserId == null) {
				tuserId = json.getString("userId");
			}
			ResultPojo result = userService.delOperatorUserInfo(tuserName,
					tuserId, userId);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}

	}

	/**
	 * 修改机主用户的用户编号
	 * 
	 * @param request
	 * 
	 *            {"oldUserId":"旧编号","newUserId":"新编号"}
	 * 
	 * @param response
	 * @return
	 */
	@RequestMapping("/modifyOwnerId")
	@ResponseBody
	public JSONObject modifyOwnerId(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr = HttpTool.readJSONString(request);
		try {
			JSONObject json = JSONObject.parseObject(jsonStr);
			String operator = json.getString("operator");
			String operatorName = json.getString("operatorName");
			if (Objects.isNullString(operator)
					|| Objects.isNullString(operatorName)) {
				operator = GetSysInfoUtil.getUserId(request);
				operatorName = GetSysInfoUtil.getUserName(request);
			}
			return userService.modifyOwnerId(operator, operatorName, json);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误", e.getMessage());
		}
	}

	@SuppressWarnings("unchecked")
	@RequestMapping("/deleteUserZoneBatch")
	// 删除用户防区
	@ResponseBody
	public JSONObject deleteUserZoneBatch(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String ownerId = json.getString("ownerId");
			// String ownerZoneName = json.getString("ownerZoneName");
			JSONArray ownerZoneNameArray = json.getJSONArray("ownerZoneName");
			List<String> ownerZoneName = (List<String>) JSON
					.parse(ownerZoneNameArray.toJSONString());
			return deletedeviceser.deleteUserZoneBatch(ownerId, ownerZoneName);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误", e.getMessage());
		}
	}

	@RequestMapping("/getOwnerInfo")
	// 查询所有机主编号信息
	@ResponseBody
	public JSONObject getOwnerInfo(HttpServletRequest request,
			HttpServletResponse response) {
		JSONObject result = new JSONObject();
		try {
			List<Map<String, Object>> list = userInfoDao.getOwnerInfoImpl();
			result.put("list", list);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
		}
		return result;
	}
}