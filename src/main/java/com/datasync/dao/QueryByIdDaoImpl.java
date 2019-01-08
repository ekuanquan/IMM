package com.datasync.dao;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

public class QueryByIdDaoImpl implements IQueryByIdDao {
	private final static Logger logger = LoggerFactory.getLogger(QueryByIdDaoImpl.class);
	private JdbcTemplate jdbcTemplate;

	public QueryByIdDaoImpl(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	public QueryPojo queryForImm_dealway(String ownerId, String dealWayId) {
		if(StringUtils.isEmpty(ownerId)||StringUtils.isEmpty(dealWayId)){
			return null;
		}
		String sql="select ownerId,dataFrom from imm_dealway where ownerId='%s' and dealWayId = '%s'";
		sql=String.format(sql,ownerId,dealWayId);
		final String idName="ownerId";
		return getQueryPojo(sql, idName);
	}

	@Override
	public QueryPojo queryForImm_devInfo(String devId) {
		if(StringUtils.isEmpty(devId)){
			return null;
		}
		String sql = "select devId,dataFrom from imm_devinfo where devId='%s'";
		sql=String.format(sql,devId);
		final String idName="devId";
		return getQueryPojo(sql, idName);
	}

	@Override
	public QueryPojo queryForImm_wirenvrattr(String devId) {
		if(StringUtils.isEmpty(devId)){
			return null;
		}
		String sql="select devId,dataFrom from imm_wirenvrattr where devId='%s'";
		sql=String.format(sql,devId);
		final String idName="devId";
		return getQueryPojo(sql, idName);
	}

	@Override
	public QueryPojo queryFormm_netnvrattr(String devId) {
		if(StringUtils.isEmpty(devId)){
			return null;
		}
		String sql="select devId,dataFrom from imm_netnvrattr where devId='%s'";
		sql=String.format(sql,devId);
		final String idName="devId";
		return getQueryPojo(sql, idName);
	}

	@Override
	public QueryPojo queryForImm_devzone(String devId, String devZoneId) {
		if(StringUtils.isEmpty(devId)||StringUtils.isEmpty(devZoneId)){
			return null;
		}
		String sql="select devId,dataFrom from imm_devzone where devId='%s' and devZoneId = '%s'";
		sql=String.format(sql,devId,devZoneId);
		final String idName="devId";
		return getQueryPojo(sql, idName);
	}

	@Override
	public QueryPojo queryForImm_camera(String devId) {
		if(StringUtils.isEmpty(devId)){
			return null;
		}
		String sql="select devId,dataFrom from imm_camera where devId='%s'";
		sql=String.format(sql,devId);
		final String idName="devId";
		return getQueryPojo(sql, idName);
	}

	@Override
	public QueryPojo queryForImm_area(String areaId) {
		if(StringUtils.isEmpty(areaId)){
			return null;
		}
		String sql="select areaId,dataFrom from imm_area where areaId='%s'";
		sql=String.format(sql,areaId);
		final String idName="areaId";
		return getQueryPojo(sql, idName);
	}

	@Override
	public QueryPojo queryForImm_tgpscarattr(String devId) {
		if(StringUtils.isEmpty(devId)){
			return null;
		}
		String sql="select devId,dataFrom from imm_tgpscarattr where devId='%s'";
		sql=String.format(sql, devId);
		final String idName="devId";
		return getQueryPojo(sql, idName);
	}

	@Override
	public QueryPojo queryForImm_ownermonitor(String ownerMonitorId,String ownerId) {
		if(StringUtils.isEmpty(ownerMonitorId)||StringUtils.isEmpty(ownerId)){
			return null;
		}
		String sql="select ownerMonitorId,dataFrom from imm_ownermonitor where ownerMonitorId='%s' and ownerId='%s'";
		sql=String.format(sql, ownerMonitorId,ownerId);
		final String idName="ownerMonitorId";
		return getQueryPojo(sql, idName);
	}

	@Override
	public QueryPojo queryForImm_ownerevtrecord(String UserEvtId) {
		if(StringUtils.isEmpty(UserEvtId)){
			return null;
		}
		String sql="select UserEvtId,dataFrom from imm_ownerevtrecord where UserEvtId='%s'";
		sql=String.format(sql, UserEvtId);
		final String idName="UserEvtId";
		return getQueryPojo(sql, idName);
	}

	@Override
	public QueryPojo queryForImm_roleinfo(String roleId) {
		if(StringUtils.isEmpty(roleId)){
			return null;
		}
		String sql="select roleId,dataFrom from imm_roleinfo where roleId='%s'";
		sql=String.format(sql, roleId);
		final String idName="roleId";
		return getQueryPojo(sql, idName);
	}

	@Override
	public QueryPojo queryForImm_syscode(String codeId) {
		if(StringUtils.isEmpty(codeId)){
			return null;
		}
		String sql="select codeId,dataFrom from imm_syscode where codeId='%s'";
		sql=String.format(sql, codeId);
		final String idName="codeId";
		return getQueryPojo(sql, idName);
	}

	@Override
	public QueryPojo queryForImm_systemconfig(String dataName) {
		if(StringUtils.isEmpty(dataName)){
			return null;
		}
		String sql="select dataName,dataFrom from imm_systemconfig where dataName='%s'";
		sql=String.format(sql, dataName);
		final String idName="dataName";
		return getQueryPojo(sql, idName);
	}

	@Override
	public QueryPojo queryForImm_usercont(String userId, String contId) {
		if(StringUtils.isEmpty(userId)||StringUtils.isEmpty(contId)){
			return null;
		}
		String sql="select userId,dataFrom from imm_usercont where userId='%s' and contId='%s'";
		sql=String.format(sql, userId,contId);
		final String idName="userId";
		return getQueryPojo(sql, idName);
	}

	@Override
	public QueryPojo queryForImm_userinfo(String userId) {
		if(StringUtils.isEmpty(userId)){
			return null;
		}
		String sql="select userId,dataFrom from imm_userinfo where userId='%s'";
		sql=String.format(sql, userId);
		final String idName="userId";
		return getQueryPojo(sql, idName);
	}

	@Override
	public QueryPojo queryForImm_userplanevent(String userId) {
		if(StringUtils.isEmpty(userId)){
			return null;
		}
		String sql="select userId,dataFrom from imm_userplanevent where userId='%s'";
		sql=String.format(sql, userId);
		final String idName="userId";
		return getQueryPojo(sql, idName);
	}

	@Override
	public QueryPojo queryForImm_ownerzone(String ownerId, String devZoneId) {
		if(StringUtils.isEmpty(ownerId)||StringUtils.isEmpty(devZoneId)){
			return null;
		}
		String sql="select userId,dataFrom from imm_ownerzone where ownerId='%s' and devZoneId='%s'";
		sql=String.format(sql, ownerId,devZoneId);
		final String idName="ownerId";
		return getQueryPojo(sql, idName);
	}

	@Override
	public QueryPojo queryForImm_ownerzoneByOwnerZoneName(String ownerId, String ownerZoneName) {
		if(StringUtils.isEmpty(ownerId)||StringUtils.isEmpty(ownerZoneName)){
			return null;
		}
		String sql="select ownerId,dataFrom from imm_ownerzone where ownerId='%s' and ownerZoneName='%s'";
		sql=String.format(sql, ownerId,ownerZoneName);
		final String idName="ownerId";
		return getQueryPojo(sql, idName);
	}

	public QueryPojo queryForImm_oneClickDev(String devId) {

		if (StringUtils.isEmpty(devId)) {
			return null;
		}
		String sql = "select devId,dataFrom from imm_devinfo where devId='%s'";
		sql = String.format(sql, devId);
		final String idName = "devId";
		return getQueryPojo(sql, idName);

	}

	private QueryPojo getQueryPojo(String sql, final String idName) {
		QueryPojo queryPojo= null;
		queryPojo = jdbcTemplate.queryForObject(sql, new RowMapper<QueryPojo>() {
			@Override
			public QueryPojo mapRow(ResultSet rs, int rowNum) throws SQLException {
				QueryPojo pojo=new QueryPojo();
				pojo.setId(rs.getString(idName));
				pojo.setDataFrom(rs.getString("dataFrom"));
				return pojo;
			}
		});
		return queryPojo;
	}

	@Override
	public QueryPojo queryForImm_assemble(String id) {

		if (StringUtils.isEmpty(id)) {
			return null;
		}
		String sql = "select id,dataFrom from imm_assemble_cfg where id='%s'";
		sql = String.format(sql, id);
		final String idName = "id";
		return getQueryPojo(sql, idName);
	}

}
