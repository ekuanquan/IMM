package com.systemcfg.dao;

import java.util.List;
import java.util.Map;

public interface AssembleCfgDao {

	boolean save(Map<String, Object> namesAndValues);

	boolean add(Map<String, Object> namesAndValues) throws Exception;

	boolean update(Object id, Map<String, Object> namesAndValues) throws Exception;

	boolean delete(Object id) throws Exception;

	List<Map<String, Object>> list() throws Exception;

	List<Map<String, Object>> getSubPlatform() throws Exception;

	List<Map<String, Object>> main() throws Exception;

	List<Map<String, Object>> findById(Object id) throws Exception;

	int countByPlatformId(Object platformId) throws Exception;

	String getLocalPlatformId() throws Exception;

}
