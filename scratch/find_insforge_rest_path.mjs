const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDg1NzZ9.wGPrNkJgQqgOXuNOk_iyfgrEjrmPpp2eRg3dwj--GLs";

async function testInsforgePaths() {
  const paths = [
    "/api/v1/invoices",
    "/api/database/invoices",
    "/api/records/invoices",
    "/api/db/invoices",
    "/v1/invoices",
    "/invoices"
  ];

  for (const path of paths) {
    try {
      const url = `https://zdwuav42.us-east.insforge.app${path}`;
      const res = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${ANON_KEY}`,
          "apikey": ANON_KEY
        }
      });
      console.log(`Path ${path} => Status ${res.status}`);
    } catch (e) {
      console.log(`Path ${path} => Error ${e.message}`);
    }
  }
}

testInsforgePaths();
