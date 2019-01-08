package com.znyw.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.DeleteDevice;
import com.znyw.dao.DeviceDao;
import com.znyw.service.UserService;
import com.znyw.tool.ResultJson;
import com.znyw.tool.ResultUtil;

@Service
public class DeleteDeviceService {
	private static final org.slf4j.Logger LOGGER = LoggerFactory
			.getLogger(DeleteDeviceService.class);

	@Resource
	private DeleteDevice deletedevice;
	@Resource
	private UserService userService;
	@Resource
	private DeviceDao deviceDao;

	public JSONObject deleteZoneService(String devId) {
		try {
			deletedevice.DeleteZone(devId);
			return ResultJson.deleteSuccess();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "删除失败", e.getMessage());
		}
	}

	public JSONObject deleteSpayService(String devId, String devZoneId) {
		try {
			deletedevice.DeleteSpay(devId, devZoneId);
			try {
				deviceDao.deleteOwnerZoneByDevIdAndDevZoneIds(devId,
						new String[] { devZoneId });
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "删除失败", e.getMessage());
			}
			return ResultUtil.simpleResponse("200", "删除成功");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "删除失败", e.getMessage());
		}
	}

	/*************************************************
	 * 删除联系人信息
	 * 
	 * @param userId
	 *            用户编号
	 * @param contId
	 *            联系人编号
	 * @return
	 */
	public JSONObject deleteContact(String userId, JSONArray contId) {

		try {
			int i = userService.DeleteContact(userId, contId);

			if (i > 0) {
				return ResultJson.deleteSuccess();
			} else {
				return ResultJson.deleteFailier();
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "删除失败", e.getMessage());
		}
	}

	/***********************************************************
	 * 删除用户防区
	 * 
	 * @param roleId
	 *            角色编号
	 * @param roleZoneName
	 *            用户防区
	 * @return
	 */
	public JSONObject deleteUserZone(String ownerId, String ownerZoneName) {
		int i = 0;
		try {
			i = userService.DeleteUserZone(ownerId, ownerZoneName);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "删除失败", e.getMessage());
		}
		if (i >= 0) {
			return ResultJson.deleteSuccess();
		} else {
			return ResultJson.deleteFailier();
		}
	}

	/***********************************************************
	 * 批量删除用户防区
	 * 
	 * @param ownerId
	 *            用户编号
	 * @param ownerZoneName
	 *            用户防区
	 * @return
	 */
	public JSONObject deleteUserZoneBatch(String ownerId,
			List<String> ownerZoneName) {
		int i = 0;
		try {
			i = userService.deleteUserZoneBatch(ownerId, ownerZoneName);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "删除失败", e.getMessage());
		}
		if (i >= 0) {
			return ResultJson.deleteSuccess();
		} else {
			return ResultJson.deleteFailier();
		}
	}

	public JSONObject deleteSpayBatchService(String devId,
			List<String> devZoneIds) {
		int i = 0;
		try {
			i = deletedevice.DeleteBatchSpay(devId, devZoneIds);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "删除失败", e.getMessage());
		}
		if (i >= 0) {
			return ResultJson.deleteSuccess();
		} else {
			return ResultJson.deleteFailier();
		}
	}

	public JSONObject deleteZoneBatchService(List<String> devIds) {
		int i = 0;
		try {
			i = deletedevice.DeleteZoneBatch(devIds);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "删除失败", e.getMessage());
		}
		if (i >= 0) {
			return ResultJson.deleteSuccess();
		} else {
			return ResultJson.deleteFailier();
		}
	}
}
