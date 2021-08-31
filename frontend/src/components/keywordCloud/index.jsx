import React from "react";
import ReactWordcloud from "react-wordcloud";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

const options = {
  colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
  enableTooltip: true,
  deterministic: false,
  fontFamily: "NotoSansKR-Black",
  fontSizes: [50, 200],
  fontStyle: "normal",
  fontWeight: "700",
  padding: 1,
  rotations: 3,
  rotationAngles: [0, 90],
  scale: "sqrt",
  spiral: "archimedean",
  transitionDuration: 1000,
};

export const KeywordCloud = (props) => {
  const keywords = [];
  for (const value in props.keyword) {
    keywords.push({ text: `${value}`, value: props.keyword[value]["cnt"] });
  }

  return (
    <>
      <div style={{ width: "100%", height: "100%" }}>
        <ReactWordcloud options={options} words={keywords} />
      </div>
    </>
  );
};

export default KeywordCloud;
