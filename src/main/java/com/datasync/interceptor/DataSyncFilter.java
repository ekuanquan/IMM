package com.datasync.interceptor;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import com.alibaba.fastjson.JSONObject;
import com.znyw.tool.ErrorAbnormal;
import com.znyw.tool.GetSysInfoUtil;
import com.znyw.tool.HttpTool;
import com.znyw.tool.Objects;
import com.znyw.tool.PropertyConfigUtil;

public class DataSyncFilter implements Filter {
	private final static Logger LOGGER = LoggerFactory.getLogger(DataSyncFilter.class);

	private static PropertyConfigUtil propertyconfigUtil;

	private final static List<String> syncToUpHttpList;
	private final static List<String> syncDictHttpList;
	static {
		propertyconfigUtil = PropertyConfigUtil.getInstance("properties/config.properties");
		syncToUpHttpList = new ArrayList<>();
		syncDictHttpList = new ArrayList<>();
		if (propertyconfigUtil.getBoolean("isSyncHttpToUp") || propertyconfigUtil.getBoolean("isSyncHttpToDown")) {
			String[] SyncToUpHttps = propertyconfigUtil.getValue("syncToUpHttpList").split(",");
			for (String fs : SyncToUpHttps) {
				fs = "/IntegratedMM" + fs.trim() + ".do";
				syncToUpHttpList.add(fs);
			}
			LOGGER.info("需要汇聚的请求列表 {}", syncToUpHttpList.toString());

			String[] SyncDictHttps = propertyconfigUtil.getValue("syncDictHttpList").split(",");
			for (String fs : SyncDictHttps) {
				fs = "/IntegratedMM" + fs.trim() + ".do";
				syncDictHttpList.add(fs);
			}
			LOGGER.info("需要字典同步的请求列表 {}", syncDictHttpList.toString());

		}
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {

	}

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
			throws IOException, ServletException {
		HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
		String requestUrl = httpServletRequest.getRequestURI();
		boolean isSync = propertyconfigUtil.getBoolean("isSyncHttpToUp")
				|| propertyconfigUtil.getBoolean("isSyncHttpToDown");
		// 文件同步
		if (isSync && requestUrl.equals("/IntegratedMM/file/upload.do")) {
			CommonsMultipartResolver commonsMultipartResolver = new CommonsMultipartResolver();
			MultipartHttpServletRequest multipartRequest = commonsMultipartResolver
					.resolveMultipart(httpServletRequest);
			String jsonStr = multipartRequest.getParameter("jsonStr");
			MultipartFile file = multipartRequest.getFile("file");

			// 将转化后的reuqest赋值到过滤链中的参数 *重要
			servletRequest = multipartRequest;

			// 进行同步
			JSONObject paramJson = null;
			try {
				paramJson = JSONObject.parseObject(jsonStr);
			} catch (Exception e) {
				LOGGER.error("参数字符串转Json失败,字符串：{}", jsonStr);
			}
			// 将请求放出
			filterChain.doFilter(servletRequest, servletResponse);
			new Thread(new FilterProcessForFile(paramJson, requestUrl, file)).start();
			// 数据汇集
		} else if (isSync && syncToUpHttpList.contains(requestUrl)) {
			BodyReaderHttpServletRequestWrapper request = new BodyReaderHttpServletRequestWrapper(httpServletRequest);
			StatusExposingServletResponse response = new StatusExposingServletResponse(
					(HttpServletResponse) servletResponse);

			String requestURI = request.getRequestURI();

			String jsonStr = "";
			if (request.getContentType() != null
					&& request.getContentType().toLowerCase().contains("multipart/form-data")) {
				CommonsMultipartResolver commonsMultipartResolver = new CommonsMultipartResolver();
				MultipartHttpServletRequest multipartRequest = commonsMultipartResolver.resolveMultipart(request);
				jsonStr = multipartRequest.getParameter("json");
			} else {
				jsonStr = HttpTool.readJSONString(request);
			}
			JSONObject paramJson = null;
			try {
				paramJson = JSONObject.parseObject(jsonStr);
			} catch (Exception e) {
				LOGGER.error("参数字符串转Json失败,字符串：{}", jsonStr);
				LOGGER.error(e.getMessage(), e);
				return;
			}
			String userName = GetSysInfoUtil.getUserName(request);
			String userId = GetSysInfoUtil.getUserId(request);
			if (paramJson.getString("userId") == null) {
				paramJson.put("userId", userId);
			}
			if (paramJson.getString("userName") == null) {
				paramJson.put("userName", userName);
			}

			// 监控点摄像机编号,国标编号 在此生成
			if (requestURI.contains("addHaveCamera") || requestURI.contains("addNoCamera")) {
				if (Objects.isNullString(paramJson.getString("cameraDevId"))) {
					// TODO
					// NOTE
					// 此处的生成的摄像机编号的方式存在重复隐患
					paramJson.put("cameraDevId", ErrorAbnormal.timeToTen());
				}
			}



			request.setBody(paramJson.toJSONString().getBytes("UTF-8"));

			filterChain.doFilter(request, response);
			new Thread(new FilterProcess(paramJson, requestURI)).start();
			// 字典同步
		} else if (isSync && syncDictHttpList.contains(requestUrl)) {
			BodyReaderHttpServletRequestWrapper request = new BodyReaderHttpServletRequestWrapper(httpServletRequest);
			StatusExposingServletResponse response = new StatusExposingServletResponse(
					(HttpServletResponse) servletResponse);

			String requestURI = request.getRequestURI();
			String jsonStr = HttpTool.readJSONString(request);
			JSONObject paramJson = null;
			try {
				paramJson = JSONObject.parseObject(jsonStr);
			} catch (Exception e) {
				LOGGER.error("参数字符串转Json失败,字符串：{}", jsonStr);
				LOGGER.error(e.getMessage(), e);
			}

			// 系统码同步时，不同步 颜色，事件归类
			if ("/IntegratedMM/syscode/add.do".equals(requestUrl)
					|| "/IntegratedMM/syscode/update.do".equals(requestUrl)
					|| "/IntegratedMM/sysCode/updateSysCodeByCodeId.do".equals(requestUrl)) {
				JSONObject sysCodePojo = paramJson.containsKey("sysCodePojo")?paramJson.getJSONObject("sysCodePojo"):null;
				if(sysCodePojo!=null){
					sysCodePojo.remove("er_Color");
					sysCodePojo.put("evtWay", -1);
				}else{
					paramJson.remove("er_Color");
					paramJson.put("evtWay", -1);
				}
			}

			filterChain.doFilter(request, response);
			new Thread(new FilterProcessForDict(paramJson, requestURI)).start();
			// 其他请求
		} else {
			filterChain.doFilter(servletRequest, servletResponse);
		}
	}

	@Override
	public void destroy() {
	}

}
