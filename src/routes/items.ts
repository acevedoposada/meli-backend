import { Request, Response, Router } from 'express';
import url from 'url';

import { apiServer } from '../config';
import { codeMessages, Keys } from '../constants';
import { Filter, ItemModel, ItemsModel } from '../models/items';

const router = Router();

const PAGE_SIZE = 50;

function pageOffsetFn(page: number) {
  if (Number.isNaN(page)) return null;
  return (page - 1) * PAGE_SIZE;
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, page } = url.parse(req.url, true).query;
    const pageOffset = pageOffsetFn(Number(page));
    const [response, resCurrency] = await Promise.all([
      apiServer(
        `/sites/MLA/search?q=${search ?? ''}${
          pageOffset ? `&offset=${pageOffset}` : ''
        }#json`
      ),
      apiServer(`/currencies`),
    ]);

    const currencies = resCurrency.data;
    const data = response.data;
    const categories =
      data.filters.find((element: Filter) => element.id === Keys.CATEGORY_ID)
        ?.values ?? [];
    const items =
      (data.results as Array<any>)?.map<ItemModel>((item) => {
        const currency = currencies.find(
          (curr: any) => curr.id === item.currency_id
        );
        return {
          author: { name: item.seller.nickname, lastname: '' },
          item: {
            id: item.id,
            title: item.title,
            condition: item.condition,
            free_shipping: item.shipping.free_shipping,
            picture: item.thumbnail,
            price: {
              id: item.currency_id,
              amount: item.price,
              currency: currency.symbol,
              decimals: currency.decimal_places,
            },
          },
        };
      }) ?? [];

    const result: ItemsModel = {
      author: { name: '', lastname: '' },
      categories,
      items,
      pagination: data.paging,
    };

    return res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { params } = req;
    const [responseDetail, responseDescription, resCurrency] =
      await Promise.all([
        apiServer(`/items/${params.id}`),
        apiServer(`/items/${params.id}/description`),
        apiServer(`/currencies`),
      ]);

    const currencies = resCurrency.data;
    const descriptionData = responseDescription.data;
    const details = responseDetail.data;
    const currency = currencies.find(
      (curr: any) => curr.id === details.currency_id
    );
    const sellerData = (await apiServer(`/users/${details.seller_id}`)).data;
    const categoryData = (await apiServer(`/categories/${details.category_id}`))
      .data;

    const data: ItemModel = {
      author: {
        name: sellerData.nickname,
        lastname: '',
      },
      category: {
        id: categoryData.id,
        name: categoryData.name,
        path_from_root: categoryData.path_from_root,
      },
      item: {
        id: details.id,
        title: details.title,
        condition: details.condition,
        free_shipping: details.shipping.free_shipping,
        picture: details.thumbnail,
        sold_quantity: details.sold_quantity,
        description: descriptionData.plain_text,
        price: {
          id: details.currency_id,
          amount: details.price,
          currency: currency.symbol,
          decimals: currency.decimal_places,
        },
      },
    };

    return res.send(data);
  } catch (error: any) {
    const { response } = error;
    if (response)
      return res.status(response.status).send({
        status: response.status,
        message:
          codeMessages[
            (response.status as keyof typeof codeMessages) ?? 'default'
          ],
      });
    return res.status(500).send(error);
  }
});

router.get('/', async () => {});

export default router;
