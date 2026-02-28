// api/lookup.js (Improved Version)

// IP ဟုတ်မဟုတ် စစ်ဖို့ Regex
const isIP = (str) => /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(str);

export default async function handler(req, res) {
  const { ip } = req.query;
  const API_KEY = process.env.API_KEY;

  // ၁။ Input Validation
  if (!ip || !isIP(ip)) {
    return res.status(400).json({ error: "Invalid or missing IP address" });
  }

  // ၂။ Security Check: Referer ကို စစ်ပါ (မင်း website ကနေပဲ ခေါ်ခိုင်းဖို့)
  const referer = req.headers.referer;
  if (!referer || !referer.includes('your-domain.com')) {
     return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    // ၃။ Upstream API Call
    const response = await fetch(`https://ip-intelligence.abstractapi.com/v1/?api_key=${API_KEY}&ip_address=${ip}`);
    
    if (!response.ok) {
        throw new Error(`Abstract API failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Cache Control ထည့်ပေးခြင်း (Browser က ထပ်မခေါ်ရအောင်)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json(data);

  } catch (error) {
    console.error("Lookup Error:", error);
    res.status(500).json({ error: "Failed to fetch data from provider" });
  }
}
