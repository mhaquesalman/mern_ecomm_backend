import { useState, useEffect, useRef } from 'react';
import Layout from '../Layout';
import CartItem from './CartItem';
import { Link } from 'react-router-dom';
import { getCartItems, updateCartItems, deleteCartItem } from '../../api/apiOrder';
import { checkValidCoupon } from '../../api/apiAdmin';
import { userInfo } from '../../utils/auth';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0)
    const couponInput = useRef("");
    let couponUsed = useRef(false)

    const loadCart = () => {
        getCartItems(userInfo().token)
            .then(response => {
                setCartItems(response.data)
            })
            .catch(() => { })
    }
    useEffect(() => {
        loadCart()
    }, []);

    useEffect(() => {
        getCartTotal()
    }, [cartItems])

    const increaseItem = (item) => () => {
        if (item.count === 5) return
        const cartItem = {
            ...item,
            count: item.count + 1
        }
        updateCartItems(userInfo().token, cartItem)
            .then(response => loadCart())
            .catch(err => { })
    }

    const getCartTotal = () => {
        const arr = cartItems.map(item => item.price * item.count);
        const sum = arr.reduce((a, b) => a + b, 0);
        setTotal(sum)
    }

    const decreaseItem = (item) => () => {
        if (item.count === 1) return
        const cartItem = {
            ...item,
            count: item.count - 1
        }
        updateCartItems(userInfo().token, cartItem)
            .then(response => loadCart())
            .catch(err => { })
    }

    const removeItem = (item) => () => {
        if (!window.confirm("Delete Item?")) return
        deleteCartItem(userInfo().token, item)
            .then(response => { loadCart() })
            .catch(() => { })
    }

    const onApplyCoupon = (e) => {
      e.preventDefault();
      if (!couponUsed.current) {
        checkValidCoupon(couponInput.current)
          .then((response) => {
            const data = response.data;
            if (data.length !== 0) {
              let discountPrice = data[0].value;
              discountPrice = (discountPrice * total) / 100;
              discountPrice = total - discountPrice;
              setTotal(discountPrice);
              couponUsed.current = true;
            } else {
              alert("Invalid Code!");
            }
          })
          .catch((err) => console.log(err));
      } else {
        alert("Coupon already applied!")
      }
    }

    return (
        <Layout title="Your Cart" description="Hurry up! Place your order!" className="container">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="#">Order</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Cart</li>
                </ol>
            </nav>
            <div className="container my-5">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col" width="15%">#</th>
                            <th scope="col">Image</th>
                            <th scope="col">Product Name</th>
                            <th scope="col">Quantity</th>
                            <th scope="col" align="right">Price</th>
                            <th scop="col">Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item, i) => <CartItem
                            item={item}
                            serial={i + 1}
                            key={item._id}
                            increaseItem={increaseItem(item)}
                            decreaseItem={decreaseItem(item)}
                            removeItem={removeItem(item)} />)}
                        <tr>
                            <th scope="row" />
                            <td colSpan={3}>Total</td>
                            <td align="right">৳ {total} </td>
                            <td />
                        </tr>
                        <tr className='text-right'>
                            <th scope="row"/>
                            <td>
                            <div>
                                <form className='form-inline' onSubmit={onApplyCoupon}>
                                <input className='form-control mr-2' type='coupon' placeholder='Coupon Code' required
                                aria-label='Search' onChange={e =>  couponInput.current = e.target.value}/>
                                <button type='submit' className='btn btn-primary'>Apply</button>
                            </form>
                                </div>
                            </td>
                            <td colSpan={6} >
                                <Link to="/"><button className="btn btn-warning mr-4">Continue Shoping</button></Link>
                                <Link to={{ pathname: "/shipping", 
                                state: { data : { totalPrice: total, couponUsed: couponUsed.current} } }} 
                                className="btn btn-success mr-4">Proceed To Checkout</Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Layout>
    )
}

export default Cart;