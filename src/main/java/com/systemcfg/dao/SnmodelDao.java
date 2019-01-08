package com.systemcfg.dao;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.Pagepojo;

public interface SnmodelDao {

	boolean hasRecord(Object snModelId) throws Exception;

	boolean addDevModel(Map<String, Object> namesAndValues) throws Exception;

	boolean updateDevmodel(Object snModelId, Map<String, Object> namesAndValues) throws Exception;

	boolean deleteDevModel(Object snModelId) throws Exception;

	List<Map<String, Object>> find(JSONObject jsonObject, Pagepojo pagepojo) throws Exception;

	List<Map<String, Object>> findByKey(JSONObject jsonObject) throws Exception;

	int count(JSONObject jsonObject) throws Exception;

}
