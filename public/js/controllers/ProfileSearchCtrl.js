'use strict'
var app = angular.module('muriquee')

app.controller('ProfileSearchCtrl', function($scope, $http, $localStorage, MapMarkerService){
    //listeners
    $scope.submitSearch = function(index){
        $localStorage.selectedNegotiation = undefined;
        $localStorage.selectedResult = undefined;
        setTimeout(function(){
                $('#profileSearchResultsTab').height(window.innerHeight-490);
            },500);

        var ops = JSON.parse(JSON.stringify($localStorage.searchOptions));
        ops.genres = $scope.unindexList(ops.genres);
        ops.subtypes = $scope.unindexList(ops.profileSubtypes);
        var req = {
            method: 'POST',
            url: '/api/profileSearch',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(ops)
        }
        $http(req)
            .success(function(data){
                $localStorage.searchResults = data;
                
                //jump to search results tab if in negotiation view
                if ($localStorage.viewmode == 'negotiation')
                {
                    $localStorage.viewmode = 'calendar';
                }
                
                if (data.length == 0){
                    $scope.calculateGeoMarkers();
                }
                else{
                    $scope.calculateGeoMarkers();
                    if ($localStorage.rememberedProfiles.length == 0){
                        return;
                    }
                    $localStorage.searchResults.forEach(function(p){
                        $localStorage.rememberedProfiles.forEach(function(q){
                            if (p._id == q._id){
                                p.isRemembered = true;
                            }
                        });
                    });
                }
            })
            .error(function(){
                alert('error retreiving data from server');
            })
    }

    $scope.calculateGeoMarkers = function(){
        $localStorage.markers = {};
        $localStorage.markers[$localStorage.profile._id] = $localStorage.profileMarker;
        $localStorage.markers['search_marker'] = $localStorage.searchMarker;
        $localStorage.searchResults.forEach(function(p){
            var marker = {
                title:p.name,
                lat:parseFloat(p.geolocation.lat),
                lng:parseFloat(p.geolocation.lon),
                message:MapMarkerService.markerMessage(p),
                focus:false,
                draggable:false,
                icon:MapMarkerService.markerIcon(p)
                //label:{
                //    message:MapMarkerService.markerMessage(p),
                //    options:{
                //        noHide:true
                //    }
                //}
            }
            $localStorage.markers[p._id] = marker;
        })
    }
 
    //filters
    $scope.filterOnTour = function(p){
        //TODO
        return true;
    }
    $scope.filterResident = function(p){
        //TODO
        return false;
    }
    $scope.profileTypeFilter = function (pt){
        return pt != $localStorage.profile.type;
    }

    $scope.getInitialProfileType = function(){
        if ($scope.profileTypes[0] == $localStorage.profile.type) return $scope.profileTypes[1];
        else return $scope.profileTypes[0];
    }

    $scope.getIndexedList = function(list){
        if (!list) return [];
        var res = [];
        var i = 1;
        list.forEach(function(item){
            res.push({
                id:i,
                name:item
            });
            i++;
        })
        return res;
    }
    $scope.unindexList = function(list){
        if (!list) return [];
        var res = [];
        list.forEach(function(item){
            res.push(item.name);
        });
        return res;
    }
    $scope.getGenreList = function(){
        var uistl = $scope.unindexList(($localStorage.searchOptions.profileSubtypes));
        if ($localStorage.searchOptions.profileType == 'Artist'){
            if (uistl && uistl.length > 0){
                var res = [];
                uistl.forEach(function(st){
                    var stgs = $localStorage.datalists.splitgenres[st];
                    res = res.concat(stgs);
                })
                return res;
            }
            else{
                return $localStorage.datalists.genres;
            }
        }
        else if ($localStorage.searchOptions.profileType){
            return $localStorage.datalists.genres;
        }
        else{
            return [];
        }
    }
    $scope.getSubtypeList = function(){
        if ($localStorage.searchOptions.profileType === 'Artist'){
            return $localStorage.datalists.artistTypes;
        }
        else{
            return [];
        }
    }

    $scope.onProfileTypeSelectionChanged = function(){
        var pt = $localStorage.searchOptions.profileType;
        if (pt === 'Artist'){
            $scope.profileSubtypes = $localStorage.datalists.artistTypes;
        }
        else if (pt === 'Venue'){
            $scope.profileSubtypes = $localStorage.datalists.venueTypes;
        }
        else {
            $scope.profileSubtypes = $localStorage.datalists.organiserTypes;
        }
        $scope.storage.searchOptions.subtypes = []
    }

    $scope.storage = $localStorage;
    if (!$scope.storage.rememberedProfiles){
        $scope.storage.rememberedProfiles = [];
    }

    $scope.profileTypes   = ['Artist', 'Venue', 'Organiser'];

    $scope.profileSubtypes = [];

    if ($localStorage.searchOptions === {}){
        $localStorage.searchOptions  = {
            profileType    : 'Artist',
            location       : [ 0.0, 0.0 ],
            radius         : 15.0,
            genres         : [],
            subtypes       : [],
            profileName    : ''
        };
    }
   
});