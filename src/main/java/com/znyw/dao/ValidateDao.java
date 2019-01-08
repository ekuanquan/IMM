package com.znyw.dao;

import java.util.List;
import java.util.Map;

import com.znyw.pojo.DropDownPojo;

public interface ValidateDao {
	public boolean isUserIdCanUse(String userId);
	public boolean isUserAccountCanUse(String userAccount);
	
	public boolean isDevIdCanUse(String devId);

}
