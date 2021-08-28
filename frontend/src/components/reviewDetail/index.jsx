import React from "react";
import styled from "styled-components";
import { Chart } from "react-google-charts";
import { ExpandMore } from "@material-ui/icons";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";

const ReviewDetailContainer = styled.div`
  width: 80%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  padding-bottom: 1em;
  border-bottom: 2px solid #e8e8e8;
  align-items: center;
  justify-content: center;
`;

const AccordianContainer = styled.div`
  width: 100%;
  margin: 2em;
  padding: 1em;
`;

export const ReviewDetail = (props) => {
  const { reviewDate, reviewSrc, reviewContents, reviewRate } = props;
  const rateChart = [["키워드", "점수"]];
  Object.keys(reviewRate).map((item) => {
    rateChart.push([item, reviewRate[item] * 100]);
  });

  return (
    <ReviewDetailContainer>
      <AccordianContainer>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            리뷰 원문 보기 (날짜: {reviewDate} 출처: {reviewSrc})
          </AccordionSummary>
          <AccordionDetails>
            <p>{reviewContents}</p>
          </AccordionDetails>
        </Accordion>
      </AccordianContainer>
      <Chart
        width={"80%"}
        height={"100%"}
        chartType="Bar"
        loader={<div>Loading Chart</div>}
        data={rateChart}
        options={{
          chartArea: { width: "100%" },
          colors: ["#ff9472"],
          chart: {
            title: "키워드 점수 분석 결과",
            subtitle: "그래프에 마우스를 대면 점수를 확인할 수 있습니다.",
          },
          hAxis: {
            title: "점수",
            minValue: 0,
            viewWindow: {
              min: 0,
              max: 100,
            },
          },
          vAxis: {
            title: "키워드",
          },
          bars: "horizontal",
          axes: {
            y: {
              0: { side: "left" },
            },
            x: {
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
    </ReviewDetailContainer>
  );
};

export default ReviewDetail;
