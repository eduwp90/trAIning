export interface ISet {
  exer: string;
  reps: number;
  rest: number;
}

export interface IWorkout{
  user: string;
  name: string;
  workout: ISet[];
}