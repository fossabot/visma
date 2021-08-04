import { RequestLogicHandlers } from '@visma/msw-openapi-backend-integration';
import type { Components } from '../client';

export const definition = require('../TodoMVC-API.json');

let id = 0;

const items: Components.Schemas.Items =
  definition.paths['/items'].get.responses['200'].content['application/json']
    .examples['example-1'].value;

const requestLogicHandlers: RequestLogicHandlers = {
  postItem(request) {
    const items =
      definition.paths['/items'].get.responses['200'].content[
        'application/json'
      ].examples['example-1'].value;
    items.push({
      ...(request.body as object),
      timestamp: Date.now(),
      _id: String(id++),
    });
  },
  putItem(request) {
    const item = request.body as Components.Schemas.Item;
    const index = items.findIndex((item) => item._id === request.params.itemId);
    items[index] = item;
  },
  putItems(request) {
    const itemUpdates = request.body as Components.Schemas.Items;
    for (const itemUpdate of itemUpdates) {
      const index = items.findIndex((item) => item._id === itemUpdate._id);
      items[index] = itemUpdate;
    }
  },
  deleteItem(request) {
    const index = items.findIndex((item) => item._id === request.params.itemId);
    items.splice(index, 1);
  },
  deleteItems(request) {
    for (const id of request.body) {
      const index = items.findIndex((item) => item._id === id);
      items.splice(index, 1);
    }
  },
};
export default requestLogicHandlers;
