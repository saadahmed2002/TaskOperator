import dbConnect from '../../lib/dbConnect';
import User from '../../model/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password, role } = await req.json();

    const user = await User.findOne({ email, role });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return new Response(
        JSON.stringify({ message: 'Invalid credentials' }),
        {
          status: 401,
        }
      );
    }

    const token = jwt.sign(
      { id: user._id, email, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict; ${
      process.env.NODE_ENV === 'production' ? 'Secure;' : ''
    }`;

    return new Response(
      JSON.stringify({ message: 'Login successful', user: { email, role } }),
      {
        status: 200,
        headers: {
          'Set-Cookie': cookie,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error during login:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      {
        status: 500,
      }
    );
  }
}
