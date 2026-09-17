self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const scope = new URL(self.registration.scope)
  const requested = new URL(event.notification.data?.url || '?view=today', scope)
  const destination =
    requested.origin === scope.origin && requested.pathname.startsWith(scope.pathname)
      ? requested.href
      : scope.href
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async (clients) => {
      const existing = clients.find((client) => {
        const url = new URL(client.url)
        return url.origin === scope.origin && url.pathname.startsWith(scope.pathname)
      })
      if (existing) {
        await existing.navigate(destination)
        return existing.focus()
      }
      return self.clients.openWindow(destination)
    }),
  )
})
