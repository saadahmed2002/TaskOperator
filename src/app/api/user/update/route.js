import dbConnect from "../../lib/dbConnect"
import { updateUser } from "../../lib/userController/userController"
import { verifyToken } from "../../middleware/middleware"


export async function PUT(req) {
    
    await dbConnect()
    return verifyToken( updateUser(req))
    
}