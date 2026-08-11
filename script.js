// ============================================
// ⭐ نظام تقييم المنتجات (5 نجوم)
// ============================================

// دالة لحفظ التقييم
function saveRating(itemId, rating) {
    const data = getData();
    const item = data.find(i => i.id === itemId);
    if (!item) return;

    // إذا كان التقييم موجوداً، نعدله
    if (item.ratings) {
        item.ratings.push(rating);
    } else {
        item.ratings = [rating];
    }

    // حساب متوسط التقييم
    const total = item.ratings.reduce((a, b) => a + b, 0);
    item.averageRating = total / item.ratings.length;
    item.totalRatings = item.ratings.length;

    saveData(data);
    displayItems(item.type, item.type === 'course' ? 'coursesContainer' : 
                           item.type === 'console' ? 'consolesContainer' : 
                           'partsContainer');
}

// دالة لعرض النجوم
function renderStars(rating, itemId) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    let starsHtml = '';
    for (let i = 0; i < fullStars; i++) {
        starsHtml += `<span class="star filled" data-value="${i+1}" onclick="rateProduct(${itemId}, ${i+1})">★</span>`;
    }
    if (halfStar) {
        starsHtml += `<span class="star half" data-value="${fullStars+1}" onclick="rateProduct(${itemId}, ${fullStars+1})">★</span>`;
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += `<span class="star empty" data-value="${fullStars + halfStar + i + 1}" onclick="rateProduct(${itemId}, ${fullStars + halfStar + i + 1})">★</span>`;
    }
    return starsHtml;
}

// دالة التقييم عند الضغط على نجمة
function rateProduct(itemId, rating) {
    if (!confirm(`هل تريد تقييم هذا المنتج بـ ${rating} نجوم؟`)) return;
    saveRating(itemId, rating);
    alert(`✅ تم التقييم بـ ${rating} نجوم!`);
}

// ============================================
// 🖥️ عرض العناصر مع التقييم
// ============================================

function displayItems(type, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = getData();
    const filtered = data.filter(item => item.type === type);

    if (filtered.length === 0) {
        container.innerHTML = `<p style="color:#666;">📭 لا توجد عناصر في هذا القسم حالياً</p>`;
        return;
    }

    container.innerHTML = filtered.map(item => {
        // زيادة عدد المشاهدات
        let views = item.views || 0;
        views++;
        item.views = views;
        const allData = getData();
        const updatedData = allData.map(i => i.id === item.id ? item : i);
        saveData(updatedData);

        // بناء رسالة واتساب
        const whatsappMessage = encodeURIComponent(
            `🛒 طلب منتج من CHIFIX PRO GAME\n\n` +
            `📦 المنتج: ${item.title}\n` +
            `📝 الوصف: ${item.description}\n` +
            `💰 السعر: ${item.price} دولار\n` +
            `⭐ التقييم: ${item.averageRating ? item.averageRating.toFixed(1) : 'غير مقيم'} (${item.totalRatings || 0} تقييم)\n` +
            `🔗 الرابط: ${window.location.href}`
        );
        const whatsappUrl = `https://wa.me/213671676544?text=${whatsappMessage}`;

        // بناء الصور المصغرة
        let thumbnails = '';
        if (item.images && item.images.length > 0) {
            thumbnails = item.images.map(img => `
                <img src="${img}" alt="${item.title}" class="thumb" onclick="openLightbox('${img}')" />
            `).join('');
        }

        // بناء المواصفات
        let specsHtml = '';
        if (item.specs && item.specs.length > 0) {
            specsHtml = `
                <div class="specs">
                    <h4>📋 المواصفات:</h4>
                    <ul>
                        ${item.specs.map(spec => `<li>${spec}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // بناء التقييم
        const avgRating = item.averageRating || 0;
        const totalRatings = item.totalRatings || 0;
        const starsHtml = renderStars(avgRating, item.id);

        return `
        <div class="card">
            <div class="card-image">
                <img src="${item.image}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/300x200/252540/666?text=No+Image'" />
                <span class="view-count">👁️ ${item.views}</span>
                ${item.images && item.images.length > 0 ? `
                <div class="thumbnails">
                    ${thumbnails}
                </div>
                ` : ''}
            </div>
            <div class="content">
                <h3>${item.title}</h3>
                <p class="description">${item.description}</p>
                ${specsHtml}
                <span class="price">💰 ${item.price} دولار</span>
                ${item.video ? `<a href="${item.video}" target="_blank" class="video-link">▶️ مشاهدة الفيديو</a>` : ''}
                ${item.status ? `<span class="status ${item.status === 'متاح' ? 'available' : 'sold'}">${item.status}</span>` : ''}
                
                <!-- ===== التقييم ===== -->
                <div class="rating-section">
                    <div class="stars">
                        ${starsHtml}
                    </div>
                    <span class="rating-text">${avgRating ? avgRating.toFixed(1) : 'غير مقيم'} (${totalRatings} تقييم)</span>
                </div>
                
                <a href="${whatsappUrl}" target="_blank" class="whatsapp-btn">
                    💬 طلب عبر واتساب
                </a>
            </div>
        </div>
    `}).join('');
}
