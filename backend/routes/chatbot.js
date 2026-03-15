const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Basic predefined conversational responses
const staticResponses = [
    { pattern: /hi|hello|hey/i, reply: "Hello! Standard operations are active. How can I help you regarding blood donation or availability?" },
    { pattern: /who are you|what are you/i, reply: "I am the Life Drop AI Blood Bank Assistant. I can check live inventory or answer general donation questions." },
    { pattern: /donate.*how|how.*donate/i, reply: "To donate, go to the 'Donate' page, fill in your details, and switch your availability to 'Available'. Hospitals can then contact you." },
    { pattern: /who.*receive.*o-/i, reply: "O- (O Negative) is the universal donor type. Anyone can receive O- blood in an emergency." },
    { pattern: /who.*receive.*ab\+/i, reply: "AB+ (AB Positive) is the universal recipient. They can receive blood from any blood type." },
    { pattern: /request.*blood|hospital/i, reply: "Hospitals can post urgent requests on the 'Request Blood' page. Our system automatically alerts compatible donors nearby." },
    { pattern: /thank you|thanks/i, reply: "You're welcome! Operations standard." },
    { pattern: /emergency|urgent.*need/i, reply: "If this is a medical emergency, please call your local emergency services immediately! Hospitals can use our platform to broadcast critical requests." }
];

// Fallback message
const fallbackReply = "I'm not quite sure I understand. Try asking about 'blood availability in [city]' or 'how to donate'.";

/**
 * POST /api/chatbot/message
 * Description: Process user chatbot messages, utilizing NLP rules and DB queries.
 * Not authenticated, accessible by any user on the domain.
 */
router.post('/message', async (req, res) => {
    const userMessage = req.body.message || '';
    if (!userMessage.trim()) return res.json({ reply: "Please type a message." });

    const lowerMsg = userMessage.toLowerCase();

    try {
        // 1. DYNAMIC SYSTEM QUERY: Check if asking for specific blood in a city
        // E.g. "Do you have O+ in Mumbai?" or "availability of A- in Delhi"
        const bloodTypeMatch = userMessage.match(/(A\+|A\-|B\+|B\-|AB\+|AB\-|O\+|O\-)/i);
        const cityMatch = userMessage.match(/(Mumbai|Delhi|Bangalore|Chennai|Hyderabad|Pune|Kolkata)/i);

        if (bloodTypeMatch && cityMatch) {
            const bloodType = bloodTypeMatch[1].toUpperCase();
            const city = cityMatch[1];
            
            // Query Database for this specific cross-section
            const [rows] = await db.execute(
                `SELECT SUM(units_available) as total 
                 FROM blood_inventory 
                 WHERE city = ? AND blood_type = ?`,
                [city, bloodType]
            );

            const total = rows[0].total || 0;
            if (total > 0) {
                return res.json({ reply: `We currently have **${total} units** of ${bloodType} available in ${city}. Check the 'Find Blood' page for exact locations.` });
            } else {
                return res.json({ reply: `I'm sorry, we currently have **0 units** of ${bloodType} in ${city} blood banks. However, we may have registered donors who are compatible.` });
            }
        }

        // 2. DYNAMIC SYSTEM QUERY: General City Availability
        // E.g. "What blood do you have in Mumbai?"
        if (cityMatch && /availability|available|stock|blood in/i.test(lowerMsg)) {
            const city = cityMatch[1];
            const [rows] = await db.execute(
                `SELECT blood_type, SUM(units_available) as total 
                 FROM blood_inventory 
                 WHERE city = ? AND units_available > 0 
                 GROUP BY blood_type`,
                [city]
            );

            if (rows.length === 0) {
                return res.json({ reply: `We currently have no active inventory logged in ${city} at blood banks.` });
            }

            let replyStr = `Here is the current active inventory for **${city}**:\n`;
            rows.forEach(r => {
                replyStr += `- ${r.blood_type}: ${r.total} units\n`;
            });
            return res.json({ reply: replyStr });
        }


        // 3. STATIC KNOWLEDGE BASE MATCHING
        for (let rule of staticResponses) {
            if (rule.pattern.test(userMessage)) {
                return res.json({ reply: rule.reply });
            }
        }

        // 4. FALLBACK
        res.json({ reply: fallbackReply });

    } catch (err) {
        console.error('Chatbot API Error:', err);
        res.json({ reply: "My systems are currently experiencing a connectivity issue to the main database. Please try again in 5 minutes." });
    }
});

module.exports = router;
