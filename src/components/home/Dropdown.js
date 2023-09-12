const Dropdown = ({ orders, handleOrders }) => {

    const handleOnChange = id => {
        // console.log('order ', orders[id].name)
        handleOrders(orders[id].value)
    }

    return (
        <div className="col-3">
            <select id="orderlist" onChange={() => {
                handleOnChange(document.getElementById("orderlist").value)}}>
                 {orders.map(order => <option key={order.id} value={order.id}>{order.name}</option>)}                  
            </select>
        </div>
    )
}

export default Dropdown