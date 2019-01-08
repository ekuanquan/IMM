package com.znyw.dao;

import java.util.List;

import com.znyw.pojo.UserPlanEventPojo;

public interface UserPlanEventDao {
	public int updateUserPlanEvent(UserPlanEventPojo pojo);
	public int updateLastNoRptCheckDateTime(String userId, String lastNoRptCheckDateTime);
	public UserPlanEventPojo findUserPlanEventByUserId(String userId);
	public List<UserPlanEventPojo> queryUserPlanEventByTime(String time,int index , int size);
	public int countUserPlanEventByTime(String time);
}
