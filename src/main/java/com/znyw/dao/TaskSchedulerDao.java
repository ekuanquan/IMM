package com.znyw.dao;

import java.util.List;
import java.util.Map;

import com.znyw.pojo.BCFPlanPojo;

public interface TaskSchedulerDao {
	/**
	 * 获得本次需要检查的设备,需要此设备:<br>
	 * 1.服务结束时间(overDateTime)大于当前时间<br>
	 * 2.是否生效(bFsymbolN)为生效(1)<br>
	 * 3.布防时间段已过(bFOvertimeN小于now)<br>
	 * 4.上次检查的时间为空(bFLastCheckDateN is null)或者不在今天(bFLastCheckDateN 小于nowDate)
	 * 
	 * @return
	 * @throws Exception
	 */
	public List<String> queryNeedCheckedDev() throws Exception;

	/**
	 * 通过id更新此设备的更新时间
	 * 
	 * @param devId
	 * @throws Exception
	 */
	public void updateTime(String devId) throws Exception;

	/**
	 * 通过用户id获取其布撤防任务信息
	 * 
	 * @param devId
	 * @return
	 * @throws Exception
	 */
	public BCFPlanPojo queryTaskByOwnerId(String ownerId) throws Exception;

	/**
	 * 通过用户id更新或者插入该设备的任务信息,Mysql版本
	 * 
	 * @param bCFPlanPojo
	 * @throws Exception
	 */
	public void mergeIntoMysql(BCFPlanPojo bCFPlanPojo) throws Exception;

	/**
	 * 通过设备id获取此设备的布撤防状态
	 * 
	 * @param devId
	 * @return
	 * @throws Exception
	 */
	public Integer getStatuesByDevId(String devId) throws Exception;

	/**
	 * 通过设备id获取此设备当日的布防开始时间和结束时间
	 * 
	 * @param devId
	 * @return
	 * @throws Exception
	 */
	public Map<String, String> getBfTimeByDevId(String devId) throws Exception;
}
