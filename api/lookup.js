<!DOCTYPE html>
<html lang="my">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IP Investigator Pro | Security Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@4/dist/fp.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</head>
<body class="bg-slate-950 text-slate-200 min-h-screen p-4 md:p-8 font-sans">

    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="md:col-span-2 bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800">
            <h2 class="text-3xl font-black mb-2 text-center text-red-500 tracking-tight">SECURITY DASHBOARD</h2>
            <p class="text-slate-500 text-center mb-8 text-sm">Anti-Abuse & Threat Detection Tool</p>
            
            <input type="text" id="ipInput" placeholder="IP လိပ်စာ ရိုက်ထည့်ပါ..." 
                   class="w-full p-4 mb-4 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-red-500 transition text-white placeholder-slate-500">
            
            <button onclick="investigate()" id="searchBtn"
                    class="w-full bg-red-600 hover:bg-red-700 p-4 rounded-lg font-bold transition flex items-center justify-center gap-2">
                <span>စစ်ဆေးမည်</span>
            </button>

            <div id="map" class="w-full h-64 mt-8 rounded-xl border border-slate-700 hidden"></div>
            
            <div id="result" class="mt-8 hidden space-y-4"></div>
        </div>

        <div class="space-y-6">
            <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 h-fit">
                <h3 class="text-lg font-bold text-red-500 mb-4">💡 အသုံးပြုနည်းလမ်းညွှန်</h3>
                <ul class="space-y-4 text-sm text-slate-300">
                    <li><strong>Device ID:</strong> မင်းရဲ့ ကွန်ပျူတာ/ဖုန်းရဲ့ လက်ဗွေရာ။</li>
                    <li><strong>ISP:</strong> အင်တာနက် ဝန်ဆောင်မှုပေးသူ။</li>
                    <li><strong>Risk Score:</strong> ၄၀ ကျော်ရင် သတိထားပါ။</li>
                </ul>
            </div>
        </div>
    </div>

    <script>
        const fpPromise = FingerprintJS.load();
        let map = null;

        async function investigate() {
            const ip = document.getElementById('ipInput').value;
            const resDiv = document.getElementById('result');
            const btn = document.getElementById('searchBtn');
            const mapDiv = document.getElementById('map');

            if(!ip) return alert("IP လိပ်စာ ထည့်ပေးပါဦး သာကြီး!");

            btn.disabled = true;
            btn.innerText = "စစ်ဆေးနေသည်...";
            resDiv.classList.remove('hidden');
            resDiv.innerHTML = "<div class='text-center animate-pulse'>System Analyzing...</div>";

            try {
                const fp = await fpPromise;
                const result = await fp.get();
                const visitorId = result.visitorId;

                const response = await fetch(`/api/lookup?ip=${ip}`);
                const data = await response.json();

                if (data.error) throw new Error(data.error);

                // UI Components
                const countryCode = data.country_code ? data.country_code.toLowerCase() : 'unknown';
                const isVPN = data.security?.is_vpn;
                const riskScore = data.security?.threat_score || 0;
                const statusColor = (isVPN || riskScore > 40) ? 'border-red-500' : 'border-emerald-500';

                // Display Result
                resDiv.innerHTML = `
                    <div class="border-l-4 ${statusColor} bg-slate-800 p-5 rounded-r-lg">
                        <div class="flex items-center gap-3 mb-4">
                            <img src="https://flagcdn.com/w40/${countryCode}.png" class="w-8 h-6 rounded shadow-sm border border-slate-700">
                            <h3 class="font-bold text-lg text-white">${data.country || "Unknown"}</h3>
                        </div>
                        <div class="space-y-2 text-sm mt-2">
                            <p><span class="text-slate-400">City:</span> ${data.city || "N/A"}</p>
                            <p><span class="text-slate-400">ISP:</span> ${data.company?.name || "N/A"}</p>
                            <p><span class="text-slate-400">Risk Score:</span> ${riskScore}/100</p>
                            <p class="font-bold text-lg mt-4 ${isVPN ? 'text-red-500' : 'text-emerald-500'}">
                                ${isVPN ? '⚠️ VPN/Proxy Detected' : '✅ Connection Clean'}
                            </p>
                        </div>
                    </div>
                `;

                // Handle Map
                if (data.latitude && data.longitude) {
                    mapDiv.classList.remove('hidden');
                    if (!map) {
                        map = L.map('map').setView([data.latitude, data.longitude], 5);
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
                    } else {
                        map.setView([data.latitude, data.longitude], 5);
                    }
                    L.marker([data.latitude, data.longitude]).addTo(map).bindPopup(data.city).openPopup();
                }

            } catch (error) {
                resDiv.innerHTML = `<div class='bg-red-900/50 p-4 rounded text-red-400 text-center border border-red-800'>Error: ${error.message}</div>`;
            } finally {
                btn.disabled = false;
                btn.innerText = "စစ်ဆေးမည်";
            }
        }
    </script>
</body>
</html>
