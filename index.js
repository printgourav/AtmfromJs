import inquirer from 'inquirer';
let ava_bal = Math.floor(Math.random()*10000000);
let CORRECT_PASSWORD = "admin123";

function checkandRun(optask){
    inquirer.prompt([
        {   
            name:    'confirm',
            type:    'confirm',
            message: 'Are You Sure you want to proceed?',
        }
    ])      //.then(({confirm})) => {}) //destructuring
    .then((answers) => {
        const confirm = answers.confirm;
        if(!confirm){
            console.log("Transaction Cancelled");
            return;
        }
        return inquirer.prompt([
            {
            type: 'password',
            name: 'password',
            message: 'Please Enter Your Password',
            mask: '*',

        }
     ]);
    }).then((answer) => {
        const entrd_password = answer.password;
        if(entrd_password !== CORRECT_PASSWORD){
            console.error("Incorrect Password. Please check before you re-entered");
            return;
        }
        optask();
    }).catch(err =>{
        console.error("Something went wrong please retry", err);
    });
}
function avail_bal(){
    console.log(`Your available balance is ₹ ${ava_bal}`);
    mainMenu();
}
function withdraw(){
    inquirer
        .prompt({
        type:    'input',
        message: 'Enter Your Amount here ₹',
        name:    'withdrawal_value',

    }).then((answers) => {
        const amount = parseInt(answers.withdrawal_value);

    if (amount < ava_bal) {
        
        ava_bal -= amount;
        console.log(`Your Request for withdraw of amount ₹${amount} Your Available Balance is ₹${ava_bal}`)
    
    }
    else {
    console.log("Please Check with your Amount entered, couldnt Process Your transaction");
    }
  });
};

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
    ])
    .then((answers) => {
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