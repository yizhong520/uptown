# INFO441 Project UPTOWN

## INFO 441 Final Project Proposal
### INFO441 Team5 
### Team members: Jessica Liu, Miranda Ma, Whitney Zhang, Yi Zhong
 
## Project Description 
We’re interested in building a housing finder tool for people to search for their next apartment to live in. This idea stems from the struggles we experience as out-of-state college students searching for off-campus housing around the university without any knowledge of the neighborhoods. We feel that there is especially a need to focus on the safety of one’s living arrangements in an urban city like Seattle, where the property crime score is 76.9 compared to the US average of 35.4 (https://www.bestplaces.net/crime/city/washington/seattle). 

The target audience for our application is UW students who are in the process of finding a flexible-termed apartment, especially those who do not know the area so well. We envision that this solution could eventually be scaled up for anyone who is looking for housing. Our application will provide apartment information like housing source, contact information, pricing. Our app will also have the ability for individuals to post about housing availability, have a bookmarked love list to keep track of interesting apartments, and include a review component for each apartment that anyone with a valid account can use. 

We wanted to build a message board type web application so anyone can post about available housing. This includes people who are trying to find subleases or are trying to sublet their own apartments for the summer. This is different from existing solutions like Zillow where it could be hard to post when you are not the landlord. We hope having uptown could also mean a centralized platform for apartment hunting so that there is no more need for people to join ten different Facebook groups scrolling through hundreds of postings a day trying to find the right fit. We also included bookmark functionalities for ease of use. One unique advantage we wanted to utilize is the power of community: we included functionalities like reviews and comments under each housing post so that people who might have lived there before can speak to their experience. 

We would like to build this application because we have been through the struggle of trying to find the right place to live. In building such solution, we hope to create a platform to truly help ease the stress of finding housing and a sense of community in the UW area. 
 
## Technical Description

![alt text](/public/img/Info%20441.png)

## Summary Table of User Stories
| Priority  |          User         |                                                 Description                                                 |                                      Technical Implementation                                     |
|:---------:|:---------------------:|:-----------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------:|
| P0        | As a user or landlord | I want to register for an account/sign in.                                                                  | Using POST to acquire the user information and log users into their accounts.                     |
| P0        | As a landlord         | I want to post housing information.                                                                         | Using POST to add new posts on housing information to the website                                 |
| P0        | As a landlord         | I want to be able to delete the post I created.                                                             | Using DELETE to remove the information on the current post from the dataset. Comments under post are also deleted.                      |
| P1        | As a user or landlord     | I want to change my displayed name.                         | Creating a feature that allows the user to update their name.                           |
| P1        | As a user             | I want to bookmark/un-bookmark the apartment I’m interested in.                                             | Clicking on the bookmark/un-bookmark button to store/remove posts into the user’s bookmark field. |
| P2        | As a user or landlord     | I want to comment under the apartment I’m interested in.                         | Creating a feature that allows users to comment under the current post.                           |
 
## API EndPoints
### Authentication 
- /signin <br>
	Handle user authentication through Azure
- /signout <br>
	Deletes current user session and logout the user
- /error <br>
	Handle login and general server errors that may occur during sign in
- /unauthorized <br>
	Deny access to login to the account if not logged into a UW Mircosoft account
 
### Users  /users/
- / <br>
	GET: Returns the session of the all users <br>
	POST: Save new users to the database by user names <br>
- /myIdentity <br>
	GET: Returns current user account information(username)  <br>
- /myBookmarkedPosts <br>
	GET: Returns usernames of the current user <br>
- /bookmark <br>
	POST: bookmark a certain post 
- /unbookmark <br>
	POST: unbookmark a certain post
 
### Housing Posts /posts/
- / <br>
GET: Returns a list of all posts <br>
POST: Add a new apartment post<br>
DELETE: Deletes a housing source post<br>
- /bookmark <br>
	POST: Save the user who bookmarked the post <br>
- /unbookmark <br>
	POST: Remove the username that the user unbookmarks a certain post<br>

### Comments/Reviews /comments/
- / <br>
GET: Returns all comments for a specific post based on the postID <br>
POST: Make a new comment for a certain post <br>
 
 
 
## Schemas
### Users:
name: String, <br>
username: String, <br>
email: String, <br>
myBookmarks: [String]
 
### Post:
username: String, <br>
name: String, <br>
contact: String, <br>
housing: String, <br>
zipcode: String, <br>
address: String, <br>
description: String, <br>
price: String, <br>
created_date: Date, <br>
bookmarks: [String]
 
### Comment
username: String, <br>
created_date: Date, <br>
comment: String, <br>
post: {type: mongoose.Schema.Types.ObjectId, ref: "Post"}

Created by Whitney Zhang, Yi Zhong, Miranda Ma, Jessica Liu
