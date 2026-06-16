async function testDomain(domain) {
  try {
    const url = `https://${domain}/api/chat`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'hola' }]
      })
    });
    console.log(`Domain: ${domain}`);
    console.log(`  Status: ${res.status}`);
    console.log(`  Content-Type: ${res.headers.get('content-type')}`);
    const text = await res.text();
    console.log(`  Body preview: ${text.slice(0, 200)}`);
  } catch (err) {
    console.error(`Domain ${domain} failed:`, err.message);
  }
}

async function main() {
  const domains = [
    'facturado.vercel.app',
    'facturado-e109d.vercel.app',
    'facturado-e109d-willksofts-projects.vercel.app'
  ];
  for (const d of domains) {
    await testDomain(d);
  }
}

main();
