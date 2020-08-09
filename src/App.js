import React, { useState } from "react";
import TreeData from "./sample.data.js";
import { useSelector } from "react-redux";

import "./App.css";

function App() {
  const allactivities = useSelector((state) => state.activities);

  const [data, setData] = useState(TreeData);
  let [editableNode, setEditableNode] = useState(false);

  const handleEditChange = (e, value) => {
    value[e.target.name] = e.target.value;
    setEditableNode({ value });
  };

  const deleteNode = (parent, index, value) => {
    parent.splice(index, 1);
    setEditableNode({ parent });
  };

  const makeEditable = (value) => {
    editableNode = JSON.parse(JSON.stringify(value));

    value.editMode = true;
    setEditableNode({ value });
  };

  const closeForm = (value, parent, index) => {
    if (value.name !== "" && value.id !== "") {
      value.name = editableNode.name;
      value.id = editableNode.id;
      value.editMode = false;
      setEditableNode({ value });
    } else {
      console.log(index);
      parent.splice(index, 1);
      setEditableNode({ parent });
    }
  };

  const doneEdit = (value) => {
    value.editMode = false;
    setEditableNode({ value });
  };

  const toggleView = (ob) => {
    ob.showChildren = !ob.showChildren;
    setEditableNode({ ob });
  };

  const nodeEditForm = (value, parent, index) => {
    return (
      <div
        className="node node_edit"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <form className="node_edit_form">
          <div className="field name">
            <input
              value={value.name}
              type="text"
              name="name"
              placeholder="Option"
              onChange={(e) => {
                handleEditChange(e, value);
              }}
            />
          </div>

          <div className="field action_node">
            <span
              className="fa fa-check"
              onClick={(e) => {
                doneEdit(value);
              }}
            ></span>
            <span
              className="fa fa-close"
              onClick={(e) => {
                closeForm(value, parent, index);
              }}
            ></span>
          </div>
        </form>
      </div>
    );
  };

  const makeChildren = (node) => {
    if (typeof node === "undefined" || node.length === 0) return null;

    let children;
    children = node.map((value, index) => {
      let item = null;

      if (value.children.length > 0 && value.showChildren) {
        let babies = makeChildren(value.children);
        let normalMode = (
          <div className="node">
            <i className="fa fa-minus-square-o"></i>
            {value.name}
            <span className="actions"></span>
          </div>
        );
        item = (
          <li
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              toggleView(value);
            }}
          >
            {value.editMode ? nodeEditForm(value, node, index) : normalMode}
            {babies}
          </li>
        );
      } else if (value.children.length > 0 && !value.showChildren) {
        item = (
          <li
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              toggleView(value);
            }}
          >
            <div className="node">
              <i className="fa fa-plus-square-o">{value.name}</i>
            </div>
          </li>
        );
      } else if (value.children.length === 0 && value.isDisabled === false) {
        let normalMode = (
          <div className="node">
            <i className="fa fa-square-o">{value.name}</i>
            <span className="actions">
              <i
                className="fa fa-pencil"
                onClick={(e) => {
                  e.stopPropagation();
                  makeEditable(value);
                }}
              ></i>
              <i
                className="fa fa-close"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(node, index);
                }}
              ></i>
            </span>
            <img
              data-lightbox="image-1"
              data-title="My caption"
              src={value.imgUrl}
              className="node__image"
              alt=""
            />
          </div>
        );

        item = (
          <li key={index} onClick={(e) => e.stopPropagation()}>
            {value.editMode ? nodeEditForm(value, node, index) : normalMode}
          </li>
        );
      } else if (value.children.length === 0 && value.isDisabled === true) {
        let normalMode = (
          <div className="node">
            <i className="fa fa-square-o">{value.name}</i>

            <img
              data-lightbox="image-1"
              data-title="My caption"
              src={value.imgUrl}
              className="node__image"
              alt=""
            />
          </div>
        );

        item = (
          <li key={index} onClick={(e) => e.stopPropagation()}>
            {value.editMode ? nodeEditForm(value, node, index) : normalMode}
          </li>
        );
      }
      return item;
    });

    return <ul>{children}</ul>;
  };

  const getNodes = () => {
    if (typeof data.name === "undefined") return null;
    let children = makeChildren(data.children);
    let root = (
      <span className="root">
        {data.name}
        <span className="actions"> &nbsp; &nbsp;</span>
      </span>
    );
    return (
      <div className="tree">
        {data.editMode ? nodeEditForm(data) : root}
        {children}
      </div>
    );
  };

  return (
    <div className="row">
      <div className="col-md-offset-4 col-md-3">
        <div className="group_dropdown_content">{getNodes()}</div>
      </div>
    </div>
  );
}

export default App;
