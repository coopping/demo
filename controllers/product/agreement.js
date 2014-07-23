/**
 * Created by Administrator on 14-7-5.
 */
/**
 * New node file
 */
var Agreement = require('../../models/product/Agreement');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
module.exports = function (app) {
    app.get('/product/agreement', function(req, res) {
        var page = 1;
        if (req.query.page) {
            page = req.query.page;
        }
        Agreement.paginate({}, page, 10, function(err, pageCount, agreements) {
            if (err) {
                return next(err);
            }
            var model = {
                title : '合约列表',
                isAdmin : true,
                agreements : agreements,
                page : page,
                pageCount : pageCount
            };
            res.render('product/agreement/index', model);
        });
    });

    /*
    add
     */
    app.get('/add', function(req, res) {
     var   model ={
            title: "新增"
        }
        res.render('product/agreement/add', model);
    });

    app.post('/add', function(req, res) {
        var agreement = req.body.agreement;
        console.log('add some agreement,come on baby!!');
        var agreementModel = new Agreement(agreement);
        agreementModel.save(function(err){
            if (err) {
               // return next(err);
                console.log(err);
            }
            var model = {
                agreement : agreement
            };
            res.redirect('/product/agreement');
        });
    });

    app.get('/agreement/:id/update', function(req, res,next) {
        var  id = req.params.id;
        Agreement.findById(new ObjectId(id), function(err, agreements){
            if (err) {
                return next(err);
            }
            var model = {
                title : '修改合约',
                agreement : agreements
            };
            res.render('product/agreement/update', model);
        });
    });

    app.post('/agreement/:id/update', function(req, res) {
        var  id = req.params.id;
        var agreement = req.body.agreement;
        Agreement.update({_id :new ObjectId(id)},agreement,{ multi: true },function(err){
            var model = {
                rec : 'OK'
            };
            res.redirect('/product/agreement');
        });
    });

    /*
     * 删除
     */
    app.get('/agreement/:id/delete', function(req, res) {
        var  id = req.params.id;

        Agreement.remove({_id : new ObjectId(id)},function (err){
            var model = {
                rec : 'OK'
            };
            res.redirect('/product/agreement');
        });

    });
};