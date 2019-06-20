# Art-Version-Control-System-One
Art Version Control System One is website that acts as a version control system for photoshop and image files. Once signed in to their account, the user can create new projects and upload files to their projects in order to create back ups of the current version of their projects. New projects can be created as public or private projects. If a project is public it will be viewable to all users on the "Public Library" page. If a project is private then it will only show up in the user's "My Library" page once signed in. As the user continues to work on their project they upload the project's file when they have made progress that they want to back up to there AVCS project. The user can then view each version of each project, download and delete any version they desire. Only the user that created the project can upload new version, delete versions, or delete the entire project. All users are able to download and view each project. This system allows the user to see the progression of their project and also easily revert back to a pervious version of their project.

## Details

### Website:
http://www.artvcs.com

### Dependencies:
  ```Node.js version 10.13.0```
  ```sqlite3 version 6.4.1```

### Technologies:
Back-end:
 - Node.js with Express Server
 - sqlite3 database

Front-end:
 - HTML, JavaScript, CSS
 - Uikit front-end framework

Hosting:
 - Managed by PM2
 - Nginx Reverse Proxy Server

### Current Limitations:
 - On current hosting service only files less than 600KB recommended. This is a limitation set by the memory size of said hosting service.

## Screenshots

### Default Home Page (Public Library)

Here the user can view all the public projects, click on them for more details, and sign in to their account. Each row shows a preview of the latest version of the project, the name of the project, and the user that owns the project.

![alt text](https://raw.githubusercontent.com/TheUzbekistan/Art-Version-Control-System-One/master/screenshots/Screenshot1-homepagedefault.png  "Screenshot1")
---
### Sign up - Account Creation

Here is the sign up view. It is a secondary option shown once the user clicks on the sign in button.

![alt text](https://raw.githubusercontent.com/TheUzbekistan/Art-Version-Control-System-One/master/screenshots/Screenshot2-signup.png "Screenshot2")
---
### Sign in

This is an example of a user signing into their account. I made this account so someone looking at the site can test out their functionality. username: "exampleuser" password: "password"

![alt text](screenshots/Screenshot3-signin.png "Screenshot3")
---
### My Library

Here is what is shown to the user after signing in. This is their "My Library". It shows all the user's public and private projects. Here the user can upload new versions of each project by click on that project's UPLOAD FILE button.

![alt text](https://raw.githubusercontent.com/TheUzbekistan/Art-Version-Control-System-One/master/screenshots/Screenshot4-mylibrary.png "Screenshot4")
---
### Library Switcher (My Library/Public Library)

By hovering over the Library button the user can switch between their My Library and the Public Library.

![alt text](https://raw.githubusercontent.com/TheUzbekistan/Art-Version-Control-System-One/master/screenshots/Screenshot5-libraryswitcher.png "Screenshot5")
---

### Create New Project

The user can create a new project by clicking the NEW PROJECT button in the bottom right corner. Here they can choose the name, whether it is public or private, and pick the file for version 0.

![alt text](https://raw.githubusercontent.com/TheUzbekistan/Art-Version-Control-System-One/master/screenshots/Screenshot7-createnewproject.png "Screenshot7")
---
### Detailed View Of A Project

Once a user clicks on the project of theirs they will be taken to a detailed page. This page shows all version of the project in descending order by version. The user can Upload a new version using the UPLOAD FILE button in the button right corner. The user can download any version by click on that version's DOWNLOAD button.

![alt text](https://raw.githubusercontent.com/TheUzbekistan/Art-Version-Control-System-One/master/screenshots/Screenshot8-detailedviewsignedin.png "Screenshot8")
---
### View Option Picker (View Mode/Edit Mode)

To access deleting features a user but hover over the project name button and switch to EDIT MODE. This mode can only be accessed for a project if the project's owner is signed in.

![alt text](https://raw.githubusercontent.com/TheUzbekistan/Art-Version-Control-System-One/master/screenshots/Screenshot9-viewoptionswitcher.png "Screenshot9")
---
### Edit Mode - Delete Version

Here is how it looks to a user when they delete a version of their project.

![alt text](https://raw.githubusercontent.com/TheUzbekistan/Art-Version-Control-System-One/master/screenshots/Screenshot10-deleteversion.png "Screenshot10")
---
### Edit Mode - Delete Project

Here is how it looks to a user when they delete the entire project.

![alt text](https://raw.githubusercontent.com/TheUzbekistan/Art-Version-Control-System-One/master/screenshots/Screenshot11-deleteproject.png "Screenshot11")
---
### Dynamically Updating Search on Public Library

The search by works by dynamically updating the projects that are currently being shown in the Library to match that is being typed.

![alt text](https://raw.githubusercontent.com/TheUzbekistan/Art-Version-Control-System-One/master/screenshots/Screenshot12-search.png "Screenshot12")
---
### Detailed View of A Project (Not Signed In)

Here's how it looks when a user clicks on a project from the Public Library. They only have access to the Download version option.

![alt text](https://raw.githubusercontent.com/TheUzbekistan/Art-Version-Control-System-One/master/screenshots/Screenshot13-notsignedindetails.png "Screenshot13")



## Future Plans
In Future I would like to implement functionality such as:
  - hosted
  - set up hosting service with more memory to handle larger files
  - implement new viewing options
  - create a version difference indicator
