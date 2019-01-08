package com.znyw.dao;


import java.util.List;

import com.znyw.pojo.ForwardSchemePojo;
import com.znyw.pojo.WorkstationPojo;

public interface ForwardSchemeDao {
	/**
	 * 添加转发工作方案
	 * @return
	 * @throws Exception
	 */
	public void addForwardScheme(ForwardSchemePojo pojo)throws Exception;
	/**
	 * 删除一个转发工作方案
	 * @return
	 * @throws Exception
	 */
	public void deleteForwardScheme(String devId, String stationNum) throws Exception;
	/**
	 * 根据工作站编号删除工作方案
	 * @return
	 * @throws Exception
	 */
	public void deleteFSByStationNum(String stationNum) throws Exception;
	/**
	 * 列表
	 * @return
	 * @throws Exception
	 */
	public List<ForwardSchemePojo> getForwardSchemeList()throws Exception;
	/**
	 * 根据设备ID获取转发列表
	 * @return
	 * @throws Exception
	 */
	public List<ForwardSchemePojo> getForwardSchemeListById(String devId)throws Exception;


}
