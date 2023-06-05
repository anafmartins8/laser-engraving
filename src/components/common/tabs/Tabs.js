import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import Tab from "./Tab";
import { useDispatch } from "react-redux";
import { switchCanvasMode } from "../../../store/slices/canvasSlice";
import { CANVAS_MODES } from "../../../consts/canvas.consts";

export const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(children[0].props.label);
  const dispatch = useDispatch();

  const onClickTabItem = (tab) => {
    onChangeTab(tab);
    setActiveTab(tab);
  };

  const onChangeTab = (tab) => {
    dispatch(
      switchCanvasMode(
        tab === "Mark" ? CANVAS_MODES.markMode : CANVAS_MODES.roiMode
      )
    );
  };

  return (
    <div className="tabs">
      <ol className="tab-list">
        {children.map((child) => {
          const { label } = child.props;

          return (
            <Tab
              activeTab={activeTab}
              key={label}
              label={label}
              onClick={onClickTabItem}
            />
          );
        })}
      </ol>
      <div className="tab-content">
        {children.map((child) => {
          if (child.props.label !== activeTab) return undefined;
          return child.props.children;
        })}
      </div>
    </div>
  );
};

export default Tabs;
