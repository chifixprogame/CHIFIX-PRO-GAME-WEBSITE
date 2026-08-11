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
// ➕ إضافة عنصر جديد (متطور)
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
// 🖥️ عرض العناصر في الصفحة الرئيسية (متطور)
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
                <a href="${whatsappUrl}" target="_blank" class="whatsapp-btn">
                    💬 طلب عبر واتساب
                </a>
            </div>
        </div>
    `}).join('');
}

// ============================================
// 🖼️ عرض الصور في Lightbox
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
// 📊 تحديث لوحة الإحصائيات
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

// ============================================
// 📋 إدارة الطلبات
// ============================================

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
        container.innerHTML = `<p style="color: #666; text-align: center; padding: 40px;">📭 لا توجد طلبات حتى الآن</p>`;
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-item">
            <div class="order-info">
                <strong>${order.product}</strong>
                <small>💰 ${order.price} دولار | 📅 ${order.date}</small>
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
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
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
        container.innerHTML = `<p style="color: #666; text-align: center; padding: 20px;">📭 لا توجد منتجات</p>`;
        return;
    }

    const sorted = [...data].sort((a, b) => (b.views || 0) - (a.views || 0));

    container.innerHTML = sorted.slice(0, 5).map((item, index) => `
        <div class="product-item">
            <span class="rank">#${index + 1}</span>
            <span class="product-name">${item.title}</span>
            <span class="product-views">👁️ ${item.views || 0} مشاهدة</span>
        </div>
    `).join('');
}

// ============================================
// 📊 رسم بياني للزوار
// ============================================

function renderChart() {
    const container = document.getElementById('visitorChart');
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
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
        const height = max > 0 ? (values[index] / max) * 170 : 10;
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
        if (el.textContent.includes('الإحصائيات') && tab === 'dashboard') el.classList.add('active');
        if (el.textContent.includes('المنتجات') && tab === 'products') el.classList.add('active');
        if (el.textContent.includes('الطلبات') && tab === 'orders') el.classList.add('active');
    });
}

// ============================================
// 🗑️ حذف عنصر
// ============================================

function deleteItem(id) {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;
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
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#666;">📭 لا توجد عناصر مضافة بعد</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.type === 'course' ? '🎓 دورة' : item.type === 'console' ? '🎮 كونسول' : '🔧 قطعة غيار'}</td>
            <td>${item.title}</td>
            <td>${item.price} دولار</td>
            <td>👁️ ${item.views || 0}</td>
            <td>${item.images ? item.images.length : 0} صورة</td>
            <td>
                <button class="btn btn-edit" onclick="editItem(${item.id})">✏️</button>
                <button class="btn btn-delete" onclick="deleteItem(${item.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
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
