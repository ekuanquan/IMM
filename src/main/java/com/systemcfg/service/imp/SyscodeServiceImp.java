package com.systemcfg.service.imp;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.systemcfg.dao.SyscodeDao;
import com.systemcfg.service.SyscodeService;
import com.znyw.pojo.Pagepojo;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultUtil;

@Service
public class SyscodeServiceImp implements SyscodeService {
	private static final Logger LOGGER = LoggerFactory.getLogger(SyscodeServiceImp.class);
	@Resource
	private SyscodeDao syscodeDao;

	@Override
	public JSONObject addSyscode(Map<String, Object> namesAndValues) {

		try {
			boolean hasRecord = syscodeDao.hasRecord(namesAndValues.get("codeId"));

			if (hasRecord) {
				return ResultUtil.simpleResponse(500, "codeId 重复");
			}

			boolean inserted = syscodeDao.addSyscode(namesAndValues);

			return inserted ? ResultUtil.simpleResponse(200, "添加成功")
					: ResultUtil.simpleResponse(500, "添加失败", "受影响行数 0");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "添加失败", e.getMessage());
		}

	}

	@Override
	public JSONObject updateSyscode(Map<String, Object> namesAndValues) {
		Object oldCodeId = namesAndValues.remove("oldCodeId");
		Object newCodeId = namesAndValues.remove("newCodeId");

		if (Objects.isNullString(oldCodeId) || Objects.isNullString(newCodeId)) {
			return ResultUtil.simpleResponse(500, "参数错误");
		}

		try {
			if (!oldCodeId.equals(newCodeId)) {
				boolean hasRecord = syscodeDao.hasRecord(newCodeId);
				if (hasRecord) {
					return ResultUtil.simpleResponse(500, "codeId 重复");
				}
			}

			namesAndValues.put("codeId", newCodeId);

			boolean updated = syscodeDao.updateSyscode(oldCodeId, namesAndValues);

			return updated ? ResultUtil.simpleResponse(200, "更新成功") : ResultUtil.simpleResponse(500, "更新失败", "受影响行数 0");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "更新失败", e.getMessage());
		}

	}

	@Override
	public JSONObject deleteSyscode(Object codeId) {

		try {
			boolean deleteed = syscodeDao.deleteSyscode(codeId);

			return deleteed ? ResultUtil.simpleResponse(200, "删除成功")
					: ResultUtil.simpleResponse(500, "删除失败", "受影响行数 0");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "删除失败", e.getMessage());
		}
	}

	@Override
	public JSONObject findSyscode(JSONObject fuzzy, Pagepojo pagepojo) {
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
			int total = syscodeDao.count(jsonObject);
			int pages = (int) Math.ceil(total * 1.0 / pagepojo.getPageSize());

			List<Map<String, Object>> list = syscodeDao.find(jsonObject, pagepojo);

			if (list == null) {
				return ResultUtil.simpleResponse(500, "数据库操作错误");
			}

			pagepojo.setTotalNum(total);
			pagepojo.setTotalPage(pages);

			JSONObject result = new JSONObject();
			result.put("code", 200);
			result.put("message", "查询成功");

			JSONObject response = new JSONObject();// 结果
			response.put("syscode", list);
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
			List<Map<String, Object>> list = syscodeDao.findByKey(jsonObejct);

			if (list == null) {
				return ResultUtil.simpleResponse(500, "数据库操作错误");
			}

			JSONObject result = new JSONObject();
			result.put("code", 200);
			result.put("message", "查询成功");

			JSONObject response = new JSONObject();
			response.put("syscode", list);
			response.put("result", result);

			return response;

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "查询失败", e.getMessage());
		}
	}

	@Override
	public JSONArray tree() {

		JSONArray array = new JSONArray();

		Map<String, Object> root = new HashMap<String, Object>();
		root.put("id", "ID-root");
		root.put("evtWat", "root");
		root.put("name", "root");
		root.put("isParent", true);
		root.put("pId", ConfigUtil.getRoot());
		array.add(root);

		try {
			List<Map<String, Object>> evtWats = syscodeDao.getAllEventClass();

			int id = 0;
			for (Map<String, Object> map : evtWats) {

				Map<String, Object> evtMap = new HashMap<String, Object>();
				evtMap.put("id", "ID-" + id);
				evtMap.put("evtWat", map.get("evtWat"));
				evtMap.put("name", map.get("evtWatName"));
				evtMap.put("isParent", false);
				evtMap.put("pId", "ID-root");

				List<Map<String, Object>> syscodes = syscodeDao
						.findSysCodeByEvenClassForTree(map.get("evtWat").toString());
				for (Map<String, Object> m : syscodes) {
					m.put("pId", "ID-" + id);
					m.put("isParent", false);
					array.add(m);
					evtMap.put("isParent", true);
				}
				array.add(evtMap);
				id++;
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
		}
		return array;
	}

}
