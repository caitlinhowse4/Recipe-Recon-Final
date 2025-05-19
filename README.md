
###### Instructions to launch web application ######

Create a file named ".env" in the main folder in this file paste the following as it is the log in to the database that I created and you cant run it without:

    MONGO_URI=mongodb+srv://caitlinhowse4:mypassword@clustercaitlin.5xrxdbn.mongodb.net/RecipeRecon?retryWrites=true&w=majority
    JWT_SECRET=39c7c79ef10e6a5ff0055b3a6f2b7ac70766a3316fadb27e8e2ecd1b65b348ba207f16c3a120ec4976b1566a4ade0dff334c5b08ecee37c43897a7436989f034
    PORT=5001


Navigate to root directory of project or open a terminal make sure to install dependencies by running the following commands:

    npm install

    npm install express mongoose bcryptjs jsonwebtoken cors dotenv

    npm install axios react-router-dom

Make sure to double check node version as it needs to be V18. To check this use the following:|

    node -v

    If this isnt version 18 use the following commands:

        nvm install 18
        nvm use 18


Run the backend server:

    node server.js

    you should see the following if the serve launch is succesfull:

        ✅ Server running on port 5001
        ✅ Connected to MongoDB

Run the front end with:

    npm run build

Launch using:

    npm start
