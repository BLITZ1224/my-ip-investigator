// api/lookup.js
export default async function handler(req, res) {
  const { ip } = req.query; 
  const API_KEY = process.env.API_KEY; // Vercel Settings ထဲက Key ကို ဒီကနေယူမယ်

  if (!ip) {
    return res.status(400).json({ error: "IP လိပ်စာ မပါဝင်ပါ" });
  }

  try {
    const response = await fetch(`https://ip-intelligence.abstractapi.com/v1/?api_key=${API_KEY}&ip_address=${ip}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Data ရယူရန် အဆင်မပြေဖြစ်နေသည်" });
  }
}