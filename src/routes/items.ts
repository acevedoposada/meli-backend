import { Request, Response, Router } from 'express';
import url from 'url';
import { apiServer } from '../config';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { search } = url.parse(req.url, true).query;
    const response = await apiServer(
      `/sites/MLA/search?q=${search ?? ''}#json`
    );
    return res.send(response.data);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get('/', async () => {});

export default router;
