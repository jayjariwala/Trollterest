var mongoose=require('mongoose');

module.exports =
{

getConnection : function()
{
  return mongoose.connect('mongodb://test:test@ds151048.mlab.com:51048/lolterest');
}
,
createSchema : function(mongoose)
{
  var Schema=mongoose.Schema;
  var taskSchema= new Schema({
    uid: String,
    uname:String,
    pic_id:String,
    pic_url:String,
    pic_title:String,
    pic_desc:String,
    time:String
  });

return user=mongoose.model('lol_images',taskSchema);

}


}
