'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('quote_details', [
      {
        quote_id: 1,
        material: 'Aluminum',
        product_type: 'Window Frame',
        CL: 'A100',
        unit: 10,
        width: 48.5,
        height: 36.0,
        at: 2,
        GL: 'Glass Type A',
        GRD: true,
        SC: 'Standard',
      },
      {
        quote_id: 1,
        material: 'PVC',
        product_type: 'Door Panel',
        CL: 'B200',
        unit: 5,
        width: 80.0,
        height: 200.0,
        at: 3,
        GL: 'Glass Type B',
        GRD: false,
        SC: 'Premium',
      },
      {
        quote_id: 2,
        material: 'Steel',
        product_type: 'Security Window',
        CL: 'C300',
        unit: 8,
        width: 60.0,
        height: 50.0,
        at: 1,
        GL: 'Glass Type C',
        GRD: true,
        SC: 'High-Security',
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('QuoteDetails', null, {});
  }
};
