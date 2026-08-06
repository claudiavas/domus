var express = require('express');
var router = express.Router();

userController = require('../controllers/userController');
const { jwtMiddleware, authRouter} = require("../security/jwt")

// User management routes

/* register */
  router.post('/register', authRouter);

/* login */
  router.post("/login", authRouter)

/* resetPassword */
  router.put("/resetpassword/:userId", authRouter)

/* me Comprueba el token del usuario si es correcto */
  router.get("/me", userController.meUser)

/* Obtener un usuario por su userId*/
  
  router.get("/:userId", userController.getUser)

  router.get("/", userController.getUser)

  router.put("/:userId", userController.updateUser) // Actualizar un usuario por su userId

module.exports = router;