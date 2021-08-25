import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ProductDetail } from "../components/productDetail";
import { Waiting } from "../components/waiting";
import axios from "axios";

const Analysis = (props) => {
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const history = useHistory();
    const pCode = props.location.state['pCode'];
    const movePath = path => {
        history.push(path);
      };
     
    // test
    console.clear();

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
      console.log("useEffect");
    }, []);
  
    
    if (loading) return <div>로딩중..</div>;
    if (error) return <div>에러가 발생했습니다</div>;
    if (!users) return null;

    if (users['analyzed'] == 1){
        return(
            <>
            <div>분석완료</div>
            <button onClick={() => movePath('/')}>홈으로 가기</button>
            </>
        );
    }
    else { // 분석이 완료되지 않은 경우
        return(
            <Waiting />
        );
    }
    };

export default Analysis;