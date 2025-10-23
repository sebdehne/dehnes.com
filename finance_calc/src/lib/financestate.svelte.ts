import {
	type CalculatorState,
	type Investment,
	type Loan,
	LoanType,
	type OneTimeEvent
} from './dtos';
import { calcPMT, PMT } from '$lib/utils';

const defaultState: CalculatorState = {
	income: 30000,
	expenses: 25000,
	interestRateCash: 0.03,
	inflationPercent: 0.03,
	loans: [],
	investments: [],
	oneTimeEvents: [],
	taxOnInterrest: 0.22,
	taxGainInvestments: 0.3784,
	minLengthInMonths: 300
};

const defaultLoan: Loan = {
	name: 'Boliglån',
	startPeriod: 0,
	amount: -3000000,
	interrestPercent: 0.05,
	type: LoanType.fixedMonthlyPayment,
	remaining: 0,
	lengthInMonths: 25 * 12,
	monthlyPayment: 10000
};

const defaultOneTimeEvent: OneTimeEvent = {
	name: 'One time event',
	startPeriod: 0,
	amount: 0
};

const defaultInvestment: Investment = {
	name: 'Fond sparing',
	startPeriod: 0,
	lengthInMonths: 25 * 12,
	monthly: 5000,
	start: 0,
	yieldPercent: 0.06
};

let myStateObj = $state<CalculatorState>(defaultState);

export const MyFinanceState = () => {
	return {
		financeState: myStateObj,
		changeMinLengthInMonths: (input: number) => {
			myStateObj.minLengthInMonths = input;
		},
		changeIncoming: (input: number) => {
			myStateObj.income = input;
		},
		changeExpenses: (input: number) => {
			myStateObj.expenses = input;
		},
		changeInterestRateCash: (input: number) => {
			myStateObj.interestRateCash = input;
		},
		changeInflationPercent: (input: number) => {
			myStateObj.inflationPercent = input;
		},
		changeTaxGainSavings: (input: number) => {
			myStateObj.taxGainInvestments = input;
		},
		changeTaxDeducationLoanInterrest: (input: number) => {
			myStateObj.taxOnInterrest = input;
		},
		addLoan: () => {
			myStateObj.loans.push(calcPMT(defaultLoan));
		},
		removeLoan: (i: number) => {
			myStateObj.loans = myStateObj.loans.toSpliced(i, 1);
		},

		changeLoanName: (i: number, n: string) => {
			myStateObj.loans[i] = calcPMT({
				...myStateObj.loans[i],
				name: n
			});
		},
		changeLoanStartPeriode: (i: number, n: number) => {
			myStateObj.loans[i].startPeriod = n;
		},
		changeLoanAmount: (i: number, amount: number) => {
			myStateObj.loans[i] = calcPMT({
				...myStateObj.loans[i],
				amount: amount
			});
		},
		changeLoanInterrestPercent: (i: number, amount: number) => {
			myStateObj.loans[i] = calcPMT({
				...myStateObj.loans[i],
				interrestPercent: amount
			});
		},
		changeLoanType: (i: number, type: string) => {
			myStateObj.loans[i].type = type as LoanType;
			if (myStateObj.loans[i].type === 'fixedMonthlyPayment') {
				myStateObj.loans[i].monthlyPayment = PMT(
					myStateObj.loans[i].interrestPercent / 12,
					myStateObj.loans[i].lengthInMonths!,
					myStateObj.loans[i].amount,
					myStateObj.loans[i].remaining
				);
			}
		},
		changeLoanRemaining: (i: number, amount: number) => {
			myStateObj.loans[i] = calcPMT({
				...myStateObj.loans[i],
				remaining: amount
			});
		},
		changeLoanLengthInMonths: (i: number, n: number) => {
			myStateObj.loans[i] = calcPMT({
				...myStateObj.loans[i],
				lengthInMonths: n
			});
		},
		changeMonthlyPayment: (i: number, n: number) => {
			myStateObj.loans[i] = calcPMT({
				...myStateObj.loans[i],
				monthlyPayment: n
			});
		},

		addInvestment: () => {
			myStateObj.investments.push(defaultInvestment);
		},
		removeInvestment: (i: number) => {
			myStateObj.investments = myStateObj.investments.toSpliced(i, 1);
		},
		changeInvestmentStartPeriode: (input: number, s: number) => {
			myStateObj.investments[input].startPeriod = s;
		},
		changeInvestmentName: (input: number, s: string) => {
			myStateObj.investments[input].name = s;
		},
		changeInvestmentStart: (input: number, s: number) => {
			myStateObj.investments[input].start = s;
		},
		changeInvestmentMonthly: (input: number, s: number) => {
			myStateObj.investments[input].monthly = s;
		},
		changeInvestmentLengthInMonths: (input: number, s: number) => {
			myStateObj.investments[input].lengthInMonths = s;
		},
		changeInvestmentYieldPercent: (input: number, s: number) => {
			myStateObj.investments[input].yieldPercent = s;
		},

		addOneTimeEvent: () => {
			myStateObj.oneTimeEvents[myStateObj.oneTimeEvents.length] = defaultOneTimeEvent;
		},
		removeOneTimeEvent: (index: number) => {
			myStateObj.oneTimeEvents = myStateObj.oneTimeEvents.toSpliced(index, 1);
		},
		changeOneTimeEventName: (input: number, s: string) => {
			myStateObj.oneTimeEvents[input].name = s;
		},
		changeOneTimeEventStartPeriode: (input: number, s: number) => {
			myStateObj.oneTimeEvents[input].startPeriod = s;
		},
		changeOneTimeEventAmount: (input: number, s: number) => {
			myStateObj.oneTimeEvents[input].amount = s;
		}
	};
};
