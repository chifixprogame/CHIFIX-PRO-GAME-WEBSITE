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
// 🌙 الوضع الليلي
// ============================================

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        document.getElementById('darkModeToggle').textContent = '☀️';
    } else {
        localStorage.setItem('darkMode', 'disabled');
        document.getElementById('darkModeToggle').textContent = '🌙';
    }
}

function loadDarkMode() {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').textContent = '☀️';
    }
}

// ============================================
// 🌍 تعدد اللغات (عربي + إنجليزي)
// ============================================

const translations = {
    ar: {
        nav_services: '🛠️ الخدمات',
        nav_courses: '🎓 الدورات',
        nav_consoles: '🎮 Consoles',
        nav_parts: '🔧 قطع الغيار',
        nav_contact: '📱 تواصل معنا',
        nav_admin: '⚙️ لوحة التحكم',
        hero_subtitle: 'CONSOLES • GAME • GAME • REPAIR',
        hero_services: '🛠️ خدماتنا',
        hero_consoles: '🎮 كونصول للبيع',
        services_title: '🎮 الخدمات',
        service_ps: 'PlayStation',
        service_ps_desc: 'PS5 / PS4 / PS3',
        service_xbox: 'Xbox',
        service_xbox_desc: 'Xbox Series / One / 360',
        service_nintendo: 'Nintendo',
        service_nintendo_desc: 'Switch / Wii / DS',
        service_controllers: 'Manettes',
        service_controllers_desc: 'تصليح جميع أنواع التحكم',
        service_electronic: 'صيانة إلكترونية',
        service_electronic_desc: 'مكونات داخلية / لحام / فحص',
        courses_title: '🎓 الدورات',
        consoles_title: '🎮 Consoles متوفرة',
        parts_title: '🔧 قطع الغيار',
        contact_title: '📱 تواصل معنا',
        contact_location: 'الموقع',
        contact_location_detail: 'عين البيضاء، أم البواقي 🇩🇿',
        contact_location_near: '📍 بجنب بنك CNEP',
        contact_location_open: '📱 افتح في خرائط Google',
        contact_whatsapp: 'واتساب',
        contact_call: 'اتصل بنا',
        social_facebook: 'فيسبوك',
        social_tiktok: 'تيك توك',
        contact_note: '📍 عين البيضاء، أم البواقي - بجنب بنك CNEP | نقبل جميع طرق الدفع',
        footer_copyright: '© 2026 CHIFIX PRO GAME - جميع الحقوق محفوظة',
        footer_tagline: 'صيانة • بيع • دورات • قطع غيار',
        footer_location: '📍 عين البيضاء، أم البواقي - بجنب بنك CNEP | 📞 0671 67 65 44'
    },
    en: {
        nav_services: '🛠️ Services',
        nav_courses: '🎓 Courses',
        nav_consoles: '🎮 Consoles',
        nav_parts: '🔧 Spare Parts',
        nav_contact: '📱 Contact Us',
        nav_admin: '⚙️ Dashboard',
        hero_subtitle: 'CONSOLES • GAME • GAME • REPAIR',
        hero_services: '🛠️ Our Services',
        hero_consoles: '🎮 Consoles for Sale',
        services_title: '🎮 Services',
        service_ps: 'PlayStation',
        service_ps_desc: 'PS5 / PS4 / PS3',
        service_xbox: 'Xbox',
        service_xbox_desc: 'Xbox Series / One / 360',
        service_nintendo: 'Nintendo',
        service_nintendo_desc: 'Switch / Wii / DS',
        service_controllers: 'Controllers',
        service_controllers_desc: 'Repair all types of controllers',
        service_electronic: 'Electronic Repair',
        service_electronic_desc: 'Internal components / Soldering / Testing',
        courses_title: '🎓 Courses',
        consoles_title: '🎮 Available Consoles',
        parts_title: '🔧 Spare Parts',
        contact_title: '📱 Contact Us',
        contact_location: 'Location',
        contact_location_detail: 'Aïn Beïda, Oum El Bouaghi 🇩🇿',
        contact_location_near: '📍 Next to CNEP Bank',
        contact_location_open: '📱 Open in Google Maps',
        contact_whatsapp: 'WhatsApp',
        contact_call: 'Call Us',
        social_facebook: 'Facebook',
        social_tiktok: 'TikTok',
        contact_note: '📍 Aïn Beïda, Oum El Bouaghi - Next to CNEP Bank | All payment methods accepted',
        footer_copyright: '© 2026 CHIFIX PRO GAME - All Rights Reserved',
        footer_tagline: 'Repair • Sales • Courses • Spare Parts',
        footer_location: '📍 Aïn Beïda, Oum El Bouaghi - Next to CNEP Bank | 📞 0671 67 65 44'
    }
};

let currentLang = localStorage.getItem('language') || 'ar';

function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    applyLanguage();
    updateLanguageButtons();
}

function applyLanguage() {
    const t = translations[currentLang];
    if (!t) return;

    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (t[key]) {
            el.textContent = t[key];
        }
    });

    // تحديث اتجاه النص
    if (currentLang === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
    } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = 'en';
    }

    // إعادة عرض المنتجات مع الترجمة
    displayItems('course', 'coursesContainer');
    displayItems('console', 'consolesContainer');
    displayItems('part', 'partsContainer');
}

function updateLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        }
    });
}

function loadLanguage() {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
        currentLang = savedLang;
    }
    switchLanguage(currentLang);
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
        title_en: title,
        description: description,
        description_en: description,
        price: price,
        image: image,
        images: images ? images.split(',').map(img => img.trim()) : [],
        specs: specs ? specs.split(',').map(spec => spec.trim()) : [],
        specs_en: specs ? specs.split(',').map(spec => spec.trim()) : [],
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

function displayItems(type, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = getData();
    const filtered = data.filter(item => item.type === type);

    if (filtered.length === 0) {
        container.innerHTML = `<p style="color:#666;">📭 لا توجد عناصر في هذا القسم حالياً</p>`;
        return;
    }

    const isArabic = currentLang === 'ar';

    container.innerHTML = filtered.map(item => {
        let views = item.views || 0;
        views++;
        item.views = views;
        const allData = getData();
        const updatedData = allData.map(i => i.id === item.id ? item : i);
        saveData(updatedData);

        const title = isArabic ? item.title : (item.title_en || item.title);
        const description = isArabic ? item.description : (item.description_en || item.description);
        const specs = isArabic ? (item.specs || []) : (item.specs_en || item.specs || []);
        
        const whatsappMessage = encodeURIComponent(
            `🛒 طلب منتج من CHIFIX PRO GAME\n\n` +
            `📦 المنتج: ${title}\n` +
            `📝 الوصف: ${description}\n` +
            `💰 السعر: ${item.price} دولار\n` +
            `⭐ التقييم: ${item.averageRating ? item.averageRating.toFixed(1) : 'غير مقيم'} (${item.totalRatings || 0} تقييم)\n` +
            `🔗 الرابط: ${window.location.href}`
        );
        const whatsappUrl = `https://wa.me/213671676544?text=${whatsappMessage}`;

        let thumbnails = '';
        if (item.images && item.images.length > 0) {
            thumbnails = item.images.map(img => `
                <img src="${img}" alt="${title}" class="thumb" onclick="openLightbox('${img}')" />
            `).join('');
        }

        let specsHtml = '';
        if (specs && specs.length > 0) {
            specsHtml = `
                <div class="specs">
                    <h4>📋 ${isArabic ? 'المواصفات:' : 'Specifications:'}</h4>
                    <ul>
                        ${specs.map(spec => `<li>${spec}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        const avgRating = item.averageRating || 0;
        const totalRatings = item.totalRatings || 0;
        const starsHtml = renderStars(avgRating, item.id);

        return `
        <div class="card">
            <div class="card-image">
                <img src="${item.image}" alt="${title}" onerror="this.src='https://via.placeholder.com/300x200/252540/666?text=No+Image'" />
                <span class="view-count">👁️ ${item.views}</span>
                ${item.images && item.images.length > 0 ? `
                <div class="thumbnails">
                    ${thumbnails}
                </div>
                ` : ''}
            </div>
            <div class="content">
                <h3>${title}</h3>
                <p class="description">${description}</p>
                ${specsHtml}
                <span class="price">💰 ${item.price} ${isArabic ? 'دولار' : 'USD'}</span>
                ${item.video ? `<a href="${item.video}" target="_blank" class="video-link">▶️ ${isArabic ? 'مشاهدة الفيديو' : 'Watch Video'}</a>` : ''}
                ${item.status ? `<span class="status ${item.status === 'متاح' ? 'available' : 'sold'}">${item.status}</span>` : ''}
                
                <div class="rating-section">
                    <div class="stars">
                        ${starsHtml}
                    </div>
                    <span class="rating-text">${avgRating ? avgRating.toFixed(1) : (isArabic ? 'غير مقيم' : 'Not Rated')} (${totalRatings} ${isArabic ? 'تقييم' : 'ratings'})</span>
                </div>
                
                <a href="${whatsappUrl}" target="_blank" class="whatsapp-btn">
                    💬 ${isArabic ? 'طلب عبر واتساب' : 'Order via WhatsApp'}
                </a>
            </div>
        </div>
    `}).join('');
}

// ============================================
// 🖼️ Lightbox
// ============================================

function openLightbox(imageSrc) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
        <span class="close-lightbox" onclick="closeLightbox()">✕</span>
        <img src="${imageSrc}" alt="صورة المنتج" class="lightbox-image" />
    `;
    overlay.onclick = function(e) {
        if (e.target === overlay) closeLightbox();
    };
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const overlay = document.querySelector('.lightbox-overlay');
    if (overlay) {
        overlay.remove();
        document.body.style.overflow = 'auto';
    }
}

// ============================================
// 📊 لوحة التحكم
// ============================================

function updateDashboard() {
    const data = getData();
    document.getElementById('totalProducts').textContent = data.length;

    let visitors = parseInt(localStorage.getItem('visitors') || '0');
    if (visitors === 0) {
        visitors = Math.floor(Math.random() * 500) + 100;
        localStorage.setItem('visitors', visitors);
    }
    document.getElementById('totalVisitors').textContent = visitors;

    const orders = getOrders();
    document.getElementById('totalOrders').textContent = orders.length;

    let revenue = 0;
    orders.forEach(order => {
        if (order.status === 'completed') {
            revenue += parseFloat(order.price) || 0;
        }
    });
    document.getElementById('totalRevenue').textContent = revenue.toFixed(2);
}

function getOrders() {
    const stored = localStorage.getItem('chifixOrders');
    return stored ? JSON.parse(stored) : [];
}

function saveOrders(orders) {
    localStorage.setItem('chifixOrders', JSON.stringify(orders));
}

function renderOrders() {
    const container = document.getElementById('ordersList');
    const orders = getOrders();

    if (orders.length === 0) {
        container.innerHTML = `<p class="no-data">📭 ${currentLang === 'ar' ? 'لا توجد طلبات حتى الآن' : 'No orders yet'}</p>`;
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-item">
            <div class="order-info">
                <strong>${order.product}</strong>
                <small>💰 ${order.price} USD | 📅 ${order.date}</small>
            </div>
            <span class="order-status ${order.status}">
                ${order.status === 'pending' ? '⏳ قيد الانتظار' : 
                  order.status === 'completed' ? '✅ مكتمل' : 
                  '❌ ملغي'}
            </span>
            <div class="order-actions">
                ${order.status === 'pending' ? `
                    <button class="btn-complete" onclick="updateOrderStatus(${order.id}, 'completed')">✅ إكمال</button>
                    <button class="btn-cancel" onclick="updateOrderStatus(${order.id}, 'cancelled')">❌ إلغاء</button>
                ` : `
                    <button class="btn-cancel" onclick="deleteOrder(${order.id})">🗑️ حذف</button>
                `}
            </div>
        </div>
    `).join('');
}

function updateOrderStatus(id, status) {
    const orders = getOrders();
    const order = orders.find(o => o.id === id);
    if (order) {
        order.status = status;
        saveOrders(orders);
        renderOrders();
        updateDashboard();
    }
}

function deleteOrder(id) {
    if (!confirm(currentLang === 'ar' ? 'هل أنت متأكد من حذف هذا الطلب؟' : 'Are you sure you want to delete this order?')) return;
    let orders = getOrders();
    orders = orders.filter(o => o.id !== id);
    saveOrders(orders);
    renderOrders();
    updateDashboard();
}

// ============================================
// 🏆 أكثر المنتجات مشاهدة
// ============================================

function renderTopProducts() {
    const container = document.getElementById('topProductsList');
    const data = getData();

    if (data.length === 0) {
        container.innerHTML = `<p style="color: #666;">📭 ${currentLang === 'ar' ? 'لا توجد منتجات' : 'No products'}</p>`;
        return;
    }

    const sorted = [...data].sort((a, b) => (b.views || 0) - (a.views || 0));

    container.innerHTML = sorted.slice(0, 5).map((item, index) => {
        const title = currentLang === 'ar' ? item.title : (item.title_en || item.title);
        return `
            <div class="product-item">
                <span class="rank">#${index + 1}</span>
                <span class="product-name">${title}</span>
                <span class="product-views">👁️ ${item.views || 0} ${currentLang === 'ar' ? 'مشاهدة' : 'views'}</span>
            </div>
        `;
    }).join('');
}

// ============================================
// 📊 رسم بياني
// ============================================

function renderChart() {
    const container = document.getElementById('visitorChart');
    const days = currentLang === 'ar' ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const values = [];

    for (let i = 0; i < 7; i++) {
        let val = parseInt(localStorage.getItem('visitor_day_' + i) || '0');
        if (val === 0) {
            val = Math.floor(Math.random() * 100) + 20;
            localStorage.setItem('visitor_day_' + i, val);
        }
        values.push(val);
    }

    const max = Math.max(...values);

    container.innerHTML = days.map((day, index) => {
        const height = max > 0 ? (values[index] / max) * 140 : 10;
        return `
            <div class="chart-bar">
                <div class="bar" style="height: ${height}px;"></div>
                <span class="day-value">${values[index]}</span>
                <span class="day-label">${day}</span>
            </div>
        `;
    }).join('');
}

// ============================================
// 🗑️ حذف عنصر
// ============================================

function deleteItem(id) {
    if (!confirm(currentLang === 'ar' ? 'هل أنت متأكد من حذف هذا العنصر؟' : 'Are you sure you want to delete this item?')) return;
    let data = getData();
    data = data.filter(item => item.id !== id);
    saveData(data);
    renderAdminTable();
    updateDashboard();
    renderTopProducts();
}

// ============================================
// ✏️ تعديل عنصر
// ============================================

function editItem(id) {
    const data = getData();
    const item = data.find(el => el.id === id);
    if (!item) return;

    document.getElementById('itemType').value = item.type;
    document.getElementById('itemTitle').value = item.title;
    document.getElementById('itemDesc').value = item.description;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemImage').value = item.image || '';
    document.getElementById('itemImages').value = (item.images || []).join(', ');
    document.getElementById('itemSpecs').value = (item.specs || []).join(', ');

    if (item.video) {
        document.getElementById('itemVideo').value = item.video;
    }
    if (item.status) {
        document.getElementById('itemStatus').value = item.status;
    }

    toggleFields();
    deleteItem(id);
    document.querySelector('.admin-form').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// 📋 عرض الجدول في لوحة التحكم
// ============================================

function renderAdminTable() {
    const data = getData();
    const tbody = document.getElementById('itemsTableBody');
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:#666;">📭 ${currentLang === 'ar' ? 'لا توجد عناصر مضافة بعد' : 'No items added yet'}</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map((item, index) => {
        const avgRating = item.averageRating || 0;
        const totalRatings = item.totalRatings || 0;
        return `
        <tr>
            <td>${index + 1}</td>
            <td>${item.type === 'course' ? '🎓 دورة' : item.type === 'console' ? '🎮 كونسول' : '🔧 قطعة غيار'}</td>
            <td>${item.title}</td>
            <td>${item.price} USD</td>
            <td>⭐ ${avgRating ? avgRating.toFixed(1) : 'غير مقيم'} (${totalRatings})</td>
            <td>👁️ ${item.views || 0}</td>
            <td>${item.images ? item.images.length : 0} صورة</td>
            <td>
                <button class="btn btn-edit" onclick="editItem(${item.id})">✏️</button>
                <button class="btn btn-delete" onclick="deleteItem(${item.id})">🗑️</button>
            </td>
        </tr>
    `}).join('');
}

// ============================================
// 🔄 إظهار/إخفاء الحقول
// ============================================

function toggleFields() {
    const type = document.getElementById('itemType').value;
    const videoField = document.getElementById('videoField');
    const statusField = document.getElementById('statusField');

    if (type === 'course') {
        videoField.style.display = 'block';
        statusField.style.display = 'none';
    } else if (type === 'console') {
        videoField.style.display = 'none';
        statusField.style.display = 'block';
    } else {
        videoField.style.display = 'none';
        statusField.style.display = 'none';
    }
}

// ============================================
// 🔄 التبديل بين التبويبات
// ============================================

function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.remove('active');
    });
    document.getElementById('tab-' + tab).classList.add('active');

    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(el => {
        if (el.textContent.includes('المنتجات') || el.textContent.includes('Products')) {
            if (tab === 'products') el.classList.add('active');
        }
        if (el.textContent.includes('الطلبات') || el.textContent.includes('Orders')) {
            if (tab === 'orders') el.classList.add('active');
        }
        if (el.textContent.includes('الإحصائيات') || el.textContent.includes('Stats')) {
            if (tab === 'stats') el.classList.add('active');
        }
    });
}
