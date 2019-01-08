package com.znyw.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.znyw.pojo.Area;
import com.znyw.service.AreaService;
import com.znyw.tool.TimeUtils;

@Service
public class AreaTree {
	private static final Logger LOGGER = LoggerFactory.getLogger(AreaTree.class);

	private static Map<String, Area> allAreas = new ConcurrentHashMap<String, Area>();

	@Resource
	private AreaService areaService;

	public void init() throws Exception {

		long begin = new Date().getTime();

		List<Area> areas = areaService.getAllAreas();
		for (Area area : areas) {
			area.setChilds(getChilds(area));
			allAreas.put(area.getAreaId(), area);
		}

		long end = new Date().getTime();

		LOGGER.info("\n\n区域信息初始化完成,耗时:{} 秒...", TimeUtils.timeGap(begin, end));
	}

	private List<Area> getChilds(Area area) throws Exception {

		List<Area> areas;

		areas = areaService.getChilds(area);

		List<Area> childAreas = new ArrayList<Area>();
		for (Area a : areas) {
			a.setChilds(getChilds(a));
			childAreas.add(a);
		}
		return childAreas;
	}


	public Set<String> getAllAreaIds(String areaId) {
		return allAreas.get(areaId).getAreaIds();
	}

	public void showAreaIds(String areaId) {
		LOGGER.info("{}", allAreas.get(areaId).getAreaIds().toString());
	}

	public void showArea() {
		for (String key : allAreas.keySet()) {
			LOGGER.info("{}", allAreas.get(key));
		}
	}

	public void reloadIfNeed() throws Exception {
		if (allAreas == null || allAreas.isEmpty()) {
			raload();
		}
	}

	public void raload() throws Exception {
		init();
	}


}
