import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

// Model imports
import UserModel from './user.js';
import DriverModel from './driver.js';
import CallcardModel from './callcard.js';

export const User = UserModel(sequelize);
export const Driver = DriverModel(sequelize);
export const Callcard = CallcardModel(sequelize);

// Associations
Driver.hasMany(Callcard, { foreignKey: 'driverId' });
Callcard.belongsTo(Driver, { foreignKey: 'driverId' });

export default {
  sequelize,
  User,
  Driver,
  Callcard,
};