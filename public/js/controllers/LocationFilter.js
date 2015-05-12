function coordinateDistanceKm(lat1, lat2, lon1, lon2){

	var r = 6371
	var dlat = deg2rad(lat2-lat1)
	var dlon = deg2rad(lon2-lon1)
	var a = 
		Math.sin(dlat/2) * Math.sin(dlat/2) + 
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.sin(dlon/2) * Math.sin(dlon/2)

	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
	var d = r * c
	return d
}

function deg2rad(deg){
	return deg * (Math.PI/180)
}

function LocationFilter(){
	this.center = { latitude : 0,  longitude : 0 }
	this.radius = 0
}

LocationFilter.prototype.setCenter = function(center){
	this.center = center
}

LocationFilter.prototype.setRadius = function(radius){
	this.radius = radius
}

LocationFilter.prototype.contains = function(location){
	if (location == undefined) return false
	var distance = coordinateDistanceKm(
		this.center.latitude, 
		location.longitude,
		this.center.longitude,
		location.longitude)
	return distance < this.radius
}

LocationFilter.prototype.filter = function(list){
	var res = []
	list.forEach(function(l){
		if (this.contains(l.location)){
			res.push(l)
		}
	})
	return res
}