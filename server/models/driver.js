import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Driver = sequelize.define('Driver', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'available', // available, on_delivery, offline
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vehicleInfo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Driver;
};