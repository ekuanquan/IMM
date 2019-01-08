package com.znyw.dao;

import java.util.List;

import com.alibaba.fastjson.JSONArray;
import com.znyw.pojo.ImmSubSysOfPojo;

public interface ImmSubSysOfDao {
	/**
	 * 根据设备id获取设备子系统列表
	 * @param devId
	 * @return
	 * @throws Exception
	 */
	public List<ImmSubSysOfPojo> getSubSysListByDevId(String devId) throws Exception;
	
	/**
	 * 保存一个设备子系统
	 * @param pojo
	 * @throws Exception
	 */
	public void saveSubSys(ImmSubSysOfPojo pojo) throws Exception;
	
	/**
	 * 更新一个设备子系统
	 * @param pojo
	 * @throws Exception
	 */
	public void updateSubSys(ImmSubSysOfPojo pojo) throws Exception;
	
	/**
	 * 删除一个设备子系统
	 * @param devId
	 * @param subSysId
	 * @throws Exception
	 */
	public void deleteSubSys(String devId, String subSysId) throws Exception;
	
	/**
	 * 批量删除设备子系统
	 * @param devId
	 * @param subSysId
	 * @throws Exception
	 */
	public boolean deleteSubSysByIds(String devId, JSONArray subSysId) throws Exception;

	/**
	 * 查找一个设备子系统
	 * 
	 * @param devId
	 * @param subSysId
	 * @return
	 * @throws Exception
	 */
	public ImmSubSysOfPojo getSubSysById(String devId,String subSysId) throws Exception;
}
