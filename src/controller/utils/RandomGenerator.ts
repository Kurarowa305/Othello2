export type RandomGenerator = () => number;

export const defaultRandomGenerator: RandomGenerator = Math.random;
