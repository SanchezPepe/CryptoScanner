#!/usr/bin/env python
# coding: utf-8

# In[9]:


import requests
import os
import json
import pprint
from time import sleep
import sched
from datetime import datetime
from time import sleep
import time
from IPython.display import clear_output


# In[6]:


def clear():
    os.system( 'cls' )


# In[7]:


def reqAPI():
    r = requests.get('https://www.cryptopia.co.nz/api/GetMarkets/BTC')
    coins = json.loads(r.text)['Data']
    if type(coins) != 'NoneType':
        return coins #lista de diccionarios 


# In[3]:


def refreshData():
    #API REQUEST
    lenDic, coc, last, volC = 0, 0, 0, 0
    old, recent = 0, 0
    coins = reqAPI()
    for y in coins:
        subDic = {}
        changeDic = {}
        name = y['Label']
        if name in dic:
            lenDic = len(dic[name])
        else:
            dic[name] = {}
        time = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        if y['BidPrice'] != 0:
            spread = ((y['AskPrice']/y['BidPrice'])-1)*100
            spread = round(spread, 2)
        changeDic = {'last':y['LastPrice'],
                     'sprd':spread,
                     'chng':y['Change'],
                    'vol': (0, y['Volume'])}
        if lenDic != 0: #Si hay registros de precios
            #Cambio
            recent = [*dic[name]][lenDic-1] #Compara con el más reciente
            last = dic[name][recent]['last']
            coc = round((y['LastPrice']/last)-1, 2)
            #Volumen
            last = dic[name][recent]['vol'][1] #Compara el volumen más reciente
            #Captura de los valores viejo y nuevo
            changeDic['vol'] = (last, y['Volume'])
            if last != 0:
                volC = round((y['Volume']/last)-1, 2)
            elif y['Volume'] == 0:
                volC = 0
            else:
                volC = 1
            if coc > 0.05 or volC > 0.05: #Si el cambio en precios o en volumen es mayor al 5%
                subDic[time] = changeDic
                toBuy[name] = subDic
            changeDic['coc'] = coc
            changeDic['volC'] = volC
        if lenDic == 5: 
            old = [*dic[name]][0] #Registro más viejo
            dic[name].pop(old)
        #Inserta el nuevo
        dic[name][time] = changeDic


# In[10]:


#Variables
#Diccionarios con los datos
toBuy = {}
ask, bid, spread = 0, 0, 0
dic, subDic, changeDic = {}, {}, {}
pp = pprint.PrettyPrinter(indent=1)
i = 0
n = 100
suma = 0

while i < n:
    #clear_output()
    start = time.time()
    refreshData()
    end = time.time()
    suma += end-start
    clear()
    pp.pprint(toBuy)
    i += 1
    sleep(1.5)

#Tiempo promedio por respuesta
print('Tiempo promedio de las ejecuciones: ', suma/n)


# In[5]:


#Coin Analisis
#pp.pprint(dic)
#pp.pprint(dic['$$$/BTC'])
""""
coin = 'BTB/BTC'

pp.pprint(dic[coin])
"""


# In[ ]:




