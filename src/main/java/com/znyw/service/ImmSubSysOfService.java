package com.znyw.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public interface ImmSubSysOfService {
	/**
	 * 根据设备id获取设备子系统列表
	 * @param devId
	 * @return
	 * @throws Exception
	 */
	public JSONObject getSubSysListByDevId(String devId);
	
	/**
	 * 添加一个设备子系统
	 * @param parames
	 * @return
	 * @throws Exception
	 */
	public JSONObject saveSubSys(JSONObject parames);
	
	/**
	 * 更新一个设备子系统
	 * @param parames
	 * @return
	 * @throws Exception
	 */
	public JSONObject updateSubSys(JSONObject parames);
	
	/**
	 *  删除一个设备子系统
	 * @param devId
	 * @param subSysId
	 * @return
	 * @throws Exception
	 */
	public JSONObject deleteSubSys(String devId, String subSysId);
	/**
	 *  批量删除设备子系统
	 * @param devId
	 * @param subSysId
	 * @return
	 * @throws Exception
	 */
	public JSONObject deleteSubSysByIds(String devId, JSONArray subSysIds);
	
	/**
	 * 查找一个设备子系统
	 * @param devId
	 * @param subSysId
	 * @return
	 * @throws Exception
	 */
	public JSONObject getSubSysById(String devId, String subSysId);
}
