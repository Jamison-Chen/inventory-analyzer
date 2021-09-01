export class MyGoogleChart {
    protected _chart: any;
    protected _chartDiv: HTMLElement;
    public constructor(chartDiv: any) {
        this._chartDiv = chartDiv;
    }
}

export class TimeSeriesSalesChart extends MyGoogleChart {
    public constructor(chartDiv: any) {
        super(chartDiv);
        google.charts.load('current', { packages: ["corechart"] });
        google.charts.setOnLoadCallback(() => {
            this._chart = new google.visualization["LineChart"](chartDiv);
        });
    }
    public drawChart(dataIn: (string | number)[][]): void {
        if (google.visualization !== undefined && this._chart !== undefined) {
            let data = google.visualization.arrayToDataTable(dataIn);
            let options = {
                title: 'Historical Sales Data',
                titleTextStyle: {
                    fontSize: 18,
                    bold: false,
                    color: "#000"
                },
                curveType: 'none',
                legend: { position: 'none' },
                hAxis: {
                    title: "",
                },
                vAxis: {
                    minValue: 0
                },
                chartArea: { left: "16%", top: "15%", width: '70%', height: '70%' }
            };
            this._chart.draw(data, options);
        } else setTimeout(() => this.drawChart(dataIn), 50);
    }
}

export class SalesDistributionChart extends MyGoogleChart {
    public constructor(chartDiv: any) {
        super(chartDiv);
        google.charts.load('current', { 'packages': ["corechart"] });
        google.charts.setOnLoadCallback(() => {
            this._chart = new google.visualization["Histogram"](chartDiv);
        });
    }
    public drawChart(dataIn: (string | number)[][]): void {
        if (google.visualization !== undefined && this._chart !== undefined) {
            let data = google.visualization.arrayToDataTable(dataIn.map(val => [val[1]]));
            let options = {
                title: 'Sales Distribution',
                legend: { position: 'none' },
                titleTextStyle: {
                    fontSize: 18,
                    bold: false,
                    color: "#000"
                },
                colors: ['#37e'],
                bar: { gap: 0 },
                histogram: {
                    maxNumBuckets: 10,
                    minValue: 0,
                },
                hAxis: {
                    viewWindow: { min: 0 }
                },
                chartArea: { left: "16%", top: "15%", width: '70%', height: '70%' },
            };
            this._chart.draw(data, options);
        } else setTimeout(() => this.drawChart(dataIn), 50);
    }
}

export class CostAnalysisChart extends MyGoogleChart {
    public constructor(chartDiv: any) {
        super(chartDiv);
        google.charts.load('current', { packages: ["corechart"] });
        google.charts.setOnLoadCallback(() => {
            this._chart = new google.visualization["LineChart"](chartDiv);
        });
    }
    public drawChart(title: string, dataIn: (string | number)[][]): void {
        if (google.visualization !== undefined && this._chart !== undefined) {
            let data = google.visualization.arrayToDataTable(dataIn);
            let options = {
                title: title,
                titleTextStyle: {
                    fontSize: 18,
                    bold: false,
                    color: "#000"
                },
                curveType: 'none',
                hAxis: {
                    title: "R",
                },
                vAxis: {
                    // minValue: 0
                },
                chartArea: { left: "16%", top: "15%", width: '64%', height: '70%' }
            };
            this._chart.draw(data, options);
        } else setTimeout(() => this.drawChart(title, dataIn), 50);
    }
}