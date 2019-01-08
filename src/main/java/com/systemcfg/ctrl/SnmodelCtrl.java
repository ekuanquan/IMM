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

import com.alibaba.fastjson.JSONObject;
import com.mongodb.util.JSON;
import com.systemcfg.service.SnmodelService;
import com.znyw.pojo.Pagepojo;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultUtil;

/**
 * 探头型号 控制器
 * 
 * @author teclan
 * 
 *         email: tbj621@163.com
 *
 *         2017年10月31日
 */
@Controller
public class SnmodelCtrl {
	private static final Logger LOGGER = LoggerFactory.getLogger(SnmodelCtrl.class);

	@Resource
	private SnmodelService snmodelService;

	/**
	 * 添加探头型号
	 * 
	 * { "snModelId":"", 探测器型号编号 </br>
	 * "snModelName":"", 探测器型号名称 </br>
	 * "snMemo":"", 探测器用途 </br>
	 * "snKind":"", </br>
	 * "buyPrice":"", 探测器价格 </br>
	 * "servicePrice":"", 服务费用 </br>
	 * "wantDo":"", 反应类型 </br>
	 * "almType":"" 警情类型 </br>
	 * }
	 * 
	 * @param response
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@ResponseBody
	@RequestMapping("/snmodel/add")
	public JSONObject addSnmodel(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);

			Map<String, Object> namesAndValues = (Map<String, Object>) JSON.parse(stringParam);
			return snmodelService.addDevModel(namesAndValues);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "参数错误", e.getMessage());
		}
	}

	/**
	 * 修改探头型号
	 * 
	 * { </br>
	 * "oldSnModelId":"", 旧探测器型号编号 </br>
	 * "newSnModelId":"", 新探测器型号编号 </br>
	 * "snModelName":"", 探测器型号名称 </br>
	 * "snMemo":"", 探测器用途 </br>
	 * "snKind":"", </br>
	 * "buyPrice":"", 探测器价格 </br>
	 * "servicePrice":"", 服务费用 </br>
	 * "wantDo":"", 反应类型 </br>
	 * "almType":"" 警情类型 </br>
	 * }
	 * 
	 * @param response
	 * @return
	 */

	@SuppressWarnings("unchecked")
	@ResponseBody
	@RequestMapping("/snmodel/update")
	public JSONObject updateSnmodel(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);

			Map<String, Object> namesAndValues = (Map<String, Object>) JSON.parse(stringParam);

			return snmodelService.updateDevmodel(namesAndValues);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "参数错误", e.getMessage());
		}
	}

	/**
	 * 删除探头型号
	 * 
	 * @param request
	 * 
	 *            { </br>
	 *            "snModelId":"", 设备型号编号</br>
	 *            }
	 * @param response
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@ResponseBody
	@RequestMapping("/snmodel /delete")
	public JSONObject deleteSnmodel(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);

			Map<String, Object> namesAndValues = (Map<String, Object>) JSON.parse(stringParam);

			return snmodelService.deleteDevModel(namesAndValues.get("snModelId"));
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "参数错误", e.getMessage());
		}
	}

	/**
	 * 查看探头型号列表
	 * 
	 * @param request
	 *            {</br>
	 *            "fuzzy":</br>
	 *            {</br>
	 *            "key":"查询字段列表，逗号隔开", </br>
	 *            "value":"模糊查询值"</br>
	 *            },</br>
	 *            </br>
	 *            "pagepojo":</br>
	 *            { "currentPage":1, "orderBy":"devModelId|DESC", "pageSize":25 } }
	 * 
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/snmodel/list")
	public JSONObject listSnmodel(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);

			JSONObject jsonObject = com.alibaba.fastjson.JSON.parseObject(stringParam);

			Pagepojo pagepojo = jsonObject.getObject("pagepojo", Pagepojo.class);

			JSONObject fuzzy = jsonObject.getJSONObject("fuzzy");

			return snmodelService.findSnmodel(fuzzy, pagepojo);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "参数错误", e.getMessage());
		}
	}

	@ResponseBody
	@RequestMapping("/snmodel/findByKey")
	public JSONObject findByKey(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);

			JSONObject jsonObject = com.alibaba.fastjson.JSON.parseObject(stringParam);

			return snmodelService.findByKey(jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "参数错误", e.getMessage());
		}
	}
}
