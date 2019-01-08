package com.znyw.pojo;

/**
 * 编号表实体类
 * 
 * @author Administrator
 *
 */
public class IdInfoPojo {

	private String id;
	private Integer userUsed;
	private Integer devUsed;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Integer getUserUsed() {
		return userUsed;
	}

	public void setUserUsed(Integer userUsed) {
		this.userUsed = userUsed;
	}

	public Integer getDevUsed() {
		return devUsed;
	}

	public void setDevUsed(Integer devUsed) {
		this.devUsed = devUsed;
	}

}
