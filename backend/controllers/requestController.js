const Request = require('../models/requestModel');

const User = require('../models/userModel');

const { ObjectId } = require('mongodb');
const requestId = new ObjectId()

/** Returns one saved search by id, or every saved search filtered by status. */
const getRequest = async (req, res) => {
  try {
    if (req.params.requestId) {

      const request = await Request.findById(req.params.requestId) 
        .populate("user");

    if (!request) {
      return res.status(404).json({ msg: 'No se ha encontrado la solicitud' });
    }  
    
    return res.status(200).json(request);
    } else {
        const filter = req.query.status ?{ status: req.query.status } : {};
        const requests = await Request.find(filter)
          .populate("user");
      // An empty list is a valid result, not an error
      return res.status(200).json(requests);
    }
  } catch (error) {
    return res.status(400).json(error);
  } 
};    

/** Stores a saved search linked to its owner. */
const addRequest = async (req, res) => {
  const { userId, ...requestFields} = req.body;
  try {
    const newRequest = new Request({
      user: userId,
      ...requestFields,
    });
    await newRequest.save();
    const populatedRequest = await Request.findById(newRequest._id)
      .populate('user')
      .exec();
    res.status(200).json({ msg: 'Request agregada con éxito', request: populatedRequest });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar la Request' });
  }
};

/** Soft-deletes a saved search. */
const deleteRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const deletedRequest = await Request.findByIdAndUpdate(
      requestId,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!deletedRequest) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    res.status(200).json({ message: 'Solicitud eliminada correctamente', deletedRequest });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la solicitud' });
  }
};

/** Updates a saved search by id. */
const updateRequest = async (req, res) => {
  const { requestId } = req.params;
  const updateData = req.body;

  try {
    const updatedRequest = await Request.findByIdAndUpdate(requestId, updateData, { new: true });

    if (!updatedRequest) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    res.status(200).json({ message: 'Solicitud actualizada correctamente', updatedRequest });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la solicitud' });
  }
};

const permanentDeleteRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const deletedRequest = await Request.findByIdAndDelete(requestId);

    if (!deletedRequest) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    res.status(200).json({ message: 'Solicitud eliminada permanentemente correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar permanentemente la solicitud' });
  }
};

module.exports = {
   getRequest,
   addRequest,
   deleteRequest,
   updateRequest,
   permanentDeleteRequest
};
