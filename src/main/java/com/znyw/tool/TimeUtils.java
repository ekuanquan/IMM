package com.znyw.tool;

import java.text.SimpleDateFormat;
import java.util.Date;

public class TimeUtils {

	public static String getTimeStart(String timeStart) {

		if (Objects.isNullString(timeStart)) {
			return "";
		}
		return timeStart;
	}

	public static String getTimeEnd(String timeEnd) {
		if (Objects.isNullString(timeEnd)) {
			return "";
		}
		return timeEnd;
	}

	public static String getTimeStartOrDefault(String timeStart) {

		if (Objects.isNullString(timeStart)) {
			return "1970-01-01";
		}
		return timeStart;
	}

	public static String getTimeEndOrDefault(String timeEnd) {

		if (Objects.isNullString(timeEnd)) {
			return new SimpleDateFormat("yyyy-MM-dd").format(new Date());
		}
		return timeEnd;
	}

	/**
	 * 获取时间差，返回秒数
	 * 
	 * @param begin
	 * @param end
	 * @return
	 */
	public static double timeGap(long begin, long end) {
		return (end - begin) * 1.0 / 1000;
	}

}
