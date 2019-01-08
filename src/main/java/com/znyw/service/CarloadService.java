package com.znyw.service;

import com.alibaba.fastjson.JSONObject;

public interface CarloadService {

	JSONObject queryTerGroup();

	JSONObject QueryCamerInfoSer(JSONObject jsonParam);

	JSONObject QueryCarloadInfoSer(JSONObject jsonParam);
	
	JSONObject AddCarloadInfoSer(JSONObject jsonParam);

	JSONObject DeelCarloadInfoSer(JSONObject jsonParam);

	JSONObject QueryDevIdOrderByRoleIdSer(JSONObject jsonParam);

	JSONObject UpdateCarloadInfoSer(JSONObject jsonParam);

	JSONObject QueryTertypeSer();

	JSONObject QueryPlateColorSer();

	JSONObject QueryCarloadSer(JSONObject jsonParam);

	JSONObject QueryCarloadListSer(JSONObject jsonParam);

	JSONObject QueryCarGroupSer(JSONObject jsonParam);

	JSONObject QueryCarloadListSerAll(JSONObject jsonParam, String userId);


}
