(function () {
    'use strict';

    angular
        .module('app')
        .filter('myfilter', myfilter)
        .controller('Home.IndexController', Controller);

    function myfilter() {
        return function( items, types) {
            var filtered = [];

            angular.forEach(items, function(item) {
                if(types.extpillar == true && item.extpillar_used == true) {
                    filtered.push(item);
                }
                else if (types.extpillar == false) {
                    filtered.push(item);
                }
            });

            return filtered;
        };
    };

    Controller.$inject = ['$rootScope',
                          '$http',
                          '$filter',
                          '$localStorage',
			  'notify'];

    function Controller($rootScope,
                        $http,
                        $filter,
                        $localStorage,
			notify) {
        var vm = this;
        vm.types = {extpillar: false}

        vm.orderBy = $filter('orderBy');
        vm.applications = {};
        vm.predicate = ['app', 'srv'];
        vm.reverse = true;

        vm.currentUser = $localStorage.currentUser;

	vm.msg = 'Hello! This is a sample message!';
	vm.template = '';
	
	vm.positions = ['center', 'left', 'right'];
	vm.position = vm.positions[0];
	
	// temps d'affichage de la notification
	vm.duration = -1;
	
	vm.demo = function(){
            notify({
		message: vm.msg,
		classes: vm.classes,
		templateUrl: vm.template,
		position: vm.position,
		duration: vm.duration
            });
	};

        vm.updateApplications = function () {
            $http({
                method: 'GET',
                url: '/api/info'
            }).then(function successCallback(response) {
                vm.applications = response.data;
                vm.order(['app', 'srv']);
            }, function errorCallback(response) {
            });
        };

        vm.order = function(predicate) {
            vm.reverse = (vm.predicate[0] === predicate[0]) ? !vm.reverse : false;
            vm.predicate = predicate;
            vm.applications = vm.orderBy(vm.applications, predicate, vm.reverse);
        };
        vm.updateApplications();

	vm.updateSvnRev = function(srv, repo_id, app, key, data) {
            var m = (data==""?"DELETE":"PUT");
            var key = (data==""?key:key+"/"+data);
            var data = $http({
                method: m,
                url: '/api/svn/' + srv + "/" + repo_id + "/" + app + "/" + key,
                headers: {'Access-Control-Allow-Origin': '*'}
            }).then(function successCallback(response) {
		notify({
		    message: "L'application " + app + " a correctement été mise à jour.",
		    classes: "alert-success",
		    templateUrl: vm.template,
		    position: vm.position,
		    duration: vm.duration
		});
            }, function errorCallback(response) {
		notify({
		    message: "L'application " + app + " n'a pas correctement été mise à jour.",
		    classes: "alert-danger",
		    templateUrl: vm.template,
		    position: vm.position,
		    duration: vm.duration
		});
            });
            return true;
        };

        vm.updateGitRev = function(srv, repo_id, app, key, data) {
            var m = (data==""?"DELETE":"PUT");
            var key = (data==""?key:key+"/"+data);
            var data = $http({
                method: m,
                url: '/api/git/' + srv + "/" + repo_id + "/" + app + "/" + key,
                headers: {'Access-Control-Allow-Origin': '*'}
            }).then(function successCallback(response) {
		notify({
		    message: "L'application " + app + " a correctement été mise à jour.",
		    classes: "alert-success",
		    templateUrl: vm.template,
		    position: vm.position,
		    duration: vm.duration
		});
            }, function errorCallback(response) {
		notify({
		    message: "L'application " + app + " n'a pas correctement été mise à jour.",
		    classes: "alert-danger",
		    templateUrl: vm.template,
		    position: vm.position,
		    duration: vm.duration
		});
            });
            return true;
        };
        vm.pullSvnRev = function(srv, repo_id, app) {
            var data = $http({
                method: "PATCH",
                url: '/api/svn/' + srv + "/" + repo_id,
                headers: {'Access-Control-Allow-Origin': '*'}
            }).then(function successCallback(response) {
		notify({
		    message: "L'application " + app + " a correctement été pull.",
		    classes: "alert-success",
		    templateUrl: vm.template,
		    position: vm.position,
		    duration: vm.duration
		});
            }, function errorCallback(response) {
		notify({
		    message: "L'application " + app + " n'a pas correctement été pull.",
		    classes: "alert-danger",
		    templateUrl: vm.template,
		    position: vm.position,
		    duration: vm.duration
		});
            });
            return true;
        };

        vm.pullGitRev = function(srv, repo_id, app) {
            var data = $http({
                method: "PATCH",
                url: '/api/git/' + srv + "/" + repo_id,
                headers: {'Access-Control-Allow-Origin': '*'}
            }).then(function successCallback(response) {
		notify({
		    message: "L'application " + app + " a correctement été pull.",
		    classes: "alert-success",
		    templateUrl: vm.template,
		    position: vm.position,
		    duration: vm.duration
		});
            }, function errorCallback(response) {
		notify({
		    message: "L'application " + app + " n'a pas correctement été pull.",
		    classes: "alert-danger",
		    templateUrl: vm.template,
		    position: vm.position,
		    duration: vm.duration
		});
            });
            return true;
        };
    }
})();
