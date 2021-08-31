import { MyMath } from "./myMath.js";
import { SalesDistributionChart, TimeSeriesSalesChart } from "./chart.js";
class Main {
    public static salesChartFieldInside: HTMLElement | null;
    public static leftShiftBtn: HTMLElement | null;
    public static rigthShiftBtn: HTMLElement | null;
    public static distributionTypeMenu: HTMLElement | null;
    public static distributionParamField: HTMLElement | null;
    public static dayToSimulateInput: HTMLElement | null;
    public static salesDistributionChartDiv: HTMLElement | null;
    public static timeSeriesSalesChartDiv: HTMLElement | null;
    // public static costAnalysisChartDiv: HTMLElement | null;
    public static genSalesDataBtn: HTMLElement | null;
    public static salesDistributionChart: SalesDistributionChart;
    public static timeSeriesSalesChart: TimeSeriesSalesChart;
    public static dailySalesData: (string | number)[][];
    public static inventoryPolicyMenu: HTMLElement | null;
    public static inventoryPolicyDescription: HTMLElement | null;
    public static materialCostInput: HTMLElement | null;
    public static shippingCostInput: HTMLElement | null;
    public static shortageCostInput: HTMLElement | null;
    public static warehouseCostInput: HTMLElement | null;
    public static maxOrderingUnitInput: HTMLElement | null;
    public static maxStoreUnitInput: HTMLElement | null;
    public static aprInput: HTMLElement | null;

    public static DISTRIBUTION: any = {
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
    public static INVENTORYPOLICY: any = {
        qr: {
            description: "Order Q units if current inventory <= R. Do nothing otherwise."
        },
    };

    public static main(): void {
        this.salesChartFieldInside =
            document.getElementById("sales-chart-field-inside");
        // this.costAnalysisChartContainer =
        //     document.getElementById("cost-analysis-chart-container");
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
        this.timeSeriesSalesChart = new TimeSeriesSalesChart(this.timeSeriesSalesChartDiv);
        this.genSalesDataBtn = document.getElementById("generate-sales-data-btn");
        this.genSalesDataBtn?.addEventListener("click", this.genSalesData);

        this.inventoryPolicyMenu = document.getElementById("inventory-policy-menu");
        this.inventoryPolicyDescription = document.getElementById("inventory-policy-description");
        this.inventoryPolicyMenu?.addEventListener("click", this.genInventoryPolicyDescription);
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
    public static genSalesData(): void {
        if (Main.dailySalesData !== undefined) Main.dailySalesData.length = 0;  // prevent memory leaks
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
        if (Main.inventoryPolicyDescription instanceof HTMLElement && Main.inventoryPolicyMenu instanceof HTMLSelectElement) {
            let selectedPolicy = Main.INVENTORYPOLICY[Main.inventoryPolicyMenu.value];
            Main.inventoryPolicyDescription.innerHTML = selectedPolicy.description;
        }
    }
    public static initAllInputValue(): void {
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

Main.main();