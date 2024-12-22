var xsmb;

XSMB = function() {
    var that = this;
    var hostApi = 'https://apixosov2.viethungdev23.workers.dev';

    that.init = function() {
        document.querySelector(".content-left").innerHTML = '';
        that.updateDateTime(); // Cập nhật thời gian sau khi append
        that.GetXSMB();
        that.OnclickAi();
    };

    // hàm lấy thời gian hiện tại 
    that.updateDateTime = function(){
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const daysOfWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
        const dayOfWeek = daysOfWeek[now.getDay()];
        const formattedDateTime = `Hôm nay: ${dayOfWeek} ngày ${day}/${month}/${year}`;

        const headerTime = document.querySelector(".header-time");
        if (headerTime) {
            headerTime.textContent = formattedDateTime;
        } else {
            console.error("Không tìm thấy phần tử .header-time");
        }
    }

    that.OnclickAi = function(){
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');

                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                const tabContent = document.getElementById(tabId);
                if (tabContent) {
                    tabContent.style.display = 'block';
                }
            });
        });
    }

    that.getDisplayText = function(dateString) {
        const targetDate = new Date(dateString);
        const currentDate = new Date();

        targetDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        const differenceInDays = (currentDate - targetDate) / (1000 * 60 * 60 * 24);
        if (differenceInDays === 0 || differenceInDays === -1) {
            return 'hôm nay';
        } else {
            const [year, month, day] = dateString.split('-');
            return `Ngày ${day}-${month}-${year}`;
        }
    }

    that.GetXSMB = function (){
        const skeletonLoader = `
        <section class="section" id="loading-section">
            <header class="section-header">
                <h1>Đang tải dữ liệu xổ số miền Bắc...</h1>
            </header>
            <div class="section-content">
                <table class="table-result">
                    <tbody>
                        <tr>
                            <th class="name-prize">...</th>
                            <td class="number-prize">Đang tải...</td>
                        </tr>
                        ${["ĐB", "1", "2", "3", "4", "5", "6", "7"].map(rank => `
                            <tr>
                                <td>${rank}</td>
                                <td>Đang tải...</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>
        `;
        document.querySelector(".content-left").innerHTML = skeletonLoader;

        fetch(hostApi + '/api/xsmb')
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const dataList = data.map(record => JSON.parse(record.Value));

                    const createHeader = (data) => `
                        <header class="section-header">
                            <h1>${data.region} - Kết quả xổ số ${data.location} - SXMB ${data.date}</h1>
                            <div class="site-link">
                                <a title="XSMB" href="/xo-so-${data.region.toLowerCase()}/${data.region.toLowerCase()}-p1.html">${data.region}</a>
                                <a title="${data.region} ${data.date}" href="/${data.region.toLowerCase()}-${data.date.replace(/\//g, '-')}.html">${data.region} ${data.date}</a>
                            </div>
                        </header>
                    `;

                    const createTable = (data) => `
                        <table class="table-result">
                            <tbody>
                                <tr>
                                    <th class="name-prize"></th>
                                    <td class="number-prize">
                                        ${data.codes.map(code => `<span class="code-DB8">${code}</span>`).join(' ')}
                                    </td>
                                </tr>
                                ${["ĐB", "1", "2", "3", "4", "5", "6", "7"].map(rank => `
                                    <tr>
                                        <td>${rank}</td>
                                        <td>
                                            ${data.prizes[rank]?.map(prize => `
                                                <span class="${rank === "ĐB" ? "special-prize" : `prize${rank}`}">${prize}</span>
                                            `).join(' ') || ""}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `;

                    const createSection = (data) => `
                        <section class="section" id="kqngay_${data.date.replace(/\//g, '')}">
                            ${createHeader(data)}
                            <div class="section-content">
                                ${createTable(data)}
                            </div>
                        </section>
                    `;

                    const htmlContent = dataList.map(createSection).join('');
                    document.querySelector(".content-left").innerHTML = htmlContent;
                } else {
                    console.warn("Không có dữ liệu từ API");
                    document.querySelector("#loading-section h1").textContent = "Không có dữ liệu để hiển thị";
                }
            })
            .catch(error => {
                console.error("Lỗi khi gọi API:", error);
                document.querySelector("#loading-section h1").textContent = "Lỗi khi tải dữ liệu. Vui lòng thử lại sau";
            });
    }

    that.init();
}

document.addEventListener('DOMContentLoaded', function () { xsmb = new XSMB(); });