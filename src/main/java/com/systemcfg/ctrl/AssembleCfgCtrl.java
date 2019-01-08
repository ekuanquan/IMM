package com.systemcfg.ctrl;

import java.util.List;
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
import com.systemcfg.service.AssembleCfgService;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultUtil;

/**
 * 数据汇聚于上传配置
 * 
 * @author Teclan
 *
 *         2017年12月6日
 */
@Controller
public class AssembleCfgCtrl {
	private static final Logger LOGGER = LoggerFactory.getLogger(AssembleCfgCtrl.class);

	@Resource
	private AssembleCfgService assembleCfgService;

	@Deprecated
	@ResponseBody
	@RequestMapping("/assemble_cfg/save")
	public JSONObject save(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);
			@SuppressWarnings("unchecked")
			Map<String, Object> namesAndValues = (Map<String, Object>) JSON.parse(stringParam);

			return assembleCfgService.save(namesAndValues);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	}

	@ResponseBody
	@RequestMapping("/assemble_cfg/add")
	public JSONObject add(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);
			@SuppressWarnings("unchecked")
			Map<String, Object> namesAndValues = (Map<String, Object>) JSON.parse(stringParam);

			return assembleCfgService.add(namesAndValues);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	}

	@ResponseBody
	@RequestMapping("/assemble_cfg/update")
	public JSONObject update(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);
			@SuppressWarnings("unchecked")
			Map<String, Object> namesAndValues = (Map<String, Object>) JSON.parse(stringParam);
			return assembleCfgService.update(namesAndValues);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	}

	@SuppressWarnings("unchecked")
	@ResponseBody
	@RequestMapping("/assemble_cfg/delete")
	public JSONObject delete(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);
			JSONObject jsonObject = com.alibaba.fastjson.JSON.parseObject(stringParam);
			JSONArray array = jsonObject.getJSONArray("ids");
			List<String> ids = (List<String>) JSON.parse(array.toJSONString());
			return assembleCfgService.delete(ids);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
	}

	@ResponseBody
	@RequestMapping("/assemble_cfg/list")
	public JSONObject list(HttpServletRequest request, HttpServletResponse response) {
			return assembleCfgService.list();
	}

	/**
	 * 获取下级平台ID和名称
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/assemble_cfg/getSubPlatform")
	public JSONObject getSubPlatform(HttpServletRequest request, HttpServletResponse response) {
		return assembleCfgService.getSubPlatform();
	}

	@ResponseBody
	@RequestMapping("/assemble_cfg/findById")
	public JSONObject findById(HttpServletRequest request, HttpServletResponse response) {

		String id;
		try {
			String stringParam = HttpTool.readJSONString(request);
			JSONObject jsonObject = com.alibaba.fastjson.JSON.parseObject(stringParam);
			id = jsonObject.getString("id");
			if (id == null) {
				return ResultUtil.simpleResponse("500", "参数错误", "id 为空");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数错误", e.getMessage());
		}
		return assembleCfgService.findById(id);
	}

	@ResponseBody
	@RequestMapping("/assemble_cfg/main")
	public JSONObject main(HttpServletRequest request, HttpServletResponse response) {
			return assembleCfgService.main();
	}

	@ResponseBody
	@RequestMapping("/assemble_cfg/getLocalPlatformId")
	public JSONObject getLocalPlatformId(HttpServletRequest request, HttpServletResponse response) {
			return assembleCfgService.getLocalPlatformId();
	}
}
