package com.znyw.dao;

public interface SMSDao {
	/**
	 * 通过设备id获取设备机主的电话
	 * @param DevId
	 * @return
	 * @throws Exception
	 */
	public String getPhoneByDevId(String devId) throws Exception;
}
