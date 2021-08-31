import { MyMath } from "./myMath.js";
import { SalesDistributionChart, TimeSeriesSalesChart } from "./chart.js";
class Main {
    static main() {
        var _a, _b, _c;
        this.salesChartFieldInside =
            document.getElementById("sales-chart-field-inside");
        // this.costAnalysisChartContainer =
        //     document.getElementById("cost-analysis-chart-container");
        this.leftShiftBtn = document.getElementById("left-shift-btn");
        this.rigthShiftBtn = document.getElementById("right-shift-btn");
        this.addShiftBtnListener();
        this.distributionTypeMenu = document.getElementById("distribution-type-menu");
        this.distributionParamField = document.getElementById("distribution-parameter-field");
        (_a = this.distributionTypeMenu) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.genDistributionParamField);
        this.genDistributionParamField();
        this.salesDistributionChartDiv =
            document.getElementById("sales-distribution-chart-container");
        this.salesDistributionChart =
            new SalesDistributionChart(this.salesDistributionChartDiv);
        this.timeSeriesSalesChartDiv =
            document.getElementById("time-series-sales-chart-container");
        this.timeSeriesSalesChart = new TimeSeriesSalesChart(this.timeSeriesSalesChartDiv);
        this.genSalesDataBtn = document.getElementById("generate-sales-data-btn");
        (_b = this.genSalesDataBtn) === null || _b === void 0 ? void 0 : _b.addEventListener("click", this.genSalesData);
        this.inventoryPolicyMenu = document.getElementById("inventory-policy-menu");
        this.inventoryPolicyDescription = document.getElementById("inventory-policy-description");
        (_c = this.inventoryPolicyMenu) === null || _c === void 0 ? void 0 : _c.addEventListener("click", this.genInventoryPolicyDescription);
        this.genInventoryPolicyDescription();
        this.dayToSimulateInput = document.getElementById("day-to-simulate-input");
        this.materialCostInput = document.getElementById("material-cost-input");
        this.shippingCostInput = document.getElementById("shipping-cost-input");
        this.shortageCostInput = document.getElementById("shortage-cost-input");
        this.warehouseCostInput = document.getElementById("warehouse-cost-input");
        this.maxOrderingUnitInput = document.getElementById("max-ordering-unit-input");
        this.maxStoreUnitInput = document.getElementById("max-store-unit-input");
        this.aprInput = document.getElementById("auunal-percentage-rate-input");
        this.initAllInputValue();
    }
    static addShiftBtnListener() {
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
    static genSalesData() {
        if (Main.dailySalesData !== undefined)
            Main.dailySalesData.length = 0; // prevent memory leaks
        if (Main.dayToSimulateInput instanceof HTMLInputElement && Main.distributionTypeMenu instanceof HTMLSelectElement) {
            let dayToSimulate = parseInt(Main.dayToSimulateInput.value);
            Main.dailySalesData = [["Day", "Sales"]];
            let selectedDistribution = Main.DISTRIBUTION[Main.distributionTypeMenu.value];
            let params = [];
            for (let eachParam in selectedDistribution.param) {
                let paramInputDiv = document.getElementById(`${Main.distributionTypeMenu.value}-${eachParam}-input`);
                if (paramInputDiv instanceof HTMLInputElement) {
                    params.push(parseFloat(paramInputDiv.value));
                }
            }
            for (let i = 1; i <= dayToSimulate; i++) {
                Main.dailySalesData.push([i, Math.max(0, Math.round(selectedDistribution.dataGeneratorFunction(...params)))]);
            }
            Main.timeSeriesSalesChart.drawChart(Main.dailySalesData);
            Main.salesDistributionChart.drawChart(Main.dailySalesData);
        }
    }
    static genDistributionParamField() {
        if (Main.distributionParamField instanceof HTMLElement && Main.distributionTypeMenu instanceof HTMLSelectElement) {
            let selectedDistribution = Main.DISTRIBUTION[Main.distributionTypeMenu.value];
            Main.distributionParamField.innerHTML = "";
            for (let eachParam in selectedDistribution.param) {
                let label = document.createElement("label");
                label.setAttribute("for", eachParam);
                label.innerHTML = eachParam;
                let input = document.createElement("input");
                input.name = eachParam;
                input.type = "number";
                input.id = `${Main.distributionTypeMenu.value}-${eachParam}-input`;
                input.value = selectedDistribution.param[eachParam].defaultVal;
                label.appendChild(input);
                Main.distributionParamField.appendChild(label);
            }
        }
    }
    static genInventoryPolicyDescription() {
        if (Main.inventoryPolicyDescription instanceof HTMLElement && Main.inventoryPolicyMenu instanceof HTMLSelectElement) {
            let selectedPolicy = Main.INVENTORYPOLICY[Main.inventoryPolicyMenu.value];
            Main.inventoryPolicyDescription.innerHTML = selectedPolicy.description;
        }
    }
    static initAllInputValue() {
        if (Main.dayToSimulateInput instanceof HTMLInputElement && Main.materialCostInput instanceof HTMLInputElement && Main.shippingCostInput instanceof HTMLInputElement && Main.shortageCostInput instanceof HTMLInputElement && Main.warehouseCostInput instanceof HTMLInputElement && Main.maxOrderingUnitInput instanceof HTMLInputElement && Main.maxStoreUnitInput instanceof HTMLInputElement && Main.aprInput instanceof HTMLInputElement) {
            Main.dayToSimulateInput.value = "365";
            Main.materialCostInput.value = "500";
            Main.shippingCostInput.value = "30";
            Main.shortageCostInput.value = "100";
            Main.warehouseCostInput.value = "1000";
            Main.maxOrderingUnitInput.value = "100";
            Main.maxStoreUnitInput.value = "1000";
            Main.aprInput.value = "0.005";
        }
    }
}
Main.DISTRIBUTION = {
    normal: {
        param: {
            "mu": { defaultVal: 200 },
            "std": { defaultVal: 200 / 4 }
        },
        dataGeneratorFunction: MyMath.normalSample
    },
    poisson: {
        param: { "lambda": { defaultVal: 200 } },
        dataGeneratorFunction: MyMath.poissonSample
    },
    uniform: {
        param: {
            "min": { defaultVal: 0 },
            "max": { defaultVal: 600 }
        },
        dataGeneratorFunction: MyMath.uniformSample
    },
};
Main.INVENTORYPOLICY = {
    qr: {
        description: "Order Q units if current inventory <= R. Do nothing otherwise."
    },
};
Main.main();
