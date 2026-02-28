// api/lookup.js

// IP address format မှန်/မမှန် စစ်ဆေးရန် Regex
const isIP = (str) => /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(str);

export default async function handler(req, res) {
  const { ip } = req.query;
  const API_KEY = process.env.API_KEY; // Vercel Environment Variables ထဲမှာ ထည့်ထားဖို့ လိုပါတယ်
  const referer = req.headers.referer;
  
  // မင်းရဲ့ Live Domain
  const ALLOWED_DOMAIN = 'ipdashboard11.vercel.app'; 

  // ၁။ Input Validation (IP လိပ်စာ မှန်/မမှန်)
  if (!ip || !isIP(ip)) {
    return res.status(400).json({ error: "Invalid or missing IP address" });
  }

  // ၂။ Security Check (Referer) - မင်း website ကနေပဲ ခေါ်ခိုင်းတာ
  // localhost မှာ test လို့ရအောင်ပါ ထည့်ပေးထားတယ်
  if (!referer || (!referer.includes(ALLOWED_DOMAIN) && !referer.includes('localhost'))) {
     return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    // ၃။ Upstream API Call
    const response = await fetch(`https://ip-intelligence.abstractapi.com/v1/?api_key=${API_KEY}&ip_address=${ip}`);
    
    if (!response.ok) {
        throw new Error(`Provider error: ${response.status}`);
    }

    const data = await response.json();
    
    // ၄။ Cache Control (တစ်နာရီစာ Cache လုပ်ထားမယ် - API Key သက်သာအောင်)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json(data);

  } catch (error) {
    console.error("Lookup Error:", error);
    res.status(500).json({ error: "Failed to fetch data from provider" });
  }
}
