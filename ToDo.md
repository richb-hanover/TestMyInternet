#Test My Internet

A Single Page (web) Application (SPA) that queries a set of web servers to see if they're alive. 
It runs as long as the page is open, and saves the state in localStorage.
Ultimately, it will show a history with time-stamped up/down events.

##Tasks

- Click a host to select it
    - highlight its rectangle to show that it's selected
    - filter text area on that host
    - hit Delete to remove
- Add "+" icon to add hosts, maybe "-" to remove
- Save list of hosts to localStorage when navigating away.
Save textarea contents; limit to ~1 MByte
- Restore list of hosts and textarea on reload
- Find other code to detect router?
- Use Markdown to display textarea
- Rework GUI to get rid of flexbox
* Settings for polling interval, clear out history, etc. (Nah...)
- Minimize and open new window button
- Make About... page driven by newer Markdown page
- Segregate all publishable html/md files into html/ directory

## Completed tasks

* Query all \<hosts> on the page
* Find local router (if possible)
* LogToWindow when item changes state
