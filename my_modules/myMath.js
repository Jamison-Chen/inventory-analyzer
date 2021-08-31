export class MyMath {
    static avg(arr) {
        return arr.length === 0
            ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;
    }
    static factorial(x) {
        if (x === 0)
            return 1;
        console.log(x);
        return x * MyMath.factorial(x - 1);
    }
    static normalSample(mu, std) {
        let u = 0, v = 0;
        while (u === 0)
            u = Math.random(); //Converting [0,1) to (0,1)
        while (v === 0)
            v = Math.random();
        return std * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) + mu;
        // return (Math.E ** (-0.5 * (((u - mu) / std) ** 2))) / (std * ((2 * Math.PI) ** 0.5));
    }
    static poissonSample(lambda) {
        let L = Math.exp(-lambda);
        let p = 1;
        let k = 0;
        do {
            k++;
            p *= Math.random();
        } while (p > L);
        return k - 1;
    }
    static uniformSample(min, max) {
        let u = 0;
        while (u === 0)
            u = Math.random(); //Converting [0,1) to (0,1)
        return u * (max - min) + min;
    }
}
