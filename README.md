# easy-agile-progress
Show progress and estimation on [Easy Agile Roadmap](https://marketplace.atlassian.com/apps/1215695/easy-agile-roadmaps-for-jira?hosting=cloud&tab=overview) board.

Unfortunately Epic progress bars are not currently available for Jira cloud instances as Easy Agile team is waiting for Atlassian to release an API that will allow us to access Epic statistics (see [JSWCLOUD-14710](https://jira.atlassian.com/browse/JSWCLOUD-14710) )

This is a simple, quick&dirty Greasemonkey/Tampermonkey script that
* Add a button to the Easy Agile Roadmap page
* Show the origianl epic estimate and the progress (as number of resolved issues on total issues in the epic)

# How to install
Install [Greasemonkey](https://addons.mozilla.org/it/firefox/addon/greasemonkey/)/[Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=it)

Click [this link](https://raw.githubusercontent.com/totomz/easy-agile-progress/master/script.js)

# How to customize
Fork this repo and choose your preferred statistics (story points, remaining estimates, whatever)
