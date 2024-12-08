# 🎲 Fika Wheel

En React-applikation som slumpmässigt väljer vem som ska ansvara för fredagsfikat. Appen använder ett viktat lotterisystem som tar hänsyn till hur många gånger en person tidigare har haft fika och hur länge sedan det var.

## 🚀 Funktioner

- **Slumpmässig fikavärd**: Väljer en ny fikavärd varje fredag
- **Rättvist system**: Viktat lotteri baserat på tidigare fikor
- **Statistik**: Spårar vem som har haft fika och när
- **Teamhantering**: Lägg till eller ta bort teammedlemmar

## 🛠️ Installation

1. Klona repot   ```bash
   git clone https://github.com/[ditt-username]/fika-wheel.git   ```

2. Installera dependencies   ```bash
   npm install   ```

3. Skapa en `.env` fil baserad på `.env.example`   ```bash
   cp .env.example .env   ```

4. Fyll i dina Firebase-credentials i `.env` filen

5. Starta utvecklingsservern   ```bash
   npm run dev   ```

## 🔧 Teknisk stack

- React + TypeScript
- Vite
- Firebase/Firestore
- Tailwind CSS

## 📝 Miljövariabler

Följande miljövariabler krävs i `.env` filen:
