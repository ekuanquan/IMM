package com.znyw.dao;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;

public interface IMMForwardingDao {
	public JSONObject getEvtSettingDao(String userId, String ZoneCHFlag,
			String ZoneCHValue);

	public Map<String, Object> getUrlDao(String cameraId) throws Exception;

	public String getTimeLengthDao();

	public List<Map<String, Object>> getIsRecordShootDao();

	public List<Map<String, Object>> getLinkageDao();

	public String getMobileDao(String userId, String contId);
}
