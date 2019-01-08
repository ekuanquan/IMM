package com.znyw.service;

import com.znyw.pojo.ResultPojo;

public interface ValidateService {
	public ResultPojo isCanUse(String validateName, String validateValue);

	public boolean hasRecordForModify(String validateName, String validateValue);
}
