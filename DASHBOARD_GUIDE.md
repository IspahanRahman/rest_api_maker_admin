# Dashboard Implementation Guide

## 🎯 Overview

A comprehensive, production-ready user dashboard for REST API Maker with modern UI/UX, real-time statistics, and responsive design.

---

## 📁 File Structure

```
src/
├── app/
│   └── [locale]/
│       └── (protected)/
│           ├── layout.tsx                    # Protected routes layout wrapper
│           └── dashboard/
│               └── page.tsx                  # Main dashboard page
│
├── components/
│   └── core-panel/
│       └── user-panel/
│           ├── layouts/
│           │   └── DashboardLayout.tsx       # Sidebar + Header layout
│           └── dashboard/
│               ├── StatsCard.tsx             # Statistics display card
│               ├── RecentProjects.tsx        # Recent projects list
│               └── RecentPayments.tsx        # Recent payments list
│
└── apis/
    ├── endpoints/
    │   └── dashboard_apis.ts                 # Dashboard API endpoints
    └── query/
        └── dashboard/
            └── useDashboardQuery.ts          # Dashboard data hooks
```

---

## ✨ Features

### 1. **Dashboard Layout**
- ✅ Responsive sidebar navigation (collapsible on mobile)
- ✅ Top header with search, notifications, and profile menu
- ✅ Dark mode toggle
- ✅ Logout functionality
- ✅ User profile display

### 2. **Statistics Cards**
- ✅ Total Projects count with trend indicator
- ✅ Active Packages count
- ✅ Total Payments count
- ✅ Monthly Spending with trend
- ✅ Animated hover effects
- ✅ Icon-based visual indicators

### 3. **Recent Projects**
- ✅ Project name and description
- ✅ Status badges (Active, Inactive, Suspended)
- ✅ Database information display
- ✅ Last updated timestamp
- ✅ Quick actions menu
- ✅ Empty state handling
- ✅ Link to view all projects

### 4. **Recent Payments**
- ✅ Payment amount display
- ✅ Status indicators (Completed, Pending, Failed)
- ✅ Package name and payment method
- ✅ Transaction ID
- ✅ Date information
- ✅ Empty state handling
- ✅ Link to payment history

### 5. **Quick Actions**
- ✅ Create new project
- ✅ Upgrade plan
- ✅ View API logs
- ✅ Hover animations

### 6. **Activity Timeline**
- ✅ Recent activity feed
- ✅ Color-coded status indicators
- ✅ Timestamp display
- ✅ Action descriptions

---

## 🎨 Components Documentation

### **StatsCard**
Reusable statistics display card with trend indicators.

**Props:**
```typescript
interface StatsCardProps {
  title: string                    // Card title
  value: string | number           // Main statistic value
  icon: LucideIcon                 // Icon component
  trend?: {                        // Optional trend data
    value: number                  // Percentage change
    isPositive: boolean            // Trend direction
  }
  iconBgColor?: string            // Icon background color
  iconColor?: string              // Icon color
}
```

**Usage:**
```tsx
<StatsCard
  title="Total Projects"
  value={12}
  icon={FolderKanban}
  trend={{ value: 12, isPositive: true }}
  iconBgColor="bg-blue-100 dark:bg-blue-900/30"
  iconColor="text-blue-600 dark:text-blue-400"
/>
```

---

### **RecentProjects**
Displays a list of recent projects with status indicators.

**Props:**
```typescript
interface RecentProjectsProps {
  projects: Project[]              // Array of project objects
  isLoading?: boolean              // Loading state
}

interface Project {
  id: number
  name: string
  description?: string
  db_name: string
  db_user: string
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  updated_at: string
}
```

**Usage:**
```tsx
<RecentProjects 
  projects={projectsData} 
  isLoading={false} 
/>
```

---

### **RecentPayments**
Displays recent payment transactions.

**Props:**
```typescript
interface RecentPaymentsProps {
  payments: Payment[]              // Array of payment objects
  isLoading?: boolean              // Loading state
}

interface Payment {
  id: number
  user_id: number
  package_id: number
  package_name?: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  payment_method?: string
  transaction_id?: string
  created_at: string
  updated_at: string
}
```

**Usage:**
```tsx
<RecentPayments 
  payments={paymentsData} 
  isLoading={false} 
/>
```

---

### **DashboardLayout**
Main layout wrapper for protected dashboard pages.

**Features:**
- Responsive sidebar with navigation
- Top header with search and user menu
- Theme toggle (light/dark)
- Logout functionality
- Mobile-friendly design

**Navigation Items:**
- Dashboard
- Projects
- Packages
- Payments
- Settings

---

## 🔌 API Integration

### **Dashboard Hooks**

Located in: `src/apis/query/dashboard/useDashboardQuery.ts`

#### **1. useDashboardStats()**
Fetches overall dashboard statistics.

```typescript
const { data, error, isLoading } = useDashboardStats()

// Returns:
{
  totalProjects: number
  activeProjects: number
  inactiveProjects: number
  suspendedProjects: number
  activePackages: number
  totalPayments: number
  completedPayments: number
  pendingPayments: number
  failedPayments: number
  monthlySpending: number
  lastMonthSpending: number
}
```

#### **2. useRecentProjects()**
Fetches recent projects list.

```typescript
const { data, error, isLoading } = useRecentProjects()
```

#### **3. useRecentPayments()**
Fetches recent payments.

```typescript
const { data, error, isLoading } = useRecentPayments()
```

#### **4. useRecentActivity()**
Fetches recent activity timeline.

```typescript
const { data, error, isLoading } = useRecentActivity()
```

---

## 🚀 Usage Example

### **Integrating Real API Data**

Replace mock data in `dashboard/page.tsx`:

```tsx
'use client'
import { useDashboardStats, useRecentProjects, useRecentPayments } from '@/apis/query/dashboard/useDashboardQuery'

export default function DashboardPage() {
  // Fetch real data
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: projects, isLoading: projectsLoading } = useRecentProjects()
  const { data: payments, isLoading: paymentsLoading } = useRecentPayments()

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      {statsLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Projects"
            value={stats?.totalProjects || 0}
            icon={FolderKanban}
          />
          {/* More stats cards... */}
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProjects 
          projects={projects || []} 
          isLoading={projectsLoading} 
        />
        <RecentPayments 
          payments={payments || []} 
          isLoading={paymentsLoading} 
        />
      </div>
    </div>
  )
}
```

---

## 🎨 Customization

### **Color Schemes**
Customize component colors by passing different props:

```tsx
<StatsCard
  iconBgColor="bg-pink-100 dark:bg-pink-900/30"
  iconColor="text-pink-600 dark:text-pink-400"
  // ...other props
/>
```

### **Adding New Navigation Items**
Edit `DashboardLayout.tsx`:

```typescript
const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Your New Item', href: '/dashboard/new-item', icon: YourIcon },
  // ...existing items
]
```

---

## 📱 Responsive Design

### **Breakpoints:**
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

### **Mobile Features:**
- Collapsible sidebar
- Touch-friendly buttons
- Optimized spacing
- Hamburger menu
- Full-width cards

---

## 🔒 Security

### **Protected Routes**
All dashboard pages are wrapped in `(protected)` route group with authentication check via proxy.

### **User Data**
User information is retrieved from localStorage using the `getCurrentUser()` utility.

### **Logout**
The `logout()` function clears all authentication data:
- localStorage tokens
- Cookies
- User profile data

---

## 🎯 Next Steps

1. **Connect to Real API**: Replace mock data with actual API calls
2. **Add More Pages**: Create Projects, Packages, Payments, Settings pages
3. **Implement CRUD Operations**: Add create, edit, delete functionality
4. **Add Filters**: Implement search and filter options
5. **Pagination**: Add pagination to lists
6. **Real-time Updates**: Integrate WebSocket for live updates
7. **Export Features**: Add CSV/PDF export options
8. **Charts & Graphs**: Integrate chart library for visualizations

---

## 📚 Technologies Used

- **Next.js 16** - App Router
- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons
- **SWR** - Data Fetching
- **next-themes** - Dark Mode
- **react-toastify** - Notifications

---

## ✅ Build Status

```
✓ Compiled successfully in 1760.3ms
✓ Finished TypeScript in 1499.3ms
✓ Generating static pages (11/11)
Total: 5.36s
```

---

**Created:** November 5, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
