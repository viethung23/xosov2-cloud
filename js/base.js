var xoso_base;

Base = function() {
    var that = this;
    var hostApi = 'https://apixosov2.viethungdev23.workers.dev';

    that.init = function() {
        that.updateDateTime();
        that.GetXSMN();
        that.OnclickAi();
    };

    // hàm lấy thời gian hiện tại 
    that.updateDateTime = function(){
        const now = new Date();
        // Lấy ngày, tháng, năm
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng trong JS bắt đầu từ 0
        const year = now.getFullYear();
        // Lấy thứ trong tuần
        const daysOfWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
        const dayOfWeek = daysOfWeek[now.getDay()];
        // Định dạng thời gian theo yêu cầu
        const formattedDateTime = `Hôm nay: ${dayOfWeek} ngày ${day}/${month}/${year}`;
        // Cập nhật nội dung của thẻ div với định dạng thời gian
        // Kiểm tra phần tử .header-time trước khi cập nhật nội dung
        if ($(".header-time").length > 0) {
            $(".header-time").text(formattedDateTime);
        } else {
            console.error("Không tìm thấy phần tử .header-time");
        }
    }

    that.OnclickAi = function(){
        $('.tab-button').click(function () {
            // Remove active class from all buttons
            $('.tab-button').removeClass('active');
            
            // Hide all tab contents
            $('.tab-content').hide();
            
            // Add active class to clicked button and show corresponding content
            $(this).addClass('active');
            $('#' + $(this).data('tab')).show();
        });
    }

    that.getDisplayText = function(dateString) {
        const targetDate = new Date(dateString); // Chuyển chuỗi thành Date
        const currentDate = new Date(); // Ngày hiện tại

        // Đặt giờ của cả hai ngày về 0 để so sánh ngày chính xác
        targetDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        const differenceInDays = (currentDate - targetDate) / (1000 * 60 * 60 * 24);
        if (differenceInDays === 0 || differenceInDays === -1) {
            return 'hôm nay'; // Nếu là hôm nay hoặc hôm qua
        } else {
            const [year, month, day] = dateString.split('-');
            return `Ngày ${day}-${month}-${year}`; // Hiển thị dạng dd-MM-yyyy
        }
    }

    that.GetXSMN = function () {
        const fullPath = $(location).attr('pathname');
        if(fullPath == '/xo-so-mien-nam/xsmn-p1' || fullPath =='/xo-so-mien-nam/xsmn-p1.html'){
            hostApi = hostApi + '/api/xsmn';
        }
        else {
            hostApi = hostApi + '/api/xsmt';
        }

        // Hiển thị giao diện skeleton ngay lập tức
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
        $(".content-left").html(skeletonHtml); // Hiển thị skeleton ngay lập tức


        $.ajax({
            url: hostApi,
            type: 'GET',
            dataType: 'json',
            //data: dataPost,
            success: function (response) {
                console.log(response)
                if (response.length > 0) {
                    // Chuyển đổi thành mảng các đối tượng JSON từ trường Value
                    const dataArray = response.map(record => JSON.parse(record.Value));
                
                    // Tạo nội dung HTML cho từng phần tử
                    const htmlContent = dataArray.map(data => {
                        const isMN = data.loai === "mn";
                        const regionName = isMN ? "Miền Nam" : "Miền Trung";
                        const regionCode = isMN ? "xsmn" : "xsmt";
                        const mainURL = isMN ? "/xo-so-mien-nam/xsmn-p1.html" : "/xo-so-mien-trung/xsmt-p1.html";
                        const displayDate = that.getDisplayText(data.date);
                
                        // Tạo tiêu đề
                        const headerHTML = `
                            <header class="section-header">
                                <h1>${regionCode.toUpperCase()} - Kết quả xổ số ${regionName} - ${regionCode.toUpperCase()} ${displayDate}</h1>
                                <h2 class="site-link">
                                    <a title="${regionCode.toUpperCase()}" href="${mainURL}">${regionCode.toUpperCase()}</a>
                                    <a title="${regionCode.toUpperCase()} ${data.date}" href="/${regionCode}-${data.code}.html">${regionCode.toUpperCase()} ${data.date}</a>
                                </h2>
                            </header>
                        `;
                
                        // Tạo bảng kết quả xổ số
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
                
                        // Tạo các tùy chọn cấu hình
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
                
                        // Tạo nội dung section
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
                
                    // Đưa nội dung vào thẻ div
                    $(".content-left").html(htmlContent);
                }
                else {
                    // Không có dữ liệu từ API
                    console.warn("Không có dữ liệu từ API");
                    $("#loading-section").find("h1").text("Không có dữ liệu để hiển thị");
                }
            },
            error: function (response) {
                console.error("Lỗi khi gọi API:", response);
                $("#loading-section").find("h1").text("Lỗi khi tải dữ liệu. Vui lòng thử lại sau");
            }
          });
    }

    that.init();
}

jQuery(function () { xoso_base = new Base(); });