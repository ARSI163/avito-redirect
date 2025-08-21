import httpx

TOKEN = "7710502525:AAH0zRcRj3a5U0pnY_CuMpgtfBMO8l0gslk"
CHAT  = 184428063
CEID  = "5372836265743909418"  # custom_emoji_id как СТРОКА!

text = "#1 ·"  # '·' заменим кастом-эмодзи
body = {
    "chat_id": CHAT,
    "text": text,
    "entities": [{
        "type": "custom_emoji",
        "offset": 3,     # позиция '·' в UTF-16 от начала "#1 ·" ( '#'(0), '1'(1), ' '(2), '·'(3) )
        "length": 1,
        "custom_emoji_id": CEID
    }]
}

r = httpx.post(f"https://api.telegram.org/bot{TOKEN}/sendMessage", json=body)
print(r.text)
