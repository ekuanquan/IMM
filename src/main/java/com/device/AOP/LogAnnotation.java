package com.device.AOP;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;




@Target({ ElementType.METHOD })  //被描述的注解可以用在描述方法
@Retention(RetentionPolicy.RUNTIME)   //描述注解的生命周期:在运行时有效（即运行时保留）(注解会在class字节码文件中存在，在运行时可以通过反射获取到)
@Documented
public @interface LogAnnotation {   //自定义注解,通过AOP来实现人员操作日志
	String whitelog() default "";   // 定义了whitelog参数
}