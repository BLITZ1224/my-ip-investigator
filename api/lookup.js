// api/lookup.js
export default async function handler(req, res) {
    const { ip } = req.query; 
    const API_KEY = process.env.ABSTRACT_API_KEY; // Vercel Settings မှာ ဒီနာမည်နဲ့ သိမ်းပါ

    if (!ip) {
        return res.status(400).json({ error: "IP address is required" });
    }

    try {
        const response = await fetch(`https://ip-intelligence.abstractapi.com/v1/?api_key=${API_KEY}&ip_address=${ip}`);
        
        if (!response.ok) {
            throw new Error(`Abstract API responded with status: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
        
    } catch (error) {
        console.error("Lookup Error:", error);
        res.status(500).json({ error: "Intelligence database connection failed" });
    }
}
