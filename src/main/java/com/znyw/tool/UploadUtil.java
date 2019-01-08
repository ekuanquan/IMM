package com.znyw.tool;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

import org.slf4j.Logger;
import org.springframework.web.multipart.MultipartFile;



public class UploadUtil {
	private static final Logger LOGGER = org.slf4j.LoggerFactory.getLogger(UploadUtil.class);
	private static PropertyConfigUtil propertyConfigUtil = PropertyConfigUtil
			.getInstance("properties/config.properties");
	
	public static String Upload(MultipartFile file) {
		boolean result = false;
		//String strFileType = file.getContentType();
		String strNewFileName = UUID.randomUUID().toString();
		String strOldFileName = file.getOriginalFilename();

		String[] strArr = strOldFileName.split("\\.");
		if (strArr.length > 1)
			strNewFileName += ("." + strArr[strArr.length - 1]);
		String storePath = propertyConfigUtil.getValue("imageSrv.storePath");
		//String storePath = "G:\\uploadProject\\";
		storePath = FileTool.GetDatePath(storePath);			//按日期创建文件夹
		if(!FileTool.CreateDirectory(storePath)){		//创建文件夹
			result = false;
		}
		String path = storePath + strNewFileName;
		LOGGER.info("存储文件的路径path：{}", path);
		try {
			result = SaveFileFromInputStream(file.getInputStream(), path);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			result = false;
		}
		if(result){
			String pre = propertyConfigUtil.getValue("imageSrv.url");
			path = path.replace("\\", "/");
			String[] strpath = path.split("/");
			String finalPath = pre + "/" + strpath[strpath.length - 2] + "/" + strpath[strpath.length - 1];
			LOGGER.info("数据库存储路径：{}", finalPath);
			return finalPath;
		}else{
			return "";
		}
	}
	
	public static boolean SaveFileFromInputStream(InputStream stream, String path) {
		FileOutputStream fs = null;
		try {
			fs = new FileOutputStream(path);
			byte[] buffer = new byte[1024 * 1024];
			int byteread = 0;
			while ((byteread = stream.read(buffer)) != -1) {
				fs.write(buffer, 0, byteread);
				fs.flush();
			}

		} catch (FileNotFoundException e) {
			LOGGER.error(e.getMessage(), e);
			return false;
		} catch (IOException e) {
			LOGGER.error(e.getMessage(), e);
			return false;
		} finally {
			try {
				if(fs!=null) {
					fs.close();
				}
				if (stream != null) {
					stream.close();
				}
			} catch (IOException e) {
				// NO LOG
			}
		}
		return true;
	}
	
	//删除文件
	public static boolean delFile(String path) {
		try {
			File f = new File(path);  // 输入要删除的文件位置
			if(f.exists()){
				f.delete();
			} 
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return false;
		} 
		return true;
	}
}
