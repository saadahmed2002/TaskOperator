
import dbConnect from '../../../lib/dbConnect';

import nc from 'next-connect';
import cookie from 'cookie';

const handler = nc()
  .post(async (req, res) => {
    await dbConnect();
    return authController.login(req, res);
  });

export default handler;
