package com.datasync.interceptor;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.alibaba.fastjson.JSONObject;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.Objects;

public class FilterProcess implements Runnable {
	private static final Logger LOGGER = LoggerFactory.getLogger(FilterProcess.class);
	private static final ClassPathXmlApplicationContext appContextData;
	protected static final JdbcTemplate dataSyncJdbcTemplate;

	public static final String INSERT_SQL = "insert into request_records (id,url,parameter,mark_place) values (?,?,?,?)";

	private JSONObject paramJson;
	private String requestUrl;

	static {
		appContextData = new ClassPathXmlApplicationContext("ApplicationContext/Application-mysql-data-source.xml");
		dataSyncJdbcTemplate = (JdbcTemplate) appContextData.getBean("dataSyncJdbcTemplate");
	}

	public FilterProcess(JSONObject paramJson, String requestUrl) {
		this.paramJson = paramJson;
		this.requestUrl = requestUrl;
	}

	@Override
	public void run() {

		if (Objects.isNullString(paramJson.getString("dataFrom"))) {
			paramJson.put("dataFrom", ConfigUtil.getPlatformId());
		}

		if (Objects.isNullString(paramJson.getString("platformId"))) {
			paramJson.put("platformId", ConfigUtil.getPlatformId());
		}

		handle(requestUrl, paramJson);

	}

	public void handle(String url, JSONObject paramater) {
		try {

			if (url.contains("roleArea/add") || url.contains("roleArea/update")) {

				JSONObject json = new JSONObject();

				json.put("roleId", paramater.getString("roleId"));
				json.put("roleType", paramater.getString("roleType"));

				dataSyncJdbcTemplate.update(INSERT_SQL, UUID.randomUUID().toString().replace("-", ""), url,
						json.toJSONString(), 1);
			} else {
				dataSyncJdbcTemplate.update(INSERT_SQL, UUID.randomUUID().toString().replace("-", ""), url,
						paramater.toJSONString(), 0);
			}

		} catch (Exception e) {
			LOGGER.info("入库失败:{}->{}", url, paramater.toJSONString());
			LOGGER.error(e.getMessage(), e);
		}
	}

	public static void main(String[] args) {

		System.out.println(UUID.randomUUID().toString());
	}

}
