
const Blog = (props) => {
  return(
  <div className="card" key={props.blog.id}>
    <div className="cardInfo">
      <h4>Title: <a href={`${props.blog.url}`}>{props.blog.title}</a> </h4>
      <h4>Author: {props.blog.author} </h4>
      <h4>Likes: {props.blog.likes} </h4>
    </div>
    <div className="btnContainer">
      <button onClick={props.onClick} className="deleteBtn">Delete</button>
    </div>
  </div>  
)}

export default Blog