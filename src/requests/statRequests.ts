// Stat

// [GET]: /stats/overview
export const getOverviewApi = async (
  from: Date | string,
  to: Date | string,
  option: RequestInit = { next: { revalidate: 0 } }
) => {
  const res = await fetch(`/api/stats/overview?from=${from}&to=${to}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
