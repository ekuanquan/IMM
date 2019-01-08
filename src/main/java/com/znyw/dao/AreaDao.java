package com.znyw.dao;

import java.util.List;
import java.util.Map;
import java.util.Set;

import com.alibaba.fastjson.JSONArray;
import com.znyw.pojo.Area;
import com.znyw.pojo.AreaPojo;

/**
 * 获得地区表部分数据dao
 * 
 * @author tangml
 *
 */
public interface AreaDao {
	/**
	 * 指定parentId，获得一个地区集合
	 * 
	 * @param parentAreaId
	 * @return
	 * @throws Exception
	 */
	public List<AreaPojo> getAreaByParentAreaId(String parentAreaId)
			throws Exception;

	/**
	 * 通过id获得一个地区
	 * 
	 * @param id
	 * @return
	 */
	public AreaPojo getAreaById(String id) throws Exception;

	public String getAreaNameById(String areaId) throws Exception;// 获取区域名称

	public Integer saveArea(AreaPojo area) throws Exception;

	public Integer deleteArea(String id) throws Exception;

	public Integer updateArea(AreaPojo area) throws Exception;

	public int queryDevAndUserNum(String id) throws Exception;

	public boolean hasDevsOrUsersInAreaIds(Set<String> areaIds)
			throws Exception;

	public int queryAreaIdNum(String id) throws Exception;

	public int queryAreaNameNum(String id,String parentAreaId) throws Exception;

	public List<Map<String, Object>> getAllAreas() throws Exception;

	public List<Map<String, Object>> getChilds(Area area) throws Exception;

	public List<Map<String, Object>> getAreasWithAreaIdsArray(JSONArray array)
			throws Exception;

	public List<Map<String, Object>> getAreasWithAreaIdsSet(Set<String> areaIds)
			throws Exception;

	public Map<String, Object> findAreaByGbId(String gbId) throws Exception;
}
