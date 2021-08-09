from machine_test import tokenize
from keras.models import load_model
from konlpy.tag import Okt
from konlpy.tag import Kkma
import json
import pandas as pd
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

keywords_words = {
    '가격': ['가격', '가성비', '비싸', '저렴', '할인', '가격대비'],
    '성능' :['성능', '기능', '속도'],
    '디자인': ['디자인', '색', '컬러', '깔끔'],
    '설치': ['설치', '거치', '고정'],
    '화면': ['화면', '화질', '그래픽'],
    '소음': ['소음'],
    '무게': ['무게', '무거움', '가벼움', '무겁', '가볍'],
    '포장': ['포장', '상태', '분리', '배송', '배달'],
    '품질': ['품질', '질', '고급', '튼튼', '재질', '교환', '소재', '원단', '성분', '기능성', '발림'],
    '냄새': ['냄새', '공장'],
    '향' : ['향'],
    '맛': ['맛'],
    '유통기한': ['신선', '유통기한', '기간'],
    '효과': ['효능', '효과', '트러블', '톤업'],
    '사이즈': ['사이즈', '크기', '높이'],
    '기호': ['기호'],
    '만족': ['만족', '추천', '강추', '비추', '도움', '좋', '활용', '유용'],
    }
keywords = keywords_words.keys()


def separateLine(review):
    return [sentence for sentence in kkma.sentences(review)]

def noIncludeKeywordLine(line):
    f_notIncludeKeyword.write(line+"\n")

def tokenize(sentence):
    stopwords = ['의','가','이','은','들','는','좀','잘','걍','과','도','를','으로','자','에','와','한','하다']
    temp_X = okt.morphs(sentence, stem=True) # 토큰화
    temp_X = [word for word in temp_X if not word in stopwords] # 불용어 제거
    return temp_X

def loadTokenizer():
    with open(tokenizer_path) as json_file:
        word_index = json.load(json_file)
        tokenizer.word_index = word_index

def updateKeywordCnt(keyword, flag):
    if flag == 1:
        keywords_cnt[keyword]['positive'] += 1
    elif flag == 0:
        keywords_cnt[keyword]['negative'] += 1
    else:
        print("exception in updateKeywordCnt()")
        exit()


def predictReview(keyword, line):
    line = line.replace("[^ㄱ-ㅎㅏ-ㅣ가-힣 ]","")
    line = line.replace('^ +', "")
    tk_line = tokenize(line)
    seq_line = tokenizer.texts_to_sequences([tk_line])
    data = pad_sequences(seq_line, maxlen = 30)
    flag = 0
    score = float(model.predict(data))
    if score > 0.5:
        print(f"{line} ==> 긍정 ({round(score*100)}%)")
        f_includeKeyword.write(f"{line} ==> 긍정 ({round(score*100)}%)\n")
        flag = 1
    else:
        print(f"{line} ==> 부정 ({round(1-score)*100}%)")
        f_includeKeyword.write(f"{line} ==> 부정 ({round(1-score)*100}%)\n")
    updateKeywordCnt(keyword, flag)

def sentenceWithKeyword(line):
    keyword_flag = False
    for keyword in keywords:
        #print(keyword)
        for word in keywords_words[keyword]:
            if word in line:
                print(keyword+"###########")
                f_includeKeyword.write(keyword + "\t")
                predictReview(keyword, line)
                keyword_flag = True
                break
        if keyword_flag == True:
            break
    if keyword_flag == False:
        noIncludeKeywordLine(line)

def reviewLoad(): ##수정 필요. 하나의 상품의 리뷰 묶음 리스트가 review_df에 들어가면 됨
    review_df = pd.read_csv(review_path, encoding='UTF-8') #지금은 파일에서 읽어오는걸로 함
    print(review_df.values)
    for row in review_df.values:
        review = row[1]
        lines = separateLine(review)
        for line in lines:
            sentenceWithKeyword(line)

def load_vocabSize():
    f_vocabSize = open(vocabSize_path, "r")
    vocabSize = f_vocabSize.readline()
    return vocabSize

def initCnt():
    for keyword in keywords:
        keywords_cnt[keyword] = {'positive':0, 'negative':0}

def mostFreqKeyword5():
    sorted(keywords_cnt.items(), reverse=True, key=lambda item:(item[1]['positive'] + item[1]['negative']))
    print(keywords_cnt)
    i = 0
    for keyword in keywords_cnt.keys():
        print(keyword, end="\t")
        print(keywords_cnt[keyword])
        i += 1
        if i >= 5:
            break


if __name__ == "__main__":
    okt = Okt()
    kkma = Kkma()
    model_save_path = './ml/review_model_all_new_model.h5'
    tokenizer_path = "./ml/tokenizer_all_new_model.json"
    vocabSize_path = "./ml/vocabSize_all_new_model.txt"

    ## 입력: output file경로, 리뷰경로
    review_path = "./reviewData/complete/reviewData_printer_test.csv"

    f_includeKeyword = open("./ml/includeKeyword_all_new_model_printer.txt", "w", encoding='UTF-8')
    f_notIncludeKeyword = open("./ml/notIncludeKeyword_all_new_model_printer.txt", "w", encoding='UTF-8')
    ###

    #저장한 ML model 불러오기
    model = load_model(model_save_path)

    #tokenizer 불러오기
    max_words = int(load_vocabSize())
    tokenizer = Tokenizer(num_words=max_words)
    loadTokenizer()

    keywords_cnt = {}
    initCnt()
    print(keywords_cnt)

    reviewLoad()
    f_includeKeyword.close()
    f_notIncludeKeyword.close()
    mostFreqKeyword5()