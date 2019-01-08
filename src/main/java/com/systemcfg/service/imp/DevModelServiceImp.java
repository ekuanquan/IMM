package com.systemcfg.service.imp;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.systemcfg.dao.DevModelDao;
import com.systemcfg.service.DevModelService;
import com.znyw.pojo.Pagepojo;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultUtil;

@Service
public class DevModelServiceImp implements DevModelService {
	private static final Logger LOGGER = LoggerFactory.getLogger(DevModelServiceImp.class);

	@Resource
	private DevModelDao devModelDao;

	@Override
	public JSONObject addDevModel(Map<String, Object> namesAndValues) {
		try {

			boolean hasRecord = devModelDao.hasRecord(namesAndValues.get("devModelId"));

			if (hasRecord) {
				return ResultUtil.simpleResponse(500, "devModelId 重复");
			}

			boolean inserted = devModelDao.addDevModel(namesAndValues);

			return inserted ? ResultUtil.simpleResponse(200, "添加成功")
					: ResultUtil.simpleResponse(500, "添加失败", "受影响行数 0");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "添加失败", e.getMessage());
		}
	}

	@Override
	public JSONObject updateDevmodel(Map<String, Object> namesAndValues) {

		Object oldDevModelId = namesAndValues.remove("oldDevModelId");
		Object newDevModelId = namesAndValues.remove("newDevModelId");

		if (Objects.isNullString(oldDevModelId) || Objects.isNullString(newDevModelId)) {
			return ResultUtil.simpleResponse(500, "参数错误");
		}

		try {

			if (!oldDevModelId.equals(newDevModelId)) {
				boolean hasRecord = devModelDao.hasRecord(newDevModelId);
				if (hasRecord) {
					return ResultUtil.simpleResponse(500, "devModelId 重复");
				}
			}

			namesAndValues.put("devModelId", newDevModelId);

			boolean updated = devModelDao.updateDevmodel(oldDevModelId, namesAndValues);

			return updated ? ResultUtil.simpleResponse(200, "更新成功") : ResultUtil.simpleResponse(500, "更新失败", "受影响行数 0");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "更新失败", e.getMessage());
		}
	}

	@Override
	public JSONObject deleteDevModel(Object devModelId) {

		try {
			boolean deleteed = devModelDao.deleteDevModel(devModelId);

			return deleteed ? ResultUtil.simpleResponse(200, "删除成功")
					: ResultUtil.simpleResponse(500, "删除失败", "受影响行数 0");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "删除失败", e.getMessage());
		}
	}

	@Override
	public JSONObject findDevModel(JSONObject fuzzy, Pagepojo pagepojo) {

		String fuzzyKey = fuzzy.getString("key");
		String fuzzyValue = fuzzy.getString("value");

		JSONObject jsonObject = new JSONObject();

		if (Objects.isNullString(fuzzyValue)) {
			jsonObject = null;
		} else {
			for (String key : fuzzyKey.split(",")) {
				jsonObject.put(key, fuzzyValue);
			}
		}

		try {

			int total = devModelDao.count(jsonObject);
			//取得总页数pages
			int pages =total>0&&pagepojo.getPageSize()>0? (int) Math.ceil(total * 1.0 / pagepojo.getPageSize()):0;
			int currentPage=pagepojo.getCurrentPage();//取得前段传过来的当前页数
			if(pages<currentPage&&currentPage!=1){//总页数小于当前页，并且当前页不是第一页
				pagepojo.setCurrentPage(currentPage-1);//当前页减一页
			}
			List<Map<String, Object>> list = devModelDao.find(jsonObject, pagepojo);

			if (list == null) {
				
				return ResultUtil.simpleResponse(500, "数据库操作错误");
			}

			pagepojo.setTotalNum(total);
			pagepojo.setTotalPage(pages);

			JSONObject result = new JSONObject();
			result.put("code", 200);
			result.put("message", "查询成功");

			JSONObject response = new JSONObject();// 结果
			response.put("devModel", list);
			response.put("pageInfoPojo", pagepojo);
			response.put("result", result);
			return response;

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "查询失败", e.getMessage());
		}
	}

	@Override
	public JSONObject findByKey(JSONObject jsonObejct) {

		try {
			List<Map<String, Object>> list = devModelDao.findByKey(jsonObejct);

			if (list == null) {
				return ResultUtil.simpleResponse(500, "数据库操作错误");
			}

			JSONObject result = new JSONObject();
			result.put("code", 200);
			result.put("message", "查询成功");

			JSONObject response = new JSONObject();// 结果
			response.put("devModel", list);
			response.put("result", result);

			return response;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "查询失败", e.getMessage());
		}
	}
}
