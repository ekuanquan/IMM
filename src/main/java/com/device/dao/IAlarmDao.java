package com.device.dao;

import java.util.Map;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public interface IAlarmDao {

	public JSONArray queryAlarmCaseList() throws Exception;

	public JSONArray queryDealwayListByUid(String userId) throws Exception;

	boolean hasDealway(String userId, int dealWayId);

	boolean hasDealWayWithDealWayId(int dealWayId);

	/**
	 * 添加处警预案
	 * 
	 * @param namesAndValues
	 * @return
	 * @throws Exception
	 */

	JSONObject addDealWay(Map<String, Object> namesAndValues) throws Exception;

	/**
	 * 更新处警预案
	 * 
	 * @param userId
	 * @param dealWayId
	 * @param namesAndValues
	 * @return
	 * @throws Exception
	 */
	JSONObject updateDealWayByUserIdAndDealWayId(String userId, int dealWayId, Map<String, Object> namesAndValues)
			throws Exception;

	/**
	 * 更新处警预案,默认条件是 [userId] 和 [dealWayId]
	 * 
	 * @throws Exception
	 * 
	 */
	JSONObject updateDealWay(Map<String, Object> namesAndValues) throws Exception;

	/**
	 * 删除处警预案
	 * 
	 * @param userId
	 * @param dealWayId
	 * @return
	 * @throws Exception
	 */
	int deleteDealWayByUserIdAndDealWayId(String userId, int dealWayId) throws Exception;
	/**
	 * 批量删除处警预案
	 * 
	 * @param userId
	 * @param dealWayId
	 * @return
	 * @throws Exception
	 */
	int deleteDealWayByUserIdAndDealWayId(String userId, JSONArray dealWayIds) throws Exception;
}