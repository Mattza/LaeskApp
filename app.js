angular.module('laeskApp', ['firebase'])
    .controller('mainCtrl', function ($scope, $firebaseAuth) {
        $scope.state = 0;
        var ref = $firebaseAuth(new Firebase("https://laesk.firebaseio.com/"))
        ref.$authWithOAuthPopup("google").then(function (authData) {
            console.log("Logged in as:", authData);
            $scope.authData = authData;
            $scope.state = 1;
        }).catch(function (error) {
            $scope.state = -1
            $scope.error = error;
        });
    })
    .controller('userCtrl', function ($scope, $firebase, $firebaseAuth) {

        var syncObj = $firebase(new Firebase("https://laesk.firebaseio.com/" + $scope.$parent.authData.uid)).$asObject();
        syncObj.$loaded().then(function () {
            syncObj.name = $scope.$parent.authData.google.displayName;
            console.log($scope);
        });
        var taco = syncObj.$bindTo($scope, 'person');
        $scope.minus = function () {
            $scope.person.saldo -= 1;
        };


    })
    .controller('adminCtrl', function ($scope, $firebase, $firebaseAuth) {
        if ($scope.$parent.authData.uid === 'google:101516603523422315983') {
            $scope.persons = $firebase(new Firebase("https://laesk.firebaseio.com/")).$asArray();
        }

        $scope.plus = function (person) {
            person.saldo += 1;
            $scope.persons.$save(person);
        }
        $scope.hundra = function (person) {
            person.saldo += 14;
            $scope.persons.$save(person);
        }

    })