angular.module('starter')



  .controller("userLoginController",function($scope,$http, serverUrl,$state, $rootScope){
    $rootScope.logData = {};
    $rootScope.logData.userAdmin = localStorage.getItem("tokenLogin");

    $scope.logAdd =function(){
      $http.post(serverUrl+"LoginUser",$rootScope.logData)
        .then(function(data){
          console.log(data.data[0].userName);
          localStorage.setItem("tokenLogin", data.data[0].userAdmin)    ;
          $state.go("app.products");
        },function(err){console.log(err)})
    };

  })




.controller('AppCtrl', function($scope, $ionicModal, $timeout,$state) {
    $scope.logOut= function(){
      localStorage.removeItem("tokenLogin");
      $state.go("app.login")};

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
 /* $scope.login = function() {
    $scope.modal.show();
  };*/

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('productsCtrl', function($scope,$http,serverUrl,$timeout,$state) {
    $scope.logData = {};
    $scope.logData.userAdmin = localStorage.getItem("tokenLogin");

    $scope.go = function(){
      $state.go("app.booking")
    }

$timeout(function(){
  /*=======Get UserName =============*/
  $http.get(serverUrl+"getUsers/"+ $scope.logData.userAdmin)
    .then(function(d){
      //console.log(d.data[0].userEmail);
      $scope.mavia = d.data[0].userName;
    });
  /*======Get OrderName==========*/
  $http.get(serverUrl + "getOrderName?prot=" + $scope.logData.userAdmin)
    .then(function (d) {
      console.log(d.data);
      $scope.productArray = d.data;
    })
},1000);
    })



.controller('bookingCtrl', function($scope,$http,serverUrl,$rootScope , $firebaseArray,$cordovaGeolocation) {

    var local = localStorage.getItem("tokenLogin");

    var ref = new Firebase("https://salsmanapp.firebaseio.com/notific");
    $scope.notification = $firebaseArray(ref);

    $scope.order = {local:local};
    console.log("user ", $scope.order);
    $scope.orderBookin = function(){
      /*$http.post(serverUrl+"Not", $scope.order)
        .then(function(data)
        {console.log("IONIC data ",data);
          alert("Your Order Send Successfully")},
        function(err) {
          console.log(err,"ionic");
        })*/
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          var lat  = position.coords.latitude;
          var long = position.coords.longitude;
          $scope.order.position= {lat: lat,long:long};

          $scope.notification.$add($scope.order);
          //console.log("user ", $scope.use)
          $http.post(serverUrl+"Not", $scope.order)
            .then(function(data)
            {console.log("IONIC data ",data);
              alert("Your Order Send Successfully")},
            function(err) {
              console.log(err,"ionic");
            })
        }, function(err) {
          // error
        });

    }

  });
