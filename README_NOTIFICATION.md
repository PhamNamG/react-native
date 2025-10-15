# 🔔 Push Notification - Tóm tắt

## App mobile CHỈ NHẬN notification, KHÔNG GỬI

---

## 📱 3 Files chính

### 1. `lib/notifications/push-notification.ts` (101 dòng)
```typescript
// Chỉ có 3 functions:
registerForPushNotificationsAsync()  // Auto gọi khi app start
unregisterPushToken(token)           // Hủy token
isNotificationEnabled()              // Check permission
```

### 2. `app/_layout.tsx` (67 dòng)
```typescript
useEffect(() => {
  // 1. Auto register token
  registerForPushNotificationsAsync();

  // 2. Handle notification tap → navigate
  Notifications.addNotificationResponseReceivedListener(response => {
    router.push(`/series/${response.data.categorySlug}`);
  });
}, []);
```

### 3. `components/notification-settings.tsx` (125 dòng)
```typescript
// Chỉ hiển thị:
- Status: BẬT/TẮT
- Button mở system settings
- Info text
```

---

## 🎯 Flow đơn giản

```
User mở app
    ↓
App register token → Backend lưu token
    ↓
Admin thêm phim (từ Dashboard)
    ↓
Backend gửi notification (qua Expo API)
    ↓
User tap notification
    ↓
App navigate to /series/[slug]
```

---

## 🧪 Test

```bash
# 1. Start app
npx expo start

# 2. Scan QR với physical device
# 3. Accept notification permission
# 4. Check console: "✅ Đã đăng ký push notification"

# 5. Admin thêm episode từ dashboard
# 6. Nhận notification
# 7. Tap → Navigate đến series
```

---

## 🔧 Build

```bash
# Build APK
eas build --profile preview --platform android
```

---

## 📝 Backend API (Dashboard dùng)

**Gửi notification:**
```http
POST https://hh3d.id.vn/api/notification/send
{
  "secretKey": "your-secret-key",
  "type": "new_episode",
  "title": "Tập 5 mới đã ra! 🎬",
  "body": "Ne Zha - Tập 5",
  "categorySlug": "ne-zha",
  "episode": 5
}
```

---

## ✅ Checklist

- [x] Install packages
- [x] Config app.json (plugin + permissions)
- [x] Register token service (3 functions)
- [x] App handler (register + navigate)
- [x] Settings UI (status display)
- [x] Documentation

---

**Chi tiết:** Xem `PUSH_NOTIFICATION_SETUP.md`


