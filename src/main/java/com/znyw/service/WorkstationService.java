package com.znyw.service;

import com.alibaba.fastjson.JSONObject;

public interface WorkstationService {
	/**
	 * 工作站列表
	 * @return
	 * @throws Exception
	 */
	public JSONObject getWorkstationList() throws Exception;
	
	/**
	 * 添加一个工作站
	 * @param parames
	 * @return
	 * @throws Exception
	 */
	public JSONObject saveWorkstation(JSONObject parames) throws Exception;
	
	/**
	 * 更新一个工作站
	 * @param parames
	 * @return
	 * @throws Exception
	 */
	public JSONObject updateWorkstation(JSONObject parames) throws Exception;
	
	/**
	 *  删除一个设备子系统
	 * @param stationNum
	 * @throws Exception
	 */
	public JSONObject deleteWorkstationById(String stationNum) throws Exception;
	
	/**
	 * 查找一个设备子系统
	 * @param stationNum
	 * @return
	 * @throws Exception
	 */
	public JSONObject getWorkstationById(String stationNum) throws Exception;

	/**
	 * 用户资料批量上传
	 * @return
	 * @throws Exception
	 */
	public JSONObject userDataTrans(JSONObject json)throws Exception;
}
