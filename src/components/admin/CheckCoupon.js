import React, { useEffect, useState } from 'react';
import Layout from '../Layout';
import { showError, showSuccess, showLoading, alertRemove } from '../../utils/messages';
import { Link } from 'react-router-dom';
import { createCoupon, getCoupons } from '../../api/apiAdmin';
import { userInfo } from '../../utils/auth';
import CouponItem from '../CouponItem';

const CheckCoupon = () => {
    const [coupons, setCoupons] = useState([])
    const [values, setValues] = useState({
        name: '',
        code: '',
        value: '',
        error: false,
        success: false,
        loading: false,
        msg: ""
    });

    const { name, code, value, error, success, loading, msg } = values;


    useEffect(() => {
        getCouponsFromAPi()
    }, [])
    
    const getCouponsFromAPi = () => {
        getCoupons()
        .then((response) => setCoupons(response.data))
        .catch(err => console.log("coupon err ", err))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setValues({
            ...values, 
            loading: true, 
            error: false, 
            success: false
        });

        const { token } = userInfo();
        console.log("coupon ", values)
        createCoupon(token, { name: name, code: code, value: value })
            .then(response => {
                setValues({
                    name: '',
                    code: '',
                    value: '',
                    error: false,
                    success: true,
                    loading: false,
                    msg: response.data.message
                })
                getCouponsFromAPi()
            })
            .catch(err => {
                if (err.response) setValues({
                    ...values,
                    success: false,
                    error: err.response.data,
                    loading: false
                })
                else setValues({
                    ...values,
                    success: false,
                    error: "Something went wrong!",
                    loading: false
                })
            }) 
    }

    const handleChange = (e) => {
        setValues({
            ...values, 
            [e.target.name]: e.target.value, 
            error: false
        })
    }

    const categoryForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <h6>Name</h6>
                    <input
                        name="name"
                        type="text"
                        onChange={handleChange}
                        value={name}
                        autoFocus
                        required
                        placeholder='Ex: Boishakhi offer'
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <h6>Code</h6>
                    <input
                        name="code"
                        type="text"
                        onChange={handleChange}
                        value={code}
                        autoFocus
                        required
                        placeholder='Ex: code20'
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <h6>Amount</h6>
                    <input
                        name="value"
                        type="number"
                        onChange={handleChange}
                        value={value}
                        autoFocus
                        required
                        placeholder='Ex: 20 (amount will convert in %)'
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-outline-primary">Create Coupon</button>
            </form>
        )
    }

    const goBack = () => (<div className="mt-5">
        <Link to="/admin/dashboard" className="text-warning">Go to Dashboard</Link>
    </div>)

    const couponlist = coupons.map(coupon => <CouponItem key={coupon._id} coupon={coupon} />)

    return (
        <Layout title="Add a new category">
            <div>
                {userInfo().role === "admin" ? (
                                    <div className="col-md-6 offset-md-3">
                                    {showLoading(loading)}
                                    {showError(error, error)}
                                    {showSuccess(success, msg)}
                                    {alertRemove()}
                                    <h5 style={{color: "GrayText"}}>Create Coupon</h5>
                                    <hr />
                                    {categoryForm()}
                                </div>
                ) : ""}
            </div>
            <hr />
            <div className='col-6 offset-md-3'>
            <h5 style={{color: "GrayText"}}>Available Coupons</h5>
            <hr />
            {couponlist ? couponlist : ""}
            </div>
        </Layout>
    );

}

export default CheckCoupon;