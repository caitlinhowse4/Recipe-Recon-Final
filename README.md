# Recipe Recon #
Recipe recon is a full-stack MERN based web app that allows users to browse adjust save & create Recipes with Ingredient scaling.

## Overview

Recipe recon allows users to
- Create an account and log in
- Use the web app as a guest 
- Browse recipes from an external API
- Asjust ingredient quantities based on desired servings
- Save custom recipes with recalculated values
- Quickly re portion recipes with quick conversion buttons
- Submit feedback suggestions
- Chat with an AI bot for help.
- Delete custom saved recipes
- Upload covers to custom saved recipes

## Technologies that were used
*Frontend*
- reactReact  
- React Router DOM  
- Axios  

*Backend:*
- Node.js  
- Express  
- MongoDB (Mongoose ODM)  
- JWT for authentication  

# Example useage
- log in or continue as a guest
- search for a meal (example: "chicken")
- Click card and scroll to the bottom to see ingredients
- Alternatively click "Create your own" and select your ingredients measurements and serving sizes before pressing "Recalculate
- adjust servings to your preference 
- Click "saved recipe" to browse and view your saved recipes
- Use the suggestion forum to submit feedback


## Instructions for launch web application for the first time##

### Prerequisites  
- Node.js  
- MongoDB (Atlas or local)  
- npm / yarn

## Next

(1)Create a file named ".env" in the main folder in this file paste the following as it is the log in to the database that I created and you cant run it without:

    MONGO_URI=mongodb+srv://caitlinhowse4:mypassword@clustercaitlin.5xrxdbn.mongodb.net/RecipeRecon?retryWrites=true&w=majority
    JWT_SECRET=39c7c79ef10e6a5ff0055b3a6f2b7ac70766a3316fadb27e8e2ecd1b65b348ba207f16c3a120ec4976b1566a4ade0dff334c5b08ecee37c43897a7436989f034
    PORT=5001
    SKIP_PREFLIGHT_CHECK=true


(2)Navigate to root directory of project or open a terminal make sure to install dependencies by running the following commands:

    npm install
    npm install cross-env
    npm install express mongoose bcryptjs jsonwebtoken cors dotenv
    npm install axios react-router-dom

(3)Run the backend server:

        node server.js

    *you should see the following if the serve launch is succesfull:

        ✅ Server running on port 5001
        ✅ Connected to MongoDB


(4)Run the front end with:

    npm run build

(5)Launch using:

    npm start

## How to launch after already set up once before ##

(1)Start server first with:

    node server.js

(2)Then launch web application using:

    npm start    

## Trouble Shooting ##

If there are issues with launching programming:

    -->WEB FAILING TO LAUNCH
        Make sure to double check node version as it might need to be V18 To  check this use the following:|

            node -v

        If this isnt version 18 use the following commands:

            nvm install 18
            nvm use 18

        Double check all these are installed:

            npm install
            npm install cross-env
            npm install express mongoose bcryptjs jsonwebtoken cors dotenv
            npm install axios react-router-dom    

    -->MONGO DB NOT CONNECTING 
        The port might is taken by another process use:

            npx kill-port 5001        

# Authors 

Caitlin Howse
Lauryne Ysabelle Fernandico
Feba Santhosh


