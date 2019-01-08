package com.device.service.impl;

import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.device.dao.IAlarmDao;
import com.device.service.IAlarmService;
import com.znyw.tool.ErrorcodeEnum;
import com.znyw.tool.ResultUtil;

@Service
public class AlarmServiceImpl implements IAlarmService {

	private final static Logger LOGGER = LoggerFactory.getLogger(AlarmServiceImpl.class);
	@Resource
	IAlarmDao iAlarmDao;

	@Override
	public JSONObject queryAlarmCaseList() {

		JSONArray list;
		try {
			list = iAlarmDao.queryAlarmCaseList();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1005", "查询失败", e.getMessage());
		}
		return ResultUtil.jsonResultBasic(ErrorcodeEnum.SUCCESS.getErrorcode(), ErrorcodeEnum.SUCCESS.getDescribe(),
				list);

	}

	@Override
	public JSONObject queryDealwayListByUid(String userId) {

		JSONObject json = new JSONObject();
		JSONArray list;
		try {
			list = iAlarmDao.queryDealwayListByUid(userId);

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("1005", "查询失败", e.getMessage());
		}
		JSONObject result = new JSONObject();
		result.put("code", "1000");
		json.put("result", result);
		json.put("List", list);
		return json;
	}

	@Override
	public JSONObject addDealWay(Map<String, Object> namesAndValues) {

		JSONObject json = new JSONObject();
		JSONObject result = new JSONObject();

		// 缺少主键
		if (!namesAndValues.containsKey("ownerId") || !namesAndValues.containsKey("dealWayId")) {
			LOGGER.error("dealway/add,return code=1009,缺少必要的参数 ownerId 或  dealWayId");
			return ResultUtil.simpleResponse("1009", "缺少必要的参数 ownerId 或  dealWayId");
		}

		// 有效性验证
		if (!valid(namesAndValues)) {
			LOGGER.error("dealway/add,return code=1001,参数不符合规则");
			return ResultUtil.simpleResponse("1001", "参数不符合规则");
		}

		// 唯一性验证
		if (iAlarmDao.hasDealway((String) namesAndValues.get("ownerId"),
				Integer.valueOf(namesAndValues.get("dealWayId").toString()))) {
			LOGGER.error("dealway/add,return code=1008,违反唯一性约束");
			return ResultUtil.simpleResponse("1008", "违反唯一性约束");
		}

		try {
			JSONObject dealway = iAlarmDao.addDealWay(namesAndValues);

			result.put("code", "1000");
			result.put("message", "添加成功");
			json.put("result", result);
			json.put("dealway", dealway);

			return json;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "添加失败", e.getMessage());
		}
	}

	@Override
	public JSONObject updateDealWayByUserIdAndDealWayId(String ownerId, int dealWayId,
			Map<String, Object> namesAndValues) {

		JSONObject json = new JSONObject();
		JSONObject result = new JSONObject();

		// 有效性验证
		if (!valid(namesAndValues)) {
			LOGGER.error("dealway/update,return code=1001,参数不符合规则");
			return ResultUtil.simpleResponse("1001", "参数不符合规则");
		}

		// 存在性验证
		if (!iAlarmDao.hasDealway(ownerId, dealWayId)) {
			LOGGER.error("dealway/update,return code=1007,指定更新的记录不存在");
			return ResultUtil.simpleResponse("1007", "指定更新的记录不存在");
		}

		try {
			JSONObject dealway = iAlarmDao.updateDealWayByUserIdAndDealWayId(ownerId, dealWayId, namesAndValues);

			result.put("code", "1000");
			result.put("message", "更新成功");
			json.put("result", result);
			json.put("dealway", dealway);

			return json;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "更新失败", e.getMessage());
		}
	}

	@Override
	public JSONObject updateDealWay(Map<String, Object> namesAndValues) {

		JSONObject json = new JSONObject();
		JSONObject result = new JSONObject();

		// 有效性验证
		if (!valid(namesAndValues)) {
			LOGGER.error("dealway/update,return code=1001,参数不符合规则");
			return ResultUtil.simpleResponse("1001", "参数不符合规则");
		}

		// 存在性验证
		if (!iAlarmDao.hasDealway((String) namesAndValues.get("ownerId"),
				Integer.valueOf(namesAndValues.get("oldDealWayId").toString()))) {
			LOGGER.error("dealway/update,return code=1007,指定更新的记录不存在");
			return ResultUtil.simpleResponse("1007", "指定更新的记录不存在");
		}

		// 存在性验证，新的 newDealWayId 是否存在
		if (!namesAndValues.get("newDealWayId").equals(namesAndValues.get("oldDealWayId"))
				&& iAlarmDao.hasDealway((String) namesAndValues.get("ownerId"),
						Integer.valueOf(namesAndValues.get("newDealWayId").toString()))) {
			LOGGER.error("dealway/update,return code=1007,序号重复");
			return ResultUtil.simpleResponse("1007", "序号重复");
		}

		try {
			JSONObject dealway = iAlarmDao.updateDealWay(namesAndValues);

			result.put("code", "1000");
			result.put("message", "更新成功");
			json.put("result", result);
			json.put("dealway", dealway);
			return json;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "更新失败", e.getMessage());
		}
	}

	@Override
	public JSONObject deleteDealWayByUserIdAndDealWayId(String ownerId, JSONArray dealWayIdString) {

		for(int i=0;i<dealWayIdString.size();i++){
			if (!StringUtils.isNumeric(dealWayIdString.getString(i))) {
				return ResultUtil.simpleResponse("1001", "参数不符合规则");
			}
		}
		
		try {
			
			int deleted = iAlarmDao.deleteDealWayByUserIdAndDealWayId(ownerId, dealWayIdString);

			JSONObject json = new JSONObject();
			JSONObject result = new JSONObject();

			if (deleted < 1) {
				LOGGER.error("dealway/del  ,return code=1005,记录不存在，删除失败");
				result.put("code", "1005");
				result.put("message", "记录不存在，删除失败");
				json.put("result", result);
				return json;
			}

			JSONObject dealway = new JSONObject();
			dealway.put("ownerId", ownerId);
			dealway.put("dealWayId", dealWayIdString);

			result.put("code", "1000");
			result.put("message", "删除成功");
			json.put("result", result);
			json.put("dealway", dealway);
			return json;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "删除失败", e.getMessage());
		}
	}

	private boolean valid(Map<String, Object> namesAndValues) {

		if (namesAndValues.containsKey("ownerId") && namesAndValues.get("ownerId").toString().length() > 9) {
			LOGGER.error("参数[userId] 长度超过 9 位,实际长度:{}", namesAndValues.get("ownerId").toString().length());
			return false;
		}

		if (namesAndValues.containsKey("dealWayId")
				&& !StringUtils.isNumeric(namesAndValues.get("dealWayId").toString())) {
			LOGGER.error("参数[dealWayId] 不是有效的数值");
			return false;
		}

		if (namesAndValues.containsKey("oldDealWayId")
				&& !StringUtils.isNumeric(namesAndValues.get("oldDealWayId").toString())) {
			LOGGER.error("参数[oldDealWayId] 不是有效的数值");
			return false;
		}

		if (namesAndValues.containsKey("newDealWayId")
				&& !StringUtils.isNumeric(namesAndValues.get("newDealWayId").toString())) {
			LOGGER.error("参数[newDealWayId] 不是有效的数值");
			return false;
		}

		if (namesAndValues.containsKey("fdata") && namesAndValues.get("fdata").toString().length() > 2000) {
			LOGGER.error("参数[fdata] 长度超过 2000，实际长度 :{}", namesAndValues.get("fdata").toString().length());
			return false;
		}

		if (namesAndValues.containsKey("fMemo") && namesAndValues.get("fMemo").toString().length() > 255) {
			LOGGER.error("参数[fMemo] 长度超过 255，实际长度 :{}", namesAndValues.get("fMemo").toString().length());
			return false;
		}

		return true;
	}

}