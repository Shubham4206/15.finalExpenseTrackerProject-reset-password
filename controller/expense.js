const Expense=require('../model/expense');
const User=require('../model/user'); 
const { Op } = require('sequelize');
const sequelize = require('../util/database');


exports.addExpense=async(req,res,next)=>{
    const{amount,description,category}=req.body;
    if(amount.length>0 && description.length>0 && category.length>0){
        try{
            const t=await sequelize.transaction();
        const totalexpense=Number(req.user.totalExpense)+Number(amount);
        await User.update({totalExpense:totalexpense},
            {where:{id:req.user.id}},
            {transaction:t});
      let data = await  req.user.createExpense({
                amount:amount,
                description:description,
                category:category
            },
            {transaction:t} );
           // console.log(data);
          await t.commit();
         res.status(200).json(data);
        
    } catch (error) {
        t.rollback();
        res.status(500).json({success: false, message: error});
    }
    }
}

exports.getExpense=async(req,res,next)=>{
    try{
        let data= await req.user.getExpenses();
        res.status(200).json(data);
    }catch(err){
        res.status(500).json({success:false,message:err});
    }
}

exports.deleteExpense=async(req,res,next)=>{
    const t=await sequelize.transaction();
    const uid=req.params.id;
    const amount=req.params.amount;
    const totalexpense=Number(req.user.totalExpense)-Number(amount);
    await Expense.destroy({
        where:{
         id:uid
        }
        
    },{transaction:t});
    await User.update({totalExpense:totalexpense},
        {where:{id:req.user.id}},
        {transaction:t});
    res.sendStatus(200);

}

exports.getLeaderboard=async(req,res,next)=>{
    if(req.user.isPremiumUser === true) {
        try{
         let user=await User.findAll({
            attributes:['id','name','totalExpense']
         });
            user.sort((a,b)=>b.totalExpense-a.totalExpense);
                    res.status(200).json(user);
                } catch (error) {
                    throw new Error(error);
                }
    } else {
        res.status(403).json({success: false, message: 'user does not premium membership'});
    }

};
