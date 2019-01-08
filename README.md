## 项目：运营综合管理平台

## 开发人员配置

为避免不同开发人员在不同机器上开发导致的配置文件重复提交或者每次更新代码后都需要重新修改相关配置才能适配自己的测试环境，
需要自己指定自己的配置文件，并且这些配置文件不允许提交至版本库，如果对部署的配置文件需要修改的，需要在项目的公共配置文件（`src/main/resources/properties/*.properties`）做相应的修改并提交。具体的配置为，配置一个名为`YW_ENV`（远
望环境变量）的环境变量，如果是给系统添加环境变量需要重启开发IDE，如果是运行程序时指定环境变量则不需要，如果找不到指定
的环境变量，则使用公共配置。

现对此配置的影响做说明：

例如，有环境变量 `YW_ENV`值为`dev`，**建议使用此环境变量值**，则启动程序的时候会加载 `src/main/resources/properties/dev/*.properties`，

再例如有环境变量 `YW_ENV`值为`product`，建议使用此环境变量值，则启动程序的时候会加载 `src/main/resources/properties/product/*.properties`，

如果环境变量 `YW_ENV`值为空或不存在，则直接加载`src/main/resources/*.properties`。

__针对的 `src\main\webapp\WEB-INF\web.xm`的自定义配置目前还不支持。__

### 数据库迁移相关说明

此项目依赖项目**yw-flyway**,具体参考该项目的`README.md`

为保证数据库的完整性和可迁移，本程序启动时，会自动执行`db\migration`下的所有脚本，默认脚本包含视图、触发器、存储过程、事件，
后续所有针对数据库的修改需要新建脚本进行管理，后期部署到其他服务器上时，程序会自动追踪哪些脚本没有执行并自动执行，不再需要人工
对比数据库，以保证数据库与程序时匹配的。具体的SQL脚本的命名格式有规范，详细参考项目**yw-flyway**的`README.md`文件。

###  退出和地图配置

修改文件 `src\main\webapp\UI\resource\js\configure.js`，内容如下：

```
$(document).ready(function () {
    configure();
});
;(function (window,$) {
    window.configure = _configure;

    //退出配置
    var location = "https://";// 前缀为 http或者https
    var serverInfo = "win-vud72jmvs9p:8843";// 此处改成所用单点的服务计算机名（或IP）和端口
    
    // 此处改成具体的地图服务地址 ，采用在线地图的不需要配置此项
    var mapServer="http://10.26.40.20:2098/";
   ....
```
