package com.znyw.dao;
/**
 * 系统码相关操作
 */

import java.util.List;

import com.znyw.pojo.SysCodePojo;

public interface SysCodeDao {
	public List<SysCodePojo> getSysCodeByCondition(String queryStr,int index , int size);
	public int countSysCodeByCondition(String queryStr);
	public SysCodePojo findSysCodeByCodeId(String codeId);
	public int updateSysCodeByCodeId(SysCodePojo pojo);
}
