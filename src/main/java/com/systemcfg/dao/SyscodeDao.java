package com.systemcfg.dao;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.Pagepojo;

public interface SyscodeDao {

	boolean hasRecord(Object syscodeId) throws Exception;

	boolean addSyscode(Map<String, Object> namesAndValues) throws Exception;

	boolean updateSyscode(Object syscodeId, Map<String, Object> namesAndValues) throws Exception;

	boolean deleteSyscode(Object syscodeId) throws Exception;

	List<Map<String, Object>> find(JSONObject jsonObject, Pagepojo pagepojo) throws Exception;

	List<Map<String, Object>> findByKey(JSONObject jsonObject) throws Exception;

	int count(JSONObject jsonObject) throws Exception;
	
	List<Map<String, Object>> getAllEventClass() throws Exception;
	
	List<Map<String, Object>> findSysCodeByEvenClassForTree(String evtcls) throws Exception;

}
