export type FlowStep =
  | "welcome"
  | "zodiac-transition"
  | "birthday"
  | "personal"
  | "month"
  | "upcoming";

export type FlowLandmark = FlowStep;

export interface FlowState {
  step: FlowStep;
  birthday: string | null;
  validationError: string | null;
}

export type FlowAction =
  | { type: "advance" }
  | { type: "skip-to-month" }
  | { type: "submit-birthday"; value: string };

export function createInitialFlow(): FlowState {
  return {
    step: "welcome",
    birthday: null,
    validationError: null,
  };
}

export function transitionFlow(
  state: FlowState,
  action: FlowAction,
): FlowState {
  if (action.type === "skip-to-month") {
    return {
      step: "month",
      birthday: null,
      validationError: null,
    };
  }

  if (action.type === "submit-birthday") {
    if (state.step !== "birthday") {
      return state;
    }

    if (!isValidBirthday(action.value)) {
      return {
        ...state,
        birthday: null,
        validationError: "Enter a valid date in MM/DD/YYYY format.",
      };
    }

    return {
      step: "personal",
      birthday: action.value,
      validationError: null,
    };
  }

  const nextStep: Record<FlowStep, FlowStep> = {
    welcome: "zodiac-transition",
    "zodiac-transition": "birthday",
    birthday: "birthday",
    personal: "month",
    month: "upcoming",
    upcoming: "upcoming",
  };

  return {
    ...state,
    step: nextStep[state.step],
    validationError: null,
  };
}

export function visibleLandmarksForFlow(
  state: FlowState,
): readonly FlowLandmark[] {
  switch (state.step) {
    case "personal":
      return ["personal", "month", "upcoming"];
    case "month":
      return ["month", "upcoming"];
    default:
      return [state.step];
  }
}

function isValidBirthday(value: string): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) {
    return false;
  }

  const [, monthText, dayText, yearText] = match;
  const month = Number(monthText);
  const day = Number(dayText);
  const year = Number(yearText);

  if (year < 1000 || month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  const candidate = new Date(0);
  candidate.setUTCHours(12, 0, 0, 0);
  candidate.setUTCFullYear(year, month - 1, day);

  return (
    candidate.getUTCFullYear() === year &&
    candidate.getUTCMonth() === month - 1 &&
    candidate.getUTCDate() === day &&
    candidate.getTime() <= Date.now()
  );
}
