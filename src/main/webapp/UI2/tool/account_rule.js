/**
 * Created by admin on 2015/12/14.
 */
/*define(function(require, exports){*/
/*require('../common/script/jquery.validate.js');
 require('./validate.css');*/
/*require('../common/script/base.js');*/
    jQuery.validator.addMethod('noAllUnderline', function (value, element) {
        return this.optional(element) || !/^_*$/.test(value);
    }, '不能全为下划线');
    jQuery.validator.addMethod('noAllNumber', function (value, element) {
        return this.optional(element) || !/^\d+$/.test(value);
    }, '不能全为数字');
    jQuery.validator.addMethod('noAllLetter', function (value, element) {
        return this.optional(element) || !/^[a-zA-Z]+$/.test(value);
    }, '不能全为字母');
    jQuery.validator.addMethod('sameValue', function (value, element) {
        var password=$("#password").val();
        return this.optional(element) || !(password!==value);
    }, '两次输入的密码不一致');
    jQuery.validator.addMethod('noBlank', function (value, element) {
        return this.optional(element) || !/\s/.test(value);
    }, '不能包含空格');
    jQuery.validator.addMethod('noSameValue', function (value, element) {
        return this.optional(element) || !(new RegExp('^' + value[0] + '+$').test(value));
    }, '不能为同一符号');
    jQuery.validator.addMethod('phone', function (value, element) {
        return this.optional(element) || /^(13[0-9]{9}|145[0-9]{8}|147[0-9]{8}|15[0-9]{9}|17[0-9]{9}|18[0-9]{9})$/.test(value)
    }, '请输入有效的手机号');
    jQuery.validator.addMethod('fix_phone', function (value, element) {
        return this.optional(element) || /^(\+)?\d{11,20}$/.test(value)
    }, '请输入有效的电话号码(如:057188075998)');
    jQuery.validator.addMethod('email', function (value, element) {
        return this.optional(element) || /\b^['_a-zA-Z0-9-\+]+(\.['_a-zA-Z0-9-\+]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.([a-z]{2}|aero|arpa|asia|biz|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|nato|net|org|pro|tel|travel|xxx)$\b/.test(value)
    }, '邮箱格式不正确');

    jQuery.validator.addMethod('illegal', function (value, element) {
        return this.optional(element) || !/[\^\$\.\*\+\?\=\!\:\|\\\/\(\)\[\]\{\}\%\&\'\"\<\>]/.test(value)
    }, '不能包含非法字符');
    jQuery.validator.addMethod('onlyNumOrLetter', function (value, element) {
        return this.optional(element) ||  /^[0-9a-zA-Z]*$/.test(value);
    }, '只能输入字母或数字');

    jQuery.validator.addMethod('notEqualTo', function (value, element, param) {
        if(!$(param) || $(param).length<=0){
            return true;
        }
        return this.optional(element) || (value != $(param).val());
    }, $.validator.format('不能和元素{0}的值相同'));

    jQuery.extend(jQuery.validator.messages, {
        required: '不能为空',
        number: '请输入数字',
        minlength: jQuery.validator.format('不能少于{0}个字符'),
        maxlength: jQuery.validator.format('不能超过{0}个字符')
    });
	
    jQuery.validator.addMethod('onlyInput', function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9\_]+$/.test(value);
    }, '只能输入英文、数字和下划线');
	
    jQuery.validator.addMethod('illegalNew', function (value, element) {
		return this.optional(element) || !/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im.test(value)
	}, '不能包含非法字符');
	
    jQuery.validator.setDefaults({
        highlight: function (element, errorClass, validClass) {
            $(element).next().removeClass(validClass).addClass(errorClass);
            $(element).trigger('validFailure');
        },
        unhighlight: function (element, errorClass, validClass) {
            if($(element).next().next().hasClass('error') || $(element).next().next().hasClass('valid')){
                $(element).next().next().remove();
            }

            $(element).next().removeClass(errorClass).addClass(validClass);
        },
        success: function (label, element) {
            $(element).trigger('validPass');
        }
    });

