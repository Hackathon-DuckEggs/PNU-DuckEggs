from selenium import webdriver
import requests
from bs4 import BeautifulSoup
import re
import time
import random

import codecs
from os import waitpid
import pandas as pd
from IPython.display import display


#labeling

def posnegData():
    pos = codecs.open("./positiveWords.txt", 'rb', encoding='UTF-8')

    while True:
        line = pos.readline()
        if not line: break
        line = line.replace('\n', '').strip() #strip
        positive.append(line)
    
    pos.close()

    neg = codecs.open("./negativeWords.txt", 'rb', encoding='UTF-8')

    while True:
        line = neg.readline()
        if not line: break
        line = line.replace('\n', '').strip()
        negative.append(line)
    neg.close()

def labeling(review): #긍정 부정 라벨 달기
    posflag = False
    negflag = False
    for neg in negative:
        if neg in review:
            negflag = True
            label = -1
            break
    if negflag == False:
        for pos in positive:
            if pos in review:
                posflag = True
                label = 1
                break
        if posflag == False:
            label = 0
    
    reviewDic['review'].append(review)
    reviewDic['label'].append(label)

#crawling

def notExistPageBar():
    pageBar = driver.find_elements_by_css_selector('#danawa-prodBlog-productOpinion-list-self > div.mall_review > div.area_right > div.common_paginate > div')
    if pageBar == []:
        return True
    return False

def next_page():
    if notExistPageBar():
        return True
    pageBar = driver.find_elements_by_css_selector('#danawa-prodBlog-productOpinion-list-self > div.mall_review > div.area_right > div.common_paginate > div')[0]
    pages = pageBar.find_elements_by_css_selector('a')
    
    #현재 페이지
    pageNow = pageBar.find_elements_by_css_selector('span.page_num.now_page')[0].text.strip()
    #print("현재: "+ pageNow)

    page_last = pages[-1].text.strip()
    #print("마지막: "+page_last) #숫자가 있으면 그 숫자가 마지막 페이지
    if page_last.isdigit():
        if pageNow >= page_last:
            return True

    for page in pages:
        page_num = page.text.strip()
        if page_num == '이전 보기':
            continue
        elif page_num == '다음 보기':
            page.send_keys("\n")
            driver.implicitly_wait(3)
            time.sleep(2+random.uniform(0,1))
            return False
        elif int(page_num) > int(pageNow):
            page.send_keys("\n")
            driver.implicitly_wait(3)
            time.sleep(1+random.uniform(0,1))
            return False
        elif int(page_num) <= int(pageNow):
            continue
        else:
            print("exception in nextpage()") 


def reviewCrawler():
    req = driver.page_source
    soup = BeautifulSoup(req, 'lxml')
    ul = soup.select_one('#danawa-prodBlog-productOpinion-list-self > div.mall_review > div.area_right > ul')
    reviews = ul.select('div.rvw_atc > div > div.atc > span') #키워드 포함 문장만 뽑기
    #print(reviews)
    for review in reviews:
        review_data = review.text #테그 없이 텍스트만
        review_data = re.sub('[-=+,#/\?:^$.@*\"※~&%ㆍ!』\\‘|\(\)\[\]\<\>`\'…\"\“》]', '', review_data) #지움
        review_data = review_data.strip()
        print(review_data)
        if review_data not in reviewDic['review']:
            labeling(review_data)

def crawler():
    is_done = False
    while(not is_done):
        reviewCrawler()
        is_done = next_page()

if __name__ == '__main__':
    reviewCnt = 0
    url = "http://prod.danawa.com/info/?pcode=1770317&cate=15340419" #넣어야 함

    options = webdriver.ChromeOptions()
    options.add_experimental_option("excludeSwitches", ["enable-logging"])

    #chrome driver 위치
    driver = webdriver.Chrome('C:/Users/김승연/Downloads/chromedriver_win32/chromedriver', options=options) #슬래시
    driver.implicitly_wait(3)
    driver.get(url)
    driver.implicitly_wait(3)

    #driver.find_element_by_xpath('//*[@id="danawa-prodBlog-productOpinion-list-self"]/div[1]/ul/li[3]').click()
    #time.sleep(1)
    keywordBox = driver.find_elements_by_css_selector('#danawa-prodBlog-productOpinion-list-self > div.mall_review > div.area_left > div.rvw_tag_area > ul')[0]
    #print(keywordBox)
    keywords = keywordBox.find_elements_by_css_selector('li')
    keywordsCnt = len(keywords)
    
    i = 2
    reviewDic = {"review":[], "label":[]}

    positive = []
    negative = []
    posnegData()
    
    while(True):
        keywordBox = driver.find_elements_by_css_selector('#danawa-prodBlog-productOpinion-list-self > div.mall_review > div.area_left > div.rvw_tag_area > ul')[0]
        time.sleep(0.1)
        try:
            keywordBox.find_element_by_xpath('//*[@id="danawa-prodBlog-productOpinion-list-self"]/div[2]/div[1]/div[3]/ul/li['+str(i)+']').click()
        except:
            print("Complete")
            break
        i += 1
        time.sleep(0.1)
        crawler()

    reviewDf = pd.DataFrame(reviewDic)
    #display(reviewDf)
    reviewDf.to_csv(('./reviewData_desk.csv'), sep=',', na_rep='NaN', encoding='utf-8-sig')
