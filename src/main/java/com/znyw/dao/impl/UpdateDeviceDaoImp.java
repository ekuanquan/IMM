package com.znyw.dao.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.UpdateDevice;



/**
 * 添加各种设备
 * @author ywhl
 *
 */

@Repository("UpdateDevice")
public class UpdateDeviceDaoImp implements UpdateDevice{
	
	private Logger log = Logger.getLogger(getClass());

	@Resource
	private JdbcTemplate jdbcTemplate;
	
	public int updaAlarmhostImp(JSONObject json){			//更新报警主机信息
		String sql = " UPDATE imm_devinfo SET devName='?' WHERE devId = '030002350'  ";
		int devce = jdbcTemplate.queryForInt(sql);													
		return devce;
	}	
	
}























