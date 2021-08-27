import React from "react";
import styled from "styled-components";
import { ProgressBar } from "../progressBar";

const ReviewContainer = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ReviewScore = (props) => {
  const rate = props.rate;
  const keywordCnt = Object.keys(rate).length;

  const sortedRate = [];
  for (const keyword in rate) {
    sortedRate.push([keyword, rate[keyword]]);
  }

  sortedRate.sort(function (a, b) {
    return b[1]["cnt"] - a[1]["cnt"];
  });

  // keyword 가 10개 이상인 경우, 상위 10개만 추출
  if (keywordCnt > 10) {
    sortedRate.length = 10;
  }

  return (
    <ReviewContainer>
      {sortedRate.map((item) => (
        <ProgressBar review={item} />
      ))}
    </ReviewContainer>
  );
};

export default ReviewScore;
