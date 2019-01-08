package com.znyw.service;

import com.alibaba.fastjson.JSONObject;

public interface IdInfoService {
	/**
	 * 获取最新可用的编号
	 * @return
	 * @throws Exception
	 */
	public JSONObject queryLatestId() throws Exception;
	
	/**
	 * 右模糊查询可用的编号
	 * @param value
	 * @return
	 * @throws Exception
	 */
	public JSONObject queryIdByLike(String value,String type) throws Exception;
}
