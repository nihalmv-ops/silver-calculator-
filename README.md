# Silver Catering - Premium Income & Expense Note Software

A fast, lightweight, and elegant single-page application built with **React + JavaScript + Vite** for catering event financial accounting, settlement tracking, and professional A4 statement printing.

Inspired by the refined presentation of premium Kerala catering services ([silvercatering.in](https://www.silvercatering.in/)).

---

## ✨ Features

- **Single Page Simplicity**: Zero clutter, no dashboards, no complex menus or databases. Open and start calculating immediately.
- **Kerala Luxury Aesthetic**: Deep emerald green (`#09261c`), warm cream (`#faf7f2`), and champagne gold accents (`#c5a059`) with classic typography (`Cormorant Garamond` & `Plus Jakarta Sans`).
- **Dynamic Income Tracking**:
  - Add, edit, and delete income entries (Catering payment, advances, extras).
  - Real-time automatic subtotal in Indian numbering format (`₹75,000`).
- **Dynamic Expense Tracking**:
  - Add, edit, and delete expense entries (Rice, Chicken, Vegetables, Staff wages, Logistics).
  - Real-time automatic subtotal calculation.
- **Automatic Settlement / Profit Calculation**:
  - Instant calculation: `Balance / Profit = Total Income - Total Expense`.
  - Clear **LOSS** indicator with alert styling when expenses exceed income.
- **Dedicated A4 Print & PDF Output**:
  - Automatically formats into an executive catering business statement upon invoking Print or Save PDF.
  - Hides screen UI, buttons, inputs, and browser navigation.
  - Right-aligned monetary figures, clear company letterhead, client metadata grid, and signature acknowledgement line.
- **Data Persistence**:
  - Automatically saves state to `localStorage` on every keystroke.
  - Data remains intact across page refreshes.
  - "Clear Note" and "New Note" buttons with confirmation dialogues.
- **Instant Demo Loader**:
  - "Load Sample (Rahul Wedding)" button for 1-click verification of the prompt's reference test case.

---

## 🛠️ Tech Stack

- **React 19**
- **Vite**
- **JavaScript (ES Modules)**
- **CSS3** (Custom Properties, `@media print`, `@page { size: A4 }`)
- **Lucide Icons & Handcrafted SVGs**
- **Zero Backend / Zero Database Dependencies**

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 📄 Print & "Save as PDF" Guidelines

1. Click **[ PRINT ]** or **[ SAVE PDF ]** in the bottom action bar.
2. The browser's native print preview window will appear formatted strictly for **A4 portrait**.
3. To save as a PDF file:
   - In the Destination dropdown, choose **"Save as PDF"**.
   - Ensure **Background graphics** is checked for full letterhead styling.
   - Click **Save**.

---

## 🧪 Verified Test Case ("Rahul Wedding")

- **Event**: Rahul Wedding
- **Customer**: Rahul
- **Incomes**:
  - Catering Payment = ₹50,000
  - Advance = ₹20,000
  - Other = ₹5,000
  - **Total Income = ₹75,000**
- **Expenses**:
  - Rice = ₹5,000
  - Chicken = ₹12,000
  - Vegetables = ₹4,000
  - Staff = ₹8,000
  - Transport = ₹2,000
  - **Total Expense = ₹31,000**
- **Net Balance / Profit**: **₹44,000**
