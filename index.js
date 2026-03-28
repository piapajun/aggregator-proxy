export default {
  async fetch(request) {
    const url = new URL(request.url)
    const path = url.pathname
    let platform = 'p1', apiPath

    if (path.startsWith('/qihuang')) {
      platform = 'p1'
      apiPath = '/api' + path.slice('/qihuang/api'.length)
    } else if (path.startsWith('/yijiaoyu')) {
      platform = 'p3'
      apiPath = '/api' + path.slice('/yijiaoyu/api'.length)
    } else {
      platform = url.searchParams.get('platform') || 'p1'
      apiPath = url.searchParams.get('path') || '/api/layout/user-profile'
    }

    const P1 = 'http://1.14.58.242:8090'
    const P3 = 'http://103.217.203.210:9900'
    const T1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Nzc0ODA3MzQ0LCJpYXQiOjE3Nzc0NzIwOTQ1LCJ1X2Rpc2NvdW50IjoxLCJ1c2VyX2lkIjoxNjh9.u9qlhqHBybtdJ254tBgZ4bw0OdrbH5Fb4JHvc4zTHNc'
    const T3 = 'F9VCrgqK0xtf3ON68guMREfOiKjUwsSR803clDLV'

    const base = platform === 'p1' ? P1 : P3
    const token = platform === 'p1' ? T1 : T3
    const response = await fetch(base + apiPath, {
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
    })
    const text = await response.text()
    let data
    try { data = JSON.parse(text) } catch { data = { raw: text } }
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }
}
