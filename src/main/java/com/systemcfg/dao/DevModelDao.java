package com.systemcfg.dao;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.Pagepojo;

public interface DevModelDao {

	boolean hasRecord(Object devModelId) throws Exception;

	boolean addDevModel(Map<String, Object> namesAndValues) throws Exception;

	boolean updateDevmodel(Object devModelId, Map<String, Object> namesAndValues) throws Exception;

	boolean deleteDevModel(Object devModelId) throws Exception;

	List<Map<String, Object>> find(JSONObject jsonObject, Pagepojo pagepojo) throws Exception;

	List<Map<String, Object>> findByKey(JSONObject jsonObject) throws Exception;

	int count(JSONObject jsonObject) throws Exception;
}
