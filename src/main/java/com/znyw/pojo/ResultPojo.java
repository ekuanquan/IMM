package com.znyw.pojo;

import java.nio.charset.Charset;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.alibaba.fastjson.JSONObject;

/**
 * HttpServletRequest 对象数据解包保存
 * 
 * @author Administrator
 *
 */
public class ResultPojo {
	JSONObject returnVal = new JSONObject();

	public void setResult(String code, String message) {
		JSONObject result = new JSONObject();
		result.put("code", code);
		result.put("message", message);

		returnVal.put("result", result);
	}

	public void setResult(String code, String message, String detail) {
		JSONObject result = new JSONObject();
		result.put("code", code);
		result.put("message", message);
		result.put("detail", detail);

		returnVal.put("result", result);
	}

	public String getCode() {

		JSONObject result = JSONObject.parseObject(returnVal
				.getString("result"));
		return result.getString("code");
	}

	public String getMessage() {
		JSONObject result = JSONObject.parseObject(returnVal
				.getString("result"));
		return result.getString("message");
	}

	public void setPojo(String pojoName, Object pojo) {
		returnVal.put(pojoName, pojo);
	}

	public ResponseEntity<String> GetResponseEntity() {
		String result = returnVal.toJSONString();
		HttpHeaders responseHeaders = new HttpHeaders();
		MediaType mediaType = new MediaType("text", "html",
				Charset.forName("UTF-8"));
		responseHeaders.setContentType(mediaType);
		return new ResponseEntity<String>(result, responseHeaders,
				HttpStatus.OK);
	}

	public JSONObject getReturnVal() {
		return returnVal;
	}

	// 服务器异常
	public static ResponseEntity<String> INTERNAL_SERVER_ERROR(String code) {
		JSONObject result = new JSONObject();
		result.put("code", code);
		result.put("message", "INTERNAL_SERVER_ERROR.");// 服务器异常
		HttpHeaders responseHeaders = new HttpHeaders();
		MediaType mediaType = new MediaType("text", "html",
				Charset.forName("UTF-8"));
		responseHeaders.setContentType(mediaType);
		return new ResponseEntity<String>(result.toJSONString(),
				responseHeaders, HttpStatus.OK);
	}

	// 服务器异常
	public static ResponseEntity<String> INTERNAL_SERVER_ERROR(String code,
			String detail) {
		JSONObject result = new JSONObject();
		result.put("code", code);
		result.put("detail", detail);
		result.put("message", "INTERNAL_SERVER_ERROR.");// 服务器异常
		HttpHeaders responseHeaders = new HttpHeaders();
		MediaType mediaType = new MediaType("text", "html",
				Charset.forName("UTF-8"));
		responseHeaders.setContentType(mediaType);
		return new ResponseEntity<String>(result.toJSONString(),
				responseHeaders, HttpStatus.OK);
	}

	// 缺少参数
	public static ResponseEntity<String> LACK_OF_PARAMETER(String code) {
		JSONObject result = new JSONObject();
		result.put("code", code);
		result.put("message", "LACK OF PARAMETER.");// 缺少参数
		HttpHeaders responseHeaders = new HttpHeaders();
		MediaType mediaType = new MediaType("text", "html",
				Charset.forName("UTF-8"));
		responseHeaders.setContentType(mediaType);
		return new ResponseEntity<String>(result.toJSONString(),
				responseHeaders, HttpStatus.OK);
	}

	// 关键字的值 超过范围
	public static ResponseEntity<String> PRECONDITION_FAILED(String code,
			String key) {
		JSONObject result = new JSONObject();
		result.put("code", code);
		result.put("message", key + " Out Of Bounds.");// 缺少参数
		HttpHeaders responseHeaders = new HttpHeaders();
		MediaType mediaType = new MediaType("text", "html",
				Charset.forName("UTF-8"));
		responseHeaders.setContentType(mediaType);
		return new ResponseEntity<String>(result.toJSONString(),
				responseHeaders, HttpStatus.OK);
	}
}
