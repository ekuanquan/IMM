package com.systemcfg.service;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;

public interface AssembleCfgService {

	@Deprecated
	JSONObject save(Map<String, Object> namesAndValues);

	JSONObject add(Map<String, Object> namesAndValues);

	JSONObject update(Map<String, Object> namesAndValues) throws Exception;

	JSONObject delete(List<String> id);

	JSONObject list();

	JSONObject getSubPlatform();

	JSONObject main();

	JSONObject findById(Object id);

	JSONObject getLocalPlatformId();

}
