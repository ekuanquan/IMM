package com.znyw.service;

import java.util.ArrayList;
import java.util.HashMap;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.ResultPojo;
import com.znyw.pojo.RoleZonePojo;
import com.znyw.pojo.ZonePojo;

public interface ZoneService {
	public ResultPojo getZoneByOwnerId(String id);

	public ResultPojo getZonesByRoleId(String roleId) throws Exception;

	public ResultPojo addRoleZone(RoleZonePojo roleZonePojo);

	public ResultPojo updateRoleZone(RoleZonePojo roleZonePojo);

	public ResultPojo updateDeviceZone(ZonePojo zonePojo);

	public JSONObject getUserZoneByUserId(String userId);

	public JSONObject getMapPicByUserId(String userId);

	public JSONObject getMapPicByOwnerId(String ownerId);

	public JSONObject getMapPicByOwnerIdFromDTPP(String ownerId);

	public ResultPojo getDevZoneId(String devId);

	public ResultPojo updateZoneMapPosition(
			ArrayList<HashMap<String, String>> list);

	public JSONObject deleteMapPic(JSONObject jsonObject);
}
