const expense=document.getElementById('expense');

expense.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const amount=document.getElementById('amount');
    const description=document.getElementById('description');
    const category=document.getElementById('category');

    const expensedetails={
        amount:amount.value,
        description:description.value,
        category:category.value
    }
    try{

        let res=await axios.post(`http://localhost:4000/expense/addexpense`,expensedetails,{
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
        showuserexpense(res.data);
        amount.value='';
        description.value='';
        category.value='';

    }catch(err){
        if(err.response.status===501){

            amount.value="";
            console.log(err)
        }
       else{
        console.log(err);
       } 
    }
})
document.addEventListener("DOMContentLoaded", async () => {
    try {

        let response2 = await axios.get("http://localhost:4000/expense/getexpense",{
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
        let response = response2.data;
        for (var i = 0; i < response.length; i++) {
            showuserexpense(response[i]);
        }
       // priceAdded();
    }
    catch (err) {
        console.log(err);
    }
    checkforpremium();
})

function showuserexpense(user) {
    let item = document.getElementById('expense-items');
    let fin = user.amount + "-" + user.description+"-"+user.category;
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(fin));
    let deleteBtn = document.createElement('button');
    deleteBtn.className = "btn btn-danger btn-sm float-right delete";
    deleteBtn.textContent = 'Delete Expense';
    li.appendChild(deleteBtn);
    item.appendChild(li);
    deleteBtn.onclick = async () => {
        await axios.delete(`http://localhost:4000/expense/deleteexpense/${user.id}/${user.amount}`,{
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
        item.removeChild(li);
        // priceAdded();
    }
  
}

document.getElementById('razorbutton').onclick= async(e)=>{
    try{

        let response = await axios.post(`http://localhost:4000/user/purchasepremium`, {}, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
        var options = {
            "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
            // "name": "Test Company",
            "order_id": response.data.order.id, // For one time payment
            // "prefill": {
            //     "name": "Test User",
            //     "email": "test.user@example.com",
            //     "contact": "7003442036"
            //     },
            // "theme": {
            //     "color": "#3399cc"
            //     },
            // This handler function will handle the success payment
            "handler": async function (response) {
                console.log(response);
                try{
              await  axios.post(`http://localhost:4000/user/purchasepremium/update-transaction-status`,
                    {
                        order_id: options.order_id,
                        payment_id: response.razorpay_payment_id,
                    }, 
                    {   
                        headers: {"Authorization" : localStorage.getItem('token')} 
                    })
                    
                        alert('You are a Premium User Now');
                        checkforpremium();
                 } catch(err)  {
                        alert('Something went wrong. Try Again!!!');
                    }
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
        e.preventDefault();

        rzp.on('payment.failed', function (response){
            console.log(response);
            // alert('something went wrong');
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
        });
        
    }catch(err){
        console.log(err);
    }

}

    async function checkforpremium(){
        try{
    let res=await axios.get("http://localhost:4000/user/checkmembership",{
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    });
    if(res.status===200){
        document.getElementById('razorbutton').style.display="none";
        document.getElementById('primeuser').innerHTML="You are Prime User!";
        document.getElementById("leaderboard_btn").style.display="block";
    }


    else if(res.status===202){
        document.getElementById('primeuser').innerHTML='';
    }
}catch(err){
    console.log(err);
    alert("something error occured");
    
}
}
    let leaderboard_btn=document.getElementById("leaderboard_btn");
    
    leaderboard_btn.onclick=async function addLeaderboard() {
    try {
        document.getElementById('leaderboard-div').style.display = "block";
        const response = await axios.get(`http://localhost:4000/expense/get-leaderboard`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
        
        const leaderboard = document.getElementById('leaderboard');
       
        leaderboard.innerHTML = '';
        console.log(response.data);
        response.data.forEach(user => {
        
    
            leaderboard.innerHTML+=`
                <li id="${user.id}">${user.name}-${user.totalExpense}<button>View Details</button></li>
            `;
        });
    } catch (error) {
        console.log('hello',error);
    }
}