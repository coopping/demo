/**
 * Created by Administrator on 14-7-5.
 */
/*

 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var agreementSchema = new mongoose.Schema({
    //agreementId		:  {type : String, unique : true, required : true},
    createUser        :  {type:String,default : 'Admin'},
    createDate  :{type: Date, default: Date.now},
    updateUser: {type:String,default : 'Admin'},
    updateDate :{type: Date, default: Date.now},
    agreementName:{type:String,required:true},
    agreementType:{type:String,required:true},
    providerId:{type:String,required:true},
    agreementStatus:{type:String,required:true},
    agreementOrderDate:{type:Date,required:true},
    startDate:{type:Date,required:true},
    endDate:{type:Date,required:true},
    agreementContent:{type:String,required:true},
    agreementDocumentId:{type:String,required:false},
    agreementUrl:{type:String,required:false}
}, { collection: 'agreement' });

module.exports = mongoose.model('Agreement', agreementSchema);
