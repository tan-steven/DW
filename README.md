Backend:
  Migrations and Models:
    1. Make sure to have sequelize cli installed. Look on https://sequelize.org/ for reference
    2. Migrations and Models have similar structures, but make sure the names and types match to ensure the api works with the database
    3. We can use seeders to populate tables with dummy data for testing, or for data migration
  Controllers:
    1. These models are responsible for handeling CRUD functions
    2. Routes directory condense the different controller modules in one Route instead of having one route per controller.
  Middleware:
    The files in the middleware directory are for verifying user roles to limit access via JWT

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

Frontend:
  The routes for the application are all in App.jsx
  Theme.js sets the styling for App.jsx
  
  Customers:
    displays the information of different customers (quotes, customer name, company, address, etc.)
  
  Dashboard:
    Theming for the site, using header.jsx in components
  
  Deliveries:
    Sets delivery dates for orders and allows users to change delivery times

  formulas:
    To be further implemented to calculate costs of products

  global:
    Includes sidebar and topbar for consistent theming for the site
  
  invoices:
    1. Stores and displays information of orders
    2. Displays components/details of the orders in a modal
  
  login:
    login page using jwt and  bcrypt to verify users

  orders:
    1. Stores and displays information of quotes
    2. Displays components/details of the quotes in a modal

  quotes:
    1. allows users to create quotes via createQuote.jsx and displays preview of the window with dimensions and color etc.
    2. displays quotes in a table with customer informations
    3. display quote details in a modal with preview of windows
    4. allows users to edit and change quote information

  team:
    only admins can access and add new accounts with different access levels

TODO:
  1. implement quote functionalities like (displaying previews of windows, edits, and data displayed)
  2. implement formulas to auto-calculate prices (still need the data from diamond windows)
  3. revert quote numbering system to the DOS style