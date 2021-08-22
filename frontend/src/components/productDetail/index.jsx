import React, { useState, useEffect } from 'react';
import axios from "axios";
import styled from "styled-components";

const ProductDetailContainer = styled.div`
  width: 100%;
  min-height: 6em;
  display: flex;
  border-bottom: 2px solid rgba(255, 170, 76, 0.2);
  padding: 6px 8px;
  align-items: center;

  &:hover {
    background-color: #EEEEEE;
    cursor: pointer;
  }
`;

export function ProductDetail(props) {
  const pCode = props.pCode['pCode'];
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchUsers = async () => {
    try {
      setError(null);
      setUsers(null);
      setLoading(true);
      const response = await axios.get(
          `http://duckegg.kro.kr/api/product/${pCode}`
      );
      setUsers(response.data); 
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!users) return null;

  // 리뷰 분석이 완료되지 않은 경우 (3초에 한번씩 요청을 보냄)
  const interval=setTimeout(()=>{
    fetchUsers()
   },3000)

  console.log("분석중");
  console.log(users);

  if(users['analyzed'] == 1) {
    clearTimeout(interval);
    console.log("분석완료");
  }
  
  return (
    <div>
      {/* {users['productInfo'].map(user => (
        <li>user</li>
      ))} */}
      test
    </div>
  );
}
