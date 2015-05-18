var keystone = require('keystone');
var Types    = keystone.Field.Types;

/*
 * Genre Model
 */

var Genre = keystone.List('Genre');

Genre.add({
    name     : {type:String, required:true, index:true, initial:''},
    category : {type:String, required:true, index:true, initial:'' } 
});

function initGenre(name, category){
	Genre.model.find({"name":"name", "category":"category"}, function(data){
		if (data.length == 0){
			var g = new Genre.model({
				name : name,
				category : category
			})
			g.save(function(err){
				console.log(err);
			});
		}
	});
}

Genre.register();
