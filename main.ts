class Main {
    public timeSeriesSalesChartContainer: HTMLElement | null;
    public salesDistributionChartContainer: HTMLElement | null;
    public costAnalysisChartContainer: HTMLElement | null;
    public constructor() {
        this.timeSeriesSalesChartContainer =
            document.getElementById("time-series-sales-chart-container");
        this.salesDistributionChartContainer =
            document.getElementById("sales-distribution-chart-container");
        this.costAnalysisChartContainer =
            document.getElementById("cost-analysis-chart-container");
    }
}