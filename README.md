# Test My Internet

A single web page application that tests addresses that for connectivity,
and logs when it can or can't connect.

## How to use the site

1. Leave the web page open
2. All the devices listed there will be tested periodically
3. If the device responds, it's shown in green; if it doesn't respond, it's red
4. The information on the right show the history of Up/Down events
5. If you close the web page, all the history will be lost 

## Building and testing

- `npm run gulp` on local server runs the gulp process, 
starts a development web server, 
and starts BrowserSync to force the browser to open. 
It also starts a watch process to refresh browser when things change.
- Edit README.md and ToDo.md to retain hints about the project. 
These will not be served in final project.

## Deployment

- On the main/production web server, retrieve software from github repo
    ```
    cd /var/www/TestMyInternet
    git pull
    npm run gulp
    ^C   # to abort. No need for further gulp action
    ```
- Domain is served out of /var/www/TestMyInternet/build directory
- On local machine, `gulp patch`, `gulp feature`, and `gulp release` update
the version in the package.json and also (when re-running `npm run gulp`) in index.html,
then re-pull from github.
