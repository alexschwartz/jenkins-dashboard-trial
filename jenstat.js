var globalJobStatusUnkown = {};

function getStatusFromJenkinsColorCode(jenkinsColorCode) {

    switch (jenkinsColorCode) {
      case "blue":
          return "successful"; 
      case "red":
          return "failed"; 
      case "blue_anim":
      case "red_anim":
      case "grey_anim":
          return"building";
      default:
          return "unkown";
    }; 
}

function status2color(status) {

    switch (status) {
      case "successful":
          return "rgb(15, 99, 30)"; 
      case "failed":
          return "#FF0000"; 
      case "building":
          return"yellow";
      default:
          return "grey";
    }; 
}

function retrieveJsonForJenkinsJobURL(jenkinsJobUrl, callbackSuccess, callbackFailed) {
    var jobId = jenkinsJobUrl.split('/').last();
    var jsonUrl = jenkinsJobUrl + '/api/json?jsonp=?'
    
    $(this).attr('title2', 'jenkins job ' + jobId + ", url: " + jsonUrl);             

    $("#statusbar").append("retrieving(" + jsonUrl + "), " +  "  ");
    $("#statusbar").append("starting request");

    if (globalJobStatusUnkown[jobId] == 1) {
    	callbackFailed(jobId)
    }
    
    globalJobStatusUnkown[jobId] = 1;
    $.getJSON(jsonUrl, function(json) {
    	globalJobStatusUnkown[jobId] = 0;
    	callbackSuccess(jobId, jenkinsJobUrl, json);
    })
 
}

Array.prototype.last = function() {return this[this.length-1];}

function updateAllJenkinsLinks() {
    $(".jenkinsJobLink").each(function(index) {
      var jobUrl = $(this).attr('href')
      var thisLink = $(this)
      $("#statusbar").append("<br/><br/> ## jenkins job " + jobUrl + " <br/>"); 
     
      
  
      retrieveJsonForJenkinsJobURL(jobUrl, 
          function(jobId,jenkinsJobUrl,json) {
              var jsonStatusColorCode = json.color
              var status = getStatusFromJenkinsColorCode(jsonStatusColorCode)
              $("#statusbar").append(" ## jenkins status: jobId='" + jobId + "', statu='" + jsonStatusColorCode + "' ## "); 
              //thisLink.text(' ');
              //thisLink.remove('.jenkinsJobStatusWidget');
              //thisLink.wrapInner('<div class="jenkinsJobStatusWidget" />');
              thisLink.attr('title', 'jenkins job ' + jobId + " (" + status + ")");
              //thisLink.children('.jenkinsJobStatusWidget').attr('class', 'jenkinsJobStatusWidget jenkinsJobLink status_' + status);
          },
          function(jobId,jenkinsJobUrl) {
        	  alert("unkown + " + jobId)
          });
   });
}

var secondsToReload = 4;

var auto_refresh = setInterval(function () {
    updateAllJenkinsLinks();
}, secondsToReload*1000); // refresh every x*1000 milliseconds


$(document).ready(updateAllJenkinsLinks);
