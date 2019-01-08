package com.znyw.service;

import com.alibaba.fastjson.JSONObject;

public interface IMMForwardingService {
	public JSONObject getEvtSettingService(String userId, String ZoneCHFlag,
			String ZoneCHValue);

	public JSONObject getUrlService(String cameraId);

	public JSONObject getTimeLengthService();

	public JSONObject getIsRecordShootService();
	
	public JSONObject getLinkageService();
	
	public JSONObject getMobileService(String userId,String contId);
}
