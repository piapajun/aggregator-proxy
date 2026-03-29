export default {
  async fetch(request) {
    const url = new URL(request.url)
    const path = url.pathname

    const P1 = 'http://1.14.58.242:8090'
    const P3 = 'http://103.217.203.210:9900'
    const T1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzQ4MDczNDQsImlhdCI6MTc3NDcyMDk0NSwidV9kaXNjb3VudCI6MSwidXNlcl9pZCI6MTY4fQ.u9qIhqHBybtdJ254tBgZ4bw0OdrbH5Fb4JHvc4zTHNc'
    const T3 = 'wPqc6BLcZiVDDrkmDKqSvfOhofjHr9j6loVbE92Q'

    let target, token, referer
    const p = url.searchParams.get('p') || ''

    if (p === 'p3' || path.includes('/yijiaoyu/') || path.includes('/website/list')) {
      target = P3 + (path.includes('/yijiaoyu') ? path.replace('/yijiaoyu', '') : path)
      token = T3
      referer = 'http://103.217.203.210:9988/'
    } else {
      target = P1 + (path.includes('/qihuang') ? path.replace('/qihuang', '') : path)
      token = T1
      referer = 'http://1.14.58.242:8090/order'
    }

    // Override target from query param
    if (url.searchParams.has('target')) {
      target = url.searchParams.get('target')
      token = url.searchParams.get('token') || token
      referer = url.searchParams.get('referer') || referer
    }

    try {
      const reqOpts = {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
          'Referer': referer,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/146.0.0.0'
        }
      }
      const method = request.method
      let body = undefined
      if (method !== 'GET' && method !== 'HEAD') {
        body = await request.text()
      }
      const resp = await fetch(target, { ...reqOpts, method, body, signal: new AbortController().signal })
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
