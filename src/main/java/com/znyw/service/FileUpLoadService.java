package com.znyw.service;

import org.springframework.web.multipart.MultipartFile;

import com.znyw.pojo.ResultPojo;

public interface FileUpLoadService {

	public ResultPojo upLoadFile(MultipartFile file, String ownerId, String mapName, String mapId, String dataFrom);
	
}
