async function submitMinimal() {
  console.log('Fetching Minimal Gallery submit page for session and nonce tokens...');
  const res = await fetch('https://minimal.gallery/submit/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  const cookies = res.headers.get('set-cookie') || '';
  const html = await res.text();

  const getHidden = (name) => {
    const match = html.match(new RegExp(`name="${name}"\\s+value="([^"]+)"`, 'i')) 
      || html.match(new RegExp(`value="([^"]+)"\\s+name="${name}"`, 'i'));
    return match ? match[1] : '';
  };

  const acfScreen = getHidden('_acf_screen') || 'acfe_form';
  const acfPostId = getHidden('_acf_post_id') || '27088';
  const acfValidation = getHidden('_acf_validation') || '1';
  const acfForm = getHidden('_acf_form');
  const acfNonce = getHidden('_acf_nonce');
  const acfeData = getHidden('_acfe_data');

  console.log('Parsed ACF Tokens:', { acfPostId, acfValidation, nonce: acfNonce, formTokenPresent: !!acfForm });

  const body = new URLSearchParams();
  body.append('_acf_screen', acfScreen);
  body.append('_acf_post_id', acfPostId);
  body.append('_acf_validation', acfValidation);
  body.append('_acf_form', acfForm);
  body.append('_acf_nonce', acfNonce);
  body.append('_acf_changed', '1');
  body.append('_acfe_data', acfeData);

  // Field values
  body.append('acf[field_661f915dc33dd]', 'Post'); // Type: Website Post
  body.append('acf[field_636a8d7a98b84]', 'https://www.thesparkstudio.digital/'); // URL
  body.append('acf[field_655e7b3111787]', 'The Spark Studio'); // Name of submission
  body.append('acf[field_636a8d904aa51]', 'The Spark Studio'); // Your name
  body.append('acf[field_636a8d974aa52]', 'hello@thesparkstudio.digital'); // Your email
  body.append('acf[field_661f8e3880c8b]', 'High-performance Framer websites, templates & digital flagships engineered for ambitious brands with 90+ PageSpeed.'); // Message

  console.log('Posting submission to Minimal Gallery...');
  const postRes = await fetch('https://minimal.gallery/submit/', {
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://minimal.gallery/submit/',
      'Origin': 'https://minimal.gallery',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookies
    },
    body: body.toString()
  });

  console.log('Post Status:', postRes.status, 'Final URL:', postRes.url);
  const postHtml = await postRes.text();
  const successMatch = postHtml.match(/thank you|received|submitted|success|acfe-form-success/i);
  console.log('Success match:', successMatch ? successMatch[0] : 'None');
  if (postHtml.includes('acf-error') || postHtml.includes('error')) {
    const errorMatches = postHtml.match(/class="[^"]*error[^"]*"[^>]*>[\s\S]*?<\/div>/gi);
    console.log('Errors:', errorMatches?.slice(0, 3));
  }
}

submitMinimal();
