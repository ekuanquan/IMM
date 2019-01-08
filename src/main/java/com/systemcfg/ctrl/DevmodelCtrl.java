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
import com.systemcfg.service.DevModelService;
import com.systemcfg.service.DevTypeService;
import com.znyw.pojo.Pagepojo;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultUtil;

/**
 * 系统设置-设备型号控制器
 * 
 * @author teclan
 * 
 *         email: tbj621@163.com
 *
 *         2017年10月31日
 */

@Controller
public class DevmodelCtrl {
	private static final Logger LOGGER = LoggerFactory.getLogger(DevmodelCtrl.class);

	@Resource
	private DevModelService devModelService;
	@Resource
	private DevTypeService devTypeService;

	/**
	 * 添加设备型号
	 * 
	 * @param request
	 *            { </br>
	 *            "devModelId":"", 设备型号编号</br>
	 *            "devModelName":"",设备型号名称</br>
	 *            "devType":"",设备类型编号</br>
	 *            "zoneNum":"",防区个数</br>
	 *            "prog_type":"",编程类型 </br>
	 *            "ChannelNum":"",通道数 </br>
	 *            "ZoneNumEx":"",扩展防区数</br>
	 *            "CodeWayId_42":"",2位编码方案 </br>
	 *            "CodeWayId_FSK":"",4位编码方案</br>
	 *            "CodeWayId_CID":""字段解释未知 </br>
	 *            }
	 * @param response
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@ResponseBody
	@RequestMapping("/devmodel/add")
	public JSONObject addDevModel(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);

			Map<String, Object> namesAndValues = (Map<String, Object>) JSON.parse(stringParam);
			namesAndValues.remove("dataSyncType");
			return devModelService.addDevModel(namesAndValues);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "参数错误", e.getMessage());
		}
	}

	/**
	 * 修改设备型号
	 * 
	 * @param request
	 *            { </br>
	 *            "newDevModelId":"", 新设备型号编号</br>
	 *            "oldDevModelId":"", 旧设备型号编号</br>
	 *            "devModelName":"",设备型号名称</br>
	 *            "devType":"",设备类型编号</br>
	 *            "zoneNum":"",防区个数</br>
	 *            "prog_type":"",编程类型 </br>
	 *            "ChannelNum":"",通道数 </br>
	 *            "ZoneNumEx":"",扩展防区数</br>
	 *            "CodeWayId_42":"",2位编码方案 </br>
	 *            "CodeWayId_FSK":"",4位编码方案</br>
	 *            "CodeWayId_CID":""字段解释未知 </br>
	 *            }
	 * @param response
	 * @return
	 */

	@SuppressWarnings("unchecked")
	@ResponseBody
	@RequestMapping("/devmodel/update")
	public JSONObject updateDevModel(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);

			Map<String, Object> namesAndValues = (Map<String, Object>) JSON.parse(stringParam);

			return devModelService.updateDevmodel(namesAndValues);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "参数错误");
		}
	}

	/**
	 * 删除设备型号
	 * 
	 * @param request
	 * 
	 *            { </br>
	 *            "devModelId":"", 设备型号编号</br>
	 *            }
	 * @param response
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@ResponseBody
	@RequestMapping("/devmodel/delete")
	public JSONObject deleteDevModel(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);

			LOGGER.info("[系统配置-设备型号] 删除设备型号   /devmodel/update.do 参数:{}", stringParam);

			Map<String, Object> namesAndValues = (Map<String, Object>) JSON.parse(stringParam);

			return devModelService.deleteDevModel(namesAndValues.get("devModelId"));
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "参数错误");
		}
	}


	/**
	 * 查看设备型号列表
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
	@RequestMapping("/devmodel/list")
	public JSONObject listDevModel(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);

			JSONObject jsonObject = com.alibaba.fastjson.JSON.parseObject(stringParam);

			Pagepojo pagepojo = jsonObject.getObject("pagepojo", Pagepojo.class);

			JSONObject fuzzy = jsonObject.getJSONObject("fuzzy");

			return devModelService.findDevModel(fuzzy, pagepojo);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "参数错误");
		}
	}

	/**
	 * 
	 * @param request
	 * 
	 *            { "devModelId":1 }
	 * 
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/devmodel/findByKey")
	public JSONObject findByKey(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);

			JSONObject jsonObject = com.alibaba.fastjson.JSON.parseObject(stringParam);
			return devModelService.findByKey(jsonObject);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "参数错误");
		}
	}


	@ResponseBody
	@RequestMapping("/devtype/list")
	public JSONObject listDevType(HttpServletRequest request, HttpServletResponse response) {
		try {
			return devTypeService.listDevType();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse(500, "数据库操作错误");
		}
	}
}
