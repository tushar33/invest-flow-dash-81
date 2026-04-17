# Cursor Prompt — Premium Toast Notification System

Copy and paste the entire prompt below into Cursor (or any AI coding assistant) to implement a unified, premium toast notification system across the entire React Native app.

---

## 🎯 GOAL

Replace **every** alert, dialog, snackbar, and inconsistent feedback message in the app with a single, unified, premium toast notification component that matches our design system.

The toast must look like a polished native iOS/Android notification — **NOT** a system alert dialog with an "OK" button.

---

## 📐 VISUAL SPEC (must match exactly)

Reference mockup: `assets/mockups/mockup-07-admin-users.png` (top of screen)

### Container
- **Position**: Floats at the top of the screen, below the status bar / safe area inset, with 16px horizontal margin
- **Background**: `#2A3B5F` (dark navy elevated surface)
- **Border radius**: `16px`
- **Padding**: `16px` vertical, `16px` horizontal
- **Shadow**: Soft glow with teal tint
  - `shadowColor: '#2DB89A'`
  - `shadowOpacity: 0.25`
  - `shadowRadius: 20`
  - `shadowOffset: { width: 0, height: 4 }`
  - `elevation: 12` (Android)
- **Animation**: Slide down from top (300ms ease-out), slide up on dismiss (200ms ease-in)
- **Auto-dismiss**: 4 seconds (configurable per type)
- **Swipe to dismiss**: Swipe up gesture closes the toast

### Layout (left → right)
1. **Icon badge** (left)
   - 40x40px circle
   - Background color depends on variant (see below)
   - Centered white icon (24px)
2. **Text block** (flex: 1, marginHorizontal: 12)
   - **Title**: DM Sans Bold, 15px, white `#FFFFFF`, single line, ellipsize tail
   - **Description** (optional): DM Sans Regular, 13px, muted `#9BA9C4`, max 2 lines
3. **Close button** (right)
   - X icon, 18px, color `#9BA9C4`
   - 8px hit slop padding

### Progress bar
- 2px tall bar at the **bottom** of the toast card
- Color matches the variant accent
- Animates from 100% width → 0% width over the dismiss duration
- Hidden when `duration: Infinity`

### Variants

| Variant   | Icon       | Icon BG     | Accent      | Use case                          |
|-----------|------------|-------------|-------------|-----------------------------------|
| `success` | check      | `#2DB89A`   | `#2DB89A`   | Confirmations, completed actions  |
| `error`   | x-circle   | `#EF4444`   | `#EF4444`   | Failures, validation errors       |
| `warning` | alert-tri  | `#F59E0B`   | `#F59E0B`   | Cautions (e.g. payout window closed) |
| `info`    | info       | `#3B82F6`   | `#3B82F6`   | Neutral information               |

---

## 🛠 IMPLEMENTATION

### 1. Install dependencies

```bash
npx expo install react-native-reanimated react-native-gesture-handler
npm install lucide-react-native
```

### 2. Create the Toast primitive

**File**: `src/components/ui/Toast.tsx`

Build a reusable `<Toast />` card component that accepts:
```ts
type ToastProps = {
  id: string;
  variant: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number; // ms, default 4000
  onDismiss: (id: string) => void;
};
```

Implementation requirements:
- Use `react-native-reanimated` for slide + progress bar animations
- Use `lucide-react-native` icons: `Check`, `XCircle`, `AlertTriangle`, `Info`, `X`
- Wrap in `GestureDetector` with a swipe-up `Pan` gesture for swipe-to-dismiss
- Title uses `DMSans_700Bold`, description uses `DMSans_400Regular`
- All colors come from `theme/colors.ts` — no hard-coded hex in the component

### 3. Create the Toast provider + hook

**File**: `src/components/ui/ToastProvider.tsx`

```ts
type ToastInput = Omit<ToastProps, 'id' | 'onDismiss'>;

type ToastContextValue = {
  toast: {
    success: (title: string, opts?: Partial<ToastInput>) => void;
    error:   (title: string, opts?: Partial<ToastInput>) => void;
    warning: (title: string, opts?: Partial<ToastInput>) => void;
    info:    (title: string, opts?: Partial<ToastInput>) => void;
    dismiss: (id?: string) => void;
  };
};
```

Requirements:
- Maintain a stacked queue (max 3 visible at once, newest on top)
- Stack toasts vertically with 8px gap
- Render absolutely-positioned overlay above all screens (use a `Portal` or place the overlay in the root navigator)
- Respect safe-area insets (use `react-native-safe-area-context`)
- Expose a `useToast()` hook that returns the `toast` object

### 4. Wire the provider into the app root

**File**: `App.tsx` (or `app/_layout.tsx` for Expo Router)

Wrap the app:
```tsx
<GestureHandlerRootView style={{ flex: 1 }}>
  <SafeAreaProvider>
    <ToastProvider>
      <NavigationContainer>{/* ... */}</NavigationContainer>
    </ToastProvider>
  </SafeAreaProvider>
</GestureHandlerRootView>
```

---

## 🔁 MIGRATION — replace ALL existing feedback

Search the entire codebase and replace every instance of the following with the new `useToast()` API:

| Old pattern                              | New pattern                                                  |
|------------------------------------------|--------------------------------------------------------------|
| `Alert.alert('Success', 'Foo done')`     | `toast.success('Foo done')`                                  |
| `Alert.alert('Error', err.message)`      | `toast.error('Something went wrong', { description: err.message })` |
| `Toast.show({ ... })` (any 3rd-party lib)| `toast.success(...)` / `toast.error(...)`                    |
| `console.log('Saved')` (user-facing)     | `toast.success('Saved')`                                     |
| Custom snackbar / inline banner          | `toast.info(...)` / `toast.warning(...)`                     |

**Cursor: do a project-wide search for `Alert.alert`, `Toast.show`, `Snackbar`, and any custom notification component, then migrate each call site.**

After migration, remove unused imports and uninstall any redundant toast/snackbar libraries.

---

## ✍️ MESSAGE COPY GUIDELINES

Apply these rules when rewriting message strings during migration. Keep them short, human, and specific.

### Rules
1. **Title ≤ 40 characters**, sentence case, no trailing period.
2. **Description is optional** — only add it when it gives the user something they don't already know (an amount, a name, a reason, a next step).
3. **Never use generic phrases** like "Success", "Error", "Done", "Failed". Always describe **what happened**.
4. **Use ₹ for currency**, Indian number formatting (`₹1,00,000`).
5. **Reference entities by name** when available (user name, package amount, etc.).
6. **Errors**: lead with the user-facing impact, put the technical reason in the description.

### Examples — apply these to the corresponding flows

| Flow                          | Variant   | Title                              | Description                              |
|-------------------------------|-----------|------------------------------------|------------------------------------------|
| Admin assigns package         | success   | Package assigned successfully      | ₹1,00,000 added to {userName}'s portfolio |
| Admin cancels package         | success   | Package cancelled                  | Refund of ₹{amount} credited to wallet   |
| Auto Pay mode updated         | success   | Auto Pay set to {MODE}             | —                                        |
| Payout requested              | success   | Payout request submitted           | ₹{amount} will be processed by tomorrow  |
| Payout outside window         | warning   | Payout window closed               | Requests open daily 9 AM – 12 PM IST     |
| Pending payout exists         | warning   | One payout already pending         | Wait for it to complete before requesting again |
| Bank details missing          | warning   | Add bank details to continue       | Required before requesting payouts       |
| Bank details saved            | success   | Bank details saved                 | —                                        |
| Login failed                  | error     | Couldn't sign you in               | {error.message}                          |
| Network error                 | error     | Connection lost                    | Check your internet and try again        |
| Session expired               | info      | Session expired                    | Please sign in again                     |
| ROI logs refreshed            | info      | ROI logs updated                   | Showing latest {count} entries           |
| Package created (admin)       | success   | Package created                    | {roi}% ROI · 12 cycles · 30-day interval |
| Settings saved                | success   | Settings saved                     | —                                        |
| Validation error              | error     | Check the highlighted fields       | —                                        |

---

## ✅ ACCEPTANCE CRITERIA

- [ ] No remaining `Alert.alert`, `Toast.show`, or custom snackbar calls in the codebase
- [ ] All toasts render via the new `<ToastProvider />` and use `useToast()`
- [ ] Toast matches mockup: dark navy card, icon badge, title + description, close button, animated progress bar
- [ ] 4 variants (success, error, warning, info) render with correct colors and icons
- [ ] Slide-in/slide-out animations are smooth at 60fps on a mid-tier Android device
- [ ] Swipe-up gesture dismisses the toast
- [ ] Up to 3 stacked toasts display correctly with 8px spacing
- [ ] All message copy follows the rules above (no "Success" / "Error" titles)
- [ ] Toasts respect safe-area insets on notched devices
- [ ] No hard-coded hex colors inside `Toast.tsx` — all from theme tokens

---

## 📦 DELIVERABLES

1. `src/components/ui/Toast.tsx`
2. `src/components/ui/ToastProvider.tsx`
3. `src/hooks/useToast.ts` (re-exports the hook from the provider)
4. `src/theme/colors.ts` — extended with toast variant tokens
5. App root wired with `ToastProvider`
6. Migration commit replacing every legacy notification call site
7. Removal of any redundant toast/snackbar dependencies from `package.json`
