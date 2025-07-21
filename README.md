Backend:
  Migrations and Models:
    1. Make sure to have sequelize cli installed. Look on https://sequelize.org/ for reference
    2. Migrations and Models have similar structures, but make sure the names and types match to ensure the api works with the database
    3. We can use seeders to populate tables for testing
  Controllers:
    1. These models are responsible for handeling CRUD functions
    2. Routes condense the different controller modules in one Route instead of having one route per controller.
  
  Setup:
    1. Make sure .env has all the required variables by config.js
        DB_USERNAME
        DB_PASSWORD
        DB_NAME
        DB_HOST
        DATABASE_URL
        PORT
    2. Include JWT_SECRET key so JWT can use it for authentication
    3. Run npm i to install packages
    4. Use command (sequelize db:migrate) to migrate the database schema to the database
    5. Start the server using npm start

