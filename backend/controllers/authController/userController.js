const db = require('../../models');
const { User, Role } = db;

const createUser = async (req, res) => {
  try {
    const { email, password, roles } = req.body;

    const user = await User.create({ email, password });

    if (roles && roles.length > 0) {
      const matchedRoles = await Role.findAll({
        where: { name: roles },
      });
      await user.setRoles(matchedRoles);
    }

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('User creation failed:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

const updateUserRoles = async (req, res) => {
  const { id } = req.params;
  const { roles = [] } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const roleInstances = await Role.findAll({ where: { name: roles } });
    await user.setRoles(roleInstances);

    res.json({ message: 'Roles updated successfully' });
  } catch (err) {
    console.error('Error updating user roles:', err);
    res.status(500).json({ error: 'Failed to update roles' });
  }
};

module.exports = { createUser, updateUserRoles };
