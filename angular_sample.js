/*
**This is Application.js file which is used by the application as its base file it has all the controllers defined in it 
**for ex: IndexController this is going to be the parent controller in our application which has many child controllers
**like dashboard,sidebar etc.
**
**we've used angular's state based routing i.e. UIRouting in here to manage diffrent routes of the application
**
**then we have services to perform certain tasks like AuthenticationService, BreadcrumbService etc the name defines it all what they do! 
**
**then we have custom directives like DateRangeSelector to perform the task of range selection of dates and some custom attributes
**like backToTop to go back to the top of the screen , full height to set the page height to the full length
**
**we've used angular cookies to remember user and his date selection and some other minor tasks
**
**we'v used angular's loading bar to show a loading bar at the top of the page while getting an http request just like the red bar at the top
**of youtube page
**
**we've used ngGrid component to show data fetched from the server in a grid which has advanced features like data-grouping, pagintaion,
**data-filtering etc
**
*/
(function(){
'use strict';
require('angular');
require('angular-route');
require('angular-ui-router');
require('bower_components/angular-cookies');
require('bower_components/angular-loading-bar');
require('bower_components/angular-animate');
var powercardApp,routes;
//routes for application
routes = require("routes.js");
//controllers
var IndexController = require("modules/index/controllers/IndexController");
var DashboardController = require("modules/dashboard/controllers/DashboardController");
var SidebarController = require("modules/dashboard/controllers/SidebarController");
var HeaderController = require("modules/dashboard/controllers/HeaderController");
var ReportsController = require("modules/reports/controllers/ReportsController");
//services
var AuthenticationService = require("services/AuthenticationService");
var GidmidlidService = require("services/GidmidlidService");
var DemoService = require("services/DemoService");
var BreadcrumbService = require("services/BreadcrumbService");
var UserDataService = require("services/UserDataService");
var DateRangeSelectorService = require("services/DateRangeSelectorService");
//directives
var dateRangeSelectorDirective = require("directives/dateRangeSelectorDirective");
//defining application
powercardApp = angular.module('powercardsApp',['ngRoute','ngCookies','ncy-angular-breadcrumb', 'ui.router','ngDaterangepicker', 'ngGrid','angular-loading-bar','ngAnimate']);
//powercardApp.config(['$routeProvider','$locationProvider',routes]);
powercardApp.config(['$stateProvider','$urlRouterProvider',routes]);
powercardApp.factory("AuthenticationService",['$http','$location',AuthenticationService]);
powercardApp.service("GidmidlidService",['$cookieStore',GidmidlidService]);
powercardApp.service("UserDataService",['$cookieStore', UserDataService]);
powercardApp.service("DateRangeSelectorService",DateRangeSelectorService)
//powercardApp.directive("dateRangeSelectorDirective",dateRangeSelectorDirective);
powercardApp.controller("IndexController",['$scope','AuthenticationService', '$cookieStore', '$rootScope', '$location', 'GidmidlidService', 'UserDataService', 'DateRangeSelectorService', IndexController]);
powercardApp.controller("DashboardController",['$scope','GidmidlidService','DemoService', '$rootScope', DashboardController]);
powercardApp.controller("SidebarController",['$http','$scope','GidmidlidService','DemoService','$rootScope', '$state',SidebarController]);
powercardApp.controller("HeaderController",['$rootScope','$scope',HeaderController]);
powercardApp.controller("ReportsController",['GidmidlidService', '$stateParams', '$scope', '$http', ReportsController]);
/*exp*/
powercardApp.directive('customBackToTop',function(){
return {
restrict:'A',
link:function($scope, element, attributes){
element.bind('click',function(){
$('body,html').animate({
       scrollTop: 0
   }, 500);
   return false;
});
}
}
});
powercardApp.directive('customCollapseLeftBar',function(){
return {
restrict:'A',
link:function($scope, element, attributes){
element.bind('click',function(){
     if ((window.innerWidth)<768) {
            $("body").toggleClass("show-leftbar");
        } 
        else {
          $("body").toggleClass("collapse-leftbar");
          //Sets Cookie for Toggle
          if($.cookie('admin_leftbar_collapse') === 'collapse-leftbar') {
              $.cookie('admin_leftbar_collapse', '');
              $('ul.acc-menu').css('visibility', '');
          } else {
              $.each($('.acc-menu'), function() {
                  if($(this).css('display') == 'none')
                    $(this).css('display', '');
              });
              $('ul.acc-menu:first ul.acc-menu').css('visibility', 'hidden');
              $.cookie('admin_leftbar_collapse', 'collapse-leftbar');
          }
        }
        checkpageheight();
        leftbarScrollShow();
});
}
}
});
powercardApp.directive('showChildWhenCollapsed',function(){
return {
strict:'A',
link : function($scope, element, attributes){
element.bind('mouseenter',function(){
 $('ul.acc-menu:first > li').hover(function() {
        if($.cookie('admin_leftbar_collapse') === 'collapse-leftbar')
        {
             $(this).find('ul.acc-menu').css('visibility', '');
        }
   }, function() {
       if($.cookie('admin_leftbar_collapse') === 'collapse-leftbar'){
           $(this).find('ul.acc-menu').css('visibility', 'hidden');
       }
    });	 
});
}
}
});
powercardApp.directive('panelCollapse',function(){
return{
strict:'A',
link:function($scope, element, attributes){
$('a.panel-collapse').click(function() {
   $(this).children().toggleClass("fa-chevron-down fa-chevron-up");
   $(this).closest(".panel-heading").next().slideToggle({duration: 200});
   $(this).closest(".panel-heading").toggleClass('rounded-bottom');
   return false;
});
}
}
});
powercardApp.directive('fullHeight', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            var headerAndFooter = 40;
            scope.initializeWindowSize = function () {
                $(element).css('min-height', $window.innerHeight - headerAndFooter);
            };
            scope.initializeWindowSize();
        }
    };
});
powercardApp.directive('maintainSideBarState',function($location,$state){
return{
link:function(){
       var targetAnchor;
       $.each ($('ul.acc-menu a'), function(i) {
 	if($(this).closest('li').hasClass('active')){
   	$(this).closest('li').removeClass('active');
   }
   	});
   $.each ($('ul.acc-menu a'), function(i) {
   //get rid of leading hashes if it exists, to match against $location.path()
 var href = $(this).attr('href') && $(this).attr('href').replace(/^/, '');
 //uiSref is laid out as 'stateName({params})', get only 'stateName'
 var stateName = $(this).attr('ui-sref') && $(this).attr('ui-sref').split('(')[0];
 if(stateName === $state.current.name){
 	if($location.path()==href.replace("%20",' ')){
 	var includesState = true;
 	}
 }
 var includesHref = href && $location.path().indexOf(href) === 0;
 	if (includesHref || includesState) {
 	targetAnchor = this;
return (false);
       }
   });
   var parent = $(targetAnchor).closest('li');
   while(true) {
       parent.addClass('active');
       parent.closest('ul.acc-menu').show().closest('li').addClass('open');
     parent = $(parent).parents('li').eq(0);
       if( $(parent).parents('ul.acc-menu').length <= 0 ) break;
   }
}
}
});
powercardApp.factory("DemoService",['$rootScope',DemoService]);
powercardApp.run(function($cookieStore,$location,$rootScope,$log,$state){
if($cookieStore.get('remember_id') ){
$location.path("/dashboard");
}
$rootScope.Utils ={
keys:Object.keys
}
$rootScope.$log = $log;
$rootScope.$on("$stateNotFound",function(){
console.log('state not found');
});
$rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) { 
sideBarActivation();
function sideBarActivation(){
var targetAnchor;
   //deactivating the old one if any
   $.each ($('ul.acc-menu a'), function(i) {
 	if($(this).closest('li').hasClass('active')){
   	$(this).closest('li').removeClass('active');
   	$(this).closest('li ul.acc-menu').css('display', 'none');
   	$(this).closest('li').removeClass('open');
   }
   });
   $.each ($('ul.acc-menu a'), function(i) {
   //get rid of leading hashes if it exists, to match against $location.path()
 var href = $(this).attr('href') && $(this).attr('href').replace(/^/, '');
 //uiSref is laid out as 'stateName({params})', get only 'stateName'
 var stateName = $(this).attr('ui-sref') && $(this).attr('ui-sref').split('(')[0];
 var includesState = stateName && $state.includes(stateName);
 var includesHref = href && $location.path().indexOf(href) === 0;
 	if (includesHref || includesState) {
         targetAnchor = this;
         return false;
       }
   });
   var parent = $(targetAnchor).closest('li');
   while(true) {
       parent.addClass('active');
       parent.closest('ul.acc-menu').show().closest('li').addClass('open');
       parent = $(parent).parents('li').eq(0);
       if( $(parent).parents('ul.acc-menu').length <= 0 ) break;
   }
}
});
});
powercardApp.filter('moment', function () {
  return function (dateString, format) {
   return moment(dateString).format(format);
  };
});
}());
_______________________________________________________________________________________________________
This is the routing file used by our application having said above that we are using angular-ui-routing
________________________________________________________________________________________________________
module.exports = function($stateProvider, $urlRouterProvider) {
$stateProvider
  .state('state1', {
    url: "/state1",
    templateUrl: "views/state1.html"
  })
  .state('state1.list', {
    url: "/list",
    templateUrl: "views/state1.list.html",
    controller: function($scope) {
      $scope.items = ["A", "List", "Of", "Items"];
    }
  })
  .state('state2', {
    url: "/state2",
    templateUrl: "views/state2.html"
  })
  .state('state2.list', {
    url: "/list",
      templateUrl: "views/state2.list.html",
      controller: function($scope) {
        $scope.things = ["A", "Set", "Of", "Things"];
      }
    })
  .state("dashboard",{
    url:"/dashboard",
    templateUrl: "./modules/index/views/dashboard.html",
    controller:"DashboardController",
    ncyBreadcrumb: {
      label: 'Dashboard'
    }
  })
  .state("login",{
    url:"/login",
    templateUrl: "./views/login.html"
  })
  .state("forgot-password",{
    url:"/forgot-password",
    templateUrl: "./views/forgotpassword.html"
  })
  .state("dashboard.customers",{
    url:"/customers",
    templateUrl:"./views/customers.html"
  })
  .state("dashboard.reports",{
    url:"/reports",
    templateUrl:"./modules/reports/views/all_reports.html",
    controller:"ReportsController",
    ncyBreadcrumb:{
      label:"Reports"
    }
  })
  .state("dashboard.reports.reporttype",{
    url :"/:reportType",
      templateUrl:"./modules/reports/views/report.html",
    controller:"ReportsController",
      ncyBreadcrumb:{
        label:"{{reportType}}",
       // parent:"dashboard.reports"
      }
    })
  .state("404",{
    url :"/404",
    templateUrl: "./views/404.html"
  })
  $urlRouterProvider.otherwise("/login");
};
