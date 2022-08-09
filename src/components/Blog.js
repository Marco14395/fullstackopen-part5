import { useState, useImperativeHandle, forwardRef } from "react";
import PropTypes from "prop-types";
const Blog = (props, ref) => {
  const [visiblity, setVisiblity] = useState(false);
  const clickToHide = { display: visiblity? "none" : "" };
  const clickToShow = { display: visiblity? "" : "none" };

  const toggleOpen = () => {
    setVisiblity(!visiblity);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleOpen,
    };
  });

  return(
    <div key={props.blog.id}>
      <div className="card" style={clickToHide}>
        <h4>Title: {props.blog.title}</h4>
        <button className="hideBtn" onClick={toggleOpen}>View</button>
      </div>
      <div className="card" style={clickToShow}>
        <div className="cardInfo">
          <h4>Title: {props.blog.title} </h4>
          <h4>Author: {props.blog.author} </h4>
          <h4>Link: <a href={`${props.blog.url}`} target="_blank" rel="noreferrer">{props.blog.url}</a>  </h4>
          <div className="likes" style={{ display: "flex", gap: "10px" }}>
            <h4>Likes: {props.blog.likes} </h4>
            <button className="likeBtn" onClick={props.addLikePerClick}>❤️</button>
          </div>
        </div>
        <div className="btnContainer" >
          <button className="hideBtn" onClick={toggleOpen}>Hide</button>
          <button onClick={props.onClick} className="deleteBtn">Delete</button>
        </div>
      </div>
    </div>
  );};

Blog.propTypes = {
  onClick: PropTypes.func.isRequired
};
export default forwardRef(Blog);