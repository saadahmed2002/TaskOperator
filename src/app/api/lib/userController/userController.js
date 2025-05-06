import bcrypt from 'bcrypt';
import User from '../../model/User';

export async function createUser(req) {
  const { name, email, password, designation, id } = await req.json();

  if (!name || !email || !password || !designation) {
    return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
  }

  try {
    const user = new User({ name, email, password, designation });
    const saved = await user.save();
    return new Response(JSON.stringify(saved), { status: 201 });
  } catch (err) {
    console.error('Create user error:', err);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}

export async function getAllUsers() {
  try {
    const users = await User.find();
    return new Response(JSON.stringify({ users }), { status: 200 });
  } catch (err) {
    console.error('Fetch users error:', err);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}

export async function updateUser(req) {
  const { name, email, password } = await req.json();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    if (name) user.name = name;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    return new Response(JSON.stringify({ message: 'Updated successfully' }), { status: 200 });
  } catch (err) {
    console.error('Update error:', err);
    return new Response(JSON.stringify({ message: 'Update failed' }), { status: 500 });
  }
}

export async function deleteUser(userId) {
  try {
    const removed = await User.findByIdAndDelete(userId);
    if (!removed) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: 'Deleted' }), { status: 200 });
  } catch (err) {
    console.error('Delete user error:', err);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}

export async function getUserDetails(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err) {
    console.error('User detail error:', err);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
export async function getTeamMembers() {
  try {
    // Query the database to find all users who are not managers
    const members = await User.find({ role: { $ne: 'manager' } }); // $ne means "not equal"

    // Return only the members (excluding the manager)
    return new Response(JSON.stringify({ users: members }), { status: 200 });
  } catch (err) {
    console.error('Fetch team error:', err);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}

export async function createManagerUser(body) {
  const { name, email, password, designation, id } = body;

  // Ensure required fields are provided
  if (!name || !email || !password || !designation || !id) {
    return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
  }

  try {
    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      id, // Ensure you pass the `id` here
      name,
      email,
      password: hashedPassword, // Store the hashed password
      designation,
      role: 'manager', // Set the role as manager
    });

    // Save the user to the database
    const saved = await user.save();
    return new Response(JSON.stringify(saved), { status: 201 });
  } catch (err) {
    console.error('Create user error:', err);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
