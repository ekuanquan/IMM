package com.znyw.service;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.ResultPojo;

public interface VideoService {
	
	public JSONObject getNVRVideoUrl(String cameraIdList);
	
	public JSONObject getCameraIdList(String userId, String zoneCHValue,String zoneCHFlag);
}
