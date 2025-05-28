import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Callcard = sequelize.define('Callcard', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pickupLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dropoffLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending', // pending, in_progress, completed, cancelled
    },
    driverId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  return Callcard;
};