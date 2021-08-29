import React from "react";
import styled from "styled-components";

const ImageContainer = styled.div`
  border: 2px solid #e8e8e8;
  width: 50%;
  height: 100%;
  max-width: 500px;
  max-height: 500px;
  display: flex;
  margin: 2em;
  flex: 0.4;
  justify-content: center;
  algin-items: center;
  img {
    width: 90%;
  }
`;

const Message = styled.span`
  color: #a1a1a1;
  font-size: 1.5em;
  display: flex;
  align-self: center;
  justify-self: center;
`;

const SelectedImage = (props) => {
  const product = props.product;
  if (product == null) {
    console.log("image is null");
    return <Message>상품을 선택해주세요</Message>;
  }

  return (
    <ImageContainer>
      <img src={product.image} alt="preview" />
    </ImageContainer>
  );
};

export default SelectedImage;
