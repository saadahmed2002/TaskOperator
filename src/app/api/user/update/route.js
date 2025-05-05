import dbConnect from "../../lib/dbConnect"
import { updateUser } from "../../lib/userController/userController"


export async function PUT(req) {
    
    await dbConnect()
    return updateUser(req)
    
}