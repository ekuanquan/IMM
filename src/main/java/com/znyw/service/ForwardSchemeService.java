package com.znyw.service;

import java.util.List;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.WorkstationPojo;

public interface ForwardSchemeService {

	public JSONObject addForwardScheme(JSONObject json)throws Exception;

	public JSONObject deleteForwardScheme(String devId, String stationNum)throws Exception;
	/**
	 * 转发工作列表
	 * @return
	 * @throws Exception
	 */
	public JSONObject getForwardSchemeList()throws Exception;
	/**
	 * 根据设备ID获取转发工作列表
	 * @return
	 * @throws Exception
	 */
	public JSONObject getForwardSchemeListById(String devId)throws Exception;
	

}
