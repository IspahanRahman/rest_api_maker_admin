# Authentication System Documentation

## 🎨 Overview

A modern, elegant authentication system with Login and Registration pages featuring:
- ✨ Beautiful, responsive UI with dark mode support
- 🔐 Full API integration
- ✅ Form validation
- 🎯 Loading states
- 🚀 TypeScript support
- 📱 Mobile-friendly design
- 🎨 Smooth animations and transitions

---

## 📁 File Structure

```
src/
├── app/
│   └── [locale]/
│       └── (public)/
│           └── (auth)/
│               ├── login/
│               │   └── page.tsx          # Login route
│               ├── register/
│               │   └── page.tsx          # Register route
│               └── layout.tsx            # Auth layout
│
├── components/
│   ├── core-panel/
│   │   └── public-panel/
│   │       └── auth/
│   │           ├── Login.tsx            # Login component
│   │           └── Register.tsx         # Register component
│   │
│   └── lib/
│       └── ui-elements/
│           ├── form/
│           │   ├── FormInput.tsx        # Reusable input
│           │   └── PasswordInput.tsx    # Password with show/hide
│           └── button/
│               └── LoadingButton.tsx    # Button with loading state
│
├── apis/
│   ├── endpoints/
│   │   └── auth_apis.ts                 # API endpoints
│   └── mutation/
│       └── auth/
│           ├── useLoginMutation.ts      # Login API hook
│           └── useRegisterMutation.ts   # Register API hook
│
├── types/
│   └── auth.ts                          # Auth type definitions
│
└── lib/
    └── utils.ts                         # Utility functions
```

---

## 🚀 Features

### Login Page

#### Core Features:
- ✅ Email and password authentication
- ✅ "Remember me" checkbox
- ✅ Forgot password link
- ✅ Social login buttons (Google, GitHub)
- ✅ Loading state during submission
- ✅ Error handling and display
- ✅ Link to registration page
- ✅ Auto-redirect to dashboard on success

#### UI Features:
- Modern card design
- Smooth transitions
- Focus states
- Error messages with icons
- Responsive layout
- Dark mode support

### Registration Page

#### Core Features:
- ✅ Full name input
- ✅ Email input
- ✅ Password with strength indicator
- ✅ Password confirmation with match indicator
- ✅ Terms and conditions checkbox
- ✅ Social signup buttons (Google, GitHub)
- ✅ Loading state during submission
- ✅ Error handling and display
- ✅ Link to login page
- ✅ Auto-redirect on success

#### UI Features:
- Password strength meter (5 levels)
- Visual password match indicator
- Real-time validation
- Elegant form layout
- Smooth animations
- Mobile-optimized

---

## 🎨 Component Documentation

### 1. **FormInput Component**

Reusable form input with label, error handling, and validation.

```tsx
<FormInput
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={handleChange}
  error={errors.email}
  required
  helperText="We'll never share your email"
/>
```

**Props:**
- `label` - Input label text
- `error` - Error message to display
- `helperText` - Helper text below input
- `containerClassName` - Custom container styling
- All standard HTML input attributes

### 2. **PasswordInput Component**

Password input with show/hide toggle and optional strength indicator.

```tsx
<PasswordInput
  label="Password"
  value={password}
  onChange={handleChange}
  error={errors.password}
  showStrength={true}
  required
/>
```

**Props:**
- `showStrength` - Display password strength meter
- All FormInput props

**Password Strength Levels:**
- 0: No password
- 1-2: Weak (red)
- 3: Medium (yellow)
- 4-5: Strong (green)

**Strength Criteria:**
- Length (8+ chars, 12+ chars)
- Lowercase letters
- Uppercase letters
- Numbers
- Special characters

### 3. **LoadingButton Component**

Button with loading state and spinner.

```tsx
<LoadingButton
  type="submit"
  isLoading={isLoading}
  loadingText="Signing in..."
  variant="primary"
  size="lg"
>
  Sign In
</LoadingButton>
```

**Props:**
- `isLoading` - Show loading spinner
- `loadingText` - Text during loading
- `variant` - primary | secondary | outline | ghost
- `size` - sm | md | lg

---

## 🔌 API Integration

### Login API

**Endpoint:** `POST /auth/login`

**Request:**
```typescript
{
  email: string
  password: string
}
```

**Response:**
```typescript
{
  status: boolean
  message: string
  data: {
    token: string
    user: {
      id: number | string
      name: string
      email: string
      avatar?: string
      role?: string
    }
  }
}
```

**Usage:**
```tsx
import { useLoginMutation } from '@/apis/mutation/auth/useLoginMutation'

const { submit, isLoading, data, errors, setData } = useLoginMutation()

const handleLogin = async () => {
  const result = await submit()
  if (result.status) {
    // Success
    localStorage.setItem('auth_token', result.data.token)
    router.push('/dashboard')
  }
}
```

### Register API

**Endpoint:** `POST /auth/register`

**Request:**
```typescript
{
  name: string
  email: string
  password: string
  password_confirmation: string
  terms_accepted?: boolean
}
```

**Response:**
```typescript
{
  status: boolean
  message: string
  data: {
    token: string  // Optional, if auto-login
    user: {
      id: number | string
      name: string
      email: string
    }
  }
}
```

**Usage:**
```tsx
import { useRegisterMutation } from '@/apis/mutation/auth/useRegisterMutation'

const { submit, isLoading, data, errors, setData } = useRegisterMutation()

const handleRegister = async () => {
  const result = await submit()
  if (result.status) {
    // Success
    router.push('/login') // or auto-login
  }
}
```

---

## 🎯 Usage Examples

### Basic Login

```tsx
'use client'
import { useLoginMutation } from '@/apis/mutation/auth/useLoginMutation'
import { FormInput } from '@/components/lib/ui-elements/form/FormInput'
import { PasswordInput } from '@/components/lib/ui-elements/form/PasswordInput'
import { LoadingButton } from '@/components/lib/ui-elements/button/LoadingButton'

export default function LoginForm() {
  const { submit, isLoading, data, errors, setData } = useLoginMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await submit()
    if (result?.status) {
      // Handle success
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Email"
        type="email"
        value={data.email}
        onChange={(e) => setData('email', e.target.value)}
        error={errors.email}
      />
      
      <PasswordInput
        label="Password"
        value={data.password}
        onChange={(e) => setData('password', e.target.value)}
        error={errors.password}
      />
      
      <LoadingButton type="submit" isLoading={isLoading}>
        Login
      </LoadingButton>
    </form>
  )
}
```

---

## 🎨 Styling & Theming

All components use CSS custom properties from `globals.css`:

### Colors:
- `--color-surface` - Background color
- `--color-surface-card` - Card backgrounds
- `--color-surface-input` - Input backgrounds
- `--color-text-primary-sem` - Primary text
- `--color-text-secondary` - Secondary text
- `--color-border-subtle` - Borders
- `--color-primary-500` - Primary brand color
- `--color-error-500` - Error state
- `--color-success-500` - Success state

### Dark Mode Support:
All components automatically adapt to dark mode via CSS variables.

---

## 📱 Responsive Design

### Breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile Optimizations:
- Touch-friendly input sizes
- Optimized spacing
- Stack social buttons on small screens
- Adaptive font sizes

---

## ✅ Validation

### Email Validation:
- Required field
- Valid email format
- Real-time validation

### Password Validation:
- Minimum 8 characters
- Strength indicator (optional)
- Match confirmation (register)

### Registration Validation:
- All fields required
- Password must match confirmation
- Terms must be accepted

---

## 🔐 Security Features

1. **Password Security:**
   - Hidden by default
   - Toggle visibility
   - Strength indicator
   - Minimum length requirement

2. **Token Management:**
   - Stored in localStorage
   - Optional cookie for "remember me"
   - Auto-included in API requests

3. **Error Handling:**
   - Server errors displayed
   - Network errors caught
   - Validation errors shown per field

---

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] API endpoints set correctly
- [ ] CORS configured on backend
- [ ] Terms & Privacy pages created
- [ ] Email verification setup (if needed)
- [ ] Password reset flow implemented
- [ ] Rate limiting configured
- [ ] Social OAuth configured (if using)

---

## 🔧 Customization

### Change Primary Color:
Update in `globals.css`:
```css
--color-primary-500: #your-color;
--color-primary-600: #your-darker-color;
```

### Add More Social Providers:
Add buttons in Login.tsx and Register.tsx:
```tsx
<button type="button" className="...">
  <YourProviderIcon />
  Provider Name
</button>
```

### Custom Validation:
Extend validation in component:
```tsx
if (password.length < 12) {
  toast.error('Password must be 12+ characters')
  return
}
```

---

## 🐛 Troubleshooting

### Issue: Form not submitting
- Check API endpoint configuration
- Verify network connectivity
- Check console for errors

### Issue: Styles not applying
- Ensure Tailwind is configured
- Check dark mode class on html element
- Verify CSS variables in globals.css

### Issue: Navigation not working
- Check locale parameter
- Verify route exists
- Check router configuration

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

**Created:** November 4, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
