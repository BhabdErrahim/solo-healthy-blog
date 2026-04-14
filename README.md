# SoloLife OS | The Modern Solo-Living Platform

**SoloLife OS** is a high-performance, professional lifestyle platform designed specifically for the modern independent professional. Built using a **Decoupled Architecture (Next.js 15 + Django REST)**, it combines scientific longevity habits, tactical travel logistics, and gourmet culinary engineering into a single unified "Lifestyle Operating System."

![Brand Colors](https://img.shields.io/badge/Brand%20Colors-%23114AB1%20%7C%20%23E4580B-blue)
![SEO Optimized](https://img.shields.io/badge/SEO-Rank%201%20Ready-orange)

---

## 🚀 The Vision
Most lifestyle blogs treat solo living as a "transition phase." **SoloLife OS** treats it as a **Superpower**. We provide the technical blueprints to turn a household of one into a high-output sanctuary.

## 🛠 Tech Stack
- **Frontend:** Next.js 15 (App Router), Tailwind CSS v4, Lucide-React, Axios.
- **Backend:** Django 5, Django REST Framework, JWT Authentication.
- **Content Engine:** Custom Markdown Importer with real-time HTML design injection.
- **Database:** PostgreSQL (Production-ready).

## ✨ Key Features

### 1. The Deployment Engine (Markdown-to-Cornerstone)
A proprietary admin tool that allows authors to paste 10,000+ word Markdown files.
- **Surgical URL Repair:** Automatically glues broken image links back together.
- **Design Injection:** Automatically applies brand typography and shadows to raw Markdown.
- **Metadata Discovery:** Auto-detects Title, Slug, and Category via YAML Frontmatter.

### 2. The "Spiderweb" Internal Linking
A strategic database relationship model where every article is linked across 5 core pillars (Health, Traveling, Solo-Living, Sport, Food) to maximize user retention and SEO power.

### 3. Industrial-Strength SEO
- **Dynamic Metadata API:** Custom Meta-Titles and Descriptions for every slug.
- **JSON-LD Schema:** Automated `BlogPosting` structured data for Google & AI search engines.
- **Dynamic XML Sitemap:** Automated indexing of all cornerstone content.

### 4. Professional UI/UX
- **Graphy-Inspired Design:** Floating card layouts and clean white-space management.
- **Mega-Navigation:** instant access to all content pillars.
- **Stable Rendering:** Zero layout shift (decalage) during image loading.

---

## 📦 Project Structure
```text
solo-healthy-blog/
├── core/               # Django Settings & Auth
├── blog/               # Blog Engine (Models, API, Sitemaps)
├── client/             # Next.js Application
│   ├── src/app/        # Pages (Home, Admin, Article, Category)
│   ├── src/components/ # UI Components (Navbar, Footer, Editor)
│   └── src/lib/        # API Handling (Axios Interceptors)
└── manage.py