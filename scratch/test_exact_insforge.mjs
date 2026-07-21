const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDg1NzZ9.wGPrNkJgQqgOXuNOk_iyfgrEjrmPpp2eRg3dwj--GLs";

async function testExactInsforgePath() {
  const url = "https://zdwuav42.us-east.insforge.app/api/database/records/invoices?select=id,invoice_number,type&limit=1";
  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${ANON_KEY}`
    }
  });
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Data:', data);
}

testExactInsforgePath();
