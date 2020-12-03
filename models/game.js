'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.game.belongsToMany(models.user, { through: 'playedGame'})
      models.game.hasMany(models.comment);
    }
  };
  game.init({
    title: DataTypes.STRING,
    rawg: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'game',
  });
  return game;
};