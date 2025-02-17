// User Settings

// [GET]: /user-settings/:id
export const getUserSettingsApi = async (
  userId: string,
  prefix: string = '',
  option: RequestInit = { next: { revalidate: 0 } }
) => {
  const res = await fetch(`${prefix}/api/user-settings/${userId}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /user-settings/edit
export const editUserSettingsApi = async (currency: string) => {
  const res = await fetch(`/api/user-settings/edit`, {
    method: 'PUT',
    body: JSON.stringify({ currency }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
