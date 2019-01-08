package com.znyw.dao;

import java.util.List;

import com.znyw.pojo.IdInfoPojo;

public interface IdInfoDao  {
	/**
	 * 获取最新可用的编号
	 * @return
	 * @throws Exception
	 */
	public List<IdInfoPojo> queryLatestId() throws Exception;
	
	/***
	 * 校验id是否可用
	 * @param id
	 * @return
	 */
	public boolean checkUsed(String id);
	
	/**
	 * 右模糊查询可用的编号
	 * @param value
	 * @return
	 * @throws Exception
	 */
	public List<String> queryIdByLike(String value,String type) throws Exception;
}
