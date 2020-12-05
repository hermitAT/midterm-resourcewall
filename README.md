LHL Midterm - Resource Wall - "devTips"
=========

## Overview

DevTips is a website where everybody can share code snippets or links to articles, blogs, videos.

## Main Features

1. Home
-	For a user who is logged in, compose a new tip, applying different types of rendering to different types of data. Select the data of your choice and app will redirect you to page for newly created tip.
-	Like and bookmark tips, allowing you to return to view those tips later!
-	Pagination functionality includes buttons at bottom of page allows a single webpage to store many pages of tips, paginated in sets of 10.
-	Titles and other elements of tips contain hyperlinks to redirect to the stored URL in question.

2. User
-	Stores all tips created by the user in question on one page.
-	Contains specific data, links, pertaining to the user in question.

3. Tip
-	Contains a render of the singular tip in question, with information on the creator of the tip to the side.
-	Comments are displayed below for each tip, and a comment form is available to a user who is logged to add a comment for the tip in question.

4. Search works in two ways:
- Clicking on a particular tag performs search for tips which contain this tag.
- Entering a search query to search field on the header and clicking the 'Search' button evaluates words from the query and redirects to the search page showing if there any valid tags among these words. If there any, results will be shown. If some of words are not exist in the database as tags for tips, the results header will show message about this and will show search results for valid tags. If all of the words are not valid tags, the header will show \No results' message.

## Screenshots

- ### Home Page
!["Home Page"](https://github.com/hermitAT/midterm-resourcewall/blob/master/docs/home-page.png)
- ### Compose New Tip
!["Home Page"](https://github.com/hermitAT/midterm-resourcewall/blob/master/docs/compose-tip.png)
- ### Paginator
!["Home Page"](https://github.com/hermitAT/midterm-resourcewall/blob/master/docs/paginator.png)
- ### Search
!["Home Page"](https://github.com/hermitAT/midterm-resourcewall/blob/master/docs/search-page.png)
- ### User Page
!["Home Page"](https://github.com/hermitAT/midterm-resourcewall/blob/master/docs/user-page.png)
- ### Tip Page
!["Home Page"](https://github.com/hermitAT/midterm-resourcewall/blob/master/docs/tip-page.png)


## Getting Started

1. Setup local database using following command, replace 'vagrant' as necessary:
    `psql -U vagrant -d template1`
2. Create user and allow that user to own the new database;
    `CREATE ROLE labber WITH LOGIN password 'labber';`
    `CREATE DATABASE midterm OWNER labber;`
3. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
4. Update the .env file with the example given in step #2.
5. Install dependencies: `npm i`
6. Fix to binaries for sass: `npm rebuild node-sass`
7. Reset database: `npm run db:reset`
8. Run the server: `npm run local`
9. Visit `http://localhost:8080/`
10. Login as `tyler_sikorski@sample.com` with password `password` to get a feel for the features!

## Dependencies

•	bcrypt 5.0.0,
•	body-parser 1.19.0,
•	chalk 2.4.2,
•	cookie-session 1.4.0,
•	dotenv 2.0.0,
•	ejs 2.6.2,
•	express 4.17.1,
•	morgan 1.9.1,
•	node-sass-middleware 0.11.0,
•	pg 6.4.2,
•	pg-native 3.0.0
