export function calculateMonthlyIncome(income) {

  const weeklyIncome = income.reduce(
    (total, item) =>
      total + (item.hourly_rate * item.hours_per_week),
    0
  );

  return weeklyIncome * 4.33;

}


export function calculateMonthlyExpenses(expenses) {

  return expenses.reduce(
    (total, item) =>
      total + Number(item.amount),
    0
  );

}


export function calculateAvailableMoney(
  monthlyIncome,
  monthlyExpenses
) {

  return monthlyIncome - monthlyExpenses;

}
