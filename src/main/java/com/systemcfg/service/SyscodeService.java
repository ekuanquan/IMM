package com.systemcfg.service;

import java.util.Map;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.Pagepojo;

public interface SyscodeService {

	JSONObject addSyscode(Map<String, Object> namesAndValues);

	JSONObject updateSyscode(Map<String, Object> namesAndValues);

	JSONObject deleteSyscode(Object codeId);

	JSONObject findSyscode(JSONObject fuzzy, Pagepojo pagepojo);

	JSONObject findByKey(JSONObject jsonObejct);
	
	JSONArray tree();

}
