package com.znyw.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.device.AOP.LogAnnotation;
import com.mongodb.util.JSON;
import com.systemcfg.dao.AssembleCfgDao;
import com.znyw.dao.DeviceDao;
import com.znyw.dao.UserInfoDao;
import com.znyw.dao.ValidateDao;
import com.znyw.dao.VideoDao;
import com.znyw.dao.ZoneDao;
import com.znyw.dao.impl.UserDaoImp;
import com.znyw.pojo.BasicUserInfoPojo;
import com.znyw.pojo.ContactPojo;
import com.znyw.pojo.GeneralUserPojo;
import com.znyw.pojo.OperatorPojo;
import com.znyw.pojo.OwnerPojo;
import com.znyw.pojo.ResultPojo;
import com.znyw.pojo.RolePojo;
import com.znyw.service.AreaService;
import com.znyw.service.RoleAreaService;
import com.znyw.service.UserService;
import com.znyw.service.ValidateService;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultUtil;

@Service("UserService")
public class UserServiceImpl implements UserService {
	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());
	@Resource
	UserInfoDao userInfoDao;
	@Resource
	DeviceDao deviceDao;
	@Resource
	JdbcTemplate jdbcTemplate;
	@Resource
	private AreaService areaService;
	@Resource
	private RoleAreaService roleAreaService;
	@Resource
	private UserDaoImp userDaoImp;
	@Resource
	private AssembleCfgDao assembleCfgDao;
	@Resource
	private ValidateService validateService;
	@Resource
	private VideoDao videoDao;
	@Resource
	private ZoneDao zoneDao;
	/*
	 * @Resource private AreaTree areaTree;
	 */

	@Resource
	private ValidateDao validateDao;

	@Override
	public JSONObject getControlDevsByUserId(String ownerId) {

		JSONObject jsonObject = new JSONObject();
		try {
			jsonObject.put("masterDevId",
					getControlDevIdByownerId("master", ownerId));
			jsonObject.put("remoteDevId",
					getControlDevIdByownerId("remote", ownerId));
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}

		JSONObject jsonResult = new JSONObject();
		jsonResult.put("code", "200");
		jsonResult.put("message", "查询成功");
		jsonResult.put("result", jsonObject);

		return jsonResult;

	}

	@Override
	public String getControlDevIdByownerId(String type, String ownerId)
			throws Exception {
		return deviceDao.getControlDevsByownerId(type, ownerId);
	}

	@Override
	public ResultPojo getUserInfoByUserId(String userId) throws Exception {
		ResultPojo returnVal = new ResultPojo();// 结果
		Map<String, Object> map = null;
		try {
			map = userDaoImp.getOwnerInfo("ASC", 1, 1, " 1=1 ", "all", "all",
					"all", "", "", "_userId", userId, "1");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			returnVal.setResult("500", "异常", e.getMessage());
			return returnVal;
		}
		List<?> list = (List<?>) map.get("list");
		returnVal.setResult("0", "查询成功");
		returnVal.setPojo("ownerPojo",
				list.isEmpty() ? new OwnerPojo() : list.get(0));

		return returnVal;
	}

	@Override
	public ResultPojo getContactByUserId(String userId) {
		ResultPojo returnVal = new ResultPojo();// 结果
		List<ContactPojo> list = null;
		try {
			list = userInfoDao.findContactByUserId(userId);
			returnVal.setResult("0", "查询成功");
		} catch (Exception e) {
			returnVal.setResult("1", "查询失败", e.getMessage());
			LOGGER.error(e.getMessage(), e);
		}
		returnVal.setPojo("contactPojo", list);
		return returnVal;
	}

	@LogAnnotation(whitelog = "0")
	@Override
	public ResultPojo updateUserInfo(String userName, String userId,
			OwnerPojo ownerPojo) throws Exception {
		userId = ownerPojo.getUserId();
		userName = ownerPojo.getUserName();
		ResultPojo returnVal = new ResultPojo();
		// String userId = ownerPojo.getUserId();

		// 如果前台没太传所属平台ID，则默认使用本平台ID
		if (Objects.isNullString(ownerPojo.getPlatformId())) {
			ownerPojo.setPlatformId(ConfigUtil.getPlatformId());
		}

		boolean updateOwner = userInfoDao.updateOwnerUserInfo(ownerPojo);

		//
		// List<String> newDevIds = ownerPojo.getDevIds();
		// List<String> oldDevIds =
		// deviceDao.getDevIdsButNotCamerasByOwnerId(userId);
		//
		// // 更新后，机主无关联设备,且之前有关联设备
		// if (Objects.isNull(newDevIds) && Objects.isNotNull(oldDevIds)) {
		//
		// // 获取被取消关联设备所对应的用户防区编号
		// List<String> ownerZoneNames =
		// deviceDao.getOwnerZoneNameByDevIdsAndOwnerId(oldDevIds, userId);
		// // 根据用户防区编号删除事件配置
		// deviceDao.deleteOwnerevtrecordByDevZoneIdsAndOwnerId(ownerZoneNames,
		// userId);
		// // 清空该机主的所有用户防区
		// deviceDao.deleteOwnerZoneByOwnerIdAndDevIds(userId, oldDevIds);
		//
		// // 清空该机主被取消关联设备对应的的所有用户监控点
		// deviceDao.deleteOwnerMonitorByOwnerIdAndDevIds(userId, oldDevIds);
		//
		// // 修改指定NVR设备所关联的摄像机的机主
		// deviceDao.updateCamrasOwnerByDevIds(oldDevIds, null);
		//
		// // 将此机主名下的所有设备变成无主设备
		// deviceDao.setOwnerId2NullForDevByOwnerId(userId);
		// }
		//
		// // 更新后，机主有关联设备，与更新之前的关联设备比较，
		// // 找出被取消关联的设备，并清空它对应的用户防区
		// if (Objects.isNotNull(newDevIds) && Objects.isNotNull(oldDevIds)) {
		//
		// // 被取消的设备编号
		// List<String> diff = Objects.getDiffFromOld(newDevIds, oldDevIds);
		// // 将被取消关联的设备设备变成无主设备
		// deviceDao.setOwnerId2NullForDevByOwnerIdAndDevIds(userId, diff);
		// // 获取被取消关联设备所对应的用户防区编号
		// List<String> ownerZoneNames =
		// deviceDao.getOwnerZoneNameByDevIdsAndOwnerId(oldDevIds, userId);
		// // 根据用户防区编号删除事件配置
		// deviceDao.deleteOwnerevtrecordByDevZoneIdsAndOwnerId(ownerZoneNames,
		// userId);
		// // 清空该机主被取消关联设备对应的的所有用户防区
		// deviceDao.deleteOwnerZoneByOwnerIdAndDevIds(userId, diff);
		//
		// // 清空该机主被取消关联设备对应的的所有用户监控点
		// deviceDao.deleteOwnerMonitorByOwnerIdAndDevIds(userId, diff);
		//
		// // 修改指定NVR设备所关联的摄像机的机主
		// deviceDao.updateCamrasOwnerByDevIds(diff, null);
		// }
		//
		// List<String> alreadyHasOwnerDevIds =
		// deviceDao.getAlreadyHasOwnerDevIdsButNotSpecifyOwner(ownerPojo.getDevIds(),
		// userId);
		// // 移除已经有主的设备 ids
		// if (alreadyHasOwnerDevIds.size() > 0) {
		// ownerPojo.getDevIds().removeAll(alreadyHasOwnerDevIds);
		// }
		//
		// // 关联设备防区
		// try {
		// List<Map<String, Object>> lists =
		// zoneDao.getDevZoneByDevIds(ownerPojo.getDevIds());
		// for (Map<String, Object> map : lists) {
		// map.put("ownerId", ownerPojo.getUserId());
		// map.put("ownerZoneName", getNextOwnerZoneId(ownerPojo.getUserId()));
		// zoneDao.addOwnerZone(map);
		// }
		//
		// } catch (Exception e) {
		// LOGGER.error(e.getMessage(), e);
		// returnVal.setResult("1", "添加失败", e.getMessage());
		// }
		//
		// // 关联NVR监控点
		// try {
		//
		// oldDevIds = deviceDao.getDevIdsButNotCamerasByOwnerId(userId);
		//
		// List<String> diff = Objects.getDiffFromNew(newDevIds, oldDevIds);
		//
		// List<Map<String, Object>> listsCamera =
		// videoDao.getCameraByDevIds(diff);
		// for (Map<String, Object> mapCamera : listsCamera) {
		// String ownerMonitorId = getNextDevMonitorId(ownerPojo.getUserId());
		//
		// deviceDao.addOwnermonitor(ownerPojo.getUserId(), (String)
		// mapCamera.get("relateNVR"),
		// (String) mapCamera.get("devMonitorId"), ownerMonitorId, (String)
		// mapCamera.get("dataFrom"));
		// }
		// } catch (Exception e) {
		// LOGGER.error(e.getMessage(), e);
		// returnVal.setResult("1", "添加失败", e.getMessage());
		// }
		//
		// // 将前台指定的设备列表中的所有主设备的机主设置为当前用户，区域
		// boolean updateUserIdForDevs =
		// deviceDao.updateOwnerIdAndAreaIdForDevInfoByDevIds(ownerPojo.getDevIds(),
		// userId,
		// ownerPojo.getAreaId());
		//
		// // 修改指定NVR设备所关联的摄像机的机主
		// deviceDao.updateCamrasOwnerByDevIds(ownerPojo.getDevIds(), userId);

		// 将机主下的所有设备的区域改成机主所在区域
		/*
		 * deviceDao.updateAreaIdForDevInfo(ownerPojo.getAreaId(), userId);
		 */
		// // 设置设备控制类型，主设备或远程控制设备
		// deviceDao.setControType(ownerPojo.getMasterDevId(),
		// ownerPojo.getRemoteDevId());

		// if (updateOwner && updateUserIdForDevs) {
		// String msg = alreadyHasOwnerDevIds.isEmpty() ? "修改成功"
		// : "修改成功,但是以下设备已经被其他用户绑定:" + Objects.Joiner(",",
		// alreadyHasOwnerDevIds);
		// returnVal.setResult("0", msg);
		// LOGGER.info("\n修改机主 {} 成功,{}", userId, msg);
		// } else {
		// returnVal.setResult("1", "修改失败");
		// LOGGER.info("\n修改机主 {} 失败", userId);
		// }

		if (updateOwner) {
			returnVal.setResult("0", "修改成功");
		} else {
			returnVal.setResult("1", "修改失败");
		}
		return returnVal;
	}

	@LogAnnotation(whitelog = "0")
	@Override
	public ResultPojo addUserInfo(String userName, String userId,
			OwnerPojo ownerPojo) throws Exception {
		ResultPojo returnVal = new ResultPojo();// 结果
		boolean userAccountresult = false;
		boolean userIdresult = validateDao
				.isUserIdCanUse(ownerPojo.getUserId());

		if (!userIdresult) {
			LOGGER.info("[添加机主信息]用户编号{}已存在", ownerPojo.getUserId());
			returnVal.setResult("2", "此用户编号已存在");
			return returnVal;
		}

		userAccountresult = validateDao.isUserAccountCanUse(ownerPojo
				.getUserAccount());
		if (!userAccountresult) {
			returnVal.setResult("2", "此用户帐号已存在");
			LOGGER.info("[添加机主信息]用户帐号{}已存在", ownerPojo.getUserAccount());
			return returnVal;
		}

		// 如果前台没太传所属平台ID，则默认使用本平台ID
		if (Objects.isNullString(ownerPojo.getPlatformId())) {
			ownerPojo.setPlatformId(ConfigUtil.getPlatformId());
		}

		if (Objects.isNullString(ownerPojo.getDataFrom())) {
			ownerPojo.setDataFrom(ConfigUtil.getPlatformId());
		}
		boolean inserted = userInfoDao.insertOwnerUserInfo(ownerPojo);

		List<String> hasOwnereIdDevIds = deviceDao
				.getAlreadyHasOwnerDevIds(ownerPojo.getDevIds());

		if (hasOwnereIdDevIds.size() > 0) {
			ownerPojo.getDevIds().removeAll(hasOwnereIdDevIds);
		}

		boolean updated = deviceDao.updateOwnerIdAndAreaIdForDevInfoByDevIds(
				ownerPojo.getDevIds(), ownerPojo.getUserId(),
				ownerPojo.getAreaId());

		// 修改指定NVR设备所关联的摄像机的机主
		deviceDao.updateCamrasOwnerByDevIds(ownerPojo.getDevIds(),
				ownerPojo.getUserId());

		// 设置设备控制类型，主设备或远程控制设备
		deviceDao.setControType(ownerPojo.getMasterDevId(),
				ownerPojo.getRemoteDevId());

		// 关联设备防区
		try {
			List<Map<String, Object>> lists = zoneDao
					.getDevZoneByDevIds(ownerPojo.getDevIds());
			for (Map<String, Object> map : lists) {
				map.put("ownerId", ownerPojo.getUserId());
				map.put("ownerZoneName",
						getNextOwnerZoneId(ownerPojo.getUserId()));
				zoneDao.addOwnerZone(map);
			}

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			returnVal.setResult("1", "添加失败", e.getMessage());
		}

		// 关联NVR监控点
		try {
			List<Map<String, Object>> listsCamera = videoDao
					.getCameraByDevIds(ownerPojo.getDevIds());
			for (Map<String, Object> mapCamera : listsCamera) {
				String ownerMonitorId = getNextDevMonitorId(ownerPojo
						.getUserId());

				deviceDao.addOwnermonitor(ownerPojo.getUserId(),
						(String) mapCamera.get("relateNVR"),
						(String) mapCamera.get("devMonitorId"), ownerMonitorId,
						(String) mapCamera.get("dataFrom"));
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			returnVal.setResult("1", "添加失败", e.getMessage());
		}

		if (inserted && updated) {
			returnVal.setResult(
					"0",
					hasOwnereIdDevIds.isEmpty() ? "添加成功"
							: "添加成功，但以下设备已经被其他机主绑定："
									+ Objects.Joiner(",", hasOwnereIdDevIds));
		} else {
			returnVal.setResult("1", "添加失败");
		}

		return returnVal;
	}

	private String getNextOwnerZoneId(String ownerId) throws Exception {

		String maxZoneId = zoneDao.getMaxOwnerZoneId(ownerId);

		String ownerZoneId = String.valueOf(Integer.valueOf(maxZoneId) + 1);

		while (ownerZoneId.length() < 4) {
			ownerZoneId = "0" + ownerZoneId;
		}
		return ownerZoneId;
	}

	private String getNextDevMonitorId(String ownerId) throws Exception {

		String maxMonitorId = videoDao.getCurrentMaxOwnerMonitorId(ownerId);

		String ownerMonitorId = String
				.valueOf(Integer.valueOf(maxMonitorId) + 1);

		while (ownerMonitorId.length() < 4) {
			ownerMonitorId = "0" + ownerMonitorId;
		}

		return ownerMonitorId;
	}

	@Override
	public ResultPojo getRoleByUserId(String userId) throws Exception {

		ResultPojo returnVal = new ResultPojo();// 结果
		List<RolePojo> list = null;
		try {
			list = userInfoDao.findRoleByUserId(userId);
		} catch (Exception e) {
			returnVal.setResult("500", "查询失败", e.getMessage());
			return returnVal;
		}

		if (list == null || list.isEmpty()) {
			returnVal.setResult("1", "查询失败");
		} else {
			returnVal.setResult("0", "查询成功");
		}
		returnVal.setPojo("rolePojo", list);
		return returnVal;
	}

	@Override
	public ResultPojo getGeneralUserInfoByUserId(String userId)
			throws Exception {
		ResultPojo returnVal = new ResultPojo();

		GeneralUserPojo generalUserPojo = null;
		try {
			generalUserPojo = userInfoDao.findGeneralUserByUserId(userId);
		} catch (Exception e) {
			returnVal.setResult("500", "查询失败");
			return returnVal;
		}
		if (generalUserPojo == null) {
			returnVal.setResult("1", "查询失败");
		} else {
			returnVal.setResult("0", "查询成功");
		}
		returnVal.setPojo("generalUserPojo", generalUserPojo);
		return returnVal;
	}

	@LogAnnotation(whitelog = "0")
	@Override
	public ResultPojo updateGeneralUserInfo(String userName, String userId,
			OwnerPojo ownerPojo) throws Exception {

		ResultPojo returnVal = new ResultPojo();// 结果

		// 如果前台没太传所属平台ID，则默认使用本平台ID
		if (Objects.isNullString(ownerPojo.getPlatformId())) {
			ownerPojo.setPlatformId(ConfigUtil.getPlatformId());
		}

		boolean result = false;
		try {
			result = userInfoDao.updateGeneralUserInfo(ownerPojo);
		} catch (Exception e) {
			returnVal.setResult("500", "修改失败", e.getMessage());
			return returnVal;
		}
		if (result == true) {
			returnVal.setResult("0", "修改成功");
		} else {
			returnVal.setResult("1", "修改失败");
		}
		return returnVal;
	}

	@LogAnnotation(whitelog = "0")
	@Override
	public ResultPojo addGeneralUserInfo(String userName, String userId,
			OwnerPojo ownerPojo) throws Exception {
		ResultPojo returnVal = new ResultPojo();// 结果

		boolean userAccountresult = false;
		boolean userIdresult = false;

		userIdresult = validateDao.isUserIdCanUse(ownerPojo.getUserId());
		if (!userIdresult) {
			LOGGER.info("[添加普通用户信息]用户编号{}已存在", ownerPojo.getUserId());
			returnVal.setResult("2", "此用户编号已存在");
			return returnVal;
		}
		userAccountresult = validateDao.isUserAccountCanUse(ownerPojo
				.getUserAccount());
		if (!userAccountresult) {
			LOGGER.info("[添加普通用户信息]用户账号{}已存在", ownerPojo.getUserAccount());
			returnVal.setResult("2", "此用户帐号已存在");
			return returnVal;
		}

		// 如果前台没太传所属平台ID，则默认使用本平台ID
		if (Objects.isNullString(ownerPojo.getPlatformId())) {
			ownerPojo.setPlatformId(ConfigUtil.getPlatformId());
		}

		if (Objects.isNullString(ownerPojo.getDataFrom())) {
			ownerPojo.setDataFrom(ConfigUtil.getPlatformId());
		}

		boolean result = userInfoDao.insertGeneralUserInfo(ownerPojo);

		if (result == true) {
			returnVal.setResult("0", "添加成功");
		} else {
			returnVal.setResult("1", "添加失败");
		}

		return returnVal;
	}

	@Override
	public ResultPojo getOperatorInfoByUserId(String userId) {
		ResultPojo returnVal = new ResultPojo();// 结果
		OperatorPojo operatorPojo = null;
		try {
			operatorPojo = userInfoDao.findOperatorByUserId(userId);
			String json = JSONObject.toJSONString(operatorPojo);
			returnVal.setResult("0", "查询成功");
		} catch (Exception e) {
			returnVal.setResult("1", "查询失败", e.getMessage());
		}
		returnVal.setPojo("operatorPojo", operatorPojo);
		return returnVal;
	}

	@LogAnnotation(whitelog = "0")
	@Override
	public ResultPojo updateOperatorUserInfo(String userName, String userId,
			OperatorPojo operatorPojo) throws Exception {
		ResultPojo returnVal = new ResultPojo();

		// 如果前台没太传所属平台ID，则默认使用本平台ID
		if (Objects.isNullString(operatorPojo.getPlatformId())) {
			operatorPojo.setPlatformId(ConfigUtil.getPlatformId());
		}

		boolean result = userInfoDao.updateOperatorUserInfo(operatorPojo);
		if (result == true) {
			returnVal.setResult("0", "修改成功");
		} else {
			returnVal.setResult("1", "修改失败");
		}
		return returnVal;
	}

	@LogAnnotation(whitelog = "0")
	@Override
	public ResultPojo addOperatorUserInfo(String userName, String userId,
			OperatorPojo operatorPojo) throws Exception {
		ResultPojo returnVal = new ResultPojo();// 结果
		boolean userIdresult = false;
		boolean userAccountresult = false;

		userIdresult = validateDao.isUserIdCanUse(operatorPojo.getUserId());
		if (!userIdresult) {
			returnVal.setResult("2", "此用户编号已存在");
			return returnVal;
		}
		userAccountresult = validateDao.isUserAccountCanUse(operatorPojo
				.getUserAccount());
		if (!userAccountresult) {
			returnVal.setResult("2", "此用户帐号已存在");
			return returnVal;
		}

		// 如果前台没太传所属平台ID，则默认使用本平台ID
		if (Objects.isNullString(operatorPojo.getPlatformId())) {
			operatorPojo.setPlatformId(ConfigUtil.getPlatformId());
		}

		if (Objects.isNullString(operatorPojo.getDataFrom())) {
			operatorPojo.setDataFrom(ConfigUtil.getPlatformId());
		}

		boolean result = userInfoDao.insertOperatorUserInfo(operatorPojo);
		// boolean updateDeviceOwner =
		// deviceDao.updateDeviceOwnerByRoleId(ownerPojo.getRoleId(),
		// ownerPojo.getUserId());
		try {
			if (result == true) {
				returnVal.setResult("0", "添加成功");
			} else {
				throw new RuntimeException("数据更新失败");
			}
		} catch (Exception e) {
			returnVal.setResult("1", "添加失败");
		}

		return returnVal;
	}

	@Override
	public ResultPojo getOperatorsInfoByAreaId(String areaId,
			String userId_name, String pageSize, String currentPage,
			String orderBy, String userId) throws Exception {
		int currentPageInt = Integer.parseInt(currentPage);
		int pageSizeInt = Integer.parseInt(pageSize);

		List<String> purviewAreaIds = new ArrayList<String>();

		try {
			purviewAreaIds = roleAreaService.getPurviewAreaIdsByUserId(userId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			ResultPojo returnVal = new ResultPojo();
			returnVal.setResult("500", "权限查询失败");
			returnVal.setPojo("detail", e.getMessage());
			return returnVal;
		}

		if (ConfigUtil.getRoot().equals(areaId)) {
			areaId = String.format(" area.areaId in ('%s') ",
					Objects.Joiner("','", purviewAreaIds));
		} else {
			areaId = String.format(" area.areaId='%s' and '%s' in ('%s') ",
					areaId, areaId, Objects.Joiner("','", purviewAreaIds));
		}

		String sort = orderBy.indexOf("DESC") > 0 ? " DESC " : "ASC";
		Map<String, Object> map = userDaoImp.getOperatorsInfo(sort,
				pageSizeInt, currentPageInt, areaId, "all", "", "", "all",
				userId_name);
		ResultPojo returnVal = createResponse(currentPage, pageSizeInt, map,
				"operatorPojo");
		
		JSONObject jsonResult = returnVal.getReturnVal(); // 如果获取当前页数大于总页数，则重新获取最大页数的数据返回
		JSONObject pageInfoPojo = jsonResult.getJSONObject("pageInfoPojo");
		int totalPage = pageInfoPojo.getIntValue("totalPage");
		if (currentPageInt > totalPage) {

			currentPageInt = totalPage==0?1:totalPage;
			map = userDaoImp.getOperatorsInfo(sort,
					pageSizeInt, currentPageInt, areaId, "all", "", "", "all",
					userId_name);
			returnVal = createResponse(totalPage+"", pageSizeInt, map,
					"operatorPojo");
		}
		return returnVal;
	}

	@Override
	public ResultPojo updateContactInfo(ContactPojo contactPojo)
			throws Exception {
		ResultPojo returnVal = new ResultPojo();// 结果

		boolean result = false;
		try {
			result = userInfoDao.updateContactInfo(contactPojo);
		} catch (Exception e) {
			returnVal.setResult("500", "修改失败", e.getMessage());
			return returnVal;
		}
		if (result == true) {
			returnVal.setResult("0", "修改成功");
		} else {
			returnVal.setResult("1", "修改失败");
		}
		return returnVal;
	}

	@Override
	public ResultPojo addContactInfo(ContactPojo contactPojo) throws Exception {
		ResultPojo returnVal = new ResultPojo();// 结果
		try {
			if (userInfoDao.hasRecord(contactPojo.getUserId(),
					contactPojo.getContId())) {
				LOGGER.error("[添加联系人]{}的联系人{}已存在", contactPojo.getUserId(),
						contactPojo.getContId());
				returnVal.setResult("3", "添加失败，联系人编号重复");
				return returnVal;
			}

			boolean result = userInfoDao.insertContactInfo(contactPojo);

			if (result == true) {
				returnVal.setResult("0", "添加成功");
			} else {
				returnVal.setResult("1", "添加失败");
			}
		} catch (Exception e) {
			returnVal.setResult("500", "添加失败", e.getMessage());
		}
		return returnVal;
	}

	@Override
	public ResultPojo getCustomerInfoByAreaId(String areaId,
			String userId_name, String pageSize, String currentPage,
			String orderBy, String userId) throws Exception {

		List<String> purviewAreaIds = new ArrayList<String>();

		try {
			purviewAreaIds = roleAreaService.getPurviewAreaIdsByUserId(userId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			ResultPojo returnVal = new ResultPojo();
			returnVal.setResult("500", "权限查询失败");
			returnVal.setPojo("detail", e.getMessage());
			return returnVal;
		}

		if (ConfigUtil.getRoot().equals(areaId)) {
			areaId = String.format(" user.areaId in ('%s') ",
					Objects.Joiner("','", purviewAreaIds));
		} else {
			areaId = String.format(" user.areaId='%s' and '%s' in ('%s') ",
					areaId, areaId, Objects.Joiner("','", purviewAreaIds));
		}

		int currentPageInt = Integer.parseInt(currentPage);
		int pageSizeInt = Integer.parseInt(pageSize);

		String sort = orderBy.indexOf("DESC") > 0 ? " DESC " : "ASC";
		Map<String, Object> map = userDaoImp.getCustomerInfo(sort, pageSizeInt,
				currentPageInt, areaId, "all", "all", "all", "", "", "all",
				userId_name);

		ResultPojo returnVal = createResponse(currentPage, pageSizeInt, map);

		JSONObject jsonResult = returnVal.getReturnVal(); // 如果获取当前页数大于总页数，则重新获取最大页数的数据返回
		JSONObject pageInfoPojo = jsonResult.getJSONObject("pageInfoPojo");
		int totalPage = pageInfoPojo.getIntValue("totalPage");
		if (currentPageInt > totalPage) {

			currentPageInt = totalPage == 0 ? 1 : totalPage;
			map = userDaoImp.getCustomerInfo(sort, pageSizeInt, currentPageInt,

			areaId, "all", "all", "all", "", "", "all", userId_name);

			returnVal = createResponse(totalPage + "", pageSizeInt, map);
		}

		return returnVal;
	}

	@Override
	public ResultPojo getOwnerInfoByAreaId(String areaId, String userId_name,
			String pageSize, String currentPage, String orderBy, String userId)
			throws Exception {

		List<String> purviewAreaIds = new ArrayList<String>();

		try {
			purviewAreaIds = roleAreaService.getPurviewAreaIdsByUserId(userId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			ResultPojo returnVal = new ResultPojo();
			returnVal.setResult("500", "权限查询失败");
			returnVal.setPojo("detail", e.getMessage());
			return returnVal;
		}

		if (ConfigUtil.getRoot().equals(areaId)) {
			areaId = String.format(" a.areaId in ('%s') ",
					Objects.Joiner("','", purviewAreaIds));
		} else {
			areaId = String.format(" a.areaId='%s' and '%s' in ('%s') ",
					areaId, areaId, Objects.Joiner("','", purviewAreaIds));
		}

		int currentPageInt = Integer.parseInt(currentPage);
		int pageSizeInt = Integer.parseInt(pageSize);

		String sort = orderBy.indexOf("DESC") > 0 ? " DESC " : "ASC";

		Map<String, Object> map = userDaoImp.getOwnerInfo(sort, pageSizeInt,
				currentPageInt, areaId, "all", "all", "all", "", "", "all",
				userId_name, "1");

		ResultPojo returnVal = createResponse(currentPage, pageSizeInt, map);

		return returnVal;
	}

	@SuppressWarnings("rawtypes")
	private ResultPojo createResponse(String currentPage, int pageSizeInt,
			Map<String, Object> map) {
		List list = (List) map.get("list");

		Integer totalNum = (Integer) map.get("totalNum");

		int totalPage;
		if (totalNum % pageSizeInt == 0) {
			totalPage = totalNum / pageSizeInt;
		} else {
			totalPage = totalNum / pageSizeInt + 1;
		}

		JSONObject result = new JSONObject();
		JSONObject pageInfoPojo = new JSONObject();

		ResultPojo returnVal = new ResultPojo();

		result.put("message", "成功");
		result.put("code", 0);
		pageInfoPojo.put("pageSize", pageSizeInt);
		pageInfoPojo.put("totalNum", totalNum);
		pageInfoPojo.put("currentPage", currentPage);
		pageInfoPojo.put("totalPage", totalPage);
		returnVal.setPojo("pageInfoPojo", pageInfoPojo);
		returnVal.setPojo("ownerPojo", list);
		returnVal.setResult("0", "查询成功");

		return returnVal;
	}

	@SuppressWarnings("rawtypes")
	private ResultPojo createResponse(String currentPage, int pageSizeInt,
			Map<String, Object> map, String dataKey) {
		List list = (List) map.get("list");

		Integer totalNum = (Integer) map.get("totalNum");

		int totalPage;
		if (totalNum % pageSizeInt == 0) {
			totalPage = totalNum / pageSizeInt;
		} else {
			totalPage = totalNum / pageSizeInt + 1;
		}

		JSONObject result = new JSONObject();
		JSONObject pageInfoPojo = new JSONObject();

		ResultPojo returnVal = new ResultPojo();

		result.put("message", "成功");
		result.put("code", 0);
		pageInfoPojo.put("pageSize", pageSizeInt);
		pageInfoPojo.put("totalNum", totalNum);
		pageInfoPojo.put("currentPage", currentPage);
		pageInfoPojo.put("totalPage", totalPage);
		returnVal.setPojo("pageInfoPojo", pageInfoPojo);
		returnVal.setPojo(dataKey, list);
		returnVal.setResult("0", "查询成功");

		return returnVal;
	}

	@Override
	public int DeleteContact(String userId, JSONArray contIds) {
		String sql = " DELETE FROM imm_usercont WHERE userId=? and contId in ('%s') ";
		int info = jdbcTemplate.update(
				String.format(sql, Objects.Joiner("','", contIds)), userId);
		return info;
	}

	@Override
	public int DeleteUserZone(String ownerId, String ownerZoneName) {
		String sql = " DELETE FROM imm_ownerzone WHERE ownerId=? and ownerZoneName=? ";
		try {
			int info = jdbcTemplate.update(sql, new Object[] { ownerId,
					ownerZoneName });
			return info;
		} catch (Exception e) {
			throw e;
		}
	}

	@LogAnnotation(whitelog = "0")
	@Override
	public ResultPojo delGeneralUserInfo(String tuserName, String tuserId,
			String userId) throws Exception {
		ResultPojo returnVal = new ResultPojo();// 结果
		// 删除联系人
		boolean delUsercont = userInfoDao.deleteContactInfosByUserId(userId);
		if (!delUsercont) {
			returnVal.setResult("1", "deleteContactInfos fail");
			return returnVal;
		}
		// 删除客户属性信息
		boolean delCustomerattr = userInfoDao.deleteCustomerattr(userId);
		if (!delCustomerattr) {
			returnVal.setResult("1", "delCustomerattr fail");
			return returnVal;
		}
		// 删除用户基本信息
		boolean delUserinfo = userInfoDao.deleteUserInfo(userId);
		if (!delUserinfo) {
			returnVal.setResult("1", "delUserinfo fail");
			return returnVal;
		}
		returnVal.setResult("0", "delete success");
		return returnVal;
	}

	@LogAnnotation(whitelog = "0")
	@Override
	public ResultPojo delOwnerUserInfo(String tuserName, String tuserId,
			String userId) throws Exception {
		ResultPojo returnVal = new ResultPojo();

		try {
			userDaoImp.deleteByOwnerId(userId);
			returnVal.setResult("0", "delete success");

		} catch (Exception e) {
			returnVal.setResult("500", e.getMessage());
		}
		return returnVal;
		// 获取关联设备并删除设备以及设备相关资料
		/*
		 * List<String> devIds = deviceDao.getDevIdsByOwnerId(userId);
		 * 
		 * try { for (String devId : devIds) { deviceDao.deleteByDevId(devId); }
		 * } catch (Exception e) { LOGGER.error(e.getMessage(), e);
		 * returnVal.setResult("500", "权限查询失败"); returnVal.setPojo("detail",
		 * e.getMessage()); return returnVal; }
		 * 
		 * // 删除机主 boolean deleted = false; try { deleted =
		 * userDaoImp.deleteByOwnerId(userId); } catch (Exception e) {
		 * returnVal.setResult("500", e.getMessage()); return returnVal; }
		 * 
		 * if (deleted) { returnVal.setResult("0", "delete success"); } else {
		 * returnVal.setResult("1", "delete fail"); } return returnVal;
		 */
	}

	@LogAnnotation(whitelog = "0")
	@Override
	public ResultPojo delOperatorUserInfo(String tuserName, String tuserId,
			String userId) throws Exception {
		ResultPojo returnVal = new ResultPojo();// 结果
		// 删除联系人
		boolean delUsercont = userInfoDao.deleteContactInfosByUserId(userId);
		if (!delUsercont) {
			returnVal.setResult("1", "deleteContactInfos fail");
			return returnVal;
		}

		// 删除记住属性信息
		boolean delOperatorattr = userInfoDao.deleteOperatorattr(userId);
		if (!delOperatorattr) {
			returnVal.setResult("1", "delOperatorattr fail");
			return returnVal;
		}
		// 删除用户基本信息
		boolean delUserinfo = userInfoDao.deleteUserInfo(userId);
		if (!delUserinfo) {
			returnVal.setResult("1", "delUserinfo fail");
			return returnVal;
		}
		returnVal.setResult("0", "delete success");
		return returnVal;
	}

	@SuppressWarnings("unused")
	@Override
	public ResultPojo getBasicUserInfoByUserId(String userId, String login) {
		ResultPojo returnVal = new ResultPojo();// 结果
		BasicUserInfoPojo basicUserInfoPojo = null;
		try {
			List<String> purviewAreaIds = roleAreaService
					.getPurviewAreaIdsByUserId(login);
			basicUserInfoPojo = userInfoDao.findBasicUserInfoByUserId(userId,
					purviewAreaIds);
			String json = JSONObject.toJSONString(basicUserInfoPojo);
			returnVal.setResult("0", "查询成功");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			returnVal.setResult("1", "查询失败");
		}
		returnVal.setPojo("basicUserInfoPojo", basicUserInfoPojo);
		return returnVal;
	}

	@Override
	@LogAnnotation(whitelog = "200")
	public JSONObject modifyOwnerId(String operator, String operatorName,
			JSONObject jsonObject) {
		String oldUserId = jsonObject.getString("oldUserId");
		String newUserId = jsonObject.getString("newUserId");

		if (Objects.isNullString(oldUserId) || Objects.isNullString(newUserId)) {
			return ResultUtil.simpleResponse("500", "参数错误",
					"字段 oldUserId 或 newUserId 为空");
		}

		if (!validateService.hasRecordForModify("userId", oldUserId)) {
			return ResultUtil.simpleResponse("500", "要修改的编号不存在", "编号为 "
					+ oldUserId + " 的机主不存在");
		}

		if (Objects.equalString(oldUserId, newUserId)) {
			return ResultUtil.simpleResponse("403", "新旧编号一致");
		}

		ResultPojo resultPojo = validateService.isCanUse("userId", newUserId);

		if (jsonObject.containsKey("dataFrom")
				|| "0".equals(resultPojo.getCode())) {
			try {
				boolean updated = userDaoImp
						.modifyOwnerId(oldUserId, newUserId);
				return updated ? ResultUtil.simpleResponse("200", "修改成功")
						: ResultUtil.simpleResponse("200", "修改失败");

			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				try {
					userDaoImp.modifyOwnerId(newUserId, oldUserId);
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
	public int deleteUserZoneBatch(String ownerId, List<String> ownerZoneName) {
		String sql = " DELETE FROM imm_ownerzone WHERE ownerId=? and ownerZoneName in ('%s') ";
		try {
			int info = jdbcTemplate.update(
					String.format(sql, Objects.Joiner("','", ownerZoneName)),
					ownerId);
			return info;
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public JSONObject correlateDevicesAdd(JSONObject jsonObject) {

		JSONObject data = jsonObject.getJSONObject("data");

		String ownerId = data.getString("ownerId");

		@SuppressWarnings("unchecked")
		List<String> devIds = (List<String>) JSON.parse(data
				.getString("correlateDevIds"));

		List<String> hasOwnereIdDevIds;
		try {
			hasOwnereIdDevIds = deviceDao.getAlreadyHasOwnerDevIds(devIds);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
		}

		if (hasOwnereIdDevIds.size() > 0) {
			devIds.removeAll(hasOwnereIdDevIds);
		}

		// 修改指定NVR设备所关联的摄像机的机主
		try {
			deviceDao.updateCamrasOwnerByDevIds(devIds, ownerId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
		}

		// 关联设备防区
		try {
			List<Map<String, Object>> lists = zoneDao
					.getDevZoneByDevIds(devIds);
			for (Map<String, Object> map : lists) {
				map.put("ownerId", ownerId);
				map.put("ownerZoneName", getNextOwnerZoneId(ownerId));
				zoneDao.addOwnerZone(map);
			}

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
		}

		// 关联NVR监控点
		try {
			List<Map<String, Object>> listsCamera = videoDao
					.getCameraByDevIds(devIds);
			for (Map<String, Object> mapCamera : listsCamera) {
				String ownerMonitorId = getNextDevMonitorId(ownerId);

				deviceDao.addOwnermonitor(ownerId,
						(String) mapCamera.get("relateNVR"),
						(String) mapCamera.get("devMonitorId"), ownerMonitorId,
						(String) mapCamera.get("dataFrom"));
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
		}

		try {
			String areaId = userDaoImp.getAreaIdByUserId(ownerId);
			deviceDao.updateOwnerIdAndAreaIdForDevInfoByDevIds(devIds, ownerId,
					areaId);

			return ResultUtil.simpleResponse("200", "添加成功");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
		}
	}

	@Override
	public JSONObject correlateDevicesDelete(JSONObject jsonObject) {

		JSONObject data = jsonObject.getJSONObject("data");

		String ownerId = data.getString("ownerId");

		@SuppressWarnings("unchecked")
		List<String> devIds = (List<String>) JSON.parse(data
				.getString("correlateDevIds"));

		try {
			// 获取被取消关联设备所对应的用户防区编号
			List<String> ownerZoneNames = deviceDao
					.getOwnerZoneNameByDevIdsAndOwnerId(devIds, ownerId);
			// 根据用户防区编号删除事件配置
			deviceDao.deleteOwnerevtrecordByDevZoneIdsAndOwnerId(
					ownerZoneNames, ownerId);
			// 清空该机主的所有用户防区
			deviceDao.deleteOwnerZoneByOwnerIdAndDevIds(ownerId, devIds);

			// 清空该机主被取消关联设备对应的的所有用户监控点
			deviceDao.deleteOwnerMonitorByOwnerIdAndDevIds(ownerId, devIds);

			// 修改指定NVR设备所关联的摄像机的机主
			deviceDao.updateCamrasOwnerByDevIds(devIds, null);

			// 将指定设备变成无主设备
			deviceDao.setOwnerId2NullForDevByOwnerIdAndDevIds(ownerId, devIds);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "删除失败", e.getMessage());
		}
		return ResultUtil.simpleResponse("200", "删除成功");
	}

	@Override
	public JSONObject updateRemoteDevice(JSONObject jsonObject) {

		JSONObject data = jsonObject.getJSONObject("data");

		if (Objects.isNull(data)) {
			return ResultUtil.simpleResponse("500", "修改失败",
					"请求参数格式错误，缺少  data 字段");
		}

		String newRemoteDevId = data.getString("newRemoteDevId");
		String oldRemoteDevId = data.getString("oldRemoteDevId");

		try {
			deviceDao.removeControlType(oldRemoteDevId, "remote");
			deviceDao.setRemoterDevId(newRemoteDevId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "修改失败", e.getMessage());
		}
		return ResultUtil.simpleResponse("200", "修改成功");
	}

	@Override
	public JSONObject updateMasterDevice(JSONObject jsonObject) {

		JSONObject data = jsonObject.getJSONObject("data");

		if (Objects.isNull(data)) {
			return ResultUtil.simpleResponse("500", "修改失败",
					"请求参数格式错误，缺少 data 字段");
		}

		String newMasterDevId = data.getString("newMasterDevId");
		String oldMasterDevId = data.getString("oldMasterDevId");

		try {
			deviceDao.removeControlType(oldMasterDevId, "master");
			deviceDao.setMasterDevId(newMasterDevId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "修改失败", e.getMessage());
		}
		return ResultUtil.simpleResponse("200", "修改成功");
	}
}
