import time
import matplotlib.pyplot as plt
import numpy as np

# 成本資訊
orderingCostEachTime = 2
shortageCostPerUnit = 2
materialCostPerUnit = 1000
APR = 0.073


def inventoryCostPerDay(c, i):
    return c * (i/365)


# 生成並整數化歷史資料
historicalSalesData = np.random.normal(loc=20, scale=5, size=500)
for i in range(len(historicalSalesData)):
    if historicalSalesData[i] < 0:
        historicalSalesData[i] = 0
    else:
        historicalSalesData[i] = round(historicalSalesData[i], 0)


# If I<=R, order Q units. Otherwise, do nothing.
def QRPolicy(Q, R, I, historicalSalesData):
    # 處理歷史資料
    historicalCostList = []
    # print("Current Inventory: " + str(I) + "\n")
    for each in historicalSalesData:
        # dailyCostList: [inventoryCost, orderingCostEachTime, shortageCost]
        dailyCostList = [0, 0, 0]
        dailySales = each
        # print("Quantity Demanded: " + str(each) + "\n")

        # 判斷存貨是否足夠，順便計算Shortage Cost
        lack = 0
        if I >= dailySales:
            I -= dailySales
            # print("Deal!\tInventory -> " + str(I))
        else:
            lack = dailySales - I
            I = 0  # 先賣出所有現存貨物
            # print("Lack of inventory!\t" + str(lack) + " unit(s) lacked\n")
            shortageCost = shortageCostPerUnit * lack
            dailyCostList[2] += shortageCost
        # print("Current Inventory: " + str(I) + "\n")

        # 判斷是否需要進貨，順便計算Ordering Cost
        while I <= R:
            I += Q  # 補貨
            # print("One order made. (+" + str(Q) +
            #       ")\tCurrent Inventory: " + str(I) + "\n")
            dailyCostList[1] += orderingCostEachTime

            # 解決昨天的短缺問題
            if lack == 0:
                break
            elif I-lack >= 0:  # 有短缺但足以被彌補
                I -= lack
                lack = 0
                # print("Lackness solved!")
                # print("Current Inventory: " + str(I) + "\n")
            else:  # 有短缺且補一次貨後仍不夠(原則上不會出現這個狀況，廠商應該在接到訂單時直接拒絕)
                lack -= I
                I = 0
                # print("Still lack of inventory!\t" +
                #       str(lack) + " unit(s) lacked\n")
                # 因為在同一天發現，所以不再另計Shortage Cost

        inventoryCost = inventoryCostPerDay(I * materialCostPerUnit, APR)
        dailyCostList[0] += inventoryCost
        historicalCostList.append(dailyCostList)
    # print("-----------------------------------------------")  # 所有歷史資料處理完畢

    # 結算歷史資料
    totalCost = totalInventoryCost = totalOrderingCost = totalShortageCost = 0
    for i in range(len(historicalCostList)):
        totalInventoryCost += historicalCostList[i][0]  # 總存貨成本
        totalOrderingCost += historicalCostList[i][1]  # 總訂貨成本
        totalShortageCost += historicalCostList[i][2]  # 總缺貨成本
    totalCost = totalInventoryCost + totalOrderingCost + totalShortageCost  # 總成本
    totalCost = round(totalCost, 3)
    # print("Total Cost                              " + str(totalCost))
    return [totalCost, totalInventoryCost, totalOrderingCost, totalShortageCost]


def runBusiness():
    I = int(input("Initial Inventory: "))
    print("Current Inventory: " + str(I))
    policy = int(input("Choose inventory policy(1)QR Policy (2)sS Policy: "))
    if policy == 1:
        # Q = int(input("The quantity each order should be: "))
        # R = int(input("The quantity that reminds you to make one order: "))
        Q = 30
        R = 10
        QRPolicy(Q, R, I)
    elif policy == 2:
        # s = int(input("The quantity after each order: "))
        # S = int(input("The quantity that reminds you to make one order: "))
        s = 30
        S = 50


L1 = []  # 存「最好的Q下，不同R」所花的總成本
L2 = []  # 存「最好的Q下，不同R」所花的存貨成本
L3 = []  # 存「最好的Q下，不同R」所花的訂貨成本
L4 = []  # 存「最好的Q下，不同R」所花的短缺成本
bestROfBestQ = 0
bestQ = 1


def minTotalCost(historicalSalesData, initialInv):
    global L1, L2, L3, L4, bestQ, bestROfBestQ
    globalLowestCost = float('inf')
    for q in range(1, 101):  # 此間廠商一次最多只能訂100個貨
        l1 = []  # 存「不同R」之下的總成本
        l2 = []  # 存「不同R」之下的存貨成本
        l3 = []  # 存「不同R」之下的訂貨成本
        l4 = []  # 存「不同R」之下的短缺成本
        localLowestCost = float('inf')
        bestR = 0
        for r in range(q):
            costReport = QRPolicy(q, r, initialInv, historicalSalesData)
            l1.append(costReport[0])
            l2.append(costReport[1])
            l3.append(costReport[2])
            l4.append(costReport[3])
            if costReport[0] <= localLowestCost:
                localLowestCost = costReport[0]
                bestR = r
        if localLowestCost <= globalLowestCost:
            globalLowestCost = localLowestCost
            bestQ = q
            bestROfBestQ = bestR
            L1, L2, L3, L4 = l1, l2, l3, l4
    # finalResult = {}
    message = "If Inventory are less than " + \
        str(bestROfBestQ+1)+" units, "+"order " + \
        str(bestQ)+" units. Otherwise, do nothing."
    message += "\nEfficient Costs: $"
    message += str(globalLowestCost)
    return message


def report():
    plt.title(minTotalCost(historicalSalesData, 80))
    plt.plot(range(bestQ), L1, color='r', label="Total Cost")
    plt.plot(range(bestQ), L2, color='g', label="Inventory Cost")
    plt.plot(range(bestQ), L3, color='b', label="Ordering Cost")
    plt.plot(range(bestQ), L4, color='y', label="Shortage Cost")
    plt.xlim(0, bestQ-1)
    plt.ylim(0, max(L1)+10)
    plt.xlabel("R")
    plt.ylabel("$")
    plt.legend()
    plt.show()


report()
