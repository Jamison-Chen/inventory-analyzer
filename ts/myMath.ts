export class MyMath {
    public static avg(arr: number[]): number {
        return arr.length === 0
            ? 0 : arr.reduce((a: number, b: number) => a + b, 0) / arr.length;
    }
    public static factorial(x: number): number {
        if (x === 0) return 1;
        console.log(x);
        return x * MyMath.factorial(x - 1);
    }
    public static normalSample(mu: number, std: number): number {
        let u = 0, v = 0;
        while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while (v === 0) v = Math.random();
        return std * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) + mu;
        // return (Math.E ** (-0.5 * (((u - mu) / std) ** 2))) / (std * ((2 * Math.PI) ** 0.5));
    }
    public static poissonSample(lambda: number): number {
        let L = Math.exp(-lambda);
        let p = 1;
        let k = 0;
        do {
            k++;
            p *= Math.random();
        } while (p > L);
        return k - 1;
    }
    public static uniformSample(min: number, max: number): number {
        let u = 0;
        while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        return u * (max - min) + min;
    }
}