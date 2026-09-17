self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const requested = new URL(event.notification.data?.url || '/?view=today', self.location.origin)
  const destination =
    requested.origin === self.location.origin ? requested.href : self.location.origin
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async (clients) => {
      const existing = clients.find((client) => new URL(client.url).origin === self.location.origin)
      if (existing) {
        await existing.navigate(destination)
        return existing.focus()
      }
      return self.clients.openWindow(destination)
    }),
  )
})
