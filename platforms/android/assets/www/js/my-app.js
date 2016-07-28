// Initialize your app

var myApp = new Framework7({
    pushState:true,
    swipePanel:'left',
    swipeBackPage:false
})


// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
// Because we use fixed-through navbar we can enable dynamic navbar
dynamicNavbar: true
});
//mainView.loadPage("https://www.eylftools.com.au/MobileApp2015/NewsFeed.html");
// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('', function (page) {
    // run createContentPage func after link was clicked

});
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;
    //Shows Preloader on page loading
    myApp.showPreloader();
  /*  var timer=setTimeout(
        function()
        {
            myApp.hidePreloader();
        },30000);  //Hiding Preloader after 25 seconds have passed*/

    //After the loading of iframes of each page complete, it will hide the preloader
    if(page.name=="observations") {

        document.getElementById("observationframe").onload = function () {
            myApp.hidePreloader();

        };
    }
    else if(page.name=="goals") {

        document.getElementById("goalsframe").onload = function () {
            myApp.hidePreloader();

        };
    }
    else if(page.name=="shareob") {

        document.getElementById("shareobframe").onload = function () {
            myApp.hidePreloader();

        };
    }
    else if(page.name=="shareobandroid") {

        document.getElementById("shareobframeandroid").onload = function () {
            myApp.hidePreloader();

        };
    }
    else if(page.name=="sharegoal") {

        document.getElementById("sharegoalframe").onload = function () {
            myApp.hidePreloader();

        };
    }
    else if(page.name=="helpus") {

        document.getElementById("helpusframe").onload = function () {
            myApp.hidePreloader();

        };
    }
    else if(page.name=="familyinformation") {

        document.getElementById("familyinformationframe").onload = function () {
            myApp.hidePreloader();

        };
    }
    else if(page.name=="experiences") {

        document.getElementById("experiencesframe").onload = function () {
            myApp.hidePreloader();

        };
    }
    else if(page.name=="educators") {

        document.getElementById("educatorsframe").onload = function () {
            myApp.hidePreloader();

        };
    }
    else if(page.name=="educators") {

        document.getElementById("educatorsframe").onload = function () {
            myApp.hidePreloader();

        };
    }
    else if(page.name=="othergoals") {

        document.getElementById("othergoalsframe").onload = function () {
            myApp.hidePreloader();

        };
    }
    else if(page.name=="aboutservice") {

        document.getElementById("aboutserviceframe").onload = function () {
            myApp.hidePreloader();

        };
    }
    else if(page.name=="calendar") {

        document.getElementById("calendarframe").onload = function () {
            myApp.hidePreloader();

        };
    }
    else if(page.name=="news") {

        document.getElementById("newsframe").onload = function () {
            myApp.hidePreloader();

        };
    }
    else if(page.name=="searchinformation") {

        document.getElementById("searchinformationframe").onload = function () {
            myApp.hidePreloader();

        };
    }
})
// Generate dynamic page
