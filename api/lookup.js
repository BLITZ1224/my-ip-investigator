export default async function handler(req, res) {
    // 1. CORS Header သတ်မှတ်ခြင်း (Frontend က လှမ်းခေါ်လို့ရအောင်)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { ip } = req.query; 
    const API_KEY = process.env.ABSTRACT_API_KEY; 

    // 2. API Key မရှိရင် အသိပေးမယ်
    if (!API_KEY) {
        return res.status(500).json({ error: "Server Configuration Error: API Key is missing." });
    }

    if (!ip) {
        return res.status(400).json({ error: "IP address is required" });
    }

    try {
        // 3. Timeout သတ်မှတ်ခြင်း (API က ကြာနေရင် error တက်အောင်)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 စက္ကန့် စောင့်မယ်

        const response = await fetch(`https://ip-intelligence.abstractapi.com/v1/?api_key=${API_KEY}&ip_address=${ip}`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Abstract API Error: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
        
    } catch (error) {
        console.error("Lookup Error:", error);
        // Timeout ဖြစ်တာလား၊ တခြား error လား ခွဲပြမယ်
        const errorMessage = error.name === 'AbortError' 
            ? "API request timed out (Slow Connection)" 
            : error.message;
            
        res.status(500).json({ error: errorMessage });
    }
}
