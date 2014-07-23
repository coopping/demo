"use strict";
var BizAccept = require('../../models/biz/BizAccept');
var AgentBroker = require('../../models/agent/AgentBroker');
var Provider = require('../../models/product/Provider');
var baseCode = require('../../lib/baseCode');
var mongoose = require('mongoose');
var async = require('async');
var ObjectId = mongoose.Types.ObjectId;
module.exports = function(app) {

    //跳转到保单受理页面
    app.get('/biz',function(req, res, next){
        res.redirect('/biz/bizAccept/bizAcceptQuery');
    });

    //保单受理列表
    app.get('/biz/bizAccept/bizAcceptQuery', function(req, res, next) {
        var page = 1;
        if (req.query.page) {
            page = req.query.page;
        }

        BizAccept.paginate({acceptStatus:'AcceptStatus_A'}, page, 5, function(err, pageCount, Bizaccepts) {
            if (err) {
                return next(err);
            }else{
                var model = {
                    title : '受理清單',
                    isAdmin : true,
                    Bizaccepts : Bizaccepts,
                    page : page,
                    pageCount : pageCount
                };
                res.render('biz/bizAccept/index', model);
            }
        },{sortBy:{createDate:-1}});
    });

    //跳转到受理单新增页面
    app.get('/biz/bizAccept/addBizAccept', function(req, res, next) {
        var  model ={
            title: "新增"
        };
        res.render('biz/bizAccept/add', model);
    });

    //保存新增信息
    app.post('/biz/bizAccept/addBizAccept', function(req, res,next) {
        var bizAccept = req.body.bizaccept;//获取页面填写内容
            console.log(bizAccept);
        var uid= new ObjectId("53b5fb130e12d75c18e75685");  //默认
            bizAccept.createUserId = uid;
            bizAccept.updateUserId = uid;
            bizAccept.acceptUserId = uid;
            bizAccept.acceptBranchId ='TA_SH';

            bizAccept.agentId = new ObjectId(bizAccept.agentId);
            bizAccept.providerId = new ObjectId(bizAccept.providerId);

        var bizAcceptModel = new BizAccept(bizAccept);
        bizAcceptModel.save(function(err,bizaccepts){
            if(err){
                var model = {
                    bizaccept : bizAccept
                };
                res.locals.err = err;
                res.locals.view = 'biz/bizAccept/add';
                res.locals.model = model;
                next(); //调用下一个错误处理middlewear
            }else{
                BizAccept.findById({_id: new ObjectId(bizaccepts.id)}, function(err){
                    if (err){
                        next(err);
                    } else {
                        req.flash('showMessage', '创建成功');
                        res.redirect('/biz/bizAccept/bizAcceptQuery');
                    }
                });
            }
        });
    });

    //跳转到受理单修改页面
    app.get('/biz/bizAccept/:id/edit', function(req, res, next) {
        var  id = req.params.id;
        BizAccept.find({_id:new ObjectId(id)},function(err, bizaccept){
            var  model ={
                title: "新增",
                Bizaccept : bizaccept
            };
            res.render('biz/bizAccept/edit', model);
        });
    });

    //修改受理单信息
    app.post('/biz/bizAccept/edit', function(req, res, next) {
        var bizAccept = req.body.bizaccept;//获取页面填写内容
        BizAccept.update({_id :new ObjectId(bizAccept.id)},bizAccept,{ multi: true },function(err,bizaccepts){
            var  model ={
                title: "新增",
                Bizaccept : bizaccepts
            };
            res.redirect('/biz/bizAccept/bizAcceptQuery');
        });
    });

    //删除受理单信息
    app.get('/biz/bizAccept/:id/delete', function(req, res) {
        var  id = req.params.id;
        BizAccept.remove({_id : new ObjectId(id)},function (err){
            if (err) {
                return next(err);
            }
        });
        res.redirect('/biz/bizAccept/bizAcceptQuery');
    });

    //受理单详情
    app.get('/biz/bizAccept/:id/info', function(req, res, next) {
        var  id = req.params.id;
        BizAccept.find({_id:new ObjectId(id)},function(err, Bizaccept){
            var  model ={
                title: "详情",
                Bizaccept : Bizaccept
            };
            res.render('biz/bizAccept/info', model);
        });
    });

    //获取代理人信息
    app.get('/biz/getBrokerInfo', function(req, res) {
        var agentCode = req.query.agentCode ;
        AgentBroker.find({"agentCode":agentCode,'agentStatus':'2'},function(err, message){
            res.send(message);
        });
    });

    //判断投保单是否存在
    app.get('/biz/bizAccept/checkApplicationNo', function(req, res) {
        var applicationNo = req.query.applicationNo ;
        BizAccept.find({"applicationNo":applicationNo},"applicationNo" ,function(err, message){
            res.send(message);
        });
    });

};
