# 🌐 Milestone dApp MVP Tasks

## 🎨 Theme Setup

- [x] Configure TailwindCSS cyberpunk theme
  ```typescript
  // tailwind.config.js
  {
    theme: {
      extend: {
        colors: {
          'cyber-black': '#000000',
          'cyber-dark': '#1A1A1A',
          'cyber-purple': '#8A2BE2',
          'cyber-neon': '#9370DB',
          'cyber-pink': '#FF00FF',
          'cyber-magenta': '#FF00CC',
          'cyber-deep-purple': '#4B0082',
        },
        boxShadow: {
          'neon': '0 0 5px #8A2BE2, 0 0 20px #8A2BE2',
        }
      }
    }
  }
  ```

## 🏠 Home Page (/pages/index.tsx)

- [x] Create hero section with "Enter the Milestone" heading
- [x] Add three portal cards:
  ```typescript
  const portals = [
    { title: "ADMIN", path: "/admin", icon: "shield" },
    { title: "NGO", path: "/ngo", icon: "building" },
    { title: "COMPANY", path: "/company", icon: "briefcase" },
  ];
  ```
- [x] Implement wallet connect integration
- [x] Add cyberpunk background pattern

## 🧱 Core Components

- [x] Create WalletButton component
- [x] Build TransactionStatus component
- [x] Design CyberForm component for inputs
- [x] Create LoadingSpinner with purple animation

## 👨‍💼 Admin Dashboard (/pages/admin/index.tsx)

- [x] Build admin initialization form:
  ```typescript
  interface AdminInit {
    maxProjects: number; // u32
    feeBasisPoints: number; // u16 (50 = 0.5%)
  }
  ```
- [x] Add transaction confirmation modal
- [x] Create admin stats display

## 🏛️ NGO Dashboard (/pages/ngo/index.tsx)

- [⏳] Build NGO registration form:
  ```typescript
  interface NgoInit {
    name: string; // max 20 chars
  }
  ```
- [ ] Add validation for name length
- [ ] Create NGO profile view

## 🏢 Company Dashboard (/pages/company/index.tsx)

- [ ] Build company registration form:
  ```typescript
  interface CompanyInit {
    name: string; // max 40 chars
    businessRegNum: string; // max 24 chars
  }
  ```
- [ ] Add form validations
- [ ] Create company profile view

## 🔄 State Management

- [x] Set up wallet context
- [ ] Create account type store
- [ ] Implement transaction state management

## 🚀 Testing & Deployment

- [ ] Test all initialization flows
- [ ] Test wallet integration
- [ ] Test form validations
- [ ] Deploy to Vercel

## 🎨 Styling Guidelines

- Use black backgrounds with purple gradients
- Add neon glow effects on buttons/cards
- Implement cyberpunk typography (Orbitron/Blender)
- Add hover animations with purple accents
- Use sharp angles and geometric patterns
- Include subtle matrix-style animations

---

✅ = Completed | ⏳ = In Progress | ❌ = Blocked

To mark a task as complete, replace "[ ]" with "[x]"

## ⚠️ Notes and Cautions

- **ProjectStatus Enum Serialization Issue**: When interacting with the Anchor program on devnet, be aware that some instruction structs don't properly declare the ProjectStatus enum in their #[instruction()] attributes. This mismatch may cause serialization/deserialization errors when calling instructions that use ProjectStatus as a parameter (especially edit_project_account). Handle with care in frontend interactions.
