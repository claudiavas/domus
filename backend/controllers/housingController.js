const Housing = require('../models/housingModel');
const RealEstate = require('../models/realEstateModel');
const User = require('../models/userModel');

const { ObjectId } = require('mongodb');
const housingId = new ObjectId()

/** Creates a listing and returns it populated with its owner. */
const addHouse = async (req, res) => {
  const { userId, ...houseFields } = req.body;
  try {
    const newHouse = new Housing({
      user: userId, 
      ...houseFields,
    });
    await newHouse.save();
    const populatedHouse = await Housing.findById(newHouse._id)
      .populate('user')
      .exec();
    res.status(200).json({ msg: 'Vivienda agregada con éxito', house: populatedHouse });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar la vivienda' });
  }
};

/** Returns one listing by id, or every listing optionally filtered by status. */
const getHouse = async (req, res) => {
  try {
    if (req.params.houseId) {

      const house = await Housing.findById(req.params.houseId)
        .populate("user");

      if (!house) {
        return res.status(404).json({ msg: 'No se ha encontrado la vivienda' });
      }

      return res.status(200).json(house);
    } else {

      const filter = req.query.status ? { status: req.query.status } : {};
      const houses = await Housing.find(filter)
        .populate("user");

      // An empty list is a valid result, not an error
      return res.status(200).json(houses);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};


// soft Delete house
    
const deleteHouse = async (req, res, next) => {
   try {
     const housingId = req.params.housingId;
     const housing = await Housing.findByIdAndUpdate(housingId, {isDeleted: true});
    if (!housing){
      return res.status(404).json({ msg: 'No se encontro la vivienda'});
    }
    res.status(200).json({ msg: "La vivienda ha sido eliminada exitosamente"})
   } catch (error) {
    res.status(500).json({msg: error.message});
   }
  };

// Permanent Delete house 
const permanentDeleteHouse = async (req, res) => {
  try {
    const housingId = req.params.houseId;
    const housing = await  Housing.findByIdAndDelete(housingId);

    if (!housing) {
      return res.status(404).json({msg: 'No se encontro la vivienda'});
    }
    res.status(200).json({msg: 'La vivienda ha sido eliminada exitosamente'});
  } catch ( error ) {
    res.status(500).json({msg: error.message});
  }
}

/** Updates a listing; supports explicit createdAt for demo data. */
const updateHouse = async (req,res) => {
  // Demo data helper: createdAt is immutable for Mongoose, so explicit
  // values go through the native driver instead
  if (req.body.createdAt) {
    try {
      const { createdAt, ...resto } = req.body;
      await Housing.collection.updateOne(
        { _id: new ObjectId(req.params.houseId) },
        { $set: { ...resto, createdAt: new Date(createdAt) } }
      );
      const house = await Housing.findById(req.params.houseId).populate('user');
      return house
        ? res.status(200).send(house)
        : res.status(404).send({ msg: "No se han encontrado la vivienda" });
    } catch (error) {
      return res.status(400).send({ msg: error.message });
    }
  }
  Housing.findByIdAndUpdate({ _id: req.params.houseId }, req.body, { new: true })
      .populate('user')
      .then(house=>{
          if (house === null) {
              res.status(404).send({msg: "No se han encontrado la vivienda"})
          } else {
              res.status(200).send(house)   
          }
      })
      .catch(error=>{
          switch (error.name) {
              case 'CastError':
                  res.status(400).send({msg: 'Formato de id inválido'})
                  break;
              default:
                  res.status(400).send(error)
          }
      })
}


module.exports = {
  getHouse,
  addHouse,
  deleteHouse,
  permanentDeleteHouse,
  updateHouse,
};