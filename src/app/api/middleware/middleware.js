
// import { parse } from 'cookie';
// import jwt from 'jsonwebtoken';

// export async function verifyToken(req) {
//   try {
//     const cookieHeader = req.headers.get('cookie');
//     if (!cookieHeader) {
//       return { authorized: false, response: unauthorized('No token') };
//     }

//     const { token } = parse(cookieHeader);
//     if (!token) {
//       return { authorized: false, response: unauthorized('Token missing') };
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     return { authorized: true, user: decoded };
//   } catch (err) {
//     return { authorized: false, response: unauthorized('Invalid or expired token') };
//   }
// }

// function unauthorized(message) {
//   return new Response(JSON.stringify({ message: `Unauthorized: ${message}` }), {
//     status: 401,
//     headers: { 'Content-Type': 'application/json' },
//   });
// }


import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function verifyToken(children) {
  try {
    
    const token = await cookies()
    const pos  =  await token
    const value = await pos.get('token')
    const val = value.value
   const resp =  jwt.verify(val, process.env.JWT_SECRET) 
   console.log(resp)  
   return children
  } catch (error) {
    
return new Response(JSON.stringify({ message: 'Invalid or expired token' }), {
  status: 403,}
)
    
  }
    
}


