package com.znyw.service;

import com.znyw.pojo.ResultPojo;

public interface DropDownService {
	public ResultPojo getOwnerDropDown(String dropDownName);
	public ResultPojo getDevIdDropDown(String roleid);

	public ResultPojo getAlarmDevIdDropByOwnerId(String ownerId);
	public ResultPojo getNVRDevIdDropByRoleId(String roleid);
	public ResultPojo getMonitorByDevId(String devId);
}
