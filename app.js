const express=require('express');
const app=express();
const bodyparser=require('body-parser');
const cors=require('cors');
const dotenv = require('dotenv');
dotenv.config();

const sequelize=require('./util/database.js');



const User=require('./model/user');
const Expense=require('./model/expense');
const Premiumuser = require('./model/premiumuser');
const Forgotpassword = require('./model/forgot-password');




User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Premiumuser);
Premiumuser.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);



const userroute=require('./routes/user');
const expenseroute=require('./routes/expense');
const passwordroute=require('./routes/password');


app.use(bodyparser.urlencoded());
app.use(bodyparser.json());
app.use(cors());


app.use('/user',userroute);
app.use('/expense',expenseroute);
app.use('/password',passwordroute);













sequelize.sync();
app.listen(4000);











