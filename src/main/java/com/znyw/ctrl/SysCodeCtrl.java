package com.znyw.ctrl;

/**
 * 系统码相关操作
 */
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.Pagepojo;
import com.znyw.pojo.ResultPojo;
import com.znyw.pojo.SysCodePojo;
import com.znyw.service.SysCodeService;
import com.znyw.tool.HttpTool;

@Controller
@RequestMapping("/sysCode")
public class SysCodeCtrl {
	private static Logger LOGGER = LoggerFactory.getLogger(SysCodeCtrl.class);

	@Resource
	private SysCodeService sysCodeSer;

	@RequestMapping("/getSysCodeByCondition")
	// 根据翻页信息获取系统码
	@ResponseBody
	public ResponseEntity<String> getSysCodeByCondition(
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String pageInfoPojo = json.getString("pageInfoPojo");
			String queryStr = json.getString("queryStr");
			Pagepojo pagePojo = JSONObject.parseObject(pageInfoPojo,
					Pagepojo.class);
			ResultPojo result = sysCodeSer.getSysCodeByCondition(queryStr,
					pagePojo);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

	@RequestMapping("/findSysCodeByCodeId")
	// 根据翻页信息获取系统码
	@ResponseBody
	public ResponseEntity<String> findSysCodeByCodeId(
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String codeId = json.getString("codeId");
			ResultPojo result = sysCodeSer.findSysCodeByCodeId(codeId);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

	@RequestMapping("/updateSysCodeByCodeId")
	// 修改系统码设置
	@ResponseBody
	public ResponseEntity<String> updateSysCodeByCodeId(
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject json = JSONObject.parseObject(jsonStr);
			String sysCodePojo = json.getString("sysCodePojo");
			SysCodePojo pojo = JSONObject.parseObject(sysCodePojo,
					SysCodePojo.class);
			ResultPojo result = sysCodeSer.updateSysCodeByCodeId(pojo);
			return result.GetResponseEntity();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultPojo.INTERNAL_SERVER_ERROR("500", e.getMessage());
		}
	}

}
