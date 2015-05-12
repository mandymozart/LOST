function TimeFilter(){
	this.date = new Date()
	this.tolerance = 1
}

TimeFilter.prototype.setDate = function(date){
	this.date = d
}
										   //:number
TimeFilter.prototype.setTolerance = function(days){
	this.tolerance = days
}
TimeFilter.prototype.contains = function(date){
	if (date == undefined) return false
	var ms_diff = Math.abs(date - this.date)
	var dy_diff = Math.floor(ms_diff / (3600000 * 24))
	return dy_diff < this.tolerance
}
TimeFilter.prototype.filter = function(list){
	var res = []
	list.forEach(function(l){
		if (this.contains(l.date)){
			res.push(l)
		}
	})
	return res
}