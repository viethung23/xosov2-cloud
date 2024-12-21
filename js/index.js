var xoso_index;

Index = function() {
    var that = this;
    var hostApi = 'https://apixosov2.viethungdev23.workers.dev';

    that.init = function() {
        $(".content-left").append('<div class="lottery-results"></div>');
        that.updateDateTime();
        that.loadAllData(); // Gọi hàm load dữ liệu bất đồng bộ
        //that.OnclickAi();
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

    // that.OnclickAi = function(){
    //     $('.tab-button').click(function () {
    //         // Remove active class from all buttons
    //         $('.tab-button').removeClass('active');
            
    //         // Hide all tab contents
    //         $('.tab-content').hide();
            
    //         // Add active class to clicked button and show corresponding content
    //         $(this).addClass('active');
    //         $('#' + $(this).data('tab')).show();
    //     });
    // }

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

    // Hàm gọi API song song và xử lý kết quả
    that.GetXSMB = function (){
        return new Promise((resolve, reject) => {
            $.ajax({
                url: hostApi + '/api/xsmb?limit=1',
                type: 'GET',
                dataType: 'json',
                success: function (response) {
                    if (response.length > 0) {
                        const dataList = response.map(record => JSON.parse(record.Value));
        
                        const createHeader = (data) => 
                            `<header class="section-header">
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
        
                        $("#xsmb-section").html(fullHtml);
                        resolve();
                    } else {
                        $("#xsmb-section").html("<div class='error'>Không có dữ liệu để hiển thị</div>");
                        reject("Không có dữ liệu");
                    }
                },
                error: function (response) {
                    $("#xsmb-section").html("<div class='error'>Lỗi khi tải dữ liệu. Vui lòng thử lại sau</div>");
                    reject(response);
                }
            });
        });
    }

    that.GetXSMN = function () {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: hostApi + '/api/xsmn?limit=1',
                type: 'GET',
                dataType: 'json',
                success: function (response) {
                    if(response.length > 0){
                        const dataArray = response.map(record => JSON.parse(record.Value));
    
                        let fullHtml = '';
                        dataArray.forEach(data => {
                            fullHtml += `
                                <header class="section-header">
                                    <h1>XSMN - Kết quả xổ số Miền Nam - XSMN ${that.getDisplayText(data.date)}</h1>
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
                
                        $("#xsmn-section").html(fullHtml);
                        resolve();
                    }
                    else {
                        $("#xsmn-section").html("<div class='error'>Không có dữ liệu để hiển thị</div>");
                        reject("Không có dữ liệu");
                    }
                },
                error: function (response) {
                    $("#xsmn-section").html("<div class='error'>Lỗi khi tải dữ liệu. Vui lòng thử lại sau</div>");
                    reject(response);
                }
            });
        });
    }

    that.GetXSMT = function () {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: hostApi + '/api/xsmt?limit=1',
                type: 'GET',
                dataType: 'json',
                success: function (response) {
                    if(response.length > 0){
                        const dataArray = response.map(record => JSON.parse(record.Value));
    
                        let fullHtml = '';
                        dataArray.forEach(data => {
                            fullHtml += `
                                <header class="section-header">
                                    <h2>XSMT - Kết quả xổ số Miền Trung - XSMT ${that.getDisplayText(data.date)}</h2>
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
                
                        $("#xsmt-section").html(fullHtml);
                        resolve();
                    }
                    else {
                        $("#xsmt-section").html("<div class='error'>Không có dữ liệu để hiển thị</div>");
                        reject("Không có dữ liệu");
                    }
                },
                error: function (response) {
                    $("#xsmt-section").html("<div class='error'>Lỗi khi tải dữ liệu. Vui lòng thử lại sau</div>");
                    reject(response);
                }
            });
        });
    }
    
    // Hàm gọi API song song và xử lý kết quả
    that.loadAllData = function () {
        Promise.all([that.GetXSMN(), that.GetXSMT(), that.GetXSMB()])
            .then(function () {
                console.log("Tất cả dữ liệu đã được tải xong");
            })
            .catch(function (error) {
                console.error("Có lỗi khi tải dữ liệu:", error);
            });
    };

    that.init();
}

jQuery(function () { xoso_index = new Index(); });