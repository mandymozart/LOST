'use strict'
var app = angular.module('muriquee')

app.controller('ProfileSearchCtrl', function($scope, $http, $localStorage){
    //listeners
    $scope.submitSearch = function(index){
        $localStorage.selectedNegotiation = undefined;
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
                if (data.length == 0){
                    //TODO nothing found
                }
            })
            .error(function(){
                alert('error retreiving data from server');
            })
    }
    //$scope.showProfile = function(p){
    //    $localStorage.selectedResult = p;
    //}

    //$scope.rememberProfile = function(p){
    //    if (!$scope.storage.rememberedProfiles){
    //        $scope.storage.rememberedProfiles = [];
    //    }
    //    if ($scope.storage.rememberedProfiles.indexOf(p) == -1){
    //        $scope.storage.rememberedProfiles.push(p);
    //        p.isRemembered = true;
    //    }
    //}
    //$scope.removeRemeberedProfile = function(p){
    //    var i = $scope.storage.rememberedProfiles.indexOf(p);
    //    $scope.storage.rememberedProfiles.splice(i, 1);
    //    p.isRemembered = false;
    //}
    //$scope.rememberAll = function(){
    //    $scope.storage.searchResults.forEach($scope.rememberProfile);
    //}
    //$scope.removeAll = function(){
    //    $scope.storage.rememberedProfiles.forEach(function(p){
    //        p.isRemembered = false;
    //    });
    //    $scope.storage.rememberedProfiles = [];
    //}
    //$scope.pushCall = function(){
    //    var req = {
    //        method: 'POST',
    //        url: '/api/sendProposal',
    //        headers: {
    //            'Content-Type': 'application/json'
    //        },
    //        data: {
    //            profile:$scope.storage.profile,
    //            profiles:$scope.storage.rememberedProfiles,
    //            proposedDate:$scope.storage.selectedDate,
    //        }
    //    }
    //    $http(req)
    //        .success(function(data){
    //            alert('sucessfully sent proposals for: ' + $localStorage.selectedDate);
    //        })
    //        .error(function(){
    //            alert('error sending proposals');
    //        })
    //}

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