package com.znyw.service;

import java.util.List;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.Area;

public interface AreaService {
	/**
	 * 通过id获得其管辖的地市
	 * 
	 * @param parentAreaId
	 * @return
	 * @throws Exception
	 */
	public JSONArray getAreaByParentAreaId(String parentAreaId)
			throws Exception;

	/**
	 * 通过id获得其所有父节点和子节点
	 * 
	 * @param id
	 * @return
	 * @throws Exception
	 */
	public JSONArray getAreaList(String id) throws Exception;

	/**
	 * @param userId
	 *            当前登录用户编号
	 * @param roleId
	 *            被修改的角色的编号，当不是获取处置区域时，此参数都置空
	 * @param handleOnly
	 *            是否仅获取处置区域
	 * @return
	 * @throws Exception
	 */
	public JSONArray getAreaListByUserId(String userId, String roleId,
			boolean handleOnly, String platformId,boolean needDataNode) throws Exception;

	public JSONArray getAreaListByRoleId(String roleId) throws Exception;

	public JSONObject getAreaById(String id);

	public JSONObject saveArea(JSONObject jso);

	public JSONObject deleteArea(String id) throws Exception;

	public JSONObject updateArea(JSONObject jso);

	public JSONArray getAreaAllById(String id) throws Exception;

	public List<Area> getAllAreas() throws Exception;

	public List<Area> getChilds(Area area) throws Exception;

}
