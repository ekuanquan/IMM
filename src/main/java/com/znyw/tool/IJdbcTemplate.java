package com.znyw.tool;

import java.util.Collection;
import java.util.List;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
/**
 * <p class="detail">
 * 功能：重写jdbcTempLate工具, 
 *  覆盖queryForObject报org.springframework.dao.EmptyResultDataAccessException: 
Incorrect result size: expected 1, actual 0 错误 
 * </p>
 * @ClassName: IJdbcTemplate 
 * @version V1.0  
 * @date 2017-1-12  
 */

//@Component   //如果加@Component@Repository，@Resource就不会从Spring注入；而是直接找到这里
public class IJdbcTemplate extends JdbcTemplate {
	    
	@Override
	public <T> T queryForObject(String sql, RowMapper<T> rowMapper) throws DataAccessException { 
		
		List<T> results = query(sql, new RowMapperResultSetExtractor<T>(rowMapper, 1)); 
		return IJdbcTemplate.requiredSingleResult(results);  
	} 
	
	@Override 
	public <T> T queryForObject(String sql,  RowMapper<T> rowMapper,Object[] args) throws DataAccessException { 
		
		List<T> results = query(sql, args, new RowMapperResultSetExtractor<T>(rowMapper, 1)); 
		return IJdbcTemplate.requiredSingleResult(results);  
	} 
	
	public static <T> T requiredSingleResult(Collection<T> results) throws IncorrectResultSizeDataAccessException {
		
		int size = (results != null ? results.size() : 0); 
		if (size == 0) { 
			return null; 
		} 
		if (results.size() > 1) { 
			throw new IncorrectResultSizeDataAccessException(1, size);
		}
		return results.iterator().next();
	}
}