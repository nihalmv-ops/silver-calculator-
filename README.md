# Silver Catering - Food Handover Note Software

A fast, lightweight, and elegant single-page application built with **React + JavaScript + Vite** for catering food handover tracking, dispatch item verification, and professional A4 statement printing with **Total Price**.

Inspired by the refined presentation of premium Kerala catering services ([silvercatering.in](https://www.silvercatering.in/)).

---

## ✨ Features

- **Single Page Simplicity**: Zero clutter, no dashboards, no complex menus or databases.
- **Event Header**:
  - Event (e.g. *Rahul Wedding*)
  - Date (e.g. *18/09/2026*)
  - Client (e.g. *Rahul*)
  - Location (e.g. *Ernakulam*)
  - Phone (optional)
- **Food Items Handover List**:
  - `Food Item` (Rice, Chicken, Beef, Vegetables, Oil, Milk, Payasam, Pickle, Water, etc.)
  - `QTY` (Quantity)
  - `UNIT` (Dropdown supporting: `KG`, `Gram`, `Litre`, `ML`, `PCS`, `Packet`, `Box`, `Bottle`, `Other`)
  - Add & Delete items dynamically
- **Single Overall TOTAL PRICE**:
  - Manual entry field: `[ ₹ 75000 ]`
  - Automatic Indian Rupee formatting preview (`₹75,000`, `₹1,000`, `₹10,000`, `₹1,25,000`)
  - Automatic `TOTAL ITEMS` counter (e.g. `9 Items`)
  - Strictly **NO** individual item price fields (Quantity is ONLY quantity)
- **Dedicated A4 Print & PDF Layout**:
  - Matches the exact official Catering Food Handover Note format:
    - Company Logo & Letterhead (*Silver Catering Services*)
    - Event, Date, Client, Location metadata grid
    - Clean table: `FOOD ITEM | QTY | UNIT`
    - `TOTAL ITEMS: 9`
    - `TOTAL PRICE: ₹75,000`
    - Client & Kitchen dispatch signature lines
    - Closing tag: *FOOD HANDOVER NOTE - Thank you for choosing us.*
- **Local Persistence**:
  - Saves to `localStorage` automatically on every keystroke.
  - "Load Sample (Rahul Wedding)" button for instant 1-click test verification.

---

## 🧪 Verified Test Case ("Rahul Wedding")

```
Event:       Rahul Wedding
Date:        18/09/2026
Client:      Rahul
Location:    Ernakulam

FOOD ITEM              QTY       UNIT
----------------------------------------
Rice                   25        KG
Chicken                35        KG
Beef                   20        KG
Vegetables             15        KG
Oil                     8        Litre
Milk                   10        Litre
Payasam                25        Litre
Pickle                  5        KG
Water                  20        Litre
----------------------------------------
TOTAL ITEMS: 9
TOTAL PRICE: ₹75,000
```
