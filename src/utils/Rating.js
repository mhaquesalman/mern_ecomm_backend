const Rating = ({ rating }) => {
  let stars = [];
  for (var i = 1; i <= 5; i++) {
    if (rating === 0) {
        stars.push(
            <span className="fa fa-star-o" style={{ color: "#f5d04d" }}></span>
        )
    }
    if (i <= rating) {
    stars.push(
      <span className="fa fa-star" style={{ color: "#f5d04d" }}></span>
    );
    } else if (rating !== 0) {
     stars.push(
        <span className="fa fa-star-o" style={{ color: "#f5d04d" }}></span>
     )
    }
  }
  return <div>{stars}</div>;
};

export default Rating;

{
  /* <span className="fa fa-star" style={{color: "#f5d04d"}}></span> */
}
{
  /* <span className="fa fa-star-o" style={{color: "#f5d04d"}}></span> */
}
