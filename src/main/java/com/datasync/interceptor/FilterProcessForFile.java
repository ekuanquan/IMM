package com.datasync.interceptor;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.fastjson.JSONObject;

public class FilterProcessForFile extends FilterProcess {
	private static final Logger LOGGER = LoggerFactory.getLogger(FilterProcessForFile.class);

	public static final String INSERT_SQL = "insert into request_records (id,url,parameter,mark_place) values (?,?,?,?)";

	// 如果有需要，重写 run()
	@SuppressWarnings("unused")
	private MultipartFile multipartFile;

	public FilterProcessForFile(JSONObject paramJson, String requestUrl, MultipartFile multipartFile) {
		super(paramJson, requestUrl);
		this.multipartFile=multipartFile;
	}

	public void handle(String url, JSONObject paramater) {
		try {
			dataSyncJdbcTemplate.update(INSERT_SQL, UUID.randomUUID().toString().replace("-", ""), url,
					paramater.toJSONString(), 2);
		} catch (Exception e) {
			LOGGER.info("入库失败:{}->{}", url, paramater.toJSONString());
			LOGGER.error(e.getMessage(), e);
		}
	}

}
