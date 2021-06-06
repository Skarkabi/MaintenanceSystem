  import express from 'express';
  const router = express.Router();

  router.get('/', async (req, res, next) => 
  {
     req.logout();
     res.redirect('/login');
   }
 );

export default router;