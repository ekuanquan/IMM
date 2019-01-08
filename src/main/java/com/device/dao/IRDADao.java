package com.device.dao;


import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public interface IRDADao {

	public JSONObject getDevUserInfoByUidRzoneCid(String userId, String roleZoneName, String codeId) throws Exception;
	
	public JSONArray getCameraListByUid(String userId) throws Exception;
	
}
