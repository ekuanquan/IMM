package com.znyw.dao;

import java.util.List;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.WorkstationPojo;

public interface WorkstationDao {
	
	/**
	 * 工作站列表
	 * @return
	 * @throws Exception
	 */
	public List<WorkstationPojo> getWorkstationList()throws Exception;

	
	/**
	 * 保存一个工作站
	 * @param pojo
	 * @throws Exception
	 */
	public JSONObject saveWorkstation(WorkstationPojo pojo) throws Exception;
	
	/**
	 * 更新一个工作站
	 * @param pojo
	 * @throws Exception
	 */
	public void updateWorkstation(WorkstationPojo pojo) throws Exception;
	
	/**
	 * 删除一个工作站
	 * @param stationNum
	 * @throws Exception
	 */
	public void deleteWorkstationById(String stationNum) throws Exception;
	
	/**
	 * 查找一个工作站
	 * @param stationNum
	 * @return
	 * @throws Exception
	 */
	public WorkstationPojo getWorkstationById(String stationNum) throws Exception;
}
