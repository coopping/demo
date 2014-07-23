/**
 * Created by thinkpad on 14-7-16.
 */
var baseCode = require('../../lib/baseCode');
var AgentBroker = require('../../models/agent/AgentBroker');
var mongoose = require('mongoose');
var moment = require('moment');
var async = require('async');
var branchHelper = require('../../lib/branchHelper');
var ObjectId = mongoose.Types.ObjectId;

module.exports = function(app) {


   //  app.get('/agent/agent/agentTest', function(req, res, next) {
   //      AgentBroker.aggregate({$group :{_id : "$_id", agentCode : { $max : "$agentCode"}}})
            //.sort({"agentCode":-1})
           // .limit(1)
   //          .exec(function(err,agentbrokers){
   //             console.log(agentbrokers);
   //         });
   // });

    //跳转到新增页面
    app.get('/agent/agent/agentAdd', function(req, res, next) {
            var  model ={
                title: "新增"
            };
            var branchTree = branchHelper.branchTree;
            var userBranches = branchHelper.getUserOprBranches(req.user, [], branchTree);
            model.userBranches = userBranches;
            res.render('agent/agent/agentAdd', model);
    });


    //代理人列表
    app.get('/agent/agent/agentQuery', function(req, res, next) {
        var page = 1;
        if (req.query.page) {
            page = req.query.page;
        }

        AgentBroker.paginate({}, page, 5, function(err, pageCount, agentbrokers) {
            var  model ={
                title: "新增",
                agentBroker:agentbrokers,
                page : page,
                pageCount : pageCount
            };
            res.render('agent/agent/agentQuery', model);
        });
    });

    app.post('/agent/agent/agentEdit', function(req, res, next) {
        var agentBroker= req.body.agentBroker;//获取页面填写内容
        console.log(agentBroker.id);
        AgentBroker.find({_id:new ObjectId(agentBroker.id)}, function(err,agentbrokers){
            console.log(agentbrokers);
            if (err){
                next(err);
            }else{
                AgentBroker.update({_id:new ObjectId(agentBroker.id)},agentBroker,{ multi: true },function(err,agents){
                    if(err){
                        var  model ={
                            title: "修改信息",
                            agentBroker : agentBroker
                        };

                        res.locals.err = err;
                        res.locals.model = model;
                        res.locals.view = 'agent/agent/agentEdit';
                        next(); //调用下一个错误处理middlewear
                    }else{
                        req.flash('showMessage', '修改成功');
                        res.redirect('/agent/agent/agentQuery');
                    }
                });
            }
        });
    });

    //代理人修改
    app.get('/agent/agent/:id/edit', function(req, res, next) {
        var  id = req.params.id;
        AgentBroker.find({_id:new ObjectId(id)},function(err, agentBroker){
            var  model ={
                title: "新增",
                agentBroker : agentBroker
            };
            console.log(agentBroker);
            res.render('agent/agent/agentEdit', model);
        });
    });

    //代理人修改
    app.get('/agent/agent/:id/info', function(req, res, next) {
        var  id = req.params.id;
        AgentBroker.find({_id:new ObjectId(id)},function(err, agentBroker){
            var  model ={
                title: "新增",
                agentBroker : agentBroker
            };
            res.render('agent/agent/agentInfo', model);
        });
    });
    app.post('/agent/agent/agentAdd', function(req, res, next) {
        var agentBroker= req.body.agentBroker;//获取页面填写内容
        AgentBroker.aggregate([{$group : {_id : "$agentCode", maxAgentCode : {$max : "$agentCode"}}}])
            .sort({"agentCode":-1})
            .limit(1)
            .exec(function(err,agentbrokers){
                console.log(agentbrokers);
            if (err){
                next(err);
            }else{
                agentBroker.agentCode = (new Number(agentbrokers[0].maxAgentCode)+1).toString();
                var AgentBrokerModel = new AgentBroker(agentBroker);
                AgentBrokerModel.save(function(err,agents){    //保存contract对象
                    if(err){
                        var  model ={
                            title: "录入信息",
                            agentBroker : agents
                        };

                        res.locals.err = err;
                        res.locals.model = model;
                        res.locals.view = 'agent/agent/agentadd';
                        next(); //调用下一个错误处理middlewear
                    }else{
                        AgentBroker.findById({_id: new ObjectId(agents.id)}, function(err){
                            if (err){
                                next(err);
                            }else{
                                req.flash('showMessage', '创建成功');
                                res.redirect('/agent/agent/agentQuery');
                            }
                        })
                    }
                });
            }
        });
    });

    //删除代理人信息
    app.get('/agent/agent/:id/delete', function(req, res) {
        var  id = req.params.id;
        AgentBroker.remove({_id : new ObjectId(id)},function (err){
            if (err) {
                return next(err);
            }
        });
        res.redirect('/agent/agent/agentQuery');
    });
}