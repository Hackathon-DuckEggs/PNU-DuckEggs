import React from "react";
import styled from "styled-components";
import { Chart } from "react-google-charts";

const WarningMessage = styled.h3`
  font-size: 2em;
  word-break: keep-all;
  text-align: center;
  color: #383838;
  display: flex;
  flex-direction: row;
  justify-content: center;
  algin-items: center;
`;

const KeywordVersus = (props) => {
  const {
    filteredKeywords,
    productFirst,
    productSecond,
    sortedDataFirst,
    sortedDataSecond,
  } = props;

  const versusData = [["키워드", productFirst, productSecond]];

  const DataFirst = {};
  const DataSecond = {};

  const makeObj = (obj, arr) => {
    for (let i = 0; i < arr.length; i++) {
      obj[arr[i][0]] = arr[i][1]["score"];
    }
  };

  makeObj(DataFirst, sortedDataFirst);
  makeObj(DataSecond, sortedDataSecond);

  // 표만들기
  // [키워드 값 그자체, 첫번째 키워드의 점수, 두 번째 키워드의 점수]
  Object.keys(filteredKeywords).map((items) => {
    let keyword = filteredKeywords[items];
    versusData.push([
      keyword,
      DataFirst[keyword] * 100,
      DataSecond[keyword] * 100,
    ]);
  });

  if (!versusData) {
    return <WarningMessage>공통 키워드가 없습니다!</WarningMessage>;
  }
  return (
    <Chart
      width={"1000px"}
      height={"500px"}
      chartType="Bar"
      loader={<div>Loading Chart</div>}
      data={versusData}
      options={{
        // Material design options
        chartArea: { width: "100%" },
        colors: ["#ff4d3f", "#F9D95E"],
        chart: {
          title: "키워드 별 점수 비교",
          subtitle:
            "상품의 상위 10개 키워드 중, 공통 키워드에 대해서 점수를 비교합니다.",
        },
        vAxis: {
          title: "점수",
          minValue: 0,
          viewWindow: {
            min: 0,
            max: 100,
          },
        },
        axes: {
          y: {
            all: {
              range: {
                max: 100,
                min: 0,
              },
            },
          },
        },
      }}
    />
  );
};

export default KeywordVersus;
