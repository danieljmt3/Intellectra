import express from 'express'
import { requestpasswordRest,RestPassword } from '../controllers/password.controller.js';

const pass= express.Router();

pass.post('/request-passw',requestpasswordRest);
pass.post('/reset-passw',RestPassword);

export default pass;