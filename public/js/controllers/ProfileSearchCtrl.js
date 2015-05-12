function ProfileSearchCtrl($scope){
	$scope.locationFilter = new locationFilter()
	$scope.timeFilter = new timeFilter()

	$scope.today = new Date()
	$scope.here = currentProfile.location //TODO
	$scope.timeFilter.setDate(today)
	$scope.timeFilter.setTolerance(1)
	$scope.locationFilter.setCenter(here)
	$scope.locationFilter.setRadius(15)

	$scope.
}