const CouponItem = ({coupon}) => {
    return (
    <div className="card mb-5" style={{textAlign: "center", padding: "8px"}}>
        <p>Name: {coupon.name}</p>
        <p>Code: {coupon.code}</p>
        <p>Discount: {coupon.value}%</p>
    </div>
    )
}

export default CouponItem;