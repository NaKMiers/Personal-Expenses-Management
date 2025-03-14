class UserSettingsApi {
  private receiveResponse = async (res: Response) => {
    if (!res.ok) {
      throw new Error((await res.json()).message)
    }

    return await res.json()
  }

  // [GET]: /user-settings/:id
  getUserSettingsApi = async (userId: string, prefix: string = '') => {
    const res = await fetch(`${prefix}/api/user-settings/${userId}`)
    return await this.receiveResponse(res)
  }

  // [PUT]: /user-settings/edit
  editUserSettingsApi = async (currency: string) => {
    const res = await fetch(`/api/user-settings/edit`, {
      method: 'PUT',
      body: JSON.stringify({ currency }),
    })
    return await this.receiveResponse(res)
  }
}

class UserSettingsApiProxy {
  private realApi: UserSettingsApi
  private cache: Map<string, any>

  constructor() {
    this.realApi = new UserSettingsApi()
    this.cache = new Map()
  }

  async getUserSettingsApi(
    userId: string,
    option: { prefix: string; noCache?: boolean } = { prefix: '', noCache: false }
  ) {
    if (!option.noCache && this.cache.has(userId)) {
      return this.cache.get(userId)
    }

    const userSettings = await this.realApi.getUserSettingsApi(userId, option.prefix)
    this.cache.set(userId, userSettings)
    return userSettings
  }

  async editUserSettingsApi(currency: string) {
    this.clearCache()
    return await this.realApi.editUserSettingsApi(currency)
  }

  clearCache(): void {
    this.cache.clear()
  }
}

export const UserSettingsApis = new UserSettingsApiProxy()
export default UserSettingsApiProxy
