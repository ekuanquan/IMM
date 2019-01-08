package com.device.service;

import com.alibaba.fastjson.JSONObject;

public interface IRDAService {

	public JSONObject getDevUserInfoByUidRzoneCid(JSONObject jsonParam) ;
	
	public JSONObject getCameraListByUid(JSONObject jsonParam) ;

}