import { IEvalStrategy } from "./IEvalStrategy";
import { Board } from "../../model/Board";
import { Position } from "../../types/Position";
import { StoneColor } from "../../types/StoneColor";
import { RandomGenerator } from "../utils/RandomGenerator";

export class RandomEval implements IEvalStrategy {
  private readonly rng: RandomGenerator;


  public constructor(rng: RandomGenerator = Math.random) {
    this.rng = rng;
  }

  
  public evaluate(_: Board, __: StoneColor, ___: Position): number {
    return this.rng(); // 0 ≦ x < 1
  }
}
