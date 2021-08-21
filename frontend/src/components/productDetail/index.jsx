import React, { useState, useEffect } from 'react';
import axios from "axios";
import styled from "styled-components";

export function ProductDetail(props) {
  const pCode = props.pCode['pCode'];
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchUsers();
  }, []);

  

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!users) return null;

  console.log(users);
  console.log(users['productInfo']);
  // console.log(users['productInfo']['specs']);
  // console.log(users['productInfo']['category']);

  return (
    <div>
      {/* {users['productInfo'].map(user => (
        <li>user</li>
      ))} */}
      test
    </div>
  );
}
