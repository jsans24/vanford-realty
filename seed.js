require('dotenv').config();
const db = require('./models');


const realtors = [
    {
        name: 'Joe Exotic'
    },
    {
        name: 'Kevin Smith'
    },
    {
        name: 'Annie Brown'
    },
    {
        name: 'Mary Jones'
    },
    {
        name: 'William VanHook'
    }
]

//Delete all realtors
db.Realtor.deleteMany((err, result) => {
    if(err) {return console.log(err)
        process.exit()
        }
    console.log(result)

    //Create realtors
    db.Realtor.create(realtors, (err, newRealtors) => {
        if(err) {return console.log(err)
        }
        console.log(newRealtors)
        process.exit()
    });
})

