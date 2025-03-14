class StatApi {
  private receiveResponse = async (res: Response) => {
    if (!res.ok) {
      throw new Error((await res.json()).message)
    }

    return await res.json()
  }

  // [GET]: /stats/overview
  getOverviewApi = async (from: Date | string, to: Date | string) => {
    const res = await fetch(`/api/stats/overview?from=${from}&to=${to}`)
    return await this.receiveResponse(res)
  }
}

class StatApiProxy {
  private realApi: StatApi
  private cache: Map<string, any>

  constructor() {
    this.realApi = new StatApi()
    this.cache = new Map()
  }

  getOverviewApi = async (
    from: Date | string,
    to: Date | string,
    option: { noCache: boolean } = { noCache: false }
  ) => {
    const key = `${from}-${to}`
    if (!option.noCache && this.cache.has(key)) {
      return this.cache.get(key)
    }

    const res = await this.realApi.getOverviewApi(from, to)
    this.cache.set(key, res)
    return res
  }

  clearCache(): void {
    this.cache.clear()
  }
}

export const StatApis = new StatApiProxy()
export default StatApiProxy
