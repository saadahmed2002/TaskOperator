const { createManagerUser } = require("../lib/userController/userController");


// Example usage of the function:
async function run() {
  const userData = {
    id: 'unique-manager-id',
    name: 'Saad Ahmed',
    email: 'manager@1.com',
    password: 'password', // This is the plaintext password
    designation: 'manager',
  };
const user =await createUser(userData)
 console.log(user)
}

run().catch(console.error);
