package com.znyw.service;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.Pagepojo;
import com.znyw.pojo.ResultPojo;

public interface UserPlanEventService {
	public ResultPojo updateUserPlanEvent(JSONObject params);

	public ResultPojo updateLastNoRptCheckDateTime(String userId, String lastNoRptCheckDateTime);

	public ResultPojo findUserPlanEventByUserId(String userId);

	public ResultPojo allValidUserPlanEventByPage(Pagepojo pagePojo);
}
