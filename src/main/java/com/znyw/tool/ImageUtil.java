package com.znyw.tool;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ImageUtil {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(ImageUtil.class);

	public static byte[] GetImage(String path) throws IOException {
		FileInputStream fis = null;
		try {
			fis = new FileInputStream(new File(path));
			int filelong = fis.available();
			byte[] long_buf = new byte[filelong];
			fis.read(long_buf);
			return long_buf;
		} catch (IOException e) {
			LOGGER.error(e.getMessage(), e);
			throw e;
		} finally {

			if (fis != null) {
				try {
					fis.close();
				} catch (IOException e) {
					// NO LOG
				}
			}
		}
	}
}
