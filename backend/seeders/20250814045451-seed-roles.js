/** 
 * @param {import('sequelize-cli').Migration} queryInterface
 * @param {import('sequelize').Sequelize} Sequelize
 */

export const up = async (queryInterface, Sequelize) => {
  const rolesData = [
    {name: 'admin'},
    {name: 'user'},
  ]

  await queryInterface.bulkInsert('roles', rolesData.map(role => ({
    ...role,
    createdAt: new Date(),
    updatedAt: new Date()
  })), {});
}

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.bulkDelete('roles', null, {});
}