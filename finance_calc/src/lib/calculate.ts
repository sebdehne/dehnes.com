import type {
	CalculationResult,
	CalculatorState,
	Investment,
	Loan,
	MonthlyInvestmentResult,
	MonthlyLoanResult,
	MonthlyResult
} from './dtos';
import { round100 } from '$lib/utils';

export const calculate = (state: CalculatorState): CalculationResult => {
	let calculated: CalculationResult = {
		monthly: []
	};

	let end = state.minLengthInMonths;
	state.loans.forEach((loan) => {
		const lEnd = loan.startPeriod + loan.lengthInMonths;
		if (lEnd > end) {
			end = lEnd;
		}
	});
	state.oneTimeEvents.forEach((e) => {
		if (end < e.startPeriod) {
			end = e.startPeriod;
		}
	});

	for (let currentMonth = 0; currentMonth <= end; currentMonth++) {
		if (currentMonth > 1200) break;

		const previous: MonthlyResult =
			currentMonth === 0
				? {
						period: -1,
						income: state.income,
						expenses: state.expenses * -1,
						savings: 0,
						interest: 0,
						taxToBePaidForSavings: 0,
						loanResults: [],
						investmentResults: [],
						result: 0,
						balance: 0
					}
				: calculated.monthly[currentMonth - 1];

		let m: MonthlyResult = {
			period: currentMonth,
			income: 0,
			expenses: 0,
			loanResults: [],
			investmentResults: [],
			savings: 0,
			interest: 0,
			taxToBePaidForSavings: 0,
			result: 0,
			balance: 0
		};
		calculated.monthly.push(m);

		state.loans.forEach((loan: Loan, index) => {
			if (currentMonth < loan.startPeriod) {
				return;
			}

			const previous: MonthlyLoanResult =
				currentMonth === loan.startPeriod
					? {
							balance: loan.amount,
							index: index,
							interest: 0,
							taxToBePaid: 0,
							paid: 0
						}
					: calculated.monthly[currentMonth - 1].loanResults[index];

			if (!previous) return;

			let l: MonthlyLoanResult = {
				index,
				interest: 0,
				balance: 0,
				taxToBePaid: 0,
				paid: 0
			};

			if (loan.type === 'fixedMonthlyPayment') {
				if (currentMonth < loan.lengthInMonths) {
					l.interest = round100(previous.balance * (loan.interrestPercent / 12));
					l.paid = loan.monthlyPayment;
					l.balance = previous.balance + l.paid + l.interest;
					l.taxToBePaid = round100(l.interest * state.taxOnInterrest) * -1;
					m.loanResults.push(l);
				} else if (currentMonth === loan.lengthInMonths) {
					// end reached
					l.interest = 0;
					l.paid = previous.balance * -1;
					l.balance = 0;
					l.taxToBePaid = 0;
					m.loanResults.push(l);
				}
			} else {
				if (previous.balance < 0) {
					// still going
					l.interest = round100(previous.balance * (loan.interrestPercent / 12));
					l.paid = l.interest * -1 + loan.monthlyPayment;
					l.balance = previous.balance + l.paid + l.interest;
					l.taxToBePaid = round100(l.interest * state.taxOnInterrest);
					m.loanResults.push(l);
				} else {
					// end reached
					l.interest = 0;
					l.paid = previous.balance * -1;
					l.balance = 0;
					l.taxToBePaid = 0;
					m.loanResults.push(l);
				}
			}
		});
		state.investments.forEach((investment: Investment, index) => {
			const previous: MonthlyInvestmentResult =
				currentMonth === 0
					? {
							balance: investment.start,
							index,
							payment: investment.monthly,
							interest: 0,
							taxToBePaid: 0
						}
					: calculated.monthly[currentMonth - 1].investmentResults[index];

			if (!previous) return;
			let l: MonthlyInvestmentResult = {
				index,
				interest: 0,
				taxToBePaid: 0,
				balance: 0,
				payment: 0
			};

			if (currentMonth < investment.lengthInMonths) {
				l.interest = round100(previous.balance * (investment.yieldPercent / 12));
				l.payment = round100(previous.payment * (1 + state.inflationPercent / 12));
				l.balance = round100(previous.balance + l.payment + l.interest);
				l.taxToBePaid = round100(l.interest * state.taxGainInvestments) * -1;

				m.investmentResults.push(l);
			} else if (currentMonth === investment.lengthInMonths) {
				l.payment = previous.balance * -1;
				m.investmentResults.push(l);
			}
		});

		// monthly result
		const payedLoans =
			m.loanResults.reduce((previousValue, currentValue) => previousValue + currentValue.paid, 0) *
			-1;
		const payedInvestments =
			m.investmentResults.reduce(
				(previousValue, currentValue) => previousValue + currentValue.payment,
				0
			) * -1;
		const taxToBePaidInvestments = m.investmentResults.reduce(
			(previousValue, currentValue) => previousValue + currentValue.taxToBePaid,
			0
		);
		const taxToBePaidInterrestLoans = m.loanResults.reduce(
			(previousValue, currentValue) => previousValue + currentValue.taxToBePaid,
			0
		);

		const oneTimeAmounts = state.oneTimeEvents
			.filter((e) => e.startPeriod === currentMonth)
			.reduce((l, e) => l + e.amount, 0);

		m.income = round100(previous.income * (1 + state.inflationPercent / 12));
		m.expenses = round100(previous.expenses * (1 + state.inflationPercent / 12));
		m.interest = round100(previous.savings * (state.interestRateCash / 12));
		m.taxToBePaidForSavings = round100(m.interest * state.taxOnInterrest) * -1;
		m.result = round100(
			m.income +
				m.expenses +
				payedLoans +
				payedInvestments +
				m.taxToBePaidForSavings +
				taxToBePaidInvestments +
				taxToBePaidInterrestLoans +
				oneTimeAmounts
		);
		m.savings = round100(previous.savings + m.result);

		const loanBalances = m.loanResults.reduce(
			(previousValue, currentValue) => previousValue + currentValue.balance,
			0
		);
		const investmentBalances = m.investmentResults.reduce(
			(previousValue, currentValue) => previousValue + currentValue.balance,
			0
		);

		m.balance = round100(investmentBalances + m.savings + loanBalances);
	}

	return calculated;
};
