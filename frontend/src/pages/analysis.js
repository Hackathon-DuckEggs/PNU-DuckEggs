import React from 'react';
import { useHistory } from 'react-router-dom';
import { ProductDetail } from "../components/productDetail";

const Analysis = (props) => {
    const history = useHistory();
    const pCode = props.location.state;

    const movePath = path => {
        history.push(path);
      };

    return (
    <div>
        <ProductDetail pCode={pCode}></ProductDetail>
        <button onClick={() => movePath('/')}>홈으로 가기</button>
    </div>
    );
    };

export default Analysis;