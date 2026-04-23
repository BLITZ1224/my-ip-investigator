export default async function handler(req, res) {
    // CORS configuration
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { ip } = req.query; 
    const API_KEY = process.env.ABSTRACT_API_KEY; 

    if (!ip) return res.status(400).json({ error: "IP address is required" });

    try {
        const response = await fetch(`https://ip-intelligence.abstractapi.com/v1/?api_key=${API_KEY}&ip_address=${ip}`);
        const data = await response.json();

        // ISP နာမည်ကို နေရာစုံကနေ ရှာဖတ်မယ် (ဒါမှ ISP ပျောက်တဲ့ပြဿနာ ရှင်းမှာပါ)
        data.isp_fixed = data.connection?.isp_name || 
                         data.company?.name || 
                         data.connection?.autonomous_system_organization || 
                         data.connection?.organization_name || 
                         "Unknown ISP";

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Intelligence database connection failed" });
    }
}
