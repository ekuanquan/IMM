package com.znyw.service;

import com.alibaba.fastjson.JSONObject;

public interface TaskSchedulerService {
	/**
	 * 获得本次需要检查的设备
	 * 
	 * @return
	 * @throws Exception
	 */
	public JSONObject queryNeedCheckedDev() throws Exception;

	/**
	 * 通过id更新此设备的更新时间
	 * 
	 * @param devId
	 * @return
	 * @throws Exception
	 */
	public JSONObject updateTime(String devId) throws Exception;

	/**
	 * 通过用户id获取其布撤防任务信息
	 * 
	 * @param ownerId
	 * @return
	 * @throws Exception
	 */
	public JSONObject queryTaskByOwnerId(String ownerId) throws Exception;

	/**
	 * 通过用户id更新或者插入该设备的任务信息
	 * 
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public JSONObject mergeIntoByOwnerId(JSONObject params) throws Exception;

	/**
	 * 通过设备id获取此设备的布撤防状态
	 * 
	 * @param devId
	 * @return
	 * @throws Exception
	 */
	public JSONObject getStatuesByDevId(String devId) throws Exception;

	/**
	 * 通过设备id检查此设备现在的布防是否"正常布防"(0),"提早布防"(1),"推迟布防"(2)
	 */
	public JSONObject getBfStatusByDevId(String devId) throws Exception;

}
