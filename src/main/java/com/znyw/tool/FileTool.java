package com.znyw.tool;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.Calendar;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FileTool {

	private final static Logger log = LoggerFactory.getLogger(FileTool.class);

	// 生成文件路径
	private static String path = "F:\\work\\JAVA\\workspace\\jiechujing\\RDAcenter_new\\text\\";

	// 文件路径+名称
	private static String filenameTemp;

	/**
	 * 创建文件
	 * 
	 * @param fileName
	 *            文件名称
	 * @param filecontent
	 *            文件内容
	 * @return 是否创建成功，成功则返回true
	 */
	public static boolean createFile(String fileName, String filecontent) {
		Boolean bool = false;
		filenameTemp = path + fileName + ".txt";// 文件路径+名称+文件类型
		File file = new File(filenameTemp);
		try {
			// 如果文件不存在，则创建新的文件
			if (!file.exists()) {
				file.createNewFile();
				bool = true;
				System.out
						.println("FileTool createFile success create file,the file is "
								+ filenameTemp);
				// 创建文件成功后，写入内容到文件里
				writeFileContent(filenameTemp, filecontent);
			} else {
				log.error("FileTool createFile fail 文件已存在,filenameTemp={}",
						filenameTemp);
			}
		} catch (Exception e) {
			log.error("FileTool createFile err,e={}", e.toString());
		}
		return bool;
	}

	/**
	 * 向文件中写入内容
	 * 
	 * @param filepath
	 *            文件路径与名称
	 * @param newstr
	 *            写入的内容
	 * @return
	 * @throws IOException
	 */
	public static boolean writeFileContent(String filepath, String newstr)
			throws IOException {
		Boolean bool = false;
		String filein = newstr + "\r\n";// 新写入的行，换行
		String temp = "";

		FileInputStream fis = null;
		InputStreamReader isr = null;
		BufferedReader br = null;
		FileOutputStream fos = null;
		PrintWriter pw = null;
		try {
			File file = new File(filepath);// 文件路径(包括文件名称)
			// 将文件读入输入流
			fis = new FileInputStream(file);
			isr = new InputStreamReader(fis);
			br = new BufferedReader(isr);
			StringBuffer buffer = new StringBuffer();

			// 文件原有内容
			for (int i = 0; (temp = br.readLine()) != null; i++) {
				buffer.append(temp);
				// 行与行之间的分隔符 相当于“\n”
				buffer = buffer.append(System.getProperty("line.separator"));
			}
			buffer.append(filein);

			fos = new FileOutputStream(file);
			pw = new PrintWriter(fos);
			pw.write(buffer.toString().toCharArray());
			pw.flush();
			bool = true;
		} catch (Exception e) {
			log.error("FileTool writeFileContent err,e={}", e.toString());
		} finally {
			// 不要忘记关闭
			if (pw != null) {
				pw.close();
			}
			if (fos != null) {
				fos.close();
			}
			if (br != null) {
				br.close();
			}
			if (isr != null) {
				isr.close();
			}
			if (fis != null) {
				fis.close();
			}
		}
		return bool;
	}

	/**
	 * 删除文件
	 * 
	 * @param fileName
	 *            文件名称
	 * @return
	 */
	public static boolean delFile(String fileName) {
		Boolean bool = false;
		File file = new File(fileName);
		try {
			if (file.exists()) {
				file.delete();
				bool = true;
			}
			return bool;
		} catch (Exception e) {
			log.error("FileTool delFile err,e={}", e.toString());
			throw e;
		}
	}

	/**
	 * 判断文件是否存在
	 * 
	 * @param path
	 * @return
	 */
	public static boolean isExistFile(String path) {
		File file = new File(path);
		if (file.exists()) {
			return true;
		}
		return false;
	}

	/**
	 * 创建目录
	 * 
	 * @param result
	 * @return
	 */
	public static boolean CreateDirectory(String path) {
		File file = new File(path);
		if (!file.exists()) {
			return file.mkdirs();
		}
		return true;
	}

	/**
	 * 按时间重命名
	 * 
	 * @param result
	 * @return
	 */
	public static String GetDatePath(String path) {
		Calendar now = Calendar.getInstance();
		// path+=(now.get(Calendar.YEAR)+"\\"+(now.get(Calendar.MONTH) +
		// 1)+"\\"+now.get(Calendar.DAY_OF_MONTH)+"\\");
		path += ("\\" + now.get(Calendar.DAY_OF_MONTH) + "\\");
		return path;
	}

}
