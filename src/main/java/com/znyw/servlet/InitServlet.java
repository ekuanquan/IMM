package com.znyw.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.ContextLoader;

import com.systemcfg.dao.AssembleCfgDao;
import com.znyw.migrate.MigrateServer;
import com.znyw.tool.ConfigUtil;
import com.znyw.tool.Objects;

public class InitServlet extends HttpServlet {
	private static final Logger LOGGER = LoggerFactory.getLogger(InitServlet.class);

	private static final long serialVersionUID = 7028862897168431723L;
	AssembleCfgDao assembleCfgDao = (AssembleCfgDao) ContextLoader.getCurrentWebApplicationContext()
			.getBean("assembleCfgDao");

	@Override
	public void init() throws ServletException {
		super.init();

		String localPlatformId = null;
		try {
			localPlatformId = assembleCfgDao.getLocalPlatformId();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
		}
		
		if (Objects.isNullString(localPlatformId)) {
			LOGGER.error("\n\n=================== 错误 ==========================");
			LOGGER.error("\n\t\t平台ID为空，启动失败  ");
			LOGGER.error("\n===================================================\n\n");
			super.destroy();
			System.exit(0);
		}
		ConfigUtil.setRoot(localPlatformId);

		boolean migrated = MigrateServer.migrate();

		if (!migrated) {
			LOGGER.error("\n\n=================== 错误 ==========================");
			LOGGER.error("\n\t\t数据库迁移错误，启动失败  ");
			LOGGER.error("\n===================================================\n\n");
			super.destroy();
			System.exit(0);
		}

	}

}
