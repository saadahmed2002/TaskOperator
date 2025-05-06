
import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import User from '../../model/User';
const bcrypt  = require('bcrypt')
import { v4 as uuidv4 } from 'uuid';


export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json(); 
    const { name, email, password, designation } = body;

    if (!name || !email || !password || !designation) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role: 'member',
      designation,
      notifications: [],
    });

    await newUser.save();
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });

  } catch (err) {
    console.error('Error creating user:', err);
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
  }
}
