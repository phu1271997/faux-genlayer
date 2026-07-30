# Faux — Tòa Án AI Phân Xử Deepfake Phi Tập Trung

> **Sàn bounty phi tập trung đánh giá "Media này có phải deepfake không?"** — Đặt cược GEN token trên phán đoán của bạn, đồng thuận bằng hội đồng AI phi tập trung trên GenLayer studionet.

---

## 1. Bài toán
Sự bùng nổ của media AI tạo sinh khiến việc phân biệt nội dung thật và giả trở nên vô cùng khó khăn. Các nền tảng tập trung có rủi ro thiên vị và đưa ra quyết định thiếu minh bạch. Faux mang lại tòa án phi tập trung, trung lập, nơi cộng đồng stake GEN và AI Jury ra phán quyết công khai on-chain.

---

## 2. Vì sao phải là GenLayer?
1. **Xử lý dữ liệu phi cấu trúc on-chain:** LLM đọc văn bản, metadata và bài báo fact-check trực tiếp.
2. **Truy cập Web không cần Oracle:** `gl.nondet.web.render` fetch URL trực tiếp trên chuỗi.
3. **Đồng thuận chủ quan (Optimistic Democracy):** Mạng lưới validator LLM đồng thuận theo ý nghĩa phán quyết (verdict bucket + confidence tier).

---

## 3. Kiến trúc Smart Contracts (`studionet`)
- `FauxCore`: Tạo case, stake, adjudicate với AI Jury, chi trả thưởng.
- `FauxTreasury`: Giữ tiền escrow, thu 2% phí protocol, thực hiện payout.
- `FauxReputation`: Theo dõi điểm uy tín staker và xếp hạng.
