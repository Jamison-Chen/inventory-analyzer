import { MyMath } from "./myMath.js";
import { CostAnalysisChart, SalesDistributionChart, TimeSeriesSalesChart } from "./chart.js";
class Main {
    public static salesChartFieldInside: HTMLElement | null;
    public static leftShiftBtn: HTMLElement | null;
    public static rigthShiftBtn: HTMLElement | null;
    public static distributionTypeMenu: HTMLElement | null;
    public static distributionParamField: HTMLElement | null;
    public static dayToSimulateInput: HTMLElement | null;
    public static salesDistributionChartDiv: HTMLElement | null;
    public static timeSeriesSalesChartDiv: HTMLElement | null;
    public static genSalesDataBtn: HTMLElement | null;
    public static salesDistributionChart: SalesDistributionChart;
    public static timeSeriesSalesChart: TimeSeriesSalesChart;
    public static dailySalesData: (string | number)[][];
    public static inventoryPolicyMenu: HTMLElement | null;
    public static inventoryPolicyDescriptionDiv: HTMLElement | null;
    public static materialCostInput: HTMLElement | null;
    public static aprInput: HTMLElement | null;
    public static shippingCostInput: HTMLElement | null;
    public static shortageCostInput: HTMLElement | null;
    public static warehouseCostInput: HTMLElement | null;
    public static initialInventoryInput: HTMLElement | null;
    public static minOrderingUnitInput: HTMLElement | null;
    public static maxOrderingUnitInput: HTMLElement | null;
    public static maxStoreUnitInput: HTMLElement | null;
    public static costAnalysisChartDiv: HTMLElement | null;
    public static costAnalysisChart: CostAnalysisChart;
    public static analyzeBtn: HTMLElement | null;
    public static upperAnalyzingMessageMask: HTMLElement | null;

    public static DISTRIBUTION: any = {
        normal: {
            param: {
                "mu": { defaultVal: 30 },
                "std": { defaultVal: 30 / 4 }
            },
            dataGeneratorFunction: MyMath.normalSample
        },
        poisson: {
            param: { "lambda": { defaultVal: 30 } },
            dataGeneratorFunction: MyMath.poissonSample
        },
        uniform: {
            param: {
                "min": { defaultVal: 0 },
                "max": { defaultVal: 100 }
            },
            dataGeneratorFunction: MyMath.uniformSample
        },
    };
    public static INVENTORYPOLICY: any = {
        qr: {
            description: "Order Q units if current inventory <= R. Do nothing otherwise.",
            processFunction: () => Main.analyzeAndDrawWithQRPolicy("Costs under Best Q"),
        },
    };

    public static main(): void {
        this.salesChartFieldInside =
            document.getElementById("sales-chart-field-inside");
        this.leftShiftBtn = document.getElementById("left-shift-btn");
        this.rigthShiftBtn = document.getElementById("right-shift-btn");
        this.addShiftBtnListener();

        this.distributionTypeMenu = document.getElementById("distribution-type-menu");
        this.distributionParamField = document.getElementById("distribution-parameter-field");
        this.distributionTypeMenu?.addEventListener("click", this.genDistributionParamField);
        this.genDistributionParamField();

        this.salesDistributionChartDiv =
            document.getElementById("sales-distribution-chart-container");
        this.salesDistributionChart =
            new SalesDistributionChart(this.salesDistributionChartDiv);
        this.timeSeriesSalesChartDiv =
            document.getElementById("time-series-sales-chart-container");
        this.timeSeriesSalesChart =
            new TimeSeriesSalesChart(this.timeSeriesSalesChartDiv);
        this.genSalesDataBtn = document.getElementById("generate-sales-data-btn");
        this.genSalesDataBtn?.addEventListener("click", this.genAndDrawSalesData);

        this.inventoryPolicyMenu = document.getElementById("inventory-policy-menu");
        this.inventoryPolicyDescriptionDiv = document.getElementById("inventory-policy-description");
        this.inventoryPolicyMenu?.addEventListener("click", this.genInventoryPolicyDescription);
        this.genInventoryPolicyDescription();

        this.dayToSimulateInput = document.getElementById("day-to-simulate-input");
        this.materialCostInput = document.getElementById("material-cost-input");
        this.aprInput = document.getElementById("auunal-percentage-rate-input");
        this.shippingCostInput = document.getElementById("shipping-cost-input");
        this.shortageCostInput = document.getElementById("shortage-cost-input");
        this.warehouseCostInput = document.getElementById("warehouse-cost-input");
        this.initialInventoryInput = document.getElementById("initial-inventory-input");
        this.minOrderingUnitInput = document.getElementById("min-ordering-unit-input");
        this.maxOrderingUnitInput = document.getElementById("max-ordering-unit-input");
        this.maxStoreUnitInput = document.getElementById("max-store-unit-input");
        this.initAllInputValue();

        this.costAnalysisChartDiv =
            document.getElementById("cost-analysis-chart-container");
        this.costAnalysisChart = new CostAnalysisChart(this.costAnalysisChartDiv);
        this.analyzeBtn = document.getElementById("analyze-btn");
        if (Main.inventoryPolicyMenu instanceof HTMLSelectElement) {
            let selectedPolicy = Main.INVENTORYPOLICY[Main.inventoryPolicyMenu.value];
            this.analyzeBtn?.addEventListener("click", selectedPolicy.processFunction);
        }

        this.upperAnalyzingMessageMask =
            document.getElementById("upper-analyzing-message-mask");

        this.genAndDrawSalesData();
    }
    public static addShiftBtnListener(): void {
        if (Main.rigthShiftBtn instanceof HTMLElement && Main.leftShiftBtn instanceof HTMLElement) {
            Main.rigthShiftBtn.addEventListener("click", () => {
                if (Main.salesChartFieldInside instanceof HTMLElement) {
                    Main.salesChartFieldInside.style.left = "-100%";
                }
            });
            Main.leftShiftBtn.addEventListener("click", () => {
                if (Main.salesChartFieldInside instanceof HTMLElement) {
                    Main.salesChartFieldInside.style.left = "0%";
                }
            });
        }
    }
    public static genAndDrawSalesData(): void {
        if (Main.dailySalesData !== undefined) Main.dailySalesData.length = 0;  // prevent memory leaks
        if (Main.dayToSimulateInput instanceof HTMLInputElement && Main.distributionTypeMenu instanceof HTMLSelectElement) {
            let dayToSimulate = parseInt(Main.dayToSimulateInput.value);
            Main.dailySalesData = [["Day", "Sales"]];
            let selectedDistribution = Main.DISTRIBUTION[Main.distributionTypeMenu.value];
            let params = Main.readDistributionSetting(selectedDistribution);
            for (let i = 1; i <= dayToSimulate; i++) {
                Main.dailySalesData.push(
                    [i, Math.max(0, Math.round(selectedDistribution.dataGeneratorFunction(...params)))]
                );
            }
            Main.timeSeriesSalesChart.drawChart(Main.dailySalesData);
            Main.salesDistributionChart.drawChart(Main.dailySalesData);
        }
    }
    public static genDistributionParamField(): void {
        if (Main.distributionParamField instanceof HTMLElement && Main.distributionTypeMenu instanceof HTMLSelectElement) {
            let selectedDistribution = Main.DISTRIBUTION[Main.distributionTypeMenu.value];
            Main.distributionParamField.innerHTML = "";
            for (let eachParam in selectedDistribution.param) {
                let label = document.createElement("label")
                label.setAttribute("for", eachParam);
                label.innerHTML = eachParam;
                let input = document.createElement("input");
                input.name = eachParam;
                input.type = "number";
                input.id = `${Main.distributionTypeMenu.value}-${eachParam}-input`;
                input.value = selectedDistribution.param[eachParam].defaultVal;
                label.appendChild(input);
                Main.distributionParamField.appendChild(label)
            }
        }
    }
    public static genInventoryPolicyDescription(): void {
        if (Main.inventoryPolicyDescriptionDiv instanceof HTMLElement && Main.inventoryPolicyMenu instanceof HTMLSelectElement) {
            let selectedPolicy = Main.INVENTORYPOLICY[Main.inventoryPolicyMenu.value];
            Main.inventoryPolicyDescriptionDiv.innerHTML = selectedPolicy.description;
        }
    }
    public static initAllInputValue(): void {
        if (Main.dayToSimulateInput instanceof HTMLInputElement && Main.materialCostInput instanceof HTMLInputElement && Main.shippingCostInput instanceof HTMLInputElement && Main.shortageCostInput instanceof HTMLInputElement && Main.warehouseCostInput instanceof HTMLInputElement && Main.initialInventoryInput instanceof HTMLInputElement && Main.minOrderingUnitInput instanceof HTMLInputElement && Main.maxOrderingUnitInput instanceof HTMLInputElement && Main.maxStoreUnitInput instanceof HTMLInputElement && Main.aprInput instanceof HTMLInputElement) {
            Main.dayToSimulateInput.value = "365";
            Main.materialCostInput.value = "500";
            Main.aprInput.value = "0.04";
            Main.shippingCostInput.value = "300";
            Main.shortageCostInput.value = "200";
            Main.warehouseCostInput.value = "100000";
            Main.initialInventoryInput.value = "200";
            Main.minOrderingUnitInput.value = "10";
            Main.maxOrderingUnitInput.value = "500";
            Main.maxStoreUnitInput.value = "500";
        }
    }
    public static readDistributionSetting(selectedDistribution: any): number[] {
        let params = [];
        if (Main.distributionTypeMenu instanceof HTMLSelectElement) {
            for (let eachParam in selectedDistribution.param) {
                let paramInputDiv = document.getElementById(`${Main.distributionTypeMenu.value}-${eachParam}-input`);
                if (paramInputDiv instanceof HTMLInputElement) {
                    params.push(parseFloat(paramInputDiv.value));
                }
            }
        }
        return params;
    }
    public static qrPolicy(
        endogenousVar: {
            Q: number,
            R: number
        },
        exogenousVar: {
            materialCostPerUnit: number,
            APR: number,
            shippingCostPerOrder: number,
            shortageCostPerUnit: number,
            warehouseCost: number,
            initialInventory: number,
            minOrderingUnit: number,
            maxOrderingUnit: number,
            maxStoreUnit: number,
        }
    ): {
        totalCost: number,
        shippingCost: number,
        shortageCost: number,
        warehouseCost: number,
        inventoryOpportunityCost: number
    } {
        let currentInventory = exogenousVar.initialInventory;
        let shippingCost = 0;
        let shortageCost = 0;
        let warehouseCost = exogenousVar.warehouseCost;
        let inventoryOpportunityCost = 0;
        for (let i = 1; i < Main.dailySalesData.length; i++) {
            let lack = Math.max(0, Number(Main.dailySalesData[i][1]) - currentInventory);
            currentInventory = Math.max(0, currentInventory - Number(Main.dailySalesData[i][1]));
            shortageCost += exogenousVar.shortageCostPerUnit * lack;
            if (currentInventory <= endogenousVar.R) {
                let orderQ = Math.min(
                    exogenousVar.maxStoreUnit - currentInventory,
                    endogenousVar.Q
                );
                currentInventory += orderQ;
                shippingCost += exogenousVar.shippingCostPerOrder;
            }
            inventoryOpportunityCost += (currentInventory * exogenousVar.materialCostPerUnit) * (exogenousVar.APR / 365);
        }
        return {
            totalCost: shippingCost + shortageCost + warehouseCost + inventoryOpportunityCost,
            shippingCost: shippingCost,
            shortageCost: shortageCost,
            warehouseCost: warehouseCost,
            inventoryOpportunityCost: inventoryOpportunityCost
        }
    }
    public static analyzeAndDrawWithQRPolicy(chartTitle: string): void {
        Main.fakeFreezeScreen();
        setTimeout(() => {
            let minTotalCost: number = Infinity;
            let bestQ: number = 0;
            let bestR: number = 0;
            let policySetting = Main.readPolicySetting();
            for (let q = policySetting.minOrderingUnit; q <= policySetting.maxOrderingUnit; q++) {
                for (let r = 0; r < q; r++) {
                    let totalCost = Main.qrPolicy({ Q: q, R: r }, policySetting).totalCost;
                    if (totalCost < minTotalCost) {
                        minTotalCost = totalCost;
                        bestQ = q;
                        bestR = r;
                    }
                }
            }
            let dataUnderBestQ: (string | number)[][] = [
                ["R", "Total Cost", "Shipping Cost",
                    "Shortage Cost", "Warehouse Cost", "Inventory Opportunity Cost"
                ]
            ];
            for (let r = 0; r < bestQ; r++) {
                let costs = Main.qrPolicy({ Q: bestQ, R: r }, policySetting);
                dataUnderBestQ.push([r, costs.totalCost, costs.shippingCost,
                    costs.shortageCost, costs.warehouseCost,
                    costs.inventoryOpportunityCost])
            }
            Main.costAnalysisChart.drawChart(chartTitle + ` = ${Math.round(minTotalCost)} (Q=${bestQ}, R=${bestR})`, dataUnderBestQ);
            Main.fakeUnfreezeScreen();
        })
    }
    public static readPolicySetting(): {
        materialCostPerUnit: number,
        APR: number,
        shippingCostPerOrder: number,
        shortageCostPerUnit: number,
        warehouseCost: number,
        initialInventory: number,
        minOrderingUnit: number,
        maxOrderingUnit: number,
        maxStoreUnit: number
    } {
        if (Main.materialCostInput instanceof HTMLInputElement && Main.aprInput instanceof HTMLInputElement && Main.shippingCostInput instanceof HTMLInputElement && Main.shortageCostInput instanceof HTMLInputElement && Main.warehouseCostInput instanceof HTMLInputElement && Main.initialInventoryInput instanceof HTMLInputElement && Main.minOrderingUnitInput instanceof HTMLInputElement && Main.maxOrderingUnitInput instanceof HTMLInputElement && Main.maxStoreUnitInput instanceof HTMLInputElement) {
            return {
                materialCostPerUnit: parseFloat(Main.materialCostInput.value),
                APR: parseFloat(Main.aprInput.value),
                shippingCostPerOrder: parseFloat(Main.shippingCostInput.value),
                shortageCostPerUnit: parseFloat(Main.shortageCostInput.value),
                warehouseCost: parseFloat(Main.warehouseCostInput.value),
                initialInventory: parseFloat(Main.initialInventoryInput.value),
                minOrderingUnit: parseFloat(Main.minOrderingUnitInput.value),
                maxOrderingUnit: parseFloat(Main.maxOrderingUnitInput.value),
                maxStoreUnit: parseFloat(Main.maxStoreUnitInput.value)
            }
        } else throw "Some input boxes didn't work.";
    }
    public static fakeFreezeScreen(): void {
        if (Main.upperAnalyzingMessageMask instanceof HTMLElement && Main.analyzeBtn instanceof HTMLButtonElement && Main.genSalesDataBtn instanceof HTMLButtonElement) {
            Main.upperAnalyzingMessageMask.className = "show";
            Main.analyzeBtn.disabled = true;
            Main.genSalesDataBtn.disabled = true;
        }
    }
    public static fakeUnfreezeScreen(): void {
        if (Main.upperAnalyzingMessageMask instanceof HTMLElement && Main.analyzeBtn instanceof HTMLButtonElement && Main.genSalesDataBtn instanceof HTMLButtonElement) {
            Main.upperAnalyzingMessageMask.className = "hide";
            Main.analyzeBtn.disabled = false;
            Main.genSalesDataBtn.disabled = false;
        }
    }
}

Main.main();