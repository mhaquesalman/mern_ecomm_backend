export const showError = (error, msg) => {
    if (error) return <div className="alert alert-danger">{msg}</div>
}

export const showSuccess = (success, msg) => {
    if (success) return <div className="alert alert-success">{msg}</div>
}

export const showLoading = loading => {
    if (loading) return <div className="alert alert-info">Loading.....</div>
}

export const alertRemove = () => {
    setTimeout(function() {
        let div = document.querySelector(".alert")
        if (div != null) div.remove()
    }, 5000)
}