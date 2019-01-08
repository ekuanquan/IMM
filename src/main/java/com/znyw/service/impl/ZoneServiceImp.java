package com.znyw.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.ZoneDao;
import com.znyw.dao.impl.UserDaoImp;
import com.znyw.pojo.MappicPojo;
import com.znyw.pojo.ResultPojo;
import com.znyw.pojo.RoleZonePojo;
import com.znyw.pojo.UserZonePojo;
import com.znyw.pojo.ZonePojo;
import com.znyw.pojo.devZonePojo;
import com.znyw.service.ZoneService;
import com.znyw.tool.FileTool;
import com.znyw.tool.Objects;
import com.znyw.tool.PropertyConfigUtil;
import com.znyw.tool.ResultUtil;

@Service("ZoneService")
public class ZoneServiceImp implements ZoneService {
	private Logger LOGGER = LoggerFactory.getLogger(getClass());
	@Resource
	ZoneDao zoneDao;
	@Resource
	// 2017-08-16 调整字段后新增
	UserDaoImp userDaoImp;

	private static PropertyConfigUtil propertyConfigUtil = PropertyConfigUtil
			.getInstance("properties/config.properties");

	@Override
	public ResultPojo getZoneByOwnerId(String ownerId) {
		ResultPojo returnVal = new ResultPojo();
		List<?> list = null;
		try {
			list = userDaoImp.getUserzoneByOwnerId(ownerId, null);
			returnVal.setResult("0", "查询成功");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			returnVal.setResult("1", "查询失败", e.getMessage());
		}
		returnVal.setPojo("zonePojo", list);
		return returnVal;
	}

	@Override
	public ResultPojo getZonesByRoleId(String roleId) throws Exception {
		ResultPojo returnVal = new ResultPojo();
		List<Map<String, Object>> list = userDaoImp.getZonesByRoleId(roleId);

		if (list == null) {
			returnVal.setResult("1", "查询失败");
		} else {
			returnVal.setResult("0", "查询成功");
		}
		returnVal.setPojo("zonePojo", list);
		return returnVal;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public JSONObject getUserZoneByUserId(String userId) {
		JSONObject json = new JSONObject();// 结果
		JSONObject result = new JSONObject();// 结果
		List jsonList = new ArrayList<JSONObject>();
		List<UserZonePojo> list;
		try {
			list = zoneDao.findUserZoneByUserId(userId);
			for (int i = 0; i < list.size(); i++) {
				jsonList.add(JSONObject.toJSON(list.get(i)));
			}
			LOGGER.info("list: ");
			result.put("code", "0");
			result.put("message", "查询成功");
			json.put("result", result);
			json.put("userZonePojo", jsonList);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result.put("code", "1");
			result.put("message", "查询失败");
			result.put("detail", e.getMessage());
			json.put("result", result);
		}
		return json;
	}

	@Override
	public JSONObject getMapPicByUserId(String userId) {
		JSONObject json = new JSONObject();// 结果
		JSONObject result = new JSONObject();// 结果
		MappicPojo pojo = null;
		try {
			pojo = zoneDao.findMapPicByUserId(userId);
			result.put("code", "0");
			result.put("message", "查询成功");
			json.put("result", result);
			json.put("MappicPojo", pojo);
		} catch (Exception e) {
			result.put("code", "1");
			result.put("message", "查询失败");
			result.put("detail", e.getMessage());
			json.put("result", result);
		}
		return json;
	}

	@Override
	public ResultPojo addRoleZone(RoleZonePojo roleZonePojo) {
		ResultPojo returnVal = new ResultPojo();// 结果
		UserZonePojo userZonePojo = null;
		UserZonePojo userZonePojo2 = null;
		try {
			userZonePojo = zoneDao.findUserZoneByRoleIdDevIdDevZoneId(
					roleZonePojo.getOwnerId(), roleZonePojo.getDevId(),
					roleZonePojo.getDevZoneId());
			userZonePojo2 = zoneDao.findUserZoneByRoleIdRoleZoneName(
					roleZonePojo.getOwnerId(), roleZonePojo.getOwnerZoneName());
		} catch (Exception e) {
			returnVal.setResult("1", "数据查询失败", e.getMessage());
		}

		try {
			if (null != userZonePojo || null != userZonePojo2) {
				if (null != userZonePojo2) {
					returnVal.setResult("2", "此用户防区编号冲突");
				} else {
					returnVal.setResult("2", "此用户防区已存在");
				}
			} else {
				boolean result = zoneDao.insertRoleZoneInfo(roleZonePojo);
				if (result == true) {
					returnVal.setResult("0", "添加成功");
				} else {
					throw new RuntimeException("数据更新失败");
				}
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			returnVal.setResult("1", "添加失败", e.getMessage());
		}
		return returnVal;
	}

	@Override
	public ResultPojo updateDeviceZone(ZonePojo zonePojo) {
		return null;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public ResultPojo getDevZoneId(String devId) {
		List<devZonePojo> list = null;
		ResultPojo returnVal = new ResultPojo();// 结果
		List jsonList = new ArrayList<JSONObject>();
		try {
			list = zoneDao.findDevZone(devId);
			for (int i = 0; i < list.size(); i++) {
				jsonList.add(list.get(i));
			}
			returnVal.setResult("0", "查询成功");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			returnVal.setResult("1", "查询失败", e.getMessage());
		}
		returnVal.setPojo("dropDownPojo", jsonList);
		return returnVal;
	}

	@Override
	public ResultPojo updateRoleZone(RoleZonePojo roleZonePojo) {
		ResultPojo returnVal = new ResultPojo();
		UserZonePojo userZonePojo = null;
		try {
			userZonePojo = zoneDao.findUserZoneByRoleIdDevIdDevZoneId(
					roleZonePojo.getOwnerId(), roleZonePojo.getDevId(),
					roleZonePojo.getDevZoneId());

		} catch (Exception e) {
			returnVal.setResult("1", "数据查询失败");
			return returnVal;
		}
		try {
			if (null != userZonePojo) {
				boolean result = zoneDao.updateRoleZone(roleZonePojo);
				if (result == true) {
					returnVal.setResult("0", "修改成功");
				} else {
					returnVal.setResult("1", "修改失败");
				}
			} else {
				userZonePojo = zoneDao.findUserZoneByRoleIdRoleZoneName(roleZonePojo.getOwnerId(), roleZonePojo.getOwnerZoneName());
				if (null != userZonePojo) {
					boolean result = zoneDao.updateRoleZone(roleZonePojo);
					if (result == true) {
						returnVal.setResult("0", "修改成功");
					} else {
						returnVal.setResult("1", "修改失败");
					}
				} else {
					returnVal.setResult("2", "此用户防区不存在");
					LOGGER.info("此用户防区不存在  {}", roleZonePojo.toString());
				}
			}

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			returnVal.setResult("1", "修改失败");
		}

		return returnVal;
	}

	@Override
	public ResultPojo updateZoneMapPosition(
			ArrayList<HashMap<String, String>> list) {
		ResultPojo resultPojo = new ResultPojo();
		try {
			int resultCount = zoneDao.updateZoneMapPosition(list);
			if (resultCount > 0) {
				resultPojo.setResult("0", "success");
				resultPojo.setPojo("resultCount", resultCount);
			} else {
				resultPojo.setResult("1", "fail");
				resultPojo.setPojo("resultCount", resultCount);
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			resultPojo.setResult("1", e.getMessage());
		}
		return resultPojo;
	}

	@Override
	public JSONObject getMapPicByOwnerId(String ownerId) {
		JSONObject json = new JSONObject();
		JSONObject result = new JSONObject();
		List<MappicPojo> pojo = null;
		try {
			pojo = zoneDao.findMapPicByOwnerId(ownerId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}
		if (pojo == null) {
			result.put("code", "1");
			result.put("message", "查询失败");
			json.put("result", result);
		} else {
			result.put("code", "0");
			result.put("message", "查询成功");
			json.put("result", result);
			json.put("MappicPojo", pojo);
		}
		return json;
	}

	@Override
	public JSONObject getMapPicByOwnerIdFromDTPP(String ownerId) {
		JSONObject json = new JSONObject();
		JSONObject result = new JSONObject();
		List<Map<String, Object>> lists = null;
		try {
			lists = zoneDao.getMapPicByOwnerIdFromDTPP(ownerId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}
		result.put("code", "0");
		result.put("message", "查询成功");
		json.put("result", result);
		json.put("mappics", lists);

		return json;
	}

	@Override
	public JSONObject deleteMapPic(JSONObject jsonObject) {
		String mapId = jsonObject.getString("mapId");

		if (Objects.isNullString(mapId)) {
			return ResultUtil.simpleResponse("500", "缺少必要字段");
		}

		try {
			String imagePath = zoneDao.findMappicByMapId(mapId);
			String imageSrvUrl = propertyConfigUtil.getValue("imageSrv.url");
			String fileName = imagePath.replace(imageSrvUrl, "");
			FileTool.delFile(fileName); // 删除对应的文件
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}

		boolean result = zoneDao.deleteMapPic(mapId);
		zoneDao.deleteOwnerZoneByMapId(mapId);

		if (result) {
			return ResultUtil.simpleResponse("200", "删除成功");
		} else {
			return ResultUtil.simpleResponse("500", "删除失败，图片不存在");
		}
	}
}