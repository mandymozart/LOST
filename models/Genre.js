var keystone = require('keystone');
var Types    = keystone.Field.Types;

/*
 * Genre Model
 */

var Genre = keystone.List('Genre');

Genre.add({
    name : {type:String, required:true, index:true, initial:''}
});

Genre.register();
