async function submitToOnePageLove() {
  console.log('Fetching One Page Love submit page to retrieve active nonce...');
  const res = await fetch('https://onepagelove.com/submit', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  const cookies = res.headers.get('set-cookie') || '';
  const html = await res.text();

  const nonceMatch = html.match(/"nonce":"([a-zA-Z0-9]+)"/);
  if (!nonceMatch) {
    console.error('Could not find nonce in HTML');
    return;
  }

  const nonce = nonceMatch[1];
  console.log('Found nonce:', nonce);

  const formData = new URLSearchParams();
  formData.append('action', 'opl_submit_website');
  formData.append('nonce', nonce);
  formData.append('first_name', 'The Spark Studio');
  formData.append('email', 'hello@thesparkstudio.digital');
  formData.append('type', 'inspiration');
  formData.append('url', 'https://www.thesparkstudio.digital/');
  formData.append('confirm', '1');

  console.log('Sending submission POST to One Page Love...');
  const postRes = await fetch('https://onepagelove.com/wp-admin/admin-ajax.php', {
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://onepagelove.com/submit',
      'Origin': 'https://onepagelove.com',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookies
    },
    body: formData.toString()
  });

  const json = await postRes.json();
  console.log('One Page Love Response:', JSON.stringify(json, null, 2));
}

submitToOnePageLove();
