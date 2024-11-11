import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// CORSミドルウェアを追加
app.use('*', cors())

app.get('/', (c) => c.text('Booth API'))

app.get('/item', async (c) => {
  const url = c.req.query('url')

  if (!url) {
    return c.json({ error: 'URLパラメータが必要です' }, 400)
  }

  try {
    const jsonUrl = `${url}.json`
    const response = await fetch(jsonUrl)

    if (!response.ok) {
      throw new Error('アイテムデータの取得に失敗しました')
    }

    const data = await response.json()
    return c.json(data)
  } catch (error) {
    console.error('エラー:', error)
    return c.json({ error: 'アイテムデータの取得中にエラーが発生しました' }, 500)
  }
})

serve(app)