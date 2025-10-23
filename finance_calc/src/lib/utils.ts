import type { Loan } from './dtos';

export function PMT(ir: number, np: number, pv: number, fv: number = 0, type: number = 0) {
	/*
	 * ir   - interest rate per month
	 * np   - number of periods (months)
	 * pv   - present value
	 * fv   - future value
	 * type - when the payments are due:
	 *        0: end of the period, e.g. end of month (default)
	 *        1: beginning of period
	 */
	var pmt, pvif;

	fv || (fv = 0);
	type || (type = 0);

	if (ir === 0) return -(pv + fv) / np;

	pvif = Math.pow(1 + ir, np);
	pmt = (-ir * (pv * pvif + fv)) / (pvif - 1);

	if (type === 1) pmt /= 1 + ir;

	return round100(pmt);
}

export const calcPMT = (loan: Loan): Loan => {
	if (loan.type === 'fixedMonthlyPayment') {
		return {
			...loan,
			monthlyPayment: PMT(
				loan.interrestPercent / 12,
				loan.lengthInMonths,
				loan.amount,
				loan.remaining
			)
		};
	} else {
		return loan;
	}
};

export function round100(x: number): number {
	return Math.round((x + Number.EPSILON) * 100) / 100;
}
export function round1(x: number): number {
	return Math.round(x + Number.EPSILON);
}

export function numberWithCommas(x: number) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function monthString(addMonth: number): string {
	let d = new Date();
	d.setMonth(d.getMonth() + addMonth);
	let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
	let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
	return `${year}-${month}`;
}
