class XosoBase {
    constructor() {
        this.hostApi = 'https://apixosov2.viethungdev23.workers.dev';
        this.init();
    }

    init() {
        document.querySelector(".content-left").innerHTML = '';
        this.updateDateTime();
        this.getXSMN();
        this.setupTabButtonClick();
    }

    // Hàm lấy thời gian hiện tại
    updateDateTime() {
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

    setupTabButtonClick() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');

                button.classList.add('active');
                const targetTab = document.getElementById(button.dataset.tab);
                if (targetTab) {
                    targetTab.style.display = 'block';
                }
            });
        });
    }

    getDisplayText(dateString) {
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

    getXSMN() {
        const fullPath = window.location.pathname;
        this.hostApi += fullPath === '/xo-so-mien-nam/xsmn-p1' || fullPath === '/xo-so-mien-nam/xsmn-p1.html'
            ? '/api/xsmn'
            : '/api/xsmt';

        const skeletonHtml = `
            <section class="section" id="loading-section">
                <header class="section-header">
                    <h1>Đang tải dữ liệu xổ số...</h1>
                </header>
                <div class="section-content">
                    <table class="table-result table-xsmn">
                        <thead>
                            <tr>
                                <th class="name-prize">Giải</th>
                                <th class="prize-col3"><h3>Loading...</h3></th>
                                <th class="prize-col3"><h3>Loading...</h3></th>
                                <th class="prize-col3"><h3>Loading...</h3></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${[...Array(9)].map(() => `
                                <tr>
                                    <th>Loading...</th>
                                    <td><span class="xs_prize placeholder"></span></td>
                                    <td><span class="xs_prize placeholder"></span></td>
                                    <td><span class="xs_prize placeholder"></span></td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </section>
        `;
        document.querySelector(".content-left").innerHTML = skeletonHtml;

        fetch(this.hostApi)
            .then(response => {
                if (!response.ok) throw new Error("Lỗi khi tải dữ liệu từ API");
                return response.json();
            })
            .then(data => {
                if (data.length > 0) {
                    const dataArray = data.map(record => JSON.parse(record.Value));

                    const htmlContent = dataArray.map(data => {
                        const isMN = data.loai === "mn";
                        const regionName = isMN ? "Miền Nam" : "Miền Trung";
                        const regionCode = isMN ? "xsmn" : "xsmt";
                        const mainURL = isMN ? "/xo-so-mien-nam/xsmn-p1.html" : "/xo-so-mien-trung/xsmt-p1.html";
                        const displayDate = this.getDisplayText(data.date);

                        const headerHTML = `
                            <header class="section-header">
                                <h1>${regionCode.toUpperCase()} - Kết quả xổ số ${regionName} - ${regionCode.toUpperCase()} ${displayDate}</h1>
                                <h2 class="site-link">
                                    <a title="${regionCode.toUpperCase()}" href="${mainURL}">${regionCode.toUpperCase()}</a>
                                    <a title="${regionCode.toUpperCase()} ${data.date}" href="/${regionCode}-${data.code}.html">${regionCode.toUpperCase()} ${data.date}</a>
                                </h2>
                            </header>
                        `;

                        const tableHTML = `
                            <table class="table-result table-${regionCode}">
                                <thead>
                                    <tr>
                                        <th class="name-prize">Giải</th>
                                        ${data.provinces.map(province => `<th class="prize-col3"><h3>${province}</h3></th>`).join("")}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.prizes.map(prize => `
                                        <tr>
                                            <th>${prize.rank}</th>
                                            ${data.provinces.map(province => `
                                                <td>
                                                    <span class="xs_prize ${prize.rank === 'ĐB' ? 'prize_db' : ''}">
                                                        ${prize[province].join("<br>")}
                                                    </span>
                                                </td>
                                            `).join("")}
                                        </tr>
                                    `).join("")}
                                </tbody>
                            </table>
                        `;

                        const configHTML = `
                            <div class="div-table">
                                <div class="config-item active" value="0">Đầy đủ</div>
                                <div class="config-item" value="2">2 số</div>
                                <div class="config-item" value="3">3 số</div>
                                ${[...Array(10).keys()].map(num => `
                                    <div class="number-config" data-number="${num}">${num}</div>
                                `).join("")}
                            </div>
                        `;

                        return `
                            <section class="section" id="${data.loai}_kqngay_${data.code}">
                                ${headerHTML}
                                <div class="section-content" id="${data.loai}_kqngay_${data.code}">
                                    ${tableHTML}
                                    ${configHTML}
                                </div>
                            </section>
                        `;
                    }).join("");

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
}

document.addEventListener('DOMContentLoaded', () => {
    new XosoBase();
});
