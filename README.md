# PNU 제4회 창의융합 소프트웨어 해커톤 - 낙동강오리알팀
## 자연어처리를 이용한 Review 분석 서비스 📄
 제 4차 산업혁명으로 더 크고 넓어진 정보의 바다 속에서 혼란스러워하는 소비자를 위하여
- __제품의 대표적인 정보를 요약하고 수치화__ 함으로써
- 소비자에게 제품선택에 대한 기준을 제공함.

## 실행방법
```
cd frontend
yarn start
```

또는 http://duckegg.kro.kr/ 로 접속

## 주요기능
- __제품 검색__ 
![search_page](https://user-images.githubusercontent.com/74234333/131425431-be1fddf6-8613-46ed-9c2e-8c436848f8de.gif)
 
  메인화면에서 제품의 이름으로, 본인이 분석하고 싶은 제품을 검색할 수 있습니다.
 
- __리뷰 분석 1 (전체 리뷰 분석)__
![analyze](https://user-images.githubusercontent.com/74234333/131426090-f46fae0d-2235-47fe-891d-5a01903d9c8f.JPG)
분석페이지에 접근하면, 약 1분 정도 리뷰 분석 후 분석 결과를 확인할 수 있습니다.
분석 결과는 키워드 워드 클라우드와 출현 빈도 상위의 10개의 키워드에 대한 긍정/부정 분석 점수를 확인할 수 있습니다.
또한 상세 정보란을 펼치면, 제품의 상세 정보를 확인할 수 있습니다.

- __리뷰 분석 2 (개별 리뷰 분석)__
![analyze2](https://user-images.githubusercontent.com/74234333/131426928-b48971e3-a31a-457c-ab7a-f97fc3b1a424.JPG)

리뷰 분석1에서 __리뷰별로 조회하기__ 를 클릭하면 각 리뷰별 키워드 점수 분석과 리뷰 원문을 확인할 수 있습니다.

-  __상품 비교__
![versus1](https://user-images.githubusercontent.com/74234333/131426587-71e47968-ea15-44bb-8f7e-139d200067f1.gif)
![versus2](https://user-images.githubusercontent.com/74234333/131426604-fb6ced37-e998-4ade-b5b2-d2490933a400.JPG)

 검색한 두 제품의 상위 키워드 10개 중, 공통 키워드에 대하여 점수 비교 결과를 확인할 수 있습니다.
 
## 개발자
- 개발기간 : 2021.06~2021.09

|개발자|역할|
|:------:|:---:|
|김다은 (정컴 19)|FE|
|김승연 (정컴 19)|ML|
|조병우 (정컴 16)|BE|
|최범주 (정컴 21)|BE|
|황인욱 (건융 18)|디자인|

## 기술 스택
### Backend
- NodeJS + ExpressJS (Server)
- MongoDB (DB)
### ML
- Tensorflow (ML)
### Frontend
- React (FE)
