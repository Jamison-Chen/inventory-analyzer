export class MyGoogleChart {
    constructor(chartDiv) {
        this._chartDiv = chartDiv;
    }
}
export class TimeSeriesSalesChart extends MyGoogleChart {
    constructor(chartDiv) {
        super(chartDiv);
        google.charts.load('current', { packages: ["corechart"] });
        google.charts.setOnLoadCallback(() => {
            this._chart = new google.visualization["LineChart"](chartDiv);
        });
    }
    drawChart(dataIn) {
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
        }
        else
            setTimeout(() => this.drawChart(dataIn), 50);
    }
}
export class SalesDistributionChart extends MyGoogleChart {
    constructor(chartDiv) {
        super(chartDiv);
        google.charts.load('current', { 'packages': ["corechart"] });
        google.charts.setOnLoadCallback(() => {
            this._chart = new google.visualization["Histogram"](chartDiv);
        });
    }
    drawChart(dataIn) {
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
        }
        else
            setTimeout(() => this.drawChart(dataIn), 50);
    }
}
