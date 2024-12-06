//Type.registerNamespace("Xoso");
var xsmb;

XSMB = function() {
    var that = this;
    var hostApi = 'https://apixosov2.viethungdev23.workers.dev';

    that.init = function() {
        that.updateDateTime(); // Cập nhật thời gian sau khi append
        that.GetXSMB();
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

    that.GetXSMB = function (){

        // Thêm skeleton loader vào giao diện
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
        $(".content-left").html(skeletonLoader); // Hiển thị skeleton trước khi gọi API

        $.ajax({
            url: hostApi + '/api/sxmb',
            type: 'GET',
            dataType: 'json',
            //data: dataPost,
            success: function (response) {
                if(response.length > 0){
                    // Chuyển đổi thành mảng các đối tượng JSON từ trường Value
                    const dataList = response.map(record => JSON.parse(record.Value));

                    const htmlContent = dataList.map(data => `
                        <section class="section" id="kqngay_${data.date.replace(/\//g, '')}">
                            <header class="section-header">
                                <h1>${data.region} - Kết quả xổ số ${data.location} - SXMB ${data.date === "30/11/2024" ? "hôm nay" : data.date}</h1>
                                <div class="site-link">
                                    <a title="XSMB" href="/xo-so-${data.region.toLowerCase()}/${data.region.toLowerCase()}-p1.html">${data.region}</a>
                                    <a title="${data.region} ${data.date}" href="/${data.region.toLowerCase()}-${data.date.replace(/\//g, '-')}.html">${data.region} ${data.date}</a>
                                </div>
                            </header>
                            <div class="section-content">
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
                                                    ${data.prizes[rank].map(prize => `
                                                        <span class="${rank === "ĐB" ? "special-prize" : `prize${rank}`}">${prize}</span>
                                                    `).join(' ')}
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    `).join('');
            
                    $(".content-left").html(htmlContent);
                }
                else {
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

    // luôn luôn gọi hàm init khi khởi tạo new
    that.init();
}

jQuery(function () { xsmb = new XSMB(); });