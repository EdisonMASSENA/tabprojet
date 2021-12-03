const db = require("../models");
const Tableau = db.tableau;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {

  const tableau = {
    chef: req.body.chef,
    direction: req.body.direction,
    priorite: req.body.priorite, 
    projet: req.body.projet, 
    type: req.body.type, 
    debut: req.body.debut,
    fin: req.body.fin,
    etat: req.body.etat, 
    tendance: req.body.tendance, 
    accompli: req.body.accompli, 
    attention: req.body.attention, 
    encours: req.body.encours,
    progress: req.body.progress
  };

  Tableau.create(tableau)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Une erreur s'est produite lors de la création du projet."
      });
    });
};

exports.findAll = (req, res) => {
    const projet = req.query.projet;
    var condition = projet ? { projet: { [Op.like]: `%${projet}%` } } : null;
  
    Tableau.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Une erreur s'est produite lors de la récupération des projets."
        });
      });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Tableau.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Le projet a été mis à jour avec succès."
          });
        } else {
          res.send({
            message: `Mise à jour impossible avec id=${id}.Elément manquant.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Erreur lors de la mise à jour du projet avec l'id=" + id
        });
      });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Tableau.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Le projet a été supprimé avec succès"
          });
        } else {
          res.send({
            message: `Suppresion impossible avec l'id=${id}.Elément manquant.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Suppresion impossible avec l'id=" + id
        });
      });
};
