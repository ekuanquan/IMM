package com.znyw.tool;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class ParesServer {
	static List<String> listResult = new ArrayList<String>();
	static List<String> listResultPath = new ArrayList<String>();
	
	public static void printAllFileNames(String path) {
        if (null != path) {
            File file = new File(path);
            if (file.exists()) {
                File[] list = file.listFiles();
                if(null != list){
                    for (File child : list) {
                        if (child.isFile()) {
                        	listResult.add(child.getName().substring(0, child.getName().lastIndexOf(".")));
                            String all = child.getAbsolutePath();
                            all = all.replace("C:\\Users\\ywhl\\Desktop\\ZoneMapUpLoad", "").replace("\\", "/");
                            listResultPath.add(all);
                        } else if (child.isDirectory()) {
                            printAllFileNames(child.getAbsolutePath());
                        }
                    }
                }
            }
        }
    }

	public static List<String> getListResult() {
		return listResult;
	}

	public static void setListResult(List<String> listResult) {
		ParesServer.listResult = listResult;
	}

	public static List<String> getListResultPath() {
		return listResultPath;
	}

	public static void setListResultPath(List<String> listResultPath) {
		ParesServer.listResultPath = listResultPath;
	}
	
	
	
}
