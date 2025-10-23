<script lang="ts">
    import type {CalculationResult} from "./dtos";
    import ResultTableCellString from "$lib/ResultTableCellString.svelte";
    import ResultTableCellNumber from "$lib/ResultTableCellNumber.svelte";
    import {monthString} from "$lib/utils";

    let {calculationResult}: { calculationResult: CalculationResult; } = $props();
</script>

<div>
    <header>
        <ResultTableCellString text="Period"/>

        <!-- Incoming -->
        <ResultTableCellString text="Income"/>
        <ResultTableCellString text="Interrest on savings"/>
        <ResultTableCellString text="Tax interrest savings"/>

        <!-- payments -->
        <ResultTableCellString text="Loan(s) payments"/>
        <ResultTableCellString text="Tax interrest loans"/>
        <ResultTableCellString text="Investment(s) payments"/>
        <ResultTableCellString text="Tax gains investment(s)"/>
        <ResultTableCellString text="Expenses"/>

        <ResultTableCellString text="Month result - tax"/>

        <!-- balances -->
        <ResultTableCellString text="Balance Bank"/>
        <ResultTableCellString text="Balance Loans"/>
        <ResultTableCellString text="Balance Investments"/>
        <ResultTableCellString text="Total balance"/>
    </header>
    {#each calculationResult.monthly as month}
        <div class="row">
            <ResultTableCellString text={monthString(month.period + 1)} left={true}/>

            <!-- Incoming -->
            <ResultTableCellNumber num={month.income}/>
            <ResultTableCellNumber num={month.interest}/>
            <ResultTableCellNumber num={month.taxToBePaidForSavings}/>

            <!-- payments -->
            <ResultTableCellNumber
                    num={month.loanResults.reduce((previousValue, currentValue) => previousValue + currentValue.paid, 0) * -1}/>
            <ResultTableCellNumber
                    num={month.loanResults.reduce((previousValue, currentValue) => previousValue + currentValue.taxToBePaid, 0)}/>
            <ResultTableCellNumber
                    num={month.investmentResults.reduce((previousValue, currentValue) => previousValue + currentValue.payment, 0) * -1}/>
            <ResultTableCellNumber
                    num={month.investmentResults.reduce((previousValue, currentValue) => previousValue + currentValue.taxToBePaid, 0)}/>
            <ResultTableCellNumber num={month.expenses}/>

            <ResultTableCellNumber num={month.result}/>

            <!-- balances -->
            <ResultTableCellNumber num={month.savings}/>
            <ResultTableCellNumber
                    num={month.loanResults.reduce((previousValue, currentValue) => previousValue + currentValue.balance, 0)}/>
            <ResultTableCellNumber
                    num={month.investmentResults.reduce((previousValue, currentValue) => previousValue + currentValue.balance, 0)}/>
            <ResultTableCellNumber num={month.balance}/>
        </div>
    {/each}
</div>

<style>
    header, .row {
        display: grid;
        align-items: center;
        grid-template-columns: 70px 90px 90px 90px 90px 90px 90px 90px 90px 90px 90px 90px 90px 90px;
        gap: 4px;
        padding: 4px;
        background: var(--bg-1);
        text-align: end;
        font-size: 10px;
    }
</style>