
var mongodb = require('mongodb');
var moment = require('moment');


exports.up = function(db, next){
	var branches = mongodb.Collection(db, 'branches');
	branches.insert({
		code			:	'01',
		name			:	'广东保源保险代理有限公司',
		abbrName		: 	'广东宝源',
		type			:	'其它',
		//parent			:	null,
		bizScope		:	'保险代理销售',
		establishDate	:	moment('2013-02-08', 'YYYY-MM-DD').toDate(),
		typeLevel		:	'',
		//revokeDate		:	null,
		//chief			:	null,	/*责任人ID*/
/*		businesslicence			:	{
			licenceNO			：	String,	业务许可证
			licenceDate			：	Date,
			issuing authority	:	String,
			startDate			：	Date,
			endDate				:	Date
		},
		orgLicence	:	{组织机构证书
			orgCode				:	String,
			licenceDate			:	Date,
			orgType				:	String,
			regNO				:	String,
			issuing authority	:	String,
			startDate			：	Date,
			endDate				:	Date		
		},
		nationaltax		:	{
			licenceNO	:	String,
			approvalNO	：	String,
			startDate	:	Date,
			endDate		:	Date
		},
		landtax		:	{
			licenceNO	:	String,
			approvalNO	：	String,
			startDate	:	Date,
			endDate		:	Date
		},
		permit4OpeningAccount : {开户许可
			
		},
		ssInfo			:	{社保
		},
		propertyInfo	：	{物业信息
		},*/
		telephone		:	'18620721320',
		address			:	'中山市东区库充大街东5栋5层',
		zip				:	'528400',
		districtCode	:	'020',
		originalID		:	'T00',
		remarks			:	'代理销售保险产品；代理收取保险费；',
		level			:	'总公司',
		status			:	'有效'
	}, function(err){
		if (err) {
			console.log(err);
		} else {
			console.log("create sucess");
		}
	});
	
    next();
};

exports.down = function(db, next){
    next();
};
