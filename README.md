# BillEasy Payments

A 2-screen payment flow application built with Astro, SolidJS, TypeScript, and TailwindCSS.

## Live Demo

---

## AI Tools Used

- I have used **Claude Code** to build this project.
- I have used the Antigravity IDE
- Lazygit for git usage

---

## Architecture

```
src/
├── components/
│   ├── PaymentForm.tsx      # SolidJS payment form component
│   └── TransactionReceipt.tsx # SolidJS receipt component
├── layouts/
│   └── Layout.astro         # Base HTML layout
├── pages/
│   ├── index.astro          # Payment form page
│   └── receipt.astro        # Receipt page
├── stores/
│   └── paymentStore.ts      # State management with signals + sessionStorage
└── types/
    └── payment.ts           # TypeScript interfaces
```

### Key Design Decisions

1. **State Management**: Uses SolidJS signals combined with sessionStorage for data persistence across page navigation. This ensures transaction data survives full page reloads.

2. **Validation**: Client-side validation with real-time error clearing as users type. Validates:
   - Required fields
   - Card number length (13-19 digits)
   - Expiry date format (MM/YY)
   - CVV length (3-4 digits)
   - Amount > 0

3. **Component Architecture**: SolidJS components are hydrated on the client using Astro's `client:load` directive for immediate interactivity.

4. **Styling**: TailwindCSS with a clean, modern design featuring gradients, shadows, and smooth transitions.

---

## Project Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd billeasy-payments

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at `localhost:4321` |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
