import inquirer from 'inquirer';
import bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3'
let ava_bal;
let password_hash;

const db = new sqlite3.Database("atm_data.db", sqlite3.OPEN_READWRITE);
function checkandRun(optask){
    db.get("SELECT password_hash FROM atm_ops",(err, row) => {
        if (err){
            console.error("Database Error:", err.message);
            return;
        }

        if (!row||!row.password_hash){
            console.log("No Password found");
            return;
        } password_hash = row.password_hash;

    inquirer.prompt([{   
            name:    'confirm',
            type:    'confirm',
            message: 'Are You Sure you want to proceed?',
        }
    ]) //.then(({confirm})) => {}) //destructuring
.then((answers) => {
        const confirm = answers.confirm;
        if(!confirm){
            console.log("Transaction Cancelled");
            return;
    } return inquirer.prompt([
            {
            type: 'password',
            name: 'password',
            message: 'Please Enter Your Password',
            mask: '*',
        }
     ]);
    }).then((answer) => {
        if(!answer) return;
        const entrd_password = answer.password;
        bcrypt.compare(entrd_password,password_hash)
        .then(match =>{  //.then (function (match) 
            if(!match){
                console.log("Please Check Your Password");
                return ;
            }
            optask();
        })
    }).catch(err =>{
        console.error("Something went wrong please retry", err);
        });
    });
}

function avail_bal(){
    db.get("SELECT balance FROM atm_ops",(err, row) =>{
        if (err){
            console.error("Database Error:", err.message);
            return;
        }
        if(!row || !row.balance === undefined){
            console.log("No Data Found !");
            return;
        }
        ava_bal = row.balance
        console.log(`Your Available Balance is ₹ ${ava_bal}`);
        mainMenu()
    })    
}

function withdraw(){
    inquirer.prompt({
        type:    'input',
        message: 'Enter Your Amount here ₹',
        name:    'withdrawal_value',
    })
    .then((answers) => {
        const amount = parseInt(answers.withdrawal_value);
    if (amount < ava_bal) {
        ava_bal -= amount;
        db.run("UPDATE atm_ops SET balance = ?", [ava_bal], function(err) {
            if(err) {
                console.error(`Failed to Update Balance is`, err.message);
                return;
            } console.log(`Your Request for withdraw of amount ₹${amount} Your Available Balance is ₹${ava_bal}`) 
        console.log(`Your Updated Balance is ${ava_bal}`);
        mainMenu();
    });
  }else{
    console.log("Insufficient Balance. Please Check the Amount")
  }
})
.catch((err) =>{
    console.error("Something went wrong", err.message);
 });
}


function mainMenu(){
    inquirer.prompt([
        {
            type:    'list',
            name:    "AtmMenu",
            message: `Welcome to JS Bank ATM \n Please select your ATM Options`,
            choices: [
                
                'balance inquiry', 
                'withdrawal'
            
            ],
        },
    ]).then((answers) => {
        switch(answers.AtmMenu){
            case 'balance inquiry': checkandRun(avail_bal);
                break;

            case 'withdrawal': checkandRun(withdraw);
                break;

            default: mainMenu();
        }        
    });
}

mainMenu();
