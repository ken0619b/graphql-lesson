import { gql } from 'apollo-boost';

import { addItemToCart } from './cart.utils';

// mutation -> inser / update / delete 用のクエリ

export const typeDefs = gql`
  extend type Item {
    quantity: Int
  }
  extend type Mutation {
    ToggleCartHidden: Boolean!
    addItemToCart(item: Item!): [Item]
  }
`;

const GET_CART_HIDDEN = gql`
  {
    cartHidden @client
  }
`;

const GET_CART_ITEMS = gql`
  {
    cartItems @client
  }
`;
// mutationに沿ってreadしてきてwriteするイメージだね。。
export const resolvers = {
  Mutation: {
    toggleCartHidden: (_root, _args, { cache }) => {
      const { cartHidden } = cache.readQuery({
        query: GET_CART_HIDDEN,
      });

      cache.writeQuery({
        query: GET_CART_HIDDEN,
        data: { cartHidden: !cartHidden },
      });

      return !cartHidden;
    },

    addItemToCart: (_root, { item }, { cache }) => {
      const { cartItems } = cache.readQuery({
        query: GET_CART_ITEMS,
      });

      const newCartItems = addItemToCart(cartItems, item);
      cache.writeQuery({
        query: GET_CART_ITEMS,
        data: { cartItems: newCartItems },
      });
    },
  },
};
