import React, { useState, useEffect, useRef } from 'react';
import Layout from '../Layout';
import { Link, useHistory, useLocation, withRouter } from 'react-router-dom';
import { getProfile, updateProfile } from '../../api/apiOrder';
import { userInfo } from '../../utils/auth';

const ShippingAddress = ({ history }) => {
    const location = useLocation()
    const [totalPrice, setTotalPrice] = useState(location.state.data.totalPrice)
    const [couponUsed, setCouponUsed] = useState(location.state.data.couponUsed)
    console.log("ShippingAdres ", totalPrice)
    console.log("ShippingAdres coupon", couponUsed)

    const [values, setValues] = useState({
        phone: '',
        address1: '',
        address2: '',
        city: '',
        postcode: '',
        country: '',
    });
    const [disabled, setDisabled] = useState(false);
    const redirect = useRef(false);
    console.log("redirect ", redirect.current)
    const {
        phone,
        address1,
        address2,
        city,
        postcode,
        country,
    } = values;

    useEffect(() => {
        getProfile(userInfo().token)
            .then(response => setValues(response.data))
            .catch(err => {

            })
    }, []);


    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = (e) => {
        
        e.preventDefault();
        setDisabled(true);
        updateProfile(userInfo().token, values)
            .then(response => {
                if (response.status === 200) {
                    console.log("profile ", response.data)
                    redirect.current = true;
                    console.log("redirect 2 ", redirect.current)
                    if (redirect.current) history.push("/checkout", 
                    { data : { totalPrice: totalPrice, couponUsed: couponUsed} })
                }
            })
            .catch(err => setDisabled(false));
    }

    const profileForm = () => (<form onSubmit={handleSubmit}>
        <label className="text-muted">Phone:</label>
        <input name="phone" value={phone} required className="form-control" onChange={handleChange} />
        <label className="text-muted">Address 1:</label>
        <input name="address1" value={address1} required className="form-control" onChange={handleChange} />
        <label className="text-muted">Address 2:</label>
        <input name="address2" value={address2} className="form-control" onChange={handleChange} />
        <div className="row">
            <div className="col-4">
                <label className="text-muted">City:</label>
                <input name="city" value={city} required className="form-control" onChange={handleChange} />
            </div>
            <div className="col-4">
                <label className="text-muted">Post Code: </label>
                <input name="postcode" value={postcode} type="number" required className="form-control" onChange={handleChange} />
            </div>
            <div className="col-4">
                <label className="text-muted">Country:</label>
                <input name="country" value={country} required className="form-control" onChange={handleChange} />
                <br />
                <button type="submit" className="btn btn-primary btn-sm float-right"
                disabled={disabled}>Save and Checkout</button>
            </div>
        </div>
    </form>)

    return (<>
        <Layout title="Checkout" description="Complete your order!" className="container">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><Link href="#">Order</Link></li>
                    <li class="breadcrumb-item"><Link href="#">Cart</Link></li>
                    <li class="breadcrumb-item active" aria-current="page">Shipping Address</li>
                </ol>
            </nav>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card mb-5" style={{ height: 'auto' }}>
                            <div className="card-header">Shipping Address</div>
                            <div className="card-body">
                            <form onSubmit={handleSubmit}>
        <label className="text-muted">Phone:</label>
        <input name="phone" value={phone} required className="form-control" onChange={handleChange} />
        <label className="text-muted">Address 1:</label>
        <input name="address1" value={address1} required className="form-control" onChange={handleChange} />
        <label className="text-muted">Address 2:</label>
        <input name="address2" value={address2} className="form-control" onChange={handleChange} />
        <div className="row">
            <div className="col-4">
                <label className="text-muted">City:</label>
                <input name="city" value={city} required className="form-control" onChange={handleChange} />
            </div>
            <div className="col-4">
                <label className="text-muted">Post Code: </label>
                <input name="postcode" value={postcode} type="number" required className="form-control" onChange={handleChange} />
            </div>
            <div className="col-4">
                <label className="text-muted">Country:</label>
                <input name="country" value={country} required className="form-control" onChange={handleChange} />
                <br />
                <button type="submit" className="btn btn-primary btn-sm float-right" disabled={disabled}>Save and Checkout</button>
            </div>
        </div>
    </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    </>);
}

export default withRouter(ShippingAddress);


// history.push({ pathName: "/checkout", state: { totalPrice: totalPrice } })