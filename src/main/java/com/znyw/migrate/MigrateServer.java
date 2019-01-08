package com.znyw.migrate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.znyw.tool.PropertyConfigUtil;

import yw.flyway.db.DataSource;
import yw.flyway.db.Database;

public class MigrateServer {
	private static final Logger LOGGER = LoggerFactory.getLogger(MigrateServer.class);

	private static PropertyConfigUtil propertyconfigUtil = PropertyConfigUtil
			.getInstance("properties/mysql.properties");

	public static boolean migrate() {

		String driverClass = propertyconfigUtil.getValue("jdbc.driverClassName");
		String url = propertyconfigUtil.getValue("jdbc.url");
		String userName = propertyconfigUtil.getValue("jdbc.username");
		String password = propertyconfigUtil.getValue("jdbc.password");

		boolean migrate = propertyconfigUtil.getBoolean("jdbc.migrate");

		if (!migrate) {

			LOGGER.info("\n=====================\n 未启用数据迁移 \n=====================\n");

			return true;
		}

		DataSource ds = new DataSource(driverClass, url, userName, password);

		try {
			Database.initDb(ds);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return false;
		}
		return true;
	}
}
