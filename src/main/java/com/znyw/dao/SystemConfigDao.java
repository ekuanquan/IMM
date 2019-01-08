package com.znyw.dao;

import java.util.List;

import com.znyw.pojo.SysConfigUnitPojo;

/**
 * 系统配置相关操作
 */
public interface SystemConfigDao {
	public List<SysConfigUnitPojo> getSystemConfig();
	public List<String> getListFromSystemConfig(String dataName);
	public int delSystemConfig(String dataName,String values);

	public int delAllSystemConfig(String dataName);
	public int addSystemConfig(String dataName,String value);
	public int updateSystemConfig(String dataName,String value);

}
