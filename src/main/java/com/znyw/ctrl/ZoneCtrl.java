package com.znyw.ctrl;

import java.util.ArrayList;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.UserInfoDao;
import com.znyw.pojo.ResultPojo;
import com.znyw.pojo.RoleZonePojo;
import com.znyw.service.ZoneService;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultUtil;

@Controller
public class ZoneCtrl {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(ZoneCtrl.class);

	@Resource
	private ZoneService zoneService;
	@Resource
	private UserInfoDao userInfoDao;

	@RequestMapping("/getZoneByOwnerId")
	// 根据 ownerId 获取防区信息
	@ResponseBody
	public ResponseEntity<String> getZoneByUserId(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			JSONObject userPojo = json.getJSONObject("userPojo");
			String ownerId = userPojo.getString("ownerId");
			ResultPojo result = zoneService.getZoneByOwnerId(ownerId);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

	@RequestMapping("/getZoneByUserIdFromDTPP")
	// 根据 userId 获取防区信息,DTPP使用
	@ResponseBody
	public ResponseEntity<String> getZoneByUserIdFromDTPP(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String json = HttpTool.readJSONString(request);
			JSONObject jsonObject = JSONObject.parseObject(json);
			String ownerId = jsonObject.getString("userId");
			ResultPojo result = zoneService.getZoneByOwnerId(ownerId);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

	@RequestMapping("/getZoneByOwnerIdFromDTPP")
	// 根据 ownerId 获取防区信息,DTPP使用
	@ResponseBody
	public ResponseEntity<String> getZoneByOwnerIdFromDTPP(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String json = HttpTool.readJSONString(request);
			JSONObject jsonObject = JSONObject.parseObject(json);
			String ownerId = jsonObject.getString("ownerId");
			ResultPojo result = zoneService.getZoneByOwnerId(ownerId);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

	@RequestMapping("/addUserZone")
	// 添加 修改 用户防区
	@ResponseBody
	public ResponseEntity<String> addUserZone(HttpServletRequest request,
			HttpServletResponse response) {
		String jsonStr = HttpTool.readJSONString(request);
		try {
			JSONObject json = JSONObject.parseObject(jsonStr);
			if (!json.containsKey("dataFrom")
					|| "".equals(json.get("dataFrom"))) {
				json.put("dataFrom", ConfigUtil.getPlatformId());
			}
			JSONObject roleZoneJson = json.getJSONObject("roleZonePojo");
			RoleZonePojo roleZonePojo = JSONObject.toJavaObject(roleZoneJson,
					RoleZonePojo.class);
			ResultPojo result = null;
			String operation = json.getString("operation");
			System.out.println(json.getString("roleZonePojo"));
			if (operation.equals("add")) {
				roleZonePojo.setDataFrom(json.getString("dataFrom"));
				
				result = zoneService.addRoleZone(roleZonePojo);
			} else if (operation.equals("alter")) {
				
				result = zoneService.updateRoleZone(roleZonePojo);
			}
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

	@RequestMapping("/getUserZoneByUserId")
	// 综合查询----获取关联设备信息 //只包含有 x y 的 用户防区
	@ResponseBody
	public JSONObject getUserZoneByUserId(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			JSONObject userPojo = jsonParam.getJSONObject("userPojo");
			String userId = userPojo.getString("userId");
			JSONObject JOSN = zoneService.getUserZoneByUserId(userId);
			return JOSN;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "异常", e.getMessage());
		}
	}

	@RequestMapping("/getMapPicByUserId")
	// 根据userId 获取防区图 接处警使用
	@ResponseBody
	public JSONObject getMapPicByUserId(HttpServletRequest request,
			HttpServletResponse response, @ModelAttribute("json") String json) {
		try {
			JSONObject jsonParam = JSONObject.parseObject(json);
			JSONObject userPojo = jsonParam.getJSONObject("userPojo");
			String userId = userPojo.getString("userId");
			JSONObject result = zoneService.getMapPicByUserId(userId);
			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@RequestMapping("/getMapPicByUserIdImm")
	// 根据userId 获取防区图 管理平台使用
	@ResponseBody
	public ResponseEntity<String> getMapPicByUserIdImm(
			HttpServletRequest request, HttpServletResponse response) {
		ResultPojo resultPojo = new ResultPojo();
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			JSONObject userPojo = json.getJSONObject("userPojo");
			String userId = userPojo.getString("userId");
			JSONObject resultJson = zoneService.getMapPicByUserId(userId);
			JSONObject result = resultJson.getJSONObject("result");
			String code = result.getString("code");
			JSONObject MappicPojo = new JSONObject();
			if (code.equals("0")) {
				MappicPojo = resultJson.getJSONObject("MappicPojo");
				resultPojo.setResult("0", "success");
				resultPojo.setPojo("MappicPojo", MappicPojo);
			} else {
				resultPojo.setResult("1", "fail");
			}
			return resultPojo.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

	@RequestMapping("/getMapPicByRoleId")
	// 根据 roleId 获取防区图 管理平台使用
	@ResponseBody
	public JSONObject getMapPicByOwnerId(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			JSONObject userPojo = json.getJSONObject("userPojo");
			String ownerId = userPojo.getString("ownerId");
			return zoneService.getMapPicByOwnerId(ownerId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@RequestMapping("/getMapPicByUserIdFromDTPP")
	// 根据 userId 获取防区图 ,DTPP使用
	@ResponseBody
	public JSONObject getMapPicByUserIdFromDTPP(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String json = HttpTool.readJSONString(request);
			JSONObject jsonObject = JSONObject.parseObject(json);
			String ownerId = jsonObject.getString("userId");
			return zoneService.getMapPicByOwnerIdFromDTPP(ownerId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@RequestMapping("/getMapPicByOwnerIdFromDTPP")
	// 根据 ownerId 获取防区图 ,DTPP使用
	@ResponseBody
	public JSONObject getMapPicByOwnerIdFromDTPP(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String json = HttpTool.readJSONString(request);
			JSONObject jsonObject = JSONObject.parseObject(json);
			String ownerId = jsonObject.getString("ownerId");
			return zoneService.getMapPicByOwnerIdFromDTPP(ownerId);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数异常", e.getMessage());
		}
	}

	@RequestMapping("/getZoneByRoleId")
	// 添加、修改用户防区获取设备防区
	@ResponseBody
	public ResponseEntity<String> getZoneByRoleId(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String devId = json.getString("devId");
			ResultPojo result = zoneService.getDevZoneId(devId);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

	@RequestMapping("/updateZoneMapPosition")
	// 修改用户防区图位置
	@ResponseBody
	public ResponseEntity<String> updateZoneMapPosition(
			HttpServletRequest request, HttpServletResponse response) {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);

			JSONArray submitZonePojoList = json.getJSONArray("submitZonePojo");
			HashMap<String, String> map;
			ArrayList<HashMap<String, String>> list = new ArrayList<HashMap<String, String>>();
			for (int i = 0; i < submitZonePojoList.size(); i++) {
				JSONObject maptemp = (JSONObject) submitZonePojoList.get(i);
				String roleId = maptemp.getString("ownerId");
				String devZoneId = maptemp.getString("devZoneId");
				String ownerZoneName = maptemp.getString("ownerZoneName");
				String mapId = maptemp.getString("mapId");
				String x = maptemp.getString("x");
				String y = maptemp.getString("y");
				map = new HashMap<String, String>();
				map.put("ownerId", roleId);
				map.put("devZoneId", devZoneId);
				map.put("ownerZoneName", ownerZoneName);
				map.put("mapId", mapId);
				map.put("x", x);
				map.put("y", y);
				list.add(map);
			}
			ResultPojo result = zoneService.updateZoneMapPosition(list);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

	/**
	 * 删除防区图
	 * 
	 * @param request
	 * @param response
	 * @param json
	 * @return
	 */
	@RequestMapping("/deleteMapPic")
	@ResponseBody
	public JSONObject deleteMapPic(HttpServletRequest request,
			HttpServletResponse response) {

		String jsonStr = HttpTool.readJSONString(request);
		try {
			JSONObject jsonParam = JSONObject.parseObject(jsonStr);
			JSONObject result = zoneService.deleteMapPic(jsonParam);
			return result;
		} catch (Exception e) {
			LOGGER.info(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误", e.getMessage());
		}
	}
}