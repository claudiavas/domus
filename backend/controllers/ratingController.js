const Rating = require('../models/ratingModel.js');

const { ObjectId } = require('mongodb');
const ratingId = new ObjectId()


const addRating = async (req, res) => {
  const ratingData = req.body;

  try {
    const rating = new Rating(ratingData);

    await Rating.save(); // Guardar la nueva solicitud en la base de datos

    res.status(200).send(rating);
  } catch (error) {
    switch (error.code) {
      case 11000:
        res.status(400).send({ msg: 'La puntuación ya existe' });
        break;
      default:
        res.status(400).send(error);
    }
  }
};



  const getRating = (req, res) => {
    if (req.params.ratingId) {
      Rating.findById(req.params.ratingId)
        .then((rating) => {
          if (rating === null) {
            res.status(404).send({ msg: 'No se ha encontrado la valoración' });
          } else {
            res.status(200).send(rating);
          }
        })
        .catch((error) => {
            switch (error.name) {
              case 'CastError':
                res.status(400).send('Formato de ID inválido');
                break;
              default:
                res.status(400).send(error);
            }
          });
        } else {
            let filter = {};
        
            if (req.query.status) {
              filter.status = req.query.status;
            }


    Rating.find(filter)
      .then((rating) => {
        if (rating.length === 0) {
          res.status(404).send({ msg: 'No se han encontrado valoraciones' });
        } else {
          res.status(200).send(rating);
        }
      })
      .catch((error) => res.status(400).send(error));
  }
};

const updateRating = async (req, res) => {
  const { ratingId } = req.params;
  const { rating, commentBrief, comment } = req.body;

  try {
    const updatedRating = await Rating.findByIdAndUpdate(
      ratingId,
      { rating, commentBrief, comment },
      { new: true }
    );

    if (!updatedRating) {
      return res.status(404).json({ error: 'Calificación no encontrada' });
    }

    res.status(200).json({ message: 'Calificación actualizada correctamente', updatedRating });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la calificación' });
  }
};

const deleteRating = async (req, res) => {
  const { ratingId } = req.params;

  try {
    const deletedRating = await Rating.findByIdAndUpdate(
      ratingId,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!deletedRating) {
      return res.status(404).json({ error: 'Calificación no encontrada' });
    }

    res.status(200).json({ message: 'Calificación eliminada correctamente', deletedRating });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la calificación' });
  }
};

const permanentDeleteRating = async (req, res) => {
  const { ratingId } = req.params;

  try {
    const deletedRating = await Rating.findByIdAndDelete(ratingId);

    if (!deletedRating) {
      return res.status(404).json({ error: 'Calificación no encontrada' });
    }

    res.status(200).json({ message: 'Calificación eliminada permanentemente correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar permanentemente la calificación' });
  }
};

module.exports = {
    getRating,
    addRating,
    deleteRating,
    updateRating,
    permanentDeleteRating
  }