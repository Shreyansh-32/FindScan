# FindScan - Bollinger Bands Chart Assignment

This project is a production-ready Bollinger Bands indicator built for a charting module as part of the FindScan Frontend Intern assignment. It features a fully interactive candlestick chart with a customizable Bollinger Bands overlay, complete with a settings panel for real-time adjustments.

## 🚀 Live Demo

**You can view the live deployed application here:** [https://find-scan-zeta.vercel.app/]

## ✨ Features

- **Interactive Candlestick Chart**: Renders historical OHLCV data using the `klinecharts` library
- **Custom Bollinger Bands Indicator**: Overlays a fully custom-calculated Bollinger Bands indicator on the main chart
- **Dynamic Settings Panel**: A user-friendly settings panel built with ShadCN/UI allows for real-time adjustments to the indicator's parameters:
  - **Inputs Tab**: Configure `Length`, `Standard Deviation`, and `Offset`
  - **Style Tab**: Control the visibility, color, and line width of each band, plus the background fill
- **Real-time Updates**: Any change in the settings panel immediately updates the chart without a page refresh
- **Responsive Tooltip**: A TradingView-style tooltip follows the crosshair and displays the values for the candle and the indicator lines

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **UI**: React
- **Styling**: Tailwind CSS
- **Component Library**: ShadCN/UI
- **Charting Library**: KLineCharts

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm

### Setup and Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shreyansh-32/FindScan.git
   cd FindScan
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.


## 🎯 Assignment Notes

- **Formulas Used**: The Bollinger Bands are calculated using the standard formulas. The Basis is a Simple Moving Average (SMA), and the upper/lower bands are derived using the **Population Standard Deviation**
- **KLineCharts Version**: The version of `klinecharts` used in this project is `10.0.0-alpha5`
- **Real-time Configuration**: All indicator parameters can be adjusted in real-time through the intuitive settings panel

## 🔧 Key Components

### Bollinger Bands Calculation
- **Basis (Middle Band)**: Simple Moving Average (SMA) of the closing prices
- **Upper Band**: Basis + (Standard Deviation × Multiplier)
- **Lower Band**: Basis - (Standard Deviation × Multiplier)

### Settings Panel Features
- **Length**: Adjustable period for the moving average calculation
- **Standard Deviation**: Multiplier for the bands' width
- **Offset**: Horizontal displacement of the indicator
- **Style Customization**: Colors, line widths, and visibility toggles for each band

## 📝 License

This project is created as part of the FindScan Frontend Intern assignment.

---