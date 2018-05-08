// ==UserScript==
// @name         Grab epics estimation
// @namespace    https://my-ideas.it
// @version      0.1
// @description  Show esitmation and progress on Easy Agile Roadmap - https://easyagile.com/
// @author       Tommaso Doninelli & Giorgio Catenazzi 2018
// @match        https://d3vsp726wp2k0e.cloudfront.net/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_xmlhttpRequest
// @connect      atlassian.net

// ==/UserScript==

(function() {
    // Onclick make this guy visible. Giorgio 1 Tom 0
    var r= $('<input type="button" value="Load Estimates" onclick="" style="z-index: 999; position: absolute; width: 150px; top: 3px" />');
    $('body').append(r);
    $(r).click(daje);
})();

function secToString(seconds) {
  
    const weeks = Math.floor(seconds / (3600*8*5));
    seconds  -= weeks*3600*8*5;
    const days = Math.floor(seconds / (3600*8));
    seconds  -= days*3600*8;
    const hrs   = Math.floor(seconds / 3600);
    seconds  -= hrs*3600;
    const mnts = Math.floor(seconds / 60);
    seconds  -= mnts*60;
    const s = [];
    if(weeks > 0){s.push(`${weeks}w`)}
    if(days > 0){s.push(`${days}d`)}
    if(hrs > 0){s.push(`${hrs}h`)}
    return s.join(' ');
  }

function daje(){
    var epics = $('div.epicDetails');

    // Get the Jira instance base address from the connect-all script
    // (this is running in the <iframe> that is loaded fromEasyAgile)
    let jiraUrl = "";
    $('script').each( (i,s) => {
        const script = $(s).attr('src');
        if(script && script.endsWith('/atlassian-connect/all.js')) {
           jiraUrl = script.replace('/atlassian-connect/all.js','');
        }
    });


    epics.each((i,e) => {

        // text() 0 Tommaso-Giorgio 1-1
        const issueKey = $(e).find('a:first').text();
        const url = `${jiraUrl}/rest/api/latest/issue/${issueKey}`;

        // Get the EPIC 
        GM_xmlhttpRequest({
            method: "GET",
            url,
            onload: function (res) {
                const issue = JSON.parse(res.responseText);
                let estimate = 'x';
                if(issue.fields.timetracking && issue.fields.timetracking.remainingEstimate){
                    estimate = issue.fields.timetracking.remainingEstimate;
                }

                // $(e).find('a:first').text( `${$(e).find('a:first').text()} - (${estimate})` ) ;               

                // Get all the issues in this epic to calcolate the "real" estimation
                // and the progress. This could be changed using the progress in the epic,
                // or issue count, or story points...
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${jiraUrl}/rest/agile/1.0/epic/${issueKey}/issue`,
                    onload: function (res) {
                        const daje = JSON.parse(res.responseText);
                        let totalEstimate_s = 0;
                        let totalSpent_s = 0;
                        let totalRemaining_s = 0;
                        let issuesInEpic = daje.total;
                        let issuesResolved = 0;

                        daje.issues.forEach(issue => {
                            totalRemaining_s += issue.fields.aggregatetimeestimate;
                            totalEstimate_s += issue.fields.timeoriginalestimate;
                            totalSpent_s += issue.fields.aggregatetimespent;

                            if (issue.fields.resolution){
                                issuesResolved++;
                            }

                            /*
                                issue.fields: {
                                    timeoriginalestimate --> Stima originale
                                    aggregatetimespent --> tempo loggato
                                    aggregatetimeestimate --> rimanente
                                }
                            */

                        });
                        const issueText = $(e).find('a:first').text();
                        $(e).find('a:first').text( `${issueText} (${estimate}) - ${secToString(totalRemaining_s)}` ) ;

                        // NOTE:
                        // If a story is closed but there is remaining effort?
                        // If there is more effort?
                        // In this implementation the progress is given by the number of
                        // issues closed/total issues in the epic
                        
                        let progress = (issuesInEpic > 0)?Math.ceil(issuesResolved/issuesInEpic*100):0;

                        $(e).parent().find('div.completion').css({
                            'background-color': 'green',
                            width: `${progress}%`
                        })
                    }
                });
            }
        });


    });

}