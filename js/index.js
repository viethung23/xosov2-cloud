let xosoIndex;

class Index {
    constructor() {
        this.hostApi = 'https://apixosov2.viethungdev23.workers.dev';
        this.init();
    }

    init() {
        const contentLeft = document.querySelector(".content-left");
        if (contentLeft) {
            const lotteryResultsDiv = document.createElement("div");
            lotteryResultsDiv.className = "lottery-results";
            contentLeft.appendChild(lotteryResultsDiv);
        }
        this.updateDateTime();
        this.loadAllData();
    }

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

    async fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return await response.json();
        } catch (error) {
            console.error("Fetch error:", error);
            return null;
        }
    }

    async renderXSMB() {
        const data = await this.fetchData(`${this.hostApi}/api/xsmb?limit=1`);
        const xsmbSection = document.getElementById("xsmb-section");

        if (data && data.length > 0) {
            const dataList = data.map(record => JSON.parse(record.Value));

            const createHeader = (data) => `
                <header class="section-header">
                    <h2>${data.region} - Kết quả xổ số ${data.location} - SXMB ${data.date}</h2>
                    <div class="site-link">
                        <a title="XSMB" href="/xo-so-${data.region.toLowerCase()}/${data.region.toLowerCase()}-p1.html">${data.region}</a>
                        <a title="${data.region} ${data.date}" href="/${data.region.toLowerCase()}-${data.date.replace(/\//g, '-')}.html">${data.region} ${data.date}</a>
                    </div>
                </header>`;

            const createTable = (data) => {
                let tableHtml = `
                <table class="table-result">
                    <tbody>
                        <tr>
                            <th class="name-prize"></th>
                            <td class="number-prize">
                                ${data.codes.map(code => `<span class="code-DB8">${code}</span>`).join(' ')}
                            </td>
                        </tr>`;

                const ranks = ["ĐB", "1", "2", "3", "4", "5", "6", "7"];
                ranks.forEach(rank => {
                    tableHtml += `
                        <tr>
                            <td>${rank}</td>
                            <td>
                                ${(data.prizes[rank] || []).map(prize => 
                                    `<span class="${rank === "ĐB" ? "special-prize" : `prize${rank}`}">${prize}</span>`
                                ).join(' ') || ""}
                            </td>
                        </tr>`;
                });

                tableHtml += `
                    </tbody>
                </table>`;

                return tableHtml;
            };

            let fullHtml = '';
            dataList.forEach(data => {
                fullHtml += `
                    ${createHeader(data)}
                    <div class="section-content">
                        ${createTable(data)}
                    </div>`;
            });

            xsmbSection.innerHTML = fullHtml;
        } else {
            xsmbSection.innerHTML = "<div class='error'>Không có dữ liệu để hiển thị</div>";
        }
    }

    async renderXSMN() {
        const data = await this.fetchData(`${this.hostApi}/api/xsmn?limit=1`);
        const xsmnSection = document.getElementById("xsmn-section");

        if (data && data.length > 0) {
            const dataArray = data.map(record => JSON.parse(record.Value));
            let fullHtml = '';

            dataArray.forEach(data => {
                fullHtml += `
                    <header class="section-header">
                        <h1>XSMN - Kết quả xổ số Miền Nam - XSMN ${this.getDisplayText(data.date)}</h1>
                        <h2 class="site-link">
                            <a title="XSMN" href="/xo-so-mien-nam/xsmn-p1.html">XSMN</a>
                            <a title="XSMN ${data.date}" href="/xsmn-${data.code}.html">XSMN ${data.date}</a> 
                        </h2>
                    </header>
                    <div class="section-content">
                        <table class="table-result table-xsmn">
                            <thead>
                                <tr>
                                    <th class="name-prize">Giải</th>
                                    ${data.provinces.map(province => `<th class="prize-col3"><h3>${province}</h3></th>`).join("")}
                                </tr>
                            </thead>
                            <tbody>
                                ${data.prizes.map(prize => 
                                    `<tr>
                                        <th>${prize.rank}</th>
                                        ${data.provinces.map(province => 
                                            `<td><span class="xs_prize ${prize.rank == 'ĐB' ? 'prize_db' : ''}">${prize[province].join("<br>")}</span></td>`
                                        ).join("")}
                                    </tr>`
                                ).join("")}
                            </tbody>
                        </table> 
                    </div>`;
            });

            xsmnSection.innerHTML = fullHtml;
        } else {
            xsmnSection.innerHTML = "<div class='error'>Không có dữ liệu để hiển thị</div>";
        }
    }

    async renderXSMT() {
        const data = await this.fetchData(`${this.hostApi}/api/xsmt?limit=1`);
        const xsmtSection = document.getElementById("xsmt-section");

        if (data && data.length > 0) {
            const dataArray = data.map(record => JSON.parse(record.Value));
            let fullHtml = '';

            dataArray.forEach(data => {
                fullHtml += `
                    <header class="section-header">
                        <h2>XSMT - Kết quả xổ số Miền Trung - XSMT ${this.getDisplayText(data.date)}</h2>
                        <h2 class="site-link">
                            <a title="XSMT" href="/xo-so-mien-trung/xsmt-p1.html">XSMT</a>
                            <a title="XSMT ${data.date}" href="/xsmt-${data.code}.html">XSMT ${data.date}</a> 
                        </h2>
                    </header>
                    <div class="section-content">
                        <table class="table-result table-xsmt">
                            <thead>
                                <tr>
                                    <th class="name-prize">Giải</th>
                                    ${data.provinces.map(province => `<th class="prize-col3"><h3>${province}</h3></th>`).join("")}
                                </tr>
                            </thead>
                            <tbody>
                                ${data.prizes.map(prize => 
                                    `<tr>
                                        <th>${prize.rank}</th>
                                        ${data.provinces.map(province => 
                                            `<td><span class="xs_prize ${prize.rank == 'ĐB' ? 'prize_db' : ''}">${prize[province].join("<br>")}</span></td>`
                                        ).join("")}
                                    </tr>`
                                ).join("")}
                            </tbody>
                        </table> 
                    </div>`;
            });

            xsmtSection.innerHTML = fullHtml;
        } else {
            xsmtSection.innerHTML = "<div class='error'>Không có dữ liệu để hiển thị</div>";
        }
    }

    async loadAllData() {
        try {
            await Promise.all([this.renderXSMN(), this.renderXSMT(), this.renderXSMB()]);
            console.log("Tất cả dữ liệu đã được tải xong");
        } catch (error) {
            console.error("Có lỗi khi tải dữ liệu:", error);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    xosoIndex = new Index();
});
