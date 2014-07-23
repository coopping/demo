"use strict";
var Provider = require('../../models/product/Provider');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
module.exports = function (app) {
    app.get('/provider', function(req, res) {

        var page = 1;
        if (req.query.page) {
            page = req.query.page;
        }
        Provider.paginate({}, page, 10, function(err, pageCount, providers) {
            if (err) {
                return next(err);
            }
           console.log(providers);
            var model = {
                title : '供应商列表',
                isAdmin : true,
                provider : providers,
                page : page,
                pageCount : pageCount
            };
            res.render('product/provider/index', model);
        });
    });

    app.get('/add', function(req, res) {
        var  model ={
             title: "新增"
        }
        res.render('provider/add', model);
    });

    app.post('/add', function(req, res) {
        var provider = req.body.provider;
        
        var providerModel = new Provider(provider);
        providerModel.save(function(err){
            console.log(provider);
            var model = {
                provider : provider
            };
            res.render('provider/index', model);
        });
    });

    app.get('/provider/:id/update', function(req, res,next) {
        var  id = req.params.id;
        Provider.findById(new ObjectId(id), function(err, providers){
            if (err) {
                return next(err);
            }
            var model = {
                title : '修改供应商',
                provider : providers
            };
            res.render('provider/update', model);
        });
    });

    app.post('/provider/:id/update', function(req, res) {
        var  id = req.params.id;
        var provider = req.body.provider;
        Provider.update({_id :new ObjectId(id)},provider,{ multi: true },function(err){
            console.log(provider);
            var model = {
                rec : 'OK'
            };
            res.render('provider/index', model);
        });
    });

    /*
     * 删除
     */
    app.get('/provider/:id/delete', function(req, res) {
        var  id = req.params.id;

        Provider.remove({_id : new ObjectId(id)},function (err){
            var model = {
                rec : 'OK'
            };
            res.render('provider/index', model);
        });

    });

};