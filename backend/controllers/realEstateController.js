const RealEstate = require('../models/realEstateModel');

const { ObjectId } = require('mongodb');
const provinceId = new ObjectId()

const addRealEstate = async (req, res) => {
  const RealEstateData = req.body;

  try {
    const newrealEstate = new RealEstate(RealEstateData);

    await newrealEstate.save(); // Guardar la nueva inmobiliaria en la base de datos

    res.status(201).json({ msg: 'Inmobiliaria agregada correctamente', realEstate: newrealEstate});
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar la inmobiliaria' });
  }
};

const getRealEstate = async (req, res) => {

  const { realEstateId} = req.params;

  try {
    const realEstate = await RealEstate.findById(realEstateId);

    if (!realEstate) {
      return res.status(404).json({ error: 'Inmobiliaria no encontrada' });
    }

    res.status(200).json({ realEstate });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la inmobiliaria' });
  }
};

const deleteRealEstate = async (req, res) => {
  const { realEstateId } = req.params;

  try {
    const deletedRealEstate = await RealEstate.findByIdAndUpdate(
      realEstateId,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!deletedRealEstate) {
      return res.status(404).json({ error: 'Inmobiliaria no encontrada' });
    }

    res.status(200).json({ message: 'Inmobiliaria eliminada correctamente', deletedRealEstate });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la inmobiliaria' });
  }
};

const updateRealEstate = async (req, res) => {
  const realEstateId  = req.params.realEstateId;
  const updateData = req.body;

  try {
    const updatedRealEstate = await RealEstate.findByIdAndUpdate(
      realEstateId,
      updateData,
      { new: true }
    );
    if (!updatedRealEstate) {
      return res.status(404).json({ error: 'Inmobiliaria no encontrada' });
    }
    
    res.status(200).json({ message: 'Inmobiliaria actualizada correctamente', updatedRealEstate });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la inmobiliaria' });
  }
};

const permanentDeleteRealEstate = async (req, res) => {
  const { realEstateId } = req.params;

  try {
    const deletedRealEstate = await RealEstate.findByIdAndDelete(realEstateId);

    if (!deletedRealEstate) {
      return res.status(404).json({ error: 'Inmobiliaria no encontrada' });
    }

    res.status(200).json({ message: 'Inmobiliaria eliminada permanentemente correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar permanentemente la inmobiliaria' });
  }
};

module.exports = {
  getRealEstate,
  addRealEstate,
  deleteRealEstate,
  updateRealEstate,
  permanentDeleteRealEstate,
};