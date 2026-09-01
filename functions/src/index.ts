import { initializeApp } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'
import { logger } from 'firebase-functions'
import { defineInt, defineList } from 'firebase-functions/params'
import { onRequest } from 'firebase-functions/v2/https'

initializeApp()

const allowedOrigins = defineList('ALLOWED_ORIGINS', {
  description: 'Origins permitted to call the notify endpoint',
})

const maxInstances = defineInt('NOTIFY_MAX_INSTANCES', {
  description: 'Upper bound on concurrent instances of the notify function',
})

interface NotifyBody {
  to?: string
  title?: string
  body?: string
  image?: string
  link?: string
}

export const notifyV2 = onRequest({ cors: allowedOrigins, maxInstances }, async (req, res) => {
  const { to, title, body, image, link } = (req.body ?? {}) as NotifyBody

  if (!to) {
    res.status(400).send({ error: 'Missing target token "to"' })
    return
  }

  try {
    const messageId = await getMessaging().send({
      token: to,
      notification: { title, body, imageUrl: image },
      webpush: {
        notification: { requireInteraction: true },
        fcmOptions: link ? { link } : undefined,
      },
    })
    logger.info('Successfully sent message', { messageId })
    res.status(200).send({ '✅': '🚀' })
  } catch (error) {
    logger.error('Error sending message', error)
    res.status(500).send({ error: (error as Error).message })
  }
})
