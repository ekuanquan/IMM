package com.znyw.service;

import com.znyw.pojo.ResultPojo;
import com.znyw.pojo.SystemConfigPojo;

/**
 * 系统配置相关操作
 */
public interface SystemConfigService {
	public ResultPojo getSystemConfig(String types);
	public ResultPojo updateSystemConfig(SystemConfigPojo pojo);
	
}
