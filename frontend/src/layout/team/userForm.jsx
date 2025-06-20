import React, { useState } from 'react';
import axios from 'axios';

const availableRoles = ['quote', 'invoice', 'order', 'admin'];

const UserForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState([]);

  const handleCheckboxChange = (role) => {
    setRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users', { email, password, roles }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('User created successfully');
      setEmail('');
      setPassword('');
      setRoles([]);
    } catch (err) {
      alert('Error creating user: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New User</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div>
        <label>Assign Roles:</label>
        {availableRoles.map((role) => (
          <div key={role}>
            <label>
              <input
                type="checkbox"
                checked={roles.includes(role)}
                onChange={() => handleCheckboxChange(role)}
              />
              {role}
            </label>
          </div>
        ))}
      </div>
      <button type="submit">Create User</button>
    </form>
  );
};

export default UserForm;
