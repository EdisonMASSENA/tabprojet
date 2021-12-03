module.exports = (sequelize, Sequelize) => {

  const Tableau = sequelize.define("tableau", {
    chef: {
      type: Sequelize.STRING
    },
    direction: {
      type: Sequelize.STRING
    },
    priorite: {
      type: Sequelize.STRING
    },
    projet: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING
    },
    debut: {
      type: Sequelize.STRING
    },
    fin: {
      type: Sequelize.STRING
    },
    etat: {
      type: Sequelize.STRING
    },
    tendance: {
      type: Sequelize.STRING
    },
    accompli: {
      type: Sequelize.STRING
    },
    attention: {
      type: Sequelize.STRING
    },
    encours: {
      type: Sequelize.STRING
    },
    progress: {
      type: Sequelize.INTEGER
    }},
  {
    timestamps: false
  });

  return Tableau;
};
