import { verifyToken } from "../../middleware/middleware";

const { default: dbConnect } = require("../../lib/dbConnect");
const { createManagerUser } = require("../../lib/userController/userController");

export async function GET(req){
   
        const userData = {
          id: 'unique-manager-id',
          name: 'Manager',
          email: 'manager@1.com',
          password: 'password',
          designation: 'manager',
        };
     
      return await verifyToken(createManagerUser(userData))

}
