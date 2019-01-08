package com.znyw.service.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.TaskSchedulerDao;
import com.znyw.dao.UserPlanEventDao;
import com.znyw.pojo.BCFPlanPojo;
import com.znyw.pojo.Pagepojo;
import com.znyw.pojo.ResultPojo;
import com.znyw.pojo.UserPlanEventPojo;
import com.znyw.service.UserPlanEventService;
import com.znyw.tool.ConfigUtil;

@Service
public class UserPlanEventServiceImpl implements UserPlanEventService {
	private static Logger logger = LoggerFactory
			.getLogger(UserPlanEventServiceImpl.class);

	@Resource
	private UserPlanEventDao userPlanEventDao;

	@Resource
	private TaskSchedulerDao taskSchedulerDao;

	@Override
	public ResultPojo updateUserPlanEvent(JSONObject params) {
		ResultPojo result = new ResultPojo();
		/*
		 * 更新超测计划任务
		 */
		try {
			if (!params.containsKey("dataFrom")
					|| "".equals(params.get("dataFrom"))) {
				params.put("dataFrom", ConfigUtil.getPlatformId());
			}
			String userPlanEvent = params.getString("userPlanEvent");
			UserPlanEventPojo userplanEventPojo = JSONObject.parseObject(
					userPlanEvent, UserPlanEventPojo.class);
			userplanEventPojo.setDataFrom(params.getString("dataFrom"));
			String userId = userplanEventPojo.getUserId();
			if (userId == null || "".equals(userId)) {
				result.setResult("201", "失败，用户编号为空");
				return result;
			} else {
				int row = userPlanEventDao
						.updateUserPlanEvent(userplanEventPojo);
				if (row > 0) {
					result.setResult("200", "成功");
				} else {
					result.setResult("201", "失败");
					return result;
				}
			}
		} catch (Exception e) {
			logger.warn("超测计划任务更新或者插入失败:{},{}", e.getMessage(), e);
			result.setResult("201", "失败", e.getMessage());
			return result;
		}

		/*
		 * 更新布撤防计划任务
		 */
		try {
			String bCFPlan = params.getString("bCFPlan");
			BCFPlanPojo bCFPlanPojo = JSONObject.parseObject(bCFPlan,
					BCFPlanPojo.class);
			taskSchedulerDao.mergeIntoMysql(bCFPlanPojo);
			result.setResult("200", "成功");
		} catch (Exception e) {
			logger.warn("布撤防计划任务更新或者插入失败:{},{}", e.getMessage(), e);
			result.setResult("201", "失败");
			return result;
		}

		return result;
	}

	@Override
	public ResultPojo updateLastNoRptCheckDateTime(String userId,
			String lastNoRptCheckDateTime) {
		ResultPojo result = new ResultPojo();
		if (userId == null || "".equals(userId)) {
			result.setResult("201", "更新失败，用户名无效！");
		}
		if (lastNoRptCheckDateTime == null || "".equals(lastNoRptCheckDateTime)) {
			result.setResult("201", "更新失败，时间无效！");
		}
		int row = 0;
		try {
			row = userPlanEventDao.updateLastNoRptCheckDateTime(userId,
					lastNoRptCheckDateTime);
		} catch (Exception e) {
			throw e;
		}
		if (row > 0) {
			result.setResult("200", "更新成功！");
		} else {
			result.setResult("201", "更新失败！");
		}
		return result;
	}

	@Override
	public ResultPojo findUserPlanEventByUserId(String userId) {
		ResultPojo result = new ResultPojo();

		if (userId == null || "".equals(userId)) {
			result.setResult("201", "失败，用户编号为空");
			result.setPojo("userPlanEvent", null);
			result.setPojo("bCFPlan", null);
			return result;
		} else {
			try {
				UserPlanEventPojo pojo = userPlanEventDao
						.findUserPlanEventByUserId(userId);
				result.setPojo("userPlanEvent", pojo);
				result.setResult("200", "成功");

			} catch (Exception e) {
				logger.error(e.getMessage(), e);
				result.setResult("200", "查询异常！", e.getMessage());
			}

			try {
				BCFPlanPojo bCFPlanPojo = taskSchedulerDao
						.queryTaskByOwnerId(userId);
				result.setPojo("bCFPlan", bCFPlanPojo);
				result.setResult("200", "成功");

			} catch (Exception e) {
				logger.error(e.getMessage(), e);
				result.setResult("200", "查询异常！", e.getMessage());
			}
			return result;
		}

	}

	@Override
	public ResultPojo allValidUserPlanEventByPage(Pagepojo pagePojo) {

		int index = 0;
		int currentPage = pagePojo.getCurrentPage();
		int pageSize = pagePojo.getPageSize();
		ResultPojo result = new ResultPojo();
		if (currentPage < 1) {
			result.setResult("201", "页码错误");
			result.setPojo("sysCodeList", null);
		} else {
			index = (currentPage - 1) * pageSize;
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String time = sdf.format(new Date());

			List<UserPlanEventPojo> list = null;
			int totalNum = 0;
			try {
				list = userPlanEventDao.queryUserPlanEventByTime(time, index,
						pageSize);

				totalNum = userPlanEventDao.countUserPlanEventByTime(time);
			} catch (Exception e) {
				throw e;
			}
			int totalPage = totalNum / pageSize;
			if (totalNum % pageSize != 0) {
				totalPage += 1;
			}
			pagePojo.setTotalNum(totalNum);
			pagePojo.setTotalPage(totalPage);
			result.setResult("200", "成功");
			result.setPojo("userPlanEventList", list);
			result.setPojo("pageInfoPojo", pagePojo);
		}
		return result;
	}

}
