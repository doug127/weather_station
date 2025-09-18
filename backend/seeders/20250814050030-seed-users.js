/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').Sequelize} Sequelize
 */

import bcrypt from 'bcrypt';

export const up = async (queryInterface, Sequelize) => {
  const usersData = [
    { 
      email: 'douglas@example.com', 
      password: 'password123.', 
      username: 'douglas', 
      role_id: 1, 
      isVerified: true, 
      code: null,
      codeExpiresAt: null
    },
    { 
      email: 'maicol@example.com', 
      password: 'password123.', 
      username: 'maicol', 
      role_id: 2, 
      isVerified: true, 
      code: null,
      codeExpiresAt: null
    },
    { 
      email: 'rosangel@example.com', 
      password: 'password123.', 
      username: 'rosangel', 
      role_id: 3, 
      isVerified: true, 
      code: null,
      codeExpiresAt: null
    }
  ];

  await queryInterface.bulkInsert('users', await Promise.all(usersData.map(async user => ({
    ...user,
    password: await bcrypt.hash(user.password, 10),
    createdAt: new Date(),
    updatedAt: new Date()
  }))), {});
}

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.bulkDelete('users', null, {});
}