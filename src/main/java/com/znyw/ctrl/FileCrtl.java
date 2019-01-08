package com.znyw.ctrl;

import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.ResultPojo;
import com.znyw.service.FileUpLoadService;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ImageUtil;

@Controller
@RequestMapping("/file")
public class FileCrtl {

	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	@Resource
	private FileUpLoadService fileUpLoadService;

	@RequestMapping(value = "/upload")
	@ResponseBody
	public String uploadFile(HttpServletRequest request,
			@RequestParam("file") MultipartFile file,
			@RequestParam("jsonStr") String jsonStr) {

		ResultPojo resultPojo = new ResultPojo();
		try {
			JSONObject json = JSONObject.parseObject(jsonStr);
			if (!json.containsKey("dataFrom")
					|| "".equals(json.get("dataFrom"))) {
				json.put("dataFrom", ConfigUtil.getPlatformId());
			}
			String ownerId = json.getString("ownerId");
			String mapName = json.getString("mapName");
			String mapId = json.getString("mapId");
			resultPojo = fileUpLoadService.upLoadFile(file, ownerId, mapName,
					mapId, json.getString("dataFrom"));

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			resultPojo.setResult("1", "文件上传错误", e.getMessage());
		}
		return resultPojo.getReturnVal().toJSONString();
	}

	@RequestMapping(value = "/GetImage", method = RequestMethod.GET)
	public void GetImage(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		try {
			String path = HttpTool.readJSONString(request);
			byte[] buffer = ImageUtil.GetImage(path);
			response.reset();
			response.addHeader("Content-Type", "image/jpeg");
			response.addHeader("Content-Length", "" + buffer.length);
			response.addHeader("Accept-Ranges", "bytes");
			OutputStream toClient = new BufferedOutputStream(
					response.getOutputStream());
			toClient.write(buffer);
			toClient.flush();
			toClient.close();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			throw e;
		}
	}
}
