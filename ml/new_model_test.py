from keras.models import load_model
from konlpy.tag import Okt
from konlpy.tag import Kkma
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

import json
import os
import time
import requests
from watchdog.observers.polling import PollingObserver
from watchdog.events import FileSystemEventHandler

keywords_words = {
    '가격': ['가격', '가성비', '비싸', '저렴', '할인', '가격대비' '성비'],
    '성능' :['성능', '기능', '속도', '선명', '작동', '인식', '사용법'],
    '디자인': ['디자인', '색', '컬러', '깔끔'],
    '설치': ['설치', '거치', '고정', '조립'],
    '화면': ['화면', '화질', '그래픽'],
    '소음': ['소음'],
    '무게': ['무게', '무거움', '가벼움', '무겁', '가볍'],
    '포장': ['포장', '상태', '분리', '기스', '흠집', '스크레치', '얼룩', '찍힘', '검수', '박스', '완충제'],
    '배송': ['배송', '배달', '택배', '출고', '누락'],
    '품질': ['품질', '질', '고급', '튼튼', '재질', '소재', '원단', '성분', '기능성', '발림', '정품', '짝퉁', '불량',
    '정확', '마감', '흔들', '벌레', '하자', '고장'],
    '냄새': ['냄새', '공장'],
    '향' : ['향'],
    '맛': ['맛'],
    '유통기한': ['신선', '유통기한', '기간'],
    '효과': ['효능', '효과', '트러블', '톤업'],
    '사이즈': ['사이즈', '크기', '높이', '치수'],
    '기호' : ['기호'],
    '서비스': ['서비스', 'A/S', 'as', 'AS', 'As', '문의', '전화', '고객센터'],
    '만족' : ['만족', '추천', '강추', '비추', '도움', '좋', '활용', '유용', '뿌듯', '감사', '단점',
    '잘 ', '깨끗', '시원', '재밌', '재미', '최고', '완벽', '짱', '훌륭', '반품', '최악', '불편', '불쾌', '서비스',
    '재구매', '다만', '실용', '편안', '편해', '편하']
    }
keywords = keywords_words.keys()

datafolder = os.getcwd().rsplit('/', 1)[0] + "/data"

def separateLine(review):
    return [sentence for sentence in kkma.sentences(review)]

def tokenize(sentence):
    stopwords = ['의','가','이','은','들','는','좀','잘','걍','과','도','를','으로','자','에','와','한','하다']
    temp_X = okt.morphs(sentence, stem=True) # 토큰화
    temp_X = [word for word in temp_X if not word in stopwords] # 불용어 제거
    return temp_X

def loadTokenizer():
    with open(tokenizer_path) as json_file:
        word_index = json.load(json_file)
        tokenizer.word_index = word_index

def predictReview(keyword, line):
    line = line.replace("[^ㄱ-ㅎㅏ-ㅣ가-힣 ]","")
    line = line.replace('^ +', "")
    tk_line = tokenize(line)
    seq_line = tokenizer.texts_to_sequences([tk_line])
    data = pad_sequences(seq_line, maxlen = 30)
    score = float(model.predict(data))
    return score

def sentenceWithKeyword(line):
    keyword_flag = False
    res = {}
    for keyword in keywords:
        if keyword == '만족' and keyword_flag == True:
            break
        for word in keywords_words[keyword]:
            if word in line:
                res['keyword'] = keyword
                res['score'] = predictReview(keyword, line)
                keyword_flag = True
                break
    return res

def reviewLoad(reviews):
    res = []
    for review in reviews:
        lines = separateLine(review)
        analyzedRes = {}
        for line in lines:
            line = line.replace(" ", "")
            temp = sentenceWithKeyword(line)
            if (temp) :
                if temp['keyword'] in analyzedRes :
                    analyzedRes[temp['keyword']] = (analyzedRes[temp['keyword']] + temp['score']) / 2
                else :
                    analyzedRes[temp['keyword']] = temp['score']
        res.append(analyzedRes)
    return res

def loadVocabSize():
    f_vocabSize = open(vocabSize_path, "r")
    vocabSize = f_vocabSize.readline()
    return vocabSize

###################

def printLog(log):
    now = time.localtime()
    print(("[%04d/%02d/%02d %02d:%02d:%02d] " + log) % (now.tm_year, now.tm_mon, now.tm_mday, now.tm_hour, now.tm_min, now.tm_sec), flush=True)

class Target:
    def __init__(self):
        self.event_handler = None
        self.observer = PollingObserver()
        self.watchDir = datafolder + "/beforeAnalyze"

    def run(self):
        printLog('listening ' + self.watchDir)
        self.event_handler = Handler()
        self.observer.schedule(self.event_handler, self.watchDir)
        self.observer.start()
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt as e :
            self.observer.stop()
        except:
            self.observer.stop()
            printLog("Error")
            self.observer.join()

class Handler(FileSystemEventHandler):
    def on_created(self, event):
        fileName, fileExtension = os.path.splitext(os.path.basename(event.src_path))
        printLog('before ' + fileName)
        if fileExtension == '.json':
            time.sleep(1)
            with open(event.src_path, 'r', encoding='utf8') as file:
                jsonData = json.load(file)
                reviews = []
                for obj in jsonData:
                    reviews.append(obj['content'])
                analyzedData = reviewLoad(reviews)
            outputData = []
            for i in range(len(jsonData)):
                if analyzedData[i] : 
                    outputData.append(jsonData[i])
                    outputData[len(outputData) - 1]['rate'] = analyzedData[i]
            with open(datafolder + "/afterAnalyze/" + fileName + '.json', 'w', encoding='utf8') as file:
                json.dump(outputData, file, indent='\t', ensure_ascii=False)
                os.remove(event.src_path)
                printLog('after ' + fileName)
            requests.post('http://localhost:5000/api/product/' + fileName, {'done': True})
		

if __name__ == "__main__":
    okt = Okt()
    kkma = Kkma()
    model_save_path = './data/review_model_all_new_model.h5'
    tokenizer_path = "./data/tokenizer_all_new_model.json"
    vocabSize_path = "./data/vocabSize_all_new_model.txt"

    ## 입력: output file경로
    KEYWORD_CNT = 5
    ###

    #저장한 ML model 불러오기
    model = load_model(model_save_path)

    #tokenizer 불러오기
    max_words = int(loadVocabSize())
    tokenizer = Tokenizer(num_words=max_words)
    loadTokenizer()

    w = Target()
    w.run()