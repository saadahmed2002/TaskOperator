
import { NextResponse } from 'next/server';
import User from '../../model/User';


export const createUser = async (req) => {
  
  const { name, email, password, designation, id } =await req.json();
  console.log(name, email,password,designation,id);
  

  if (!name || !email || !password || !designation) {
    return  NextResponse.json({ status: 400, message: 'Missing required fields' });
  }

  try {
    const newUser = new User({ name, email, password, designation });
    const savedUser = await newUser.save();
    console.log(savedUser)
    return NextResponse.json({ status: 201, data: savedUser });
  } catch (err) {
    console.error('Error creating user:', err);
    return NextResponse.json({ status: 500, message: 'Server error' });
  }
};

export const getAllUsers = async () => {
  try {
    const users = await User.find();
    return Response.json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    return NextResponse.json({ status: 500, message: 'Server error' });
  }
};

export const updateUser = async (req) => {
  const { name, email, password } = await req.json();
  try {
    const updatedUser = await User.findOne({ email });

    if (!updatedUser) {
      return  NextResponse.json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name) updatedUser.name = name;
    if (password) updatedUser.password = await bcrypt.hash(password, 10);

   const result = await updatedUser.save();
   console.log(result)

    return NextResponse.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Error updating user' });
  }
};

export const deleteUser = async (userId) => {
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return { status: 404, message: 'User not found' };
    }
    return { status: 200, message: 'User deleted successfully' };
  } catch (err) {
    console.error('Error deleting user:', err);
    return { status: 500, message: 'Server error' };
  }
};

export const getUserDetails = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ status: 404, message: 'User not found' });
    }
    return NextResponse.json({ status: 200, data: user });
  } catch (err) {
    console.error('Error fetching user details:', err);
    return NextResponse.json({ status: 500, message: 'Server error' });
  }
};

export const getTeamMembers = async () => {
  try {
    const teamMembers = await User.find();
    return NextResponse.json({users: teamMembers })
  } catch (err) {
    console.error('Error fetching team members:', err);
    return NextResponse.json( { status: 500, message: 'Server error' });
  }
};
