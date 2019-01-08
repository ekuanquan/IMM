package com.znyw.tool;

import java.util.List;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.Pagepojo;

public class ResultUtil {


	public static JSONObject simpleResponse(Integer code, String message) {
		JSONObject jsonResult = new JSONObject();
		JSONObject result = new JSONObject();
		jsonResult.put("code", code);
		jsonResult.put("message", message);
		jsonResult.put("result", result);
		return jsonResult;
	}

	public static JSONObject simpleResponse(Integer code, String message, String detail) {
		JSONObject jsonResult = new JSONObject();
		JSONObject result = new JSONObject();
		jsonResult.put("code", code);
		jsonResult.put("message", message);
		jsonResult.put("detail", detail);
		jsonResult.put("result", result);
		return jsonResult;
	}

	public static JSONObject simpleResponse(String code, String message) {
		JSONObject jsonResult = new JSONObject();
		jsonResult.put("code", code);
		jsonResult.put("message", message);
		jsonResult.put("result", "{}");
		return jsonResult;
	}

	public static JSONObject simpleResponse(String code, String message, String detail) {
		JSONObject jsonResult = new JSONObject();
		jsonResult.put("code", code);
		jsonResult.put("message", message);
		jsonResult.put("detail", detail);
		jsonResult.put("result", "{}");
		return jsonResult;
	}

	public static JSONObject simpleResponse(String code, String message, Object object) {
		JSONObject jsonResult = new JSONObject();
		jsonResult.put("code", code);
		jsonResult.put("message", message);

		JSONObject json = new JSONObject();
		json.put("data", object);

		jsonResult.put("result", json);

		return jsonResult;
	}

	public static JSONObject simpleResponse(String code, String message, Object object, Pagepojo pagepojo) {
		JSONObject jsonResult = new JSONObject();
		jsonResult.put("code", code);
		jsonResult.put("message", message);

		JSONObject json = new JSONObject();
		json.put("data", object);
		json.put("pagepojo", pagepojo);

		jsonResult.put("result", json);

		return jsonResult;
	}

	public static <T> JSONObject jsonResultList(Integer code, String message, List<T> list) {
		JSONObject jsonResult = new JSONObject();
		jsonResult.put("code", code);
		jsonResult.put("message", message);
		jsonResult.put("result", list);
		return jsonResult;
	}

	public static <T> JSONObject jsonResultList(Integer code, String message, List<T> list, JSONObject pageInfo) {
		JSONObject jsonResult = new JSONObject();
		jsonResult.put("code", code);
		jsonResult.put("message", message);
		jsonResult.put("result", list);
		jsonResult.put("pageInfo", pageInfo);
		return jsonResult;
	}

	public static <T> JSONObject jsonResultBasic(Integer code, String message, T obj) {
		JSONObject jsonResult = new JSONObject();
		jsonResult.put("code", code);
		jsonResult.put("message", message);
		jsonResult.put("result", obj);
		return jsonResult;
	}

	public static <T> JSONObject jsonResultList2(Integer code, String message, List<T> list, JSONObject pageInfo) {
		JSONObject jsonResult2 = new JSONObject();
		jsonResult2.put("code", code);
		jsonResult2.put("message", message);
		JSONObject jsonResult = new JSONObject();
		jsonResult.put("result", jsonResult2);
		jsonResult.put("json", list);
		jsonResult.put("pageInfoPojo", pageInfo);
		return jsonResult;
	}

}
