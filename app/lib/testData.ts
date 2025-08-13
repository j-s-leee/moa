// 타입 정의
export interface MonthlyIncome {
  id: string;
  name: string;
  amount: number;
  effectiveFrom: string;
}

export interface MonthlyExpense {
  id: string;
  name: string;
  amount: number;
  effectiveFrom: string;
}

export interface IrregularCategory {
  id: string;
  name: string;
  annualBudget: number;
  year: number;
  spent: number;
}

export interface IrregularExpense {
  id: string;
  categoryId: string;
  amount: number;
  description: string;
  date: string;
}

export interface SavingsGoal {
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

// 초기 데이터
export const initialMonthlyIncomes: MonthlyIncome[] = [
  { id: "1", name: "주급여", amount: 3500000, effectiveFrom: "2025-01-01" },
  { id: "2", name: "부업", amount: 500000, effectiveFrom: "2025-01-01" },
];

export const initialMonthlyExpenses: MonthlyExpense[] = [
  { id: "1", name: "주거비", amount: 800000, effectiveFrom: "2025-01-01" },
  { id: "2", name: "식비", amount: 400000, effectiveFrom: "2025-01-01" },
  { id: "3", name: "교통비", amount: 150000, effectiveFrom: "2025-01-01" },
  { id: "4", name: "통신비", amount: 80000, effectiveFrom: "2025-01-01" },
];

export const irregularCategories: IrregularCategory[] = [
  { id: "1", name: "여행", annualBudget: 2000000, year: 2025, spent: 0 },
  { id: "2", name: "운동", annualBudget: 600000, year: 2025, spent: 0 },
  {
    id: "3",
    name: "문화생활",
    annualBudget: 800000,
    year: 2025,
    spent: 0,
  },
  {
    id: "4",
    name: "경조사비",
    annualBudget: 400000,
    year: 2025,
    spent: 0,
  },
];

export const initialIrregularExpenses: IrregularExpense[] = [
  {
    id: "1",
    categoryId: "1",
    amount: 500000,
    description: "제주도 여행",
    date: "2025-01-15",
  },
  {
    id: "2",
    categoryId: "1",
    amount: 200000,
    description: "부산 여행",
    date: "2025-01-20",
  },
  {
    id: "3",
    categoryId: "2",
    amount: 80000,
    description: "헬스장 등록",
    date: "2025-01-10",
  },
  {
    id: "4",
    categoryId: "2",
    amount: 100000,
    description: "운동용품 구매",
    date: "2025-01-25",
  },
  {
    id: "9",
    categoryId: "2",
    amount: 5000000,
    description: "PT",
    date: "2025-06-25",
  },
  {
    id: "5",
    categoryId: "3",
    amount: 150000,
    description: "영화/공연 관람",
    date: "2025-01-12",
  },
  {
    id: "6",
    categoryId: "3",
    amount: 170000,
    description: "전시회/박물관",
    date: "2025-01-28",
  },
  {
    id: "7",
    categoryId: "4",
    amount: 100000,
    description: "결혼식 축의금",
    date: "2025-01-18",
  },
  {
    id: "8",
    categoryId: "1",
    amount: 1000000,
    description: "일본 여행",
    date: "2025-03-30",
  },
  {
    id: "10",
    categoryId: "2",
    amount: 1000000,
    description: "헬스장 등록",
    date: "2025-06-30",
  },
  {
    id: "11",
    categoryId: "2",
    amount: 1000000,
    description: "헬스장 등록",
    date: "2025-07-01",
  },
  {
    id: "12",
    categoryId: "2",
    amount: 1000000,
    description: "헬스장 등록",
    date: "2025-07-02",
  },
  {
    id: "13",
    categoryId: "2",
    amount: 1000000,
    description: "헬스장 등록",
    date: "2025-07-03",
  },
  {
    id: "14",
    categoryId: "2",
    amount: 1000000,
    description: "헬스장 등록",
    date: "2025-07-04",
  },
  {
    id: "15",
    categoryId: "2",
    amount: 1000000,
    description: "헬스장 등록",
    date: "2025-07-05",
  },
];

export const savingsGoal: SavingsGoal = {
  targetAmount: 50000000,
  currentAmount: 8500000,
  deadline: "2026-12-31",
};

// 유틸리티 함수들
export const getTotalMonthlyIncome = (incomes: MonthlyIncome[]) => {
  return incomes.reduce((sum, income) => sum + income.amount, 0);
};

export const getTotalMonthlyExpenses = (expenses: MonthlyExpense[]) => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

export const getTotalIrregularBudget = (categories: IrregularCategory[]) => {
  return categories.reduce((sum, cat) => sum + cat.annualBudget, 0);
};

export const getCategorySpent = (
  categoryId: string,
  expenses: IrregularExpense[]
) => {
  return expenses
    .filter((expense) => expense.categoryId === categoryId)
    .reduce((sum, expense) => sum + expense.amount, 0);
};

export const calculateMonthlySavingsPotential = (
  monthlyIncomes: MonthlyIncome[],
  monthlyExpenses: MonthlyExpense[],
  irregularCategories: IrregularCategory[]
) => {
  const totalIncome = getTotalMonthlyIncome(monthlyIncomes);
  const totalExpenses = getTotalMonthlyExpenses(monthlyExpenses);
  const monthlyIrregularBudget =
    getTotalIrregularBudget(irregularCategories) / 12;

  return totalIncome - totalExpenses - monthlyIrregularBudget;
};

export const calculateMonthsToGoal = (
  savingsGoal: SavingsGoal,
  monthlySavingsPotential: number
) => {
  const remainingGoal = savingsGoal.targetAmount - savingsGoal.currentAmount;
  return Math.ceil(remainingGoal / monthlySavingsPotential);
};
