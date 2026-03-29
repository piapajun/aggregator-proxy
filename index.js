export default {
  async fetch(request) {
    const url = new URL(request.url)
    const T1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzQ4MDczNDQsImlhdCI6MTc3NDcyMDk0NSwidV9kaXNjb3VudCI6MSwidXNlcl9pZCI6MTY4fQ.u9qIhqHBybtdJ254tBgZ4bw0OdrbH5Fb4JHvc4zTHNc'
    const T3 = 'wPqc6BLcZiVDDrkmDKqSvfOhofjHr9j6loVbE92Q'
    const p = url.searchParams.get('p') || 'p1'
    const apiPath = url.searchParams.get('path') || '/'
    const method = request.method

    // Use direct IP to avoid DNS
    const target = p === 'p3'
      ? `http://103.217.203.210:9900${apiPath.startsWith('/')?apiPath:'/'+apiPath}`
      : `http://1.14.58.242:8090${apiPath.startsWith('/')?apiPath:'/'+apiPath}`
    const token = p === 'p3' ? T3 : T1
    const referer = p === 'p3' ? 'http://103.217.203.210:9988/' : 'http://1.14.58.242:8090/order'

    try {
      const headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Referer': referer,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/146.0.0.0',
        'Accept': 'application/json'
      }
      let body
      if (method !== 'GET' && method !== 'HEAD') body = await request.text()
      const resp = await fetch(target, { method, headers, body })
      const text = await resp.text()
      let data
      try { data = JSON.parse(text) } catch { data = { raw: text } }
      return new Response(JSON.stringify(data), {
        status: resp.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      })
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      })
    }
  }
}
