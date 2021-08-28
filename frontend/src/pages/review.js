import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../components/header";
import { ReviewDetail } from "../components/reviewDetail";
import { Waiting } from "../components/waiting";
import Footer from "../components/footer";

const ReviewContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 8em 2em;
`;

const Title = styled.h3`
  font-size: 20px;
  word-break: keep-all;
  text-align: center;
  color: #383838;
  flex: 2;
  display: flex;
  flex-direction: row;
  justify-content: center;
  algin-items: center;
`;

const Review = (props) => {
  const pCode = props.match.params.key;
  const url = `http://duckegg.kro.kr/api/review?pCode=${pCode}`;
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const result = await fetch(url);
      const data = await result.json();
      setData(data);
    } catch (err) {
      // error handling code
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (data == null)
    return (
      <>
        <Waiting />
        <Footer />
      </>
    );

  const reviewList = data.reviewList;
  const reviewCnt = Object.keys(reviewList).length;

  return (
    <ReviewContainer>
      <Header />
      <Title>총 리뷰 {reviewCnt}개 (그래프가 로드될 때까지 기다려주세요)</Title>
      {reviewList.map((item) => (
        <ReviewDetail
          reviewDate={item.date}
          reviewSrc={item.src}
          reviewContents={item.content}
          reviewRate={item.rate}
        />
      ))}
    </ReviewContainer>
  );
};

export default Review;
