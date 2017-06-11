#Test My Internet

A Single Page (web) Application (SPA) that queries a set of web servers to see if they're alive. 
It runs as long as the page is open, and saves the state in localStorage.
Ultimately, it will show a history with time-stamped up/down events.

## Tasks

- Use Markdown to display textarea (?)
- Minimize and open new window button
- Add hamburger icon in nav bar
- Consider getting location info; displaying neighborhood up/downs
- Move spinner to green icon?
- Make header stretch across page?

## Completed tasks

* LogToWindow when item changes state
- Segregate all publishable html/md files into html/ directory
- Make remote-site checking code more robust
- Restore textarea/history on reload
- Rework GUI to get rid of flexbox (Switched to bootstrap3)
- Possibly add About at bottom of page
- Make About... page driven by newer Markdown page,
- Change text to white <h1> in green icon?

## Won't Fix

- Click a host to select it
    - highlight its rectangle to show that it's selected
    - filter text area on that host
    - hit Delete to remove
- Add "+" icon to add hosts, maybe "-" to remove
- Save list of hosts to localStorage when navigating away.
- Save textarea contents; limit to ~1 MByte
- Find other code to detect router?
* Settings for polling interval, clear out history, etc. (Nah...)
* Query all \<hosts> on the page
* Find local router (if possible)

