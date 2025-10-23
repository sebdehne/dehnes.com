<script>
	import TextInput from '$lib/TextInput.svelte';
	import { MyFinanceState } from '$lib/financestate.svelte';
	import SelectInput from '$lib/SelectInput.svelte';
	import ResultTable from '$lib/ResultTable.svelte';
    import {calculate} from "$lib/calculate.js";
    import {LoanType} from "$lib/dtos.js";

	const digitsWithDecimalOnly = /^-?[0-9]+(\.[0-9]+)?$/;
	const digitsOnly = /^[0-9]+$/;

	const {
		financeState,
		changeIncoming,
		changeMinLengthInMonths,
		changeExpenses,
		changeInterestRateCash,
		changeInflationPercent,
		changeTaxGainSavings,
		changeTaxDeducationLoanInterrest,
		addLoan,
		removeLoan,
		changeLoanName,
        changeLoanStartPeriode,
		changeLoanAmount,
		changeLoanInterrestPercent,
		changeLoanType,
		changeLoanRemaining,
		changeLoanLengthInMonths,
		changeMonthlyPayment,
		addInvestment,
		removeInvestment,
		changeInvestmentLengthInMonths,
		changeInvestmentMonthly,
        changeInvestmentStartPeriode,
		changeInvestmentName,
		changeInvestmentStart,
		changeInvestmentYieldPercent,

        addOneTimeEvent,
        removeOneTimeEvent,
        changeOneTimeEventName,
        changeOneTimeEventStartPeriode,
        changeOneTimeEventAmount
	} = MyFinanceState();

	const calculationResult = $derived.by(() => {
		console.log('financeState', $state.snapshot(financeState));
        debugger;
		let calculationResult = calculate(financeState);
		console.log('calculationResult', calculationResult);
		return calculationResult;
	});
</script>

    <h1>Welcome to my Finance calculator</h1>
<TextInput
	label="Min length in months:"
	value={financeState.minLengthInMonths.toString()}
	onChange={(v) => changeMinLengthInMonths(parseFloat(v))}
	pattern={digitsWithDecimalOnly}
	placeholder="Min length in months"
/>
<TextInput
	label="Monthly netto income:"
	value={financeState.income.toString()}
	onChange={(v) => changeIncoming(parseFloat(v))}
	pattern={digitsWithDecimalOnly}
	placeholder="Monthly netto income"
/>
<TextInput
	label="Monthly expenses excluding loan/investment payments:"
	value={financeState.expenses.toString()}
	onChange={(v) => changeExpenses(parseFloat(v))}
	pattern={digitsWithDecimalOnly}
	placeholder="Monthly expenses"
/>
<TextInput
	label="Interest rate cash:"
	value={financeState.interestRateCash.toString()}
	onChange={(v) => changeInterestRateCash(parseFloat(v))}
	pattern={digitsWithDecimalOnly}
	placeholder="Interest rate cash"
/>
<TextInput
	label="Inflaction:"
	value={financeState.inflationPercent.toString()}
	onChange={(v) => changeInflationPercent(parseFloat(v))}
	pattern={digitsWithDecimalOnly}
	placeholder="Inflaction"
/>
<TextInput
	label="Tax on gains for investments:"
	value={financeState.taxGainInvestments.toString()}
	onChange={(v) => changeTaxGainSavings(parseFloat(v))}
	pattern={digitsWithDecimalOnly}
	placeholder="Tax on gains for investments"
/>
<TextInput
	label="Tax over interrest to/from bank:"
	value={financeState.taxOnInterrest.toString()}
	onChange={(v) => changeTaxDeducationLoanInterrest(parseFloat(v))}
	pattern={digitsWithDecimalOnly}
	placeholder="Tax over interrest to/from bank"
/>
<h2>Loans:</h2>
<ul>
	{#each financeState.loans as loan, i (i)}
		<li>
			<TextInput
				label="Navn:"
				value={loan.name}
				onChange={(v) => changeLoanName(i, v)}
				placeholder="Navn"
			/>
            <TextInput
                    label="Start periode:"
                    value={loan.startPeriod.toString()}
                    pattern={digitsOnly}
                    onChange={(v) => changeLoanStartPeriode(i, parseInt(v))}
                    placeholder="Start periode"
            />
			<TextInput
				label="Amount:"
				value={loan.amount.toString()}
				pattern={digitsWithDecimalOnly}
				onChange={(v) => changeLoanAmount(i, parseFloat(v))}
				placeholder="Amount"
			/>
			<TextInput
				label="Interrest:"
				value={loan.interrestPercent.toString()}
				pattern={digitsWithDecimalOnly}
				onChange={(v) => changeLoanInterrestPercent(i, parseFloat(v))}
				placeholder="Interrest"
			/>
			<SelectInput
				value={loan.type}
				options={Object.values(LoanType)}
				label="Type:"
				onChange={(v) => changeLoanType(i, v)}
			/>
			{#if loan.type === 'fixedMonthlyPayment'}
				<TextInput
					label="Remaining at the end:"
					value={(loan.remaining ?? 0).toString()}
					pattern={digitsWithDecimalOnly}
					onChange={(v) => changeLoanRemaining(i, parseFloat(v))}
					placeholder="Remaining at the end"
				/>
				<TextInput
					label="Length in months:"
					value={(loan.lengthInMonths ?? 0).toString()}
					pattern={digitsWithDecimalOnly}
					onChange={(v) => changeLoanLengthInMonths(i, parseFloat(v))}
					placeholder="Length in months"
				/>
				<p>Monlthly payment: {loan.monthlyPayment}</p>
			{:else}
				<TextInput
					label="Monthly downpayment:"
					value={(loan.monthlyPayment ?? 0).toString()}
					pattern={digitsWithDecimalOnly}
					onChange={(v) => changeMonthlyPayment(i, parseFloat(v))}
					placeholder="Monthly downpayment"
				/>
			{/if}

			<button onclick={() => removeLoan(i)}>Remove Loan {loan.name}</button>
		</li>
	{/each}
</ul>
<button onclick={addLoan}>Add loan</button>

<h2>Investments:</h2>
<ul>
	{#each financeState.investments as investment, i (i)}
		<li>
			<TextInput
				label="Navn:"
				value={investment.name}
				onChange={(v) => changeInvestmentName(i, v)}
				placeholder="Navn"
			/>
			<TextInput
				label="Start periode:"
				value={investment.startPeriod.toString()}
                pattern={digitsOnly}
				onChange={(v) => changeInvestmentStartPeriode(i, parseInt(v))}
				placeholder="Start periode"
			/>
			<TextInput
				label="Initial amount:"
				value={investment.start.toString()}
				onChange={(v) => changeInvestmentStart(i, parseFloat(v))}
				pattern={digitsWithDecimalOnly}
				placeholder="Initial amount"
			/>
			<TextInput
				label="Add Monthly:"
				value={investment.monthly.toString()}
				onChange={(v) => changeInvestmentMonthly(i, parseFloat(v))}
				pattern={digitsWithDecimalOnly}
				placeholder="Add Monthly"
			/>
			<TextInput
				label="Length in months:"
				value={investment.lengthInMonths.toString()}
				onChange={(v) => changeInvestmentLengthInMonths(i, parseFloat(v))}
				pattern={digitsWithDecimalOnly}
				placeholder="Length in months"
			/>
			<TextInput
				label="yield percent:"
				value={investment.yieldPercent.toString()}
				onChange={(v) => changeInvestmentYieldPercent(i, parseFloat(v))}
				pattern={digitsWithDecimalOnly}
				placeholder="yield"
			/>
			<button onclick={() => removeInvestment(i)}>Remove Investment {investment.name}</button>
		</li>
	{/each}
</ul>
<button onclick={addInvestment}>Add investment</button>

<h2>One time events:</h2>
<ul>
	{#each financeState.oneTimeEvents as oneTimeEvent, i (i)}
		<li>
			<TextInput
				label="Navn:"
				value={oneTimeEvent.name}
				onChange={(v) => changeOneTimeEventName(i, v)}
				placeholder="Navn"
			/>
			<TextInput
				label="Happens at month:"
				value={oneTimeEvent.startPeriod.toString()}
                pattern={digitsOnly}
				onChange={(v) => changeOneTimeEventStartPeriode(i, parseInt(v))}
				placeholder="Start periode"
			/>
			<TextInput
				label="Amount:"
				value={oneTimeEvent.amount.toString()}
				onChange={(v) => changeOneTimeEventAmount(i, parseFloat(v))}
				pattern={digitsWithDecimalOnly}
				placeholder="Amount"
			/>
			<button onclick={() => removeOneTimeEvent(i)}>Remove One time event {oneTimeEvent.name}</button>
		</li>
	{/each}
</ul>
<button onclick={addOneTimeEvent}>Add one time event</button>

<h2>Results:</h2>

<ResultTable calculationResult={calculationResult} />

<div>
	<p>
		Result: {Math.round(
			(calculationResult.monthly[calculationResult.monthly.length - 1]?.balance ?? 0)
		)}
	</p>
</div>
