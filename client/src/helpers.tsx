export function calculateBMI(height: number, weight: number) {
  return weight / ((height * height) / 10000);
}

//function to calculate calories burn
// weight x MET x 0.0175 x Mins
export function calculateTotalCalories(weight: number, exer: string, mins: number) {
  let MET: number = 0;
  switch (exer) {
    case "squats":
      MET = 5.5;
      break;
    case "push-ups":
      MET = 8;
      break;
    case "lunges":
      MET = 6;
      break;
    case "jumping-jacks":
      MET = 8;
      break;
    case "side-squats":
      MET = 6;
      break;
  }
  return weight * MET * 0.0175 * mins; //total calories of an exercise
}

export function calculateRepCalories(weight: number, exer: string, mins: number) {
  return calculateTotalCalories(weight, exer, mins) / mins / 30; //calories burnt per repetition
}

export function calculateSetTime(reps: number, rest: number) {
  const restSeconds = rest * 60;
  return Math.round((reps * 2 + restSeconds) / 60);
}
