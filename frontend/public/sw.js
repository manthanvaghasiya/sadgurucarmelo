self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    try { 
      data = event.data.json(); 
    } catch (e) { 
      data = { title: event.data.text() }; 
    }
  }
  const title = data.title || 'સદગુરુ કાર મેળો | Sadguru Car Melo';
  const options = {
    body: data.body || 'નવી કાર ઉપલબ્ધ છે! તપાસો હમણાં જ. / New car arrived!',
    icon: data.icon || '/sadgurulogo-192.png',
    badge: '/sadgurulogo-48.png',
    data: { url: data.url || '/' },
    vibrate: [200, 100, 200],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
