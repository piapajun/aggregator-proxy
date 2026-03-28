// Cloudflare Pages Function - Aggregator Proxy
export async function onRequest({ request }) {
  const url = new URL(request.url)

  // Path-based routing
  const path = url.pathname
  let platform, apiPath

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
  const T1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzQ3ODg1NjAsImlhdCI6MTc3NDcwMjE2MSwidV9kaXNjb3VudCI6MSwidXNlcl9pZCI6MTY4fQ.Vny9yFn_6WDj_ddSH0m_lrrQZE9i4C-AFxXJX02BhKE'
  const T3 = 'F9VCrgqK0xtf3ON68guMREfOiKjUwsSR803clDLV'

  const base = platform === 'p1' ? P1 : P3
  const token = platform === 'p1' ? T1 : T3
  const target = base + apiPath

  const response = await fetch(target, {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    }
  })

  let data
  try { data = await response.json() } catch { data = { raw: await response.text() } }

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  })
}
