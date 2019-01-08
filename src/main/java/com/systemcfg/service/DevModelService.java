package com.systemcfg.service;

import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.Pagepojo;

public interface DevModelService {

	JSONObject addDevModel(Map<String, Object> namesAndValues);

	JSONObject updateDevmodel(Map<String, Object> namesAndValues);

	JSONObject deleteDevModel(Object devModelId);

	JSONObject findDevModel(JSONObject fuzzy, Pagepojo pagepojo);

	JSONObject findByKey(JSONObject jsonObejct);

}
