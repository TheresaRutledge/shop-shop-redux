import React from 'react';
import {REMOVE_FROM_CART,UPDATE_CART_QUANTITY} from '../../utils/actions'
import { useStoreContext } from "../../utils/GlobalState";
import { idbPromise } from "../../utils/helpers";


const CartItem = ({ item }) => {

    const[,dispatch] = useStoreContext();

    const removeFromCart= () => {
        dispatch({
          type:REMOVE_FROM_CART,
          _id:item._id
        });
        idbPromise('cart','delete',{...item});
      }

      const onChange = (e) => {
          const value = e.target.value;

          if(value==='0'){
            dispatch({
                type:REMOVE_FROM_CART,
                _id:item._id
              });
              idbPromise('cart','delete',{...item});
          } else {
            dispatch({
                type:UPDATE_CART_QUANTITY,
                purchaseQuantity:parseInt(value),
                _id:item._id
            });
            idbPromise('cart','put',{...item,purchaseQuantity:parseInt(value)})
          }
          
      }

  return (
    <div className="flex-row">
      <div>
        <img
          src={`/images/${item.image}`}
          alt=""
        />
      </div>
      <div>
        <div>{item.name}, ${item.price}</div>
        <div>
          <span>Qty:</span>
          <input
            type="number"
            placeholder="1"
            value={item.purchaseQuantity}
            onChange={onChange}
          />
          <span
            role="img"
            aria-label="trash"
            onClick={removeFromCart}
          >
            🗑️
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartItem;