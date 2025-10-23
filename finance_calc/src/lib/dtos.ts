export enum LoanType {
	fixedDownpayment = 'fixedDownpayment',
	fixedMonthlyPayment = 'fixedMonthlyPayment'
}

export type Event = {
	startPeriod: number;
};

export type OneTimeEvent = Event & {
	name: string;
	amount: number;
};

export type Loan = Event & {
	name: string;
	amount: number;
	interrestPercent: number;
	type: LoanType;
	remaining: number;
	lengthInMonths: number;
	monthlyPayment: number;
};

export type Investment = Event & {
	name: string;
	start: number;
	monthly: number;
	lengthInMonths: number;
	yieldPercent: number;
};

export type CalculatorState = {
	loans: Loan[];
	investments: Investment[];
	oneTimeEvents: OneTimeEvent[];
	inflationPercent: number;
	taxGainInvestments: number; // 0.3784
	taxOnInterrest: number; // 0.22
	income: number;
	expenses: number;
	interestRateCash: number;
	minLengthInMonths: number;
};

export type MonthlyLoanResult = {
	index: number;
	paid: number;
	interest: number;
	taxToBePaid: number;
	balance: number;
};
export type MonthlyInvestmentResult = {
	index: number;
	interest: number;
	payment: number;
	balance: number;
	taxToBePaid: number;
};

export type MonthlyResult = {
	period: number;
	income: number;
	expenses: number;
	loanResults: MonthlyLoanResult[];
	investmentResults: MonthlyInvestmentResult[];
	result: number;
	interest: number;
	taxToBePaidForSavings: number;
	savings: number;
	balance: number;
};

export type CalculationResult = {
	monthly: MonthlyResult[];
};
