import React from "react";
import { useState, useImperativeHandle, forwardRef } from "react";

const CreateBlogInterface = ({ titleValue, authorValue, urlValue, titleOnChange, authorOnChange, urlOnChange, onClick1 }, refs) => {
  const [visible, setVisible] = useState(false);

  const hiddenWhenClicked = { display: visible? "none" : "" };
  const showWhenClicked = { display: visible? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    };
  });

  return (
    <>
      <button className='createBtn' style={hiddenWhenClicked} onClick={toggleVisibility}>Create New Blog?</button>
      <div className="create" style={showWhenClicked}>
        <h3 style={{ marginBottom: "1rem" }}>Create new</h3>
        <input type="text" placeholder='Title:' value={titleValue} onChange={titleOnChange}/>
        <input type="text" placeholder='Author:' value={authorValue} onChange={authorOnChange}/>
        <input type="text" placeholder='Url:' value={urlValue} onChange={urlOnChange}/>
        <div className="btnContainer2">
          <button type='submit' className='createBtn' onClick={onClick1}>Create</button>
          <button type='submit' className='cancelBtn' onClick={toggleVisibility}>Cancel</button>
        </div>
      </div>
    </>
  );
};

export default forwardRef(CreateBlogInterface);