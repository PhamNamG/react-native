# 🔔 Push Notification - Setup Complete!

> **App mobile CHỈ NHẬN thông báo từ backend.**  
> Dashboard admin sẽ gửi notification qua backend API.

---

## ✅ Đã setup xong

### 📦 Packages
- `expo-notifications` - Nhận và hiển thị notifications
- `expo-device` - Thông tin device
- `expo-constants` - App config

### 📁 Files

**1. Core Service:** `lib/notifications/push-notification.ts`
- `registerForPushNotificationsAsync()` - Đăng ký nhận notification
- `unregisterPushToken()` - Hủy đăng ký
- `isNotificationEnabled()` - Check permission status

**2. App Integration:** `app/_layout.tsx`
- Auto register khi app start
- Handle notification tap → navigate to `/series/[slug]`

**3. Settings UI:** `components/notification-settings.tsx`
- Hiển thị status (BẬT/TẮT)
- Link đến system settings

**4. Config:** `app.json`
- Plugin `expo-notifications`
- Android permissions: `NOTIFICATIONS`, `RECEIVE_BOOT_COMPLETED`

---

## 🚀 Cách hoạt động

### Flow đơn giản:

```
1. User mở app
   ↓
2. App tự động register push token
   POST /api/push-token/register
   {
     token: "ExponentPushToken[xxx]",
     platform: "android",
     deviceName: "Pixel 7"
   }
   ↓
3. Backend lưu token vào database
   ↓
4. Admin thêm phim/episode từ Dashboard
   ↓
5. Backend gửi notification đến tất cả tokens
   ↓
6. User nhận notification
   ↓
7. User tap notification
   ↓
8. App mở và navigate đến /series/[categorySlug]
```

---

## 📱 Test ngay

### Development (Expo Go):
```bash
cd "E:\Test\Test 2"
npx expo start
```

**Yêu cầu:**
- ✅ Physical device (Android/iOS)
- ❌ Emulator/Simulator KHÔNG hỗ trợ

**Khi mở app:**
1. App request notification permission
2. User chấp nhận
3. App register token với backend
4. Console log: `✅ Đã đăng ký push notification: ExponentPushToken[xxx]`

### Production (Build APK):
```bash
eas build --profile preview --platform android
```

---

## 🎯 Backend API

### Mobile → Backend: Register Token (NO AUTH)

```http
POST https://hh3d.id.vn/api/push-token/register
Content-Type: application/json

{
  "token": "ExponentPushToken[xxxxxx]",
  "platform": "android",
  "deviceName": "Pixel 7",
  "appVersion": "1.0.0"
}
```

### Dashboard → Backend: Send Notification (SECRET_KEY)

**Episode mới:**
```http
POST https://hh3d.id.vn/api/notification/send
Content-Type: application/json

{
  "secretKey": "your-secret-key",
  "type": "new_episode",
  "title": "Tập 5 mới đã ra! 🎬",
  "body": "Ne Zha - Tập 5",
  "categoryName": "Ne Zha",
  "categorySlug": "ne-zha",
  "episode": 5
}
```

**Phim mới:**
```http
POST https://hh3d.id.vn/api/notification/send
Content-Type: application/json

{
  "secretKey": "your-secret-key",
  "type": "new_category",
  "title": "Phim mới đã ra mắt! 🎉",
  "body": "Monkey King 3D",
  "categoryName": "Monkey King 3D",
  "categorySlug": "monkey-king-3d"
}
```

---

## 🧪 Testing

### ✅ Test 1: Register Token
1. Mở app trên physical device
2. Accept notification permission
3. Check console: `✅ Đã đăng ký push notification`
4. Check backend database: token đã lưu

### ✅ Test 2: Nhận Notification (App đang mở)
1. Admin thêm episode từ dashboard
2. Backend auto gửi notification
3. App hiển thị notification banner

### ✅ Test 3: Tap Notification → Navigate
1. Nhận notification (app đang mở hoặc background)
2. Tap vào notification
3. App navigate đến `/series/ne-zha`

### ✅ Test 4: App đóng hoàn toàn
1. Close app (swipe kill)
2. Admin gửi notification
3. Device nhận notification
4. Tap → App mở + navigate đến đúng trang

---

## ⚙️ Settings

**Path:** Settings → Notifications

**Hiển thị:**
- ✅ Status (BẬT/TẮT)
- ✅ Mô tả
- ✅ Link đến system settings (nếu tắt)

**User có thể:**
- Mở system settings để bật/tắt notifications
- Xem status hiện tại

---

## 🐛 Troubleshooting

### ❌ Không nhận notification

**1. Device type:**
```
✅ Physical device (Android/iOS)
❌ Emulator/Simulator
```

**2. Permission:**
```bash
Android: Settings → Apps → O3D → Notifications → ON
iOS: Settings → O3D → Notifications → Allow
```

**3. Check logs:**
```
✅ Đã đăng ký push notification: ExponentPushToken[xxx]
❌ User từ chối notification permission
❌ Thiếu Expo project ID
```

**4. Backend:**
- API running: https://hh3d.id.vn/api
- Token đã lưu trong database
- Admin gửi đúng format

### ❌ Navigation không work

**Check notification data:**
```javascript
{
  type: "new_episode",
  categorySlug: "ne-zha"  // ← REQUIRED để navigate
}
```

**Route phải tồn tại:**
- `/series/[id].tsx` ✅

---

## 📊 Code Summary

### Notification Handler (`app/_layout.tsx`)
```typescript
// Handle notification tap
responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  const data = response.notification.request.content.data;
  
  if (data.categorySlug) {
    router.push(`/series/${data.categorySlug}`);
  }
});
```

### Register Token (`lib/notifications/push-notification.ts`)
```typescript
export async function registerForPushNotificationsAsync() {
  // 1. Request permission
  // 2. Get Expo push token
  // 3. POST /api/push-token/register
  // 4. Backend lưu token
}
```

### Settings UI (`components/notification-settings.tsx`)
```typescript
export function NotificationSettings() {
  // Hiển thị status (BẬT/TẮT)
  // Button mở system settings
}
```

---

## 🎉 Done!

**Mobile App:**
- ✅ Register token tự động
- ✅ Nhận notifications
- ✅ Navigate khi tap notification
- ✅ Settings UI

**Backend:**
- ✅ Lưu tokens
- ✅ API gửi notification (cho Dashboard)
- ✅ Auto send khi add episode/category

**Dashboard:**
- ⏳ Cần implement UI gửi notification
- ⏳ Call API `/notification/send` với `secretKey`

---

## 📚 API Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/push-token/register` | POST | NO | Mobile đăng ký token |
| `/push-token/unregister` | POST | NO | Mobile hủy token |
| `/notification/send` | POST | SECRET_KEY | Dashboard gửi notification |

**Expo Project ID:** `90333c20-3f35-4480-a490-1d9ab15eb0c1`  
**Backend URL:** `https://hh3d.id.vn/api`

---

**🚀 Ready to use!**

```bash
# Build and test
eas build --profile preview --platform android
```
