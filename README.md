# 🍔 FoodExpress - Full-Stack Food Delivery Web Application

FoodExpress is a production-grade full-stack food ordering platform built with **Django REST Framework** and **React (Vite)** with complete JWT Role-Based Authentication.

---

## 🚀 Key Features

- **Role-Based Authentication:** Distinct portal flows for Customers and Restaurant Owners using SimpleJWT.
- **Live Search & Filtering:** Instant filter for restaurants and locations.
- **Interactive Cart Engine:** Real-time quantity adjustments and automated bill math.
- **Mock Payment Gateway:** Interactive multi-method modal supporting UPI/GPay and Credit/Debit cards.
- **Live Order Stepper:** Real-time visual progress tracking (_Pending ➔ Preparing ➔ Out for Delivery ➔ Delivered_).
- **Instant PDF Invoices:** Auto-generated order receipts via jsPDF.
- **Restaurant Management Dashboard:** Live order lifecycle updates and menu control.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, Axios, jsPDF
- **Backend:** Django 5.x, Django REST Framework, SimpleJWT, SQLite/PostgreSQL

---

## ⚡ Quick Setup

### 1. Backend Setup

```bash
cd foodexpress-backend
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python seed_data.py
python manage.py runserver
```
