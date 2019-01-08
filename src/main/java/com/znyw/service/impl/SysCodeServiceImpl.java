package com.znyw.service.impl;

/**
 * 系统码相关操作
 */
import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.znyw.dao.SysCodeDao;
import com.znyw.pojo.Pagepojo;
import com.znyw.pojo.ResultPojo;
import com.znyw.pojo.SysCodePojo;
import com.znyw.service.SysCodeService;

@Service
public class SysCodeServiceImpl implements SysCodeService {
	private static Logger logger = LoggerFactory
			.getLogger(SysCodeServiceImpl.class);

	@Resource
	private SysCodeDao sysCodeDao;

	@Override
	public ResultPojo getSysCodeByCondition(String queryStr, Pagepojo pagepojo) {
		int index = 0;
		int currentPage = pagepojo.getCurrentPage();
		int pageSize = pagepojo.getPageSize();
		ResultPojo result = new ResultPojo();
		if (currentPage < 1) {
			result.setResult("201", "页码错误");
			result.setPojo("sysCodeList", null);
		} else {
			index = (currentPage - 1) * pageSize;
			List<SysCodePojo> list = null;
			try {
				list = sysCodeDao.getSysCodeByCondition(queryStr, index,
						pageSize);
			} catch (Exception e) {
				throw e;
			}
			int totalNum = sysCodeDao.countSysCodeByCondition(queryStr);
			int totalPage = totalNum / pageSize;
			if (totalNum % pageSize != 0) {
				totalPage += 1;
			}
			pagepojo.setTotalNum(totalNum);
			pagepojo.setTotalPage(totalPage);
			result.setResult("200", "成功");
			result.setPojo("sysCodeList", list);
			result.setPojo("pageInfoPojo", pagepojo);
		}

		return result;
	}

	@Override
	public ResultPojo findSysCodeByCodeId(String codeId) {

		ResultPojo result = new ResultPojo();
		if (codeId == null || "".equals(codeId)) {
			result.setResult("201", "codeId为空");
			result.setPojo("sysCodePojo", null);
		} else {
			SysCodePojo pojo = null;
			try {
				pojo = sysCodeDao.findSysCodeByCodeId(codeId);
			} catch (Exception e) {
				throw e;
			}
			result.setResult("200", "成功");
			result.setPojo("sysCodePojo", pojo);
		}
		return result;
	}

	@Override
	public ResultPojo updateSysCodeByCodeId(SysCodePojo pojo) {

		ResultPojo result = new ResultPojo();
		if (pojo == null) {
			result.setResult("201", "参数异常");
		} else if (pojo.getCodeId() == null || "".equals(pojo.getCodeId())) {
			result.setResult("201", "无系统码编号，修改失败");
		} else {
			int row = 0;
			try {
				row = sysCodeDao.updateSysCodeByCodeId(pojo);
			} catch (Exception e) {
				throw e;
			}
			if (row > 0) {
				result.setResult("200", "成功");
			} else {
				result.setResult("201", "失败");
			}
		}
		return result;
	}
}
