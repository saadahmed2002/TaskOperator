import dbConnect from '../../lib/dbConnect'
import User from '../../model/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../config/config';

export async function POST(req) {
  await dbConnect();
  const { email, password, role } = await req.json();

  const user = await User.findOne({ email, role });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
      status: 401,
    });
  }

  const token = jwt.sign({ id: user._id, email, role }, config.JWT_SECRET, { expiresIn: '7d' });

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
}
