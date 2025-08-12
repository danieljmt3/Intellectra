import express from 'express'

const pass= express.Router();

pass.post('/request-passw');
pass.post('/reset-passw');

export default pass;