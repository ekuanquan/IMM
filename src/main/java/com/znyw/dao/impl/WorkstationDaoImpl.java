package com.znyw.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.WorkstationDao;
import com.znyw.pojo.WorkstationPojo;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultUtil;

@Repository
public class WorkstationDaoImpl implements WorkstationDao {

	private static final Logger logger = Logger
			.getLogger(WorkstationDaoImpl.class);

	@Resource
	private JdbcTemplate jdbcTemplate;

	@Override
	public List<WorkstationPojo> getWorkstationList() throws Exception {
		String sql = "select * from imm_workstation_info";
		try {
			return jdbcTemplate.query(sql, new RowMapper<WorkstationPojo>() {
				@Override
				public WorkstationPojo mapRow(ResultSet rs, int rowNum)
						throws SQLException {
					WorkstationPojo pojo = new WorkstationPojo();
					pojo.setStationNum(rs.getString("stationNum"));
					pojo.setStationHost(rs.getString("stationHost"));
					pojo.setStationName(rs.getString("stationName"));
					pojo.setStationPort(rs.getInt("stationPort"));
					pojo.setfMemo(rs.getString("fMemo"));
					pojo.setSysCode(rs.getString("sysCode"));
					return pojo;
				}
			});
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public JSONObject saveWorkstation(WorkstationPojo pojo) throws Exception {
		
		String sqlCount = "select count(*) from imm_workstation_info where stationNum=?";
		//id主键int自增长类型
		String sql = "insert into imm_workstation_info (stationName,stationHost,stationNum,stationPort,sysCode,fMemo) value (?,?,?,?,?,?)";
		JSONObject jso = new JSONObject();
		JSONObject result = new JSONObject();
		try {
			List<Map<String,Object>> lists=jdbcTemplate.queryForList(sqlCount,pojo.getStationNum());
			int count =  Objects.isNull(lists)?0:Integer.valueOf(lists.get(0).get("count(*)").toString());
			
			if(count==0){
				jdbcTemplate.update(
						sql,
						new Object[] {pojo.getStationName(),
								pojo.getStationHost(), pojo.getStationNum(),
								pojo.getStationPort(), pojo.getSysCode(),
								pojo.getfMemo() });
				result.put("code", 200);
				result.put("message", "添加成功");
				jso.put("result", result);
				
			}else{
				result.put("code", 500);
				result.put("message", "工作站编号已存在");
				jso.put("result", result);
			}
			
		} catch (Exception e) {
			return ResultUtil.simpleResponse("201", "添加失败", e.getMessage());
		}
		return jso;
	}

	@Override
	public void updateWorkstation(WorkstationPojo pojo) throws Exception {
		String sql = "update imm_workstation_info set  stationName=?,stationHost=?,stationPort=?,sysCode=? ,fMemo=? where stationNum=?";
		try {
			jdbcTemplate.update(
					sql,
					new Object[] { pojo.getStationName(),
							pojo.getStationHost(), pojo.getStationPort(),
							pojo.getSysCode(), pojo.getfMemo(),
							pojo.getStationNum() });
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public void deleteWorkstationById(String stationNum) throws Exception {
		String sql = "delete from imm_workstation_info where stationNum=?";
		try {
			jdbcTemplate.update(sql, stationNum);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public WorkstationPojo getWorkstationById(String stationNum)
			throws Exception {
		String sql = "select * from imm_workstation_info where stationNum=?";
		try {
			return jdbcTemplate.queryForObject(sql,
					new Object[] { stationNum }, new BeanPropertyRowMapper<>(
							WorkstationPojo.class));
		} catch (Exception e) {
			throw e;
		}
	}
}
