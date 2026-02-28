// api/lookup.js

export default async function handler(req, res) {
  // Frontend က ပို့လိုက်တဲ့ ip ကို ဖမ်းမယ်
  const { ip } = req.query; 
  
  // Vercel Settings ထဲက API_KEY ကို ခေါ်သုံးမယ်
  const API_KEY = process.env.API_KEY; 

  // IP လိပ်စာ မပါလာရင် Error ပေးမယ်
  if (!ip) {
    return res.status(400).json({ error: "IP လိပ်စာ မပါဝင်ပါ" });
  }

  try {
    // Abstract API ဆီကို လှမ်းခေါ်မယ်
    const response = await fetch(`https://ip-intelligence.abstractapi.com/v1/?api_key=${API_KEY}&ip_address=${ip}`);
    
    // API က Data ပြန်ပေးရင် အဲဒီ Data ကို Frontend ဆီ ပြန်ပို့မယ်
    const data = await response.json();
    
    res.status(200).json(data);
    
  } catch (error) {
    // တစ်ခုခုမှားရင် Error ပြမယ်
    console.error("Lookup Error:", error);
    res.status(500).json({ error: "Data ရယူရန် အဆင်မပြေဖြစ်နေသည်" });
  }
}
