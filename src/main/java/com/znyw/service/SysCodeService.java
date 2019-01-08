package com.znyw.service;
import com.znyw.pojo.Pagepojo;
/**
 * 系统码相关操作
 */
import com.znyw.pojo.ResultPojo;
import com.znyw.pojo.SysCodePojo;

public interface SysCodeService {
	public ResultPojo getSysCodeByCondition(String queryStr,Pagepojo pagepojo);
	public ResultPojo findSysCodeByCodeId(String codeId);
	public ResultPojo updateSysCodeByCodeId(SysCodePojo pojo);
}
