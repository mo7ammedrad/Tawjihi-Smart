# Tawjihi Platform

منصّة تعليميّة كاملة مبنية على MERN (MongoDB, Express, React, Node) لتقديم دروس التوجيهي إلكترونياً مع أدوار للطلاب، المعلّمين، والمدراء، ودعم دفع آمن، وإدارة محتوى، إضافة إلى شات مساعد دراسي مدعوم بالذكاء الاصطناعي.

## المزايا الرئيسية
- مصادقة وصلاحيات: تسجيل دخول أدوار (طالب، معلّم، مدير) مع JWT و OAuth (Google/Facebook).
- إدارة المقررات والدروس: فيديوهات، ملفات، موارد إضافية، تقييمات وتعليقات.
- متجر ودفع: سلة مشتريات، Wishlist، دفع عبر Stripe.
- ملفات وميديا: رفع إلى Cloudinary مع تحكّم بالأنواع والأحجام.
- شات AI للطلاب: نطاق الإجابات ضمن المقررات المسجَّل فيها الطالب، يدعم مرفقات (صور/ملفات) مع الرسالة.

## المتطلبات
- Node.js 18+
- MongoDB
- حساب Cloudinary
- مفاتيح Stripe (للدفع)

## الإعداد السريع
### 1) Backend
```bash
cd backend
npm install
cp config-lock.env config.env   # أو انسخ الإعدادات المناسبة
npm run dev
```
أهم متغيرات البيئة في `config.env`:
```env
PORT=5000
DB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# إعدادات الشات (اختياري لضبط السرعة والدقة)
AI_MAX_CONTEXT_CHARS=400
AI_MAX_LESSONS=1
OLLAMA_BASE_URL=http://127.0.0.1:11435
OLLAMA_MODEL=mistral:7b
```

### 2) Frontend
```bash
cd frontend
npm install
npm start
```
الواجهة ستعمل على `http://localhost:3000`.

## دليل شات المساعد الدراسي (AI Chat)
- الظهور: زر عائم أسفل يمين الواجهة للطلاب (role=user). التصميم داكن بتدرجات زرقاء وشارة “متصل الآن”.
- النطاق: المساعد يجيب فقط من مواد الطالب. تظهر شارة توضيح داخل المحادثة.
- المرفقات: يمكن رفع حتى 3 ملفات (صور أو pdf/doc/docx/txt) بحجم 5MB لكل ملف. تُحفظ مؤقتاً في `backend/uploads/chat` وتظهر روابطها في الرسائل.
- التخزين: كل محادثة تخزَّن في `AiChatLog` مع المرفقات والاستشهادات.
- السرعة: تم تقليص `MAX_CONTEXT_CHARS` إلى 400 و `MAX_LESSONS` إلى 1 وتعطيل تحليل PDF في الاسترجاع لتسريع الرد. يمكن تعديل القيم عبر متغيرات البيئة حسب الحاجة.

### نقطة النهاية
- `POST /api/v1/ai/chat`
- الطلب: `multipart/form-data`
  - `message`: نص (مطلوب إذا لا توجد ملفات)
  - `attachments`: حتى 3 ملفات
- الاستجابة النموذجية:
```json
{
  "inScope": true,
  "answer": "النص",
  "citations": [
    {"lessonTitle": "...", "courseTitle": "...", "lessonId": "...", "courseId": "..."}
  ],
  "attachments": [
    {"url": "/uploads/chat/..", "originalName": "...", "mimeType": "...", "size": 1234}
  ]
}
```
الحماية: `protect` + `allowedTo('user')` مع معدل محدود `aiChatRateLimit`.

## نصائح الأداء
- استخدم نموذج خفيف وسريع (`OLLAMA_MODEL`)، واحفظ `AI_MAX_CONTEXT_CHARS` صغيراً.
- أوقف تحليل PDF (مُعطّل حالياً) أو فعّله عند الحاجة لدقة أعلى.
- فعّل الضغط HTTP/2 أو Gzip على الخادم لتحسين النقل.

## مسارات مهمة في الكود
- Frontend Chat UI: `frontend/src/components/AiChatWidget/index.jsx`
- AI Chat Controller: `backend/controllers/AiChatController.js`
- AI Service (سياق ونموذج): `backend/services/aiChat.service.js`
- سجل المحادثات: `backend/models/AiChatLog.js`

## أوامر مفيدة
- تشغيل الخادم الخلفي: `cd backend && npm run dev`
- تشغيل الواجهة: `cd frontend && npm start`
- تهيئة بيانات تجريبية: `cd backend/utils/dummyData && node seeder.js -i`

## الترخيص
MIT License.
