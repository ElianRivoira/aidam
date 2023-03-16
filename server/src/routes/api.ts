const express = require('express');
import { Request, Response } from 'express';


const api = express.Router();

api.use('/', function test(req: Request, res: Response) {
  res.json('hola');
});

export default api;
