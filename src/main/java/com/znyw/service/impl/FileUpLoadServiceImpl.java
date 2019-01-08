package com.znyw.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.znyw.dao.ZoneDao;
import com.znyw.dao.impl.UserDaoImp;
import com.znyw.pojo.ResultPojo;
import com.znyw.service.FileUpLoadService;
import com.znyw.tool.FileTool;
import com.znyw.tool.Objects;
import com.znyw.tool.PropertyConfigUtil;
import com.znyw.tool.UploadUtil;

@Service("FileUpLoadService")
public class FileUpLoadServiceImpl implements FileUpLoadService {

	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	private static PropertyConfigUtil propertyConfigUtil = PropertyConfigUtil
			.getInstance("properties/config.properties");
	@Resource
	private ZoneDao zoneDao;
	@Resource
	UserDaoImp userDaoImp;

	@Override
	public ResultPojo upLoadFile(MultipartFile file, String ownerId,
			String mapName, String mapId, String dataFrom) {
		ResultPojo resultPojo = new ResultPojo();
		try {
			// 返回文件路径
			String mapPath = UploadUtil.Upload(file); // 文件上传

			Map<String, Object> map = zoneDao.getOldFileWithMapName(ownerId,
					mapName);

			boolean uploaded = false;
			if (Objects.isNotNull(map)) {
				uploaded = zoneDao.updateMappic(ownerId, mapName, mapId,
						mapPath);
				String imageSrvUrl = propertyConfigUtil
						.getValue("imageSrv.url");
				String oldPath = map.get("mapPath").toString();
				String fileName = oldPath.replace(imageSrvUrl, "");
				FileTool.delFile(fileName); // 删除原来的文件

				// 将旧防区图上的防区更新到新的防区图
				zoneDao.updateMapIdForOwnerzoneByOldMapId(mapId,
						map.get("mapId").toString());

			} else {
				uploaded = zoneDao.insertMappic(ownerId, mapName, mapId,
						mapPath, dataFrom);
			}

			List<Map<String, Object>> list = userDaoImp.getUserzoneByOwnerId(
					ownerId, mapId);

			if (uploaded) {
				resultPojo.setResult("0", "success");
				resultPojo.setPojo("zonePojo", list);
				resultPojo.setPojo("mapId", mapId);
				resultPojo.setPojo("uploadFile", mapPath);
			} else {
				resultPojo.setResult("1", "uploadResult success but db fail");
			}
			return resultPojo;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			resultPojo.setResult("1", "文件保存失败", e.getMessage());
			return resultPojo;
		}
	}

}
