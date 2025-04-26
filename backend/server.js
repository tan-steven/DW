require('dotenv').config();
const express = require("express");
const app = express();
const {Sequelize} = require('sequelize');
const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const port = process.env.PORT || 4000;
app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});