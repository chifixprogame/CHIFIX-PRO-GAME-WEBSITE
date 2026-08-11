// ============================================
// 📦 إدارة البيانات في localStorage
// ============================================

function getData() {
    const stored = localStorage.getItem('chifixData');
    return stored ? JSON.parse(stored) : [];
}

function saveData(data) {
    localStorage.setItem('chifixData', JSON.stringify(data));
}

// ============================================
// ⭐ نظام التقييم (5 نجوم)
// ============================================

function saveRating(itemId, rating) {
    const data = getData();
    const item = data.find(i => i.id === itemId);
    if (!item) return;

    if (!item.ratings) item.ratings = [];
    item.ratings.push(rating);

    const total = item.ratings.reduce((a, b) => a + b, 0);
    item.averageRating = total / item.ratings.length;
    item.totalRatings = item.ratings.length;

    saveData(data);
    
    // تحديث العرض حسب النوع
    if (item.type === 'course') displayItems('course', 'coursesContainer');
    else if (item.type === 'console') displayItems('console', 'consolesContainer');
    else if (item.type === 'part') displayItems('part', 'partsContainer');
}

function renderStars(rating, itemId) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    let starsHtml = '';
    for (let i = 0; i < fullStars; i++) {
        starsHtml += `<span class="star filled" onclick="rateProduct(${itemId}, ${i+1})">★</span>`;
    }
    if (halfStar) {
        starsHtml += `<span class="star half">★</span>`;
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += `<span class="star empty" onclick="rateProduct(${itemId}, ${fullStars + halfStar + i + 1})">★</span>`;
    }
    return starsHtml;
}

function rateProduct(itemId, rating) {
    if (!confirm(`هل تريد تقييم هذا المنتج بـ ${rating} نجوم؟`)) return;
    saveRating(itemId, rating);
    alert(`✅ تم التقييم بـ ${rating} نجوم!`);
}

// ============================================
// ➕ إضافة عنصر جديد
// ============================================

function addItem() {
    const type = document.getElementById('itemType').value;
    const title = document.getElementById('itemTitle').value.trim();
    const description = document.getElementById('itemDesc').value.trim();
    const price = document.getElementById('itemPrice').value.trim();
    const image = document.getElementById('itemImage').value.trim();
    const images = document.getElementById('itemImages').value.trim();
    const specs = document.getElementById('itemSpecs').value.trim();

    if (!title || !description || !price || !image) {
        alert('❌ الرجاء ملء جميع الحقول الأساسية!');
        return;
    }

    const newItem = {
        id: Date.now(),
        type: type,
        title: title,
        description: description,
        price: price,
        image: image,
        images: images ? images.split(',').map(img => img.trim()) : [],
        specs: specs ? specs.split(',').map(spec => spec.trim()) : [],
        views: 0,
        ratings: [],
        averageRating: 0,
        totalRatings: 0,
        createdAt: new Date().toLocaleString('ar-DZ')
    };

    if (type === 'course') {
        const video = document.getElementById('itemVideo').value.trim();
        if (!video) {
            alert('❌ الرجاء إدخال رابط الفيديو للدورة!');
            return;
        }
        newItem.video = video;
    }

    if (type === 'console') {
        newItem.status = document.getElementById('itemStatus').value;
    }

    const data = getData();
    data.push(newItem);
    saveData(data);

    // تنظيف النموذج
    document.getElementById('itemTitle').value = '';
    document.getElementById('itemDesc').value = '';
    document.getElementById('itemPrice').value = '';
    document.getElementById('itemImage').value = '';
    document.getElementById('itemImages').value = '';
    document.getElementById('itemSpecs').value = '';
    document.getElementById('itemVideo').value = '';

    renderAdminTable();
    updateDashboard();
    renderTopProducts();
    alert('✅ تمت الإضافة بنجاح!');
}

// ============================================
// 🖥️ عرض العناصر في الصفحة الرئيسية
// ============================================

function displayItems(type,
