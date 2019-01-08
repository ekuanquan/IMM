package com.device.service;

import java.util.Map;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public interface IAlarmService {

	public JSONObject queryAlarmCaseList();

	public JSONObject queryDealwayListByUid(String userId);

	/**
	 * 添加处警预案，验证用户ID和序号的唯一性
	 * 
	 * @param namesAndValues
	 *            json对象的 Map 表示
	 * @return
	 */
	JSONObject addDealWay(Map<String, Object> namesAndValues);

	/**
	 * 指定用户ID和序号更新处警预案
	 * 
	 * @return JSONObject
	 */
	JSONObject updateDealWayByUserIdAndDealWayId(String userId, int dealWayId, Map<String, Object> namesAndValues);

	/**
	 * 更新处警预案，默认条件 [userId] 和 [dealWayId]
	 * 
	 * @return JSONObject
	 */
	JSONObject updateDealWay(Map<String, Object> namesAndValues);

	/**
	 * 指定用户ID和序号删除处警预案
	 * 
	 * @param userId
	 * @param dealWayIdString
	 *            dealWayId 的字符串表示
	 * @return
	 */
	JSONObject deleteDealWayByUserIdAndDealWayId(String userId, JSONArray dealWayIdString);

}