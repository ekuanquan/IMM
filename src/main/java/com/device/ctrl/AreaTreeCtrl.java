package com.device.ctrl;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.znyw.service.impl.AreaTree;

/**
 * 未启用
 * 
 * @author teclan
 *
 *         2017年12月27日
 */
@Deprecated
@Controller
@RequestMapping("/")
public class AreaTreeCtrl {
	private static final Logger LOGGER = LoggerFactory.getLogger(AreaTreeCtrl.class);

	@Resource
	private AreaTree areaTree;

	@ResponseBody
	@RequestMapping("initAreaTree")
	public JSONObject QueryAlarmCaseList(HttpServletRequest request, HttpServletResponse response) {

		new Thread(new Runnable() {
			@Override
			public void run() {
				try {
					areaTree.init();
				} catch (Exception e) {
					LOGGER.error(e.getMessage(), e);
				}
			}
		}).start();

		return new JSONObject();
	}

}
