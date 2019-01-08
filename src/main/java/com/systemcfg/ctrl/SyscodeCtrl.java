package com.systemcfg.ctrl;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.util.JSON;
import com.systemcfg.service.SyscodeService;
import com.znyw.pojo.Pagepojo;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultUtil;

/**
 * 系统配置-系统码
 * 
 * @author teclan
 * 
 *         email: tbj621@163.com
 *
 *         2017年11月15日
 */
@Controller
public class SyscodeCtrl {
	private static final Logger LOGGER = LoggerFactory.getLogger(SyscodeCtrl.class);

	@Resource
	private SyscodeService syscodeService;

	@SuppressWarnings("unchecked")
	@ResponseBody
	@RequestMapping("/syscode/add")
	public JSONObject addSyscode(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);

			Map<String, Object> namesAndValues = (Map<String, Object>) JSON.parse(stringParam);

			return syscodeService.addSyscode(namesAndValues);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "参数错误", e.getMessage());
		}
	}

	
	@SuppressWarnings("unchecked")
	@ResponseBody
	@RequestMapping("/syscode/update")
	public JSONObject updateSyscode(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);
			Map<String, Object> namesAndValues = (Map<String, Object>) JSON.parse(stringParam);

			return syscodeService.updateSyscode(namesAndValues);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "参数错误", e.getMessage());
		}
	}

	@SuppressWarnings("unchecked")
	@ResponseBody
	@RequestMapping("/syscode/delete")
	public JSONObject deleteSyscode(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);
			Map<String, Object> namesAndValues = (Map<String, Object>) JSON.parse(stringParam);

			return syscodeService.deleteSyscode(namesAndValues.get("codeId"));
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "参数错误", e.getMessage());
		}
	}
	/**
	 * 系统配置--系统码--获取列表
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/syscode/list")
	public JSONObject findSyscode(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);

			JSONObject jsonObject = JSONObject.parseObject(stringParam);

			Pagepojo pagepojo = jsonObject.getObject("pagepojo", Pagepojo.class);

			JSONObject fuzzy = jsonObject.getJSONObject("fuzzy");

			return syscodeService.findSyscode(fuzzy, pagepojo);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "参数错误", e.getMessage());
		}
	}

	@ResponseBody
	@RequestMapping("/syscode/findByKey")
	public JSONObject findByKey(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);

			JSONObject jsonObject = JSONObject.parseObject(stringParam);

			return syscodeService.findByKey(jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "参数错误", e.getMessage());
		}
	}
	
	
	@ResponseBody
	@RequestMapping("/syscode/tree")
	public JSONArray tree(HttpServletRequest request, HttpServletResponse response) {
		try {
			return syscodeService.tree();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return new JSONArray();
		}
	}
}
