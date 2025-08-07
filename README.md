# 🎬 CineScoper  
**Your gateway to a smarter streaming experience**

## 📽️ Overview

**CineScoper** is a sleek, responsive web app built with **React** and **Tailwind CSS** that lets you explore, search, and watch movies and TV shows across multiple sources. With powerful filtering and discovery features, it’s the ultimate front-end for film and TV enthusiasts.

## ✨ Features

- 🔍 **Advanced Search**: Search by title, keywords, or year  
- 👥 **Discover by Cast**: Find all content related to your favorite actors  
- 📅 **Browse by Year**: Dive into releases from specific years  
- 🧠 **Keyword-Based Discovery**: Uncover hidden gems by theme or topic  
- 📡 **Multiple Streaming Sources**: Choose from several links to watch from  
- 📱 **Fully Responsive**: Works great on desktop, tablet, and mobile  
- 🎨 **Modern UI**: Built with Tailwind CSS for a clean, elegant design  

## 🚀 Tech Stack

- ⚛️ React
- 🌬 Tailwind CSS
- 📡 TMDb API
- 🌐 Multiple external streaming providers
- 📁 React Router

## 🧠 Project Philosophy

**CineScoper** aims to bring together rich movie data and flexible viewing options into a single, intuitive UI — combining design and utility in one seamless package.

## 🛠️ Installation

```bash
git clone https://github.com/Tommy0412/cinescoper.git
cd cinescoper
npm install
```

Rename config.env to .env and Edit `.env` file in the root directory:

```env
VITE_SITE_NAME=
VITE_TMDB_API_KEY=
VITE_TELEGRAM_ID=
VITE_DONATION_MESSAGE="If you like it..."
VITE_DONATION_LINK="http://ko-fi.com/embedsito"
VITE_DONATION_BUTTON_TEXT="DONATE"
```
Build app 

```bash
npm run build
```

Then run the app:

```bash
npm run dev
```
Hostinh the app
upload content of dist folder to cloudflare pages, use with apache, nginx server etc...

## 👨‍💻 Created By

- 🧠 [munie-i](https://github.com/munie-i)  
- ⚙️ [Tommy0412](https://github.com/Tommy0412)

## 📸 Preview

![CineScoper Preview](screenshot.png)

## 🌍 Live Demo

https://embedsito.xyz

## 📜 License

MIT License
