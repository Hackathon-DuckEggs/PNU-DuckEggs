import React from "react";
import styled from "styled-components";
import { IoClose, IoSearch } from "react-icons/io5";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "react-click-outside-hook";
import { useEffect } from "react";
import { useRef } from "react";
import MoonLoader from "react-spinners/MoonLoader";
import { useDebounce } from "../../hooks/debounceHook";
import axios from "axios";
import { Product } from "../product";

const SearchBarContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 34em;
  height: 3.8em;
  background-color: #ff;
  border: thick solid;
  border-radius: 6px;
  border-color: #ffaa4c;
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

const SearchIcon = styled.span`
  color: #ffaa4c;
  font-size: 27px;
  margin-right: 10px;
  margin-top: 0px;
  vertical-align: middle;
`;

const CloseIcon = styled(motion.span)`
  color: #ffaa4c;
  font-size: 23px;
  vertical-align: middle;
  transition: all 200ms ease-in-out;
  cursor: pointer;

  &:hover {
    color: #035397;
  }
`;

const LineSeperator = styled.span`
  display: flex;
  min-width: 100%;
  min-height: 2px;
  background-color: #ffaa4c;
  opacity: 0.2;
`;

const SearchContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1em;
  overflow-y: auto;
`;

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WarningMessage = styled.span`
  color: #a1a1a1;
  font-size: 14px;
  display: flex;
  align-self: center;
  justify-self: center;
`;

const containerVariants = {
  expanded: {
    height: "30em",
  },
  collapsed: {
    height: "3.8em",
  },
};

const containerTransition = { type: "spring", damping: 22, stiffness: 150 };

export function SearchBar(props) {
  const [isExpanded, setExpanded] = useState(false);
  const [parentRef, isClickedOutside] = useClickOutside();
  const inputRef = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [products, setProduct] = useState([]);
  const [noProducts, setNoProduct] = useState(false);

  const isEmpty = !products || products.length === 0;

  const changeHandler = (e) => {
    e.preventDefault();
    if (e.target.value.trim() === "") setNoProduct(false);

    setSearchQuery(e.target.value);
  };

  const expandContainer = () => {
    setExpanded(true);
  };

  const collapseContainer = () => {
    setExpanded(false);
    setSearchQuery("");
    setLoading(false);
    setNoProduct(false);
    setProduct([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  useEffect(() => {
    if (isClickedOutside) collapseContainer();
  }, [isClickedOutside]);

  const prepareSearchQuery = (query) => {
    const url = `http://duckegg.kro.kr/api/product?title=${query}`;
    return encodeURI(url);
  };

  const searchProduct = async () => {
    if (!searchQuery || searchQuery.trim() === "") return;

    setLoading(true);
    setNoProduct(false);

    const URL = prepareSearchQuery(searchQuery);

    const response = await axios.get(URL).catch((err) => {
      console.log("Error: ", err);
    });

    if (response) {
      console.log("Response: ", response.data);
      if (response.data && response.data["list"].length === 0)
        setNoProduct(true);
      setProduct(response.data);
    }

    setLoading(false);
  };

  useDebounce(searchQuery, 500, searchProduct);

  return (
    <SearchBarContainer
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={containerVariants}
      transition={containerTransition}
      ref={parentRef}
    >
      <SearchInputContainer>
        <SearchIcon>
          <IoSearch />
        </SearchIcon>
        <SearchInput
          placeholder="제품 이름 검색"
          onFocus={expandContainer}
          ref={inputRef}
          value={searchQuery}
          onChange={changeHandler}
        />
        <AnimatePresence>
          {isExpanded && (
            <CloseIcon
              key="close-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={collapseContainer}
              transition={{ duration: 0.2 }}
            >
              <IoClose />
            </CloseIcon>
          )}
        </AnimatePresence>
      </SearchInputContainer>
      {isExpanded && <LineSeperator />}
      {isExpanded && (
        <SearchContent>
          {isLoading && (
            <LoadingWrapper>
              <MoonLoader loading color="#000" size={20} />
            </LoadingWrapper>
          )}
          {!isLoading && isEmpty && !noProducts && (
            <LoadingWrapper>
              <WarningMessage>제품 이름을 입력해 주세요.</WarningMessage>
            </LoadingWrapper>
          )}
          {!isLoading && noProducts && (
            <LoadingWrapper>
              <WarningMessage>제품을 찾을 수 없습니다!</WarningMessage>
            </LoadingWrapper>
          )}
          {!isLoading && !isEmpty && (
            <>
              {products.list.map((item) => (
                <Product
                  key={item.pCode}
                  title={item.title}
                  previewSrc={item.image}
                  pCode={item.pCode}
                />
              ))}
            </>
          )}
        </SearchContent>
      )}
    </SearchBarContainer>
  );
}
