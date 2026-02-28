// api/lookup.js - Simple Version

export default async function handler(req, res) {
  const { ip } = req.query;
  const API_KEY = process.env.API_KEY;

  if (!ip) {
    return res.status(400).json({ error: "IP လိပ်စာ ထည့်ပေးပါဦး" });
  }

  try {
    const response = await fetch(`https://ip-intelligence.abstractapi.com/v1/?api_key=${API_KEY}&ip_address=${ip}`);
    
    if (!response.ok) {
        throw new Error(`Provider error: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache လုပ်ပေးထားတာကတော့ API Key သက်သာဖို့အတွက် ထည့်ထားတာနော်
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json(data);

  } catch (error) {
    console.error("Lookup Error:", error);
    res.status(500).json({ error: "Data ရယူရန် အဆင်မပြေဖြစ်နေသည်" });
  }
}
