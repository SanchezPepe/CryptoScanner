#!/usr/bin/env python
# coding: utf-8

# In[1]:


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


# In[2]:
pp = pprint.PrettyPrinter(indent=1)


def clear():
    os.system('cls')


# In[3]:


def reqAPI():
    try:
        r = requests.get('https://www.cryptopia.co.nz/api/GetMarkets/BTC')
        coins = json.loads(r.text)['Data']
        if coins is not None:
            return coins #lista de diccionarios 
    except ValueError:
        print('Error al hacer el request, intentando nuevamente')
        reqAPI()


# In[4]:


def refreshData():
    #API REQUEST
    lenDic, coc, last, volC, bVol = 0, 0, 0, 0, 0
    ask, bid, spread = 0, 0, 0
    old, recent = 0, 0
    coins = reqAPI()
    while coins is None:
        coins = reqAPI()
        print(type(coins))
    for y in coins:
        changeDic = {}
        name = y['Label']
        if name in dic:
            lenDic = len(dic[name])
        else:
            dic[name] = {}
        ts = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        if y['BidPrice'] != 0:
            spread = ((y['AskPrice']/y['BidPrice'])-1)*100
            spread = round(spread, 2)
        changeDic = {'last':y['LastPrice'],
                    'sprd':spread,
                    'chng':y['Change'],
                    'vol': (0, y['Volume']),
                    'buyVol': (0, y['BuyVolume'])}
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
            #BuyVolume
            last = dic[name][recent]['buyVol'][1] #(    ,****) 
            changeDic['buyVol'] = (last, y['BuyVolume'])
            if last != 0:
                bVol = round(y['BuyVolume']/last-1, 2)
            elif y['BuyVolume'] == 0:
                bVol = 0
            else:
                bVol = 1
            changeDic['bvc'] = bVol
            changeDic['coc'] = coc
            changeDic['volC'] = volC
            if coc > 0.05 or volC > 0.05 or bVol > 0.05 : #Si el cambio en precios o en volumen es mayor al 5%
                if not name in toBuy:
                    toBuy[name] = {}
                toBuy[name][ts] = changeDic
        if lenDic == 5: 
            old = [*dic[name]][0] #Registro más viejo
            dic[name].pop(old)
        #Inserta el nuevo
        dic[name][ts] = changeDic


# In[5]:


#Variables
#Diccionarios con los datos
def analiza(n):
    i = 0
    suma = 0
    toBuySize = 0
    while i < n:
        start = time.time()
        refreshData()
        end = time.time()
        suma += end-start
        if toBuySize < len(toBuy): #Si se agregó un nvo item a toBuy
            clear()
            #clear_output()
            pp.pprint(toBuy)
        i += 1
        toBuySize = len(toBuy)
        sleep(1.5)
        
    #Tiempo promedio por respuesta
    print('Tiempo promedio de las ejecuciones: ', suma/n)


# In[15]:


#Coin Analisis
#pp.pprint(dic)
#pp.pprint(dic['$$$/BTC'])
dic, toBuy, changeDic = {}, {}, {}
n = input('Ingresar número de pruebas a ejecutar ')
if type(n) is str:
    n = int(n)
    if n > 0:
        analiza(n)
else:
    print('Ingresa un número mayor a 0')


# In[16]:





# In[ ]:




