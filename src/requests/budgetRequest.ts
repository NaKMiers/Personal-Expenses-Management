
// [GET]: /budgets
export const getBudgetsApi = async () => {
  const res = await fetch('/api/budgets');
  if (!res.ok) throw new Error((await res.json()).message);
  return await res.json();
};

// [POST]: /budgets/create
export const createBudgetApi = async (data: any) => {
  const res = await fetch('/api/budgets/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).message);
  return await res.json();
};

// [PUT]: /budgets/:id/edit
export const editBudgetApi = async (id: string, data: any) => {
  const res = await fetch(`/api/budgets/${id}/edit`, {
    method: 'PUT',
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error((await res.json()).message);
  return await res.json();
};

// [DELETE]: /budgets/:id/delete
export const deleteBudgetApi = async (id: string) => {
  const res = await fetch(`/api/budgets/${id}/delete`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error((await res.json()).message);
  return await res.json();
};
