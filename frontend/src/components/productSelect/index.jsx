import React from "react";
import styled from "styled-components";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import ReactFetchAutocomplete from "react-fetch-autocomplete";

const SearchBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 30em;
  height: 3.8em;
  background-color: #ff;
  border: thick solid;
  border-radius: 6px;
  border-color: #ffaa4c;
  margin: 4em;
`;

const SearchInputContainer = styled.div`
  width: 100%;
  min-height: 4em;
  display: flex;
  align-items: center;
  position: relative;
  padding: 2px 15px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  font-size: 21px;
  color: #035397;
  font-weight: 500;
  border-radius: 6px;
  background-color: transparent;

  &:focus {
    outline: none;
    &::placeholder {
      opacity: 0;
    }
  }

  &::placeholder {
    color: #bebebe;
    transition: all 250ms ease-in-out;
  }
`;

const ProductConatiner = styled.div`
  width: 100%;
  min-height: 6em;
  display: flex;
  border-bottom: 2px solid rgba(255, 170, 76, 0.2);
  padding: 6px 8px;
  align-items: center;
  &:hover {
    background-color: #eeeeee;
    cursor: pointer;
  }
`;

const Preview = styled.div`
  width: auto;
  height: 100%;
  display: flex;
  flex: 0.4;
  img {
    width: auto;
    height: 100%;
  }
`;

const Title = styled.h3`
  font-size: 15px;
  font-family: "Spoqa Han Sans";
  color: #000;
  margin-left: 10px;
  flex: 2;
  display: flex;
`;

const CloseIcon = styled.div`
  color: #ffaa4c;
  font-size: 23px;
  vertical-align: middle;
  transition: all 200ms ease-in-out;
  cursor: pointer;

  &:hover {
    color: #035397;
  }
`;

const Message = styled.span`
  color: #a1a1a1;
  font-size: 14px;
  display: flex;
  align-self: center;
  justify-self: center;
`;

const suggestionParser = (data) =>
  data.list.map((item) => ({
    description: item.title,
    coords: item.pCode,
    image: item.image,
  }));

export const ProductSelect = () => {
  const [value, setValue] = useState("");
  const [selection, setSelection] = useState(null);
  const fetchUrl = ({ searchQuery }) =>
    `http://duckegg.kro.kr/api/product?title=${searchQuery}`;

  const resetInputField = () => {
    setValue("");
    setSelection(null);
  };

  return (
    <ReactFetchAutocomplete
      value={value}
      onChange={setValue}
      onSelect={setSelection}
      fetchUrl={fetchUrl}
      suggestionParser={suggestionParser}
    >
      {({ inputProps, getSuggestionProps, suggestions, error, loading }) => {
        if (error)
          return <Message>에러가 발생했습니다. 새로고침 해주세요.</Message>;
        return (
          <SearchBarContainer>
            <SearchInputContainer>
              <SearchInput
                {...inputProps({
                  placeholder: "비교할 제품 이름을 입력하세요",
                })}
              />
              <CloseIcon onClick={resetInputField}>
                <IoClose />
              </CloseIcon>
            </SearchInputContainer>
            {loading && <Message>로딩 중..</Message>}
            {suggestions.length > 0 && (
              <div>
                {suggestions.map((suggestion) => (
                  <ProductConatiner>
                    <Preview>
                      <img src={suggestion.image} alt="preview" />
                    </Preview>
                    <Title {...getSuggestionProps(suggestion)}>
                      {suggestion.description}
                    </Title>
                  </ProductConatiner>
                ))}
              </div>
            )}
          </SearchBarContainer>
        );
      }}
    </ReactFetchAutocomplete>
  );
};

export default ProductSelect;
